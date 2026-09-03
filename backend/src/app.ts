import express, { ErrorRequestHandler } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { env } from './lib/env';
import { authRouter } from './routes/auth';
import { fleetRouter } from './routes/fleet';
import { bookingsRouter } from './routes/bookings';
import { documentsRouter } from './routes/documents';
import { referenceRouter } from './routes/reference';

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      // Empty allow-list in dev means "allow any origin" so Expo's simulator/
      // dev-tunnel origins just work; production must set CORS_ORIGINS.
      origin: env.nodeEnv === 'production' ? env.corsOrigins : true,
    })
  );
  app.use(express.json({ limit: '256kb' }));

  // Coarse global limiter — the auth routes carry their own tighter limits.
  app.use(rateLimit({ windowMs: 60 * 1000, limit: 120, standardHeaders: true, legacyHeaders: false }));

  app.get('/health', (_req, res) => res.json({ ok: true }));

  app.use('/auth', authRouter);
  app.use('/fleet', fleetRouter);
  app.use('/bookings', bookingsRouter);
  app.use('/documents', documentsRouter);
  app.use('/', referenceRouter);

  app.use((_req, res) => res.status(404).json({ error: 'not_found' }));

  const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    // Never leak stack traces or internal error detail to the client.
    // eslint-disable-next-line no-console
    console.error(err);
    res.status(500).json({ error: 'internal_error' });
  };
  app.use(errorHandler);

  return app;
}
