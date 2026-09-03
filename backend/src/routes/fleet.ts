import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { validateQuery } from '../lib/validate';
import { serializeVehicle } from '../lib/serialize';
import { freeUnits, nextFreeDate } from '../lib/availability';

export const fleetRouter = Router();

const dateQuery = z.object({ pickupDate: z.string().datetime().optional() });

fleetRouter.get('/', validateQuery(dateQuery), async (req, res) => {
  const { pickupDate } = (req as unknown as { validatedQuery: z.infer<typeof dateQuery> }).validatedQuery;
  const vehicles = await prisma.vehicle.findMany({ include: { units: true } });

  if (!pickupDate) {
    res.json({ vehicles: vehicles.map((v) => serializeVehicle(v)) });
    return;
  }

  const pickup = new Date(pickupDate);
  res.json({
    vehicles: vehicles.map((v) => {
      const free = freeUnits(v.units, pickup);
      return {
        ...serializeVehicle(v),
        available: free.length > 0,
        freeCount: free.length,
        nextFree: free.length === 0 ? nextFreeDate(v.units) : null,
      };
    }),
  });
});

fleetRouter.get(
  '/:id/availability',
  validateQuery(z.object({ pickupDate: z.string().datetime() })),
  async (req, res) => {
    const vehicleId = String(req.params.id);
    const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId }, include: { units: true } });
    if (!vehicle) {
      res.status(404).json({ error: 'not_found' });
      return;
    }
    const { pickupDate } = (req as unknown as { validatedQuery: { pickupDate: string } }).validatedQuery;
    const pickup = new Date(pickupDate);
    const free = freeUnits(vehicle.units, pickup);
    res.json({
      vehicleId: vehicle.id,
      available: free.length > 0,
      freeCount: free.length,
      nextFree: free.length === 0 ? nextFreeDate(vehicle.units) : null,
    });
  }
);
