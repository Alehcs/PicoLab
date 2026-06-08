import { Router } from 'express';
import { settings } from '../data/mockResponses.js';
import { createResponseMeta } from '../middleware/errorHandler.js';

export const settingsRouter = Router();

settingsRouter.get('/settings', (_req, res) => {
  res.json({
    ok: true,
    data: {
      ...settings,
      source: 'mock',
    },
    meta: createResponseMeta(),
  });
});

settingsRouter.patch('/settings', (req, res) => {
  res.json({
    ok: true,
    data: {
      ...settings,
      ...(req.body && typeof req.body === 'object' ? req.body : {}),
      source: 'mock',
    },
    meta: createResponseMeta(),
  });
});
