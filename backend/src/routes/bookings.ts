import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { validateBody } from '../lib/validate';
import { requireAuth } from '../middleware/auth';
import { serializeBooking, serializeDocument } from '../lib/serialize';
import { freeUnits } from '../lib/availability';
import { computeBookingCost, nightsBetween } from '../lib/pricing';

export const bookingsRouter = Router();
bookingsRouter.use(requireAuth);

const createBookingSchema = z
  .object({
    vehicleId: z.string(),
    pickupDate: z.string().datetime(),
    returnDate: z.string().datetime(),
    locationId: z.number().int(),
    driver: z.boolean(),
    addonIds: z.array(z.string()).default([]),
    orgName: z.string().optional(),
    costCentre: z.string().optional(),
    poRef: z.string().optional(),
    payMethod: z.enum(['invoice', 'bankak', 'mbok', 'cash']),
    approverId: z.string().optional(),
  })
  .refine((b) => new Date(b.returnDate).getTime() > new Date(b.pickupDate).getTime(), {
    message: 'returnDate must be after pickupDate',
  });

bookingsRouter.post('/', validateBody(createBookingSchema), async (req, res) => {
  const b = req.body as z.infer<typeof createBookingSchema>;
  const pickupDate = new Date(b.pickupDate);
  const returnDate = new Date(b.returnDate);
  const nights = nightsBetween(pickupDate, returnDate);
  const isOrg = req.user!.accountType !== 'INDIVIDUAL';

  try {
    const result = await prisma.$transaction(async (tx) => {
      // Re-read inside the transaction — this is the actual "authoritative
      // availability" check: SQLite serializes writers, so a second booking
      // racing against this one for the same unit blocks until this
      // transaction commits, then sees the updated busyUntil and correctly
      // fails instead of double-booking the vehicle.
      const vehicle = await tx.vehicle.findUnique({ where: { id: b.vehicleId }, include: { units: true } });
      if (!vehicle) throw new HttpError(404, 'vehicle_not_found');

      const location = await tx.location.findUnique({ where: { id: b.locationId } });
      if (!location) throw new HttpError(400, 'invalid_location');

      if (b.approverId) {
        const approver = await tx.approver.findFirst({ where: { id: b.approverId, organizationId: req.user!.organizationId ?? undefined } });
        if (!approver) throw new HttpError(400, 'invalid_approver');
      }

      const free = freeUnits(vehicle.units, pickupDate);
      if (free.length === 0) throw new HttpError(409, 'unavailable');
      const unit = free[0];

      const addons = b.addonIds.length ? await tx.addon.findMany({ where: { id: { in: b.addonIds } } }) : [];
      const extrasTotalUsd = addons.reduce((sum, a) => sum + (a.unit === 'day' ? a.priceUsd * nights : a.priceUsd), 0);
      const cost = computeBookingCost({
        dailyRateUsd: vehicle.dailyRateUsd,
        nights,
        hasDriver: b.driver,
        extrasTotalUsd,
        payMethodId: b.payMethod,
      });

      const counter = await tx.refCounter.update({ where: { id: 'booking_ref' }, data: { value: { increment: 1 } } });
      const ref = 'BV-26-' + String(counter.value).padStart(4, '0');

      const booking = await tx.booking.create({
        data: {
          ref,
          userId: req.user!.id,
          vehicleId: vehicle.id,
          unitId: unit.id,
          pickupDate,
          returnDate,
          locationId: b.locationId,
          driver: b.driver,
          driverName: b.driver ? 'Osman Bashir' : null,
          addonsJson: JSON.stringify(b.addonIds),
          orgName: b.orgName,
          costCentre: b.costCentre,
          poRef: b.poRef,
          payMethod: b.payMethod,
          needsApproval: isOrg,
          approverId: b.approverId,
          stage: 0,
          costTotalUsd: cost.total,
          depositUsd: cost.deposit,
        },
        include: { vehicle: true, unit: true },
      });

      // Extend the unit's busy window to cover this hire so a subsequent
      // booking attempt against overlapping dates correctly sees it as busy.
      // Known simplification: one busyUntil field per unit, not a full
      // interval calendar — see the accompanying review notes.
      const newBusyUntil = unit.busyUntil && unit.busyUntil > returnDate ? unit.busyUntil : returnDate;
      await tx.vehicleUnit.update({ where: { id: unit.id }, data: { busyUntil: newBusyUntil } });

      const doc = await tx.document.create({
        data: {
          type: 'invoice',
          ref: 'INV-' + ref.replace('BV-26-', '2026-'),
          bookingRef: ref,
          organizationId: req.user!.organizationId,
          titleEn: `${vehicle.name} — ${isOrg ? 'awaiting approval' : 'requested'}`,
          titleAr: `${vehicle.name} — بانتظار المعالجة`,
          date: new Date(),
          amountUsd: cost.total,
          status: 'outstanding',
        },
      });

      return { booking, doc };
    });

    res.status(201).json({ booking: serializeBooking(result.booking), document: serializeDocument(result.doc) });
  } catch (e) {
    if (e instanceof HttpError) {
      res.status(e.status).json({ error: e.code });
      return;
    }
    throw e;
  }
});

bookingsRouter.get('/', async (req, res) => {
  const scope = req.user!.organizationId
    ? { user: { organizationId: req.user!.organizationId } }
    : { userId: req.user!.id };
  const bookings = await prisma.booking.findMany({
    where: scope,
    include: { vehicle: true, unit: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ bookings: bookings.map(serializeBooking) });
});

bookingsRouter.post('/:ref/cancel', async (req, res) => {
  const booking = await prisma.booking.findUnique({ where: { ref: req.params.ref } });
  if (!booking) {
    res.status(404).json({ error: 'not_found' });
    return;
  }
  const ownsIt = booking.userId === req.user!.id;
  const orgOwnsIt = req.user!.organizationId && (await prisma.user.findUnique({ where: { id: booking.userId } }))?.organizationId === req.user!.organizationId;
  if (!ownsIt && !orgOwnsIt) {
    res.status(403).json({ error: 'forbidden' });
    return;
  }
  if (booking.cancelled || booking.stage >= 4) {
    res.status(409).json({ error: 'not_cancellable' });
    return;
  }

  await prisma.$transaction(async (tx) => {
    await tx.booking.update({ where: { id: booking.id }, data: { cancelled: true } });
    if (booking.unitId) {
      // Recompute the unit's busy-until from the remaining active bookings
      // rather than blindly clearing it — another hire may still cover it.
      const stillActive = await tx.booking.findMany({
        where: { unitId: booking.unitId, cancelled: false, id: { not: booking.id } },
      });
      const newBusyUntil = stillActive.length
        ? stillActive.reduce((max, x) => (x.returnDate > max ? x.returnDate : max), stillActive[0].returnDate)
        : null;
      await tx.vehicleUnit.update({ where: { id: booking.unitId }, data: { busyUntil: newBusyUntil } });
    }
  });

  res.json({ ok: true });
});

class HttpError extends Error {
  constructor(public status: number, public code: string) {
    super(code);
  }
}
