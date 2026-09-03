import { RequestHandler } from 'express';
import { ZodType } from 'zod';

/** Parses + validates req.body against `schema`; 400s with issue details on failure. */
export function validateBody<T>(schema: ZodType<T>): RequestHandler {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: 'validation_error', details: result.error.issues });
      return;
    }
    req.body = result.data;
    next();
  };
}

export function validateQuery<T>(schema: ZodType<T>): RequestHandler {
  return (req, res, next) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      res.status(400).json({ error: 'validation_error', details: result.error.issues });
      return;
    }
    (req as unknown as { validatedQuery: T }).validatedQuery = result.data;
    next();
  };
}
