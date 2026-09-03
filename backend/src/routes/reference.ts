import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth } from '../middleware/auth';

export const referenceRouter = Router();

referenceRouter.get('/locations', async (_req, res) => {
  const locations = await prisma.location.findMany({ orderBy: { id: 'asc' } });
  res.json({ locations });
});

referenceRouter.get('/addons', async (_req, res) => {
  const addons = await prisma.addon.findMany();
  res.json({ addons });
});

referenceRouter.get('/payment-methods', requireAuth, async (req, res) => {
  const isOrg = req.user!.accountType !== 'INDIVIDUAL';
  const methods = await prisma.payMethod.findMany({ where: isOrg ? {} : { orgOnly: false } });
  res.json({ paymentMethods: methods });
});

// Org-scoped — an individual account has no approval chain.
referenceRouter.get('/approvers', requireAuth, async (req, res) => {
  if (!req.user!.organizationId) {
    res.json({ approvers: [] });
    return;
  }
  const approvers = await prisma.approver.findMany({ where: { organizationId: req.user!.organizationId } });
  res.json({ approvers });
});
