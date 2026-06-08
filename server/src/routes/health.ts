import { Router } from 'express';
import { createResponseMeta } from '../middleware/errorHandler.js';

export const healthRouter = Router();

healthRouter.get('/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'picolab-api',
    mode: 'mock',
    data: {
      ok: true,
      service: 'picolab-api',
      mode: 'mock',
    },
    meta: createResponseMeta(),
  });
});
