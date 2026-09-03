import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth } from '../middleware/auth';
import { serializeDocument } from '../lib/serialize';

export const documentsRouter = Router();
documentsRouter.use(requireAuth);

documentsRouter.get('/', async (req, res) => {
  const docs = req.user!.organizationId
    ? await prisma.document.findMany({ where: { organizationId: req.user!.organizationId }, orderBy: { date: 'desc' } })
    : [];
  res.json({ documents: docs.map(serializeDocument) });
});
