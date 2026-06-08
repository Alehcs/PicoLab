import { Router } from 'express';
import { profile } from '../data/mockResponses.js';
import { createResponseMeta } from '../middleware/errorHandler.js';

export const profileRouter = Router();

profileRouter.get('/profile', (_req, res) => {
  res.json({
    ok: true,
    data: {
      ...profile,
      source: 'mock',
    },
    meta: createResponseMeta(),
  });
});

profileRouter.post('/profile/goals', (req, res) => {
  const goals = Array.isArray(req.body?.goals) ? req.body.goals : profile.goals;

  res.json({
    ok: true,
    data: {
      ...profile,
      goals,
      source: 'mock',
    },
    meta: createResponseMeta(),
  });
});
