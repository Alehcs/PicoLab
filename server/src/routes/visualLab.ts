import { Router } from 'express';
import { visualRenderState, visualTemplate } from '../data/mockResponses.js';
import { createResponseMeta } from '../middleware/errorHandler.js';

export const visualLabRouter = Router();

visualLabRouter.post('/visual-lab/select-template', (_req, res) => {
  res.json({
    ok: true,
    data: {
      ...visualTemplate,
      source: 'mock',
    },
    meta: createResponseMeta(),
  });
});

visualLabRouter.post('/visual-lab/render-state', (_req, res) => {
  res.json({
    ok: true,
    data: {
      ...visualRenderState,
      source: 'mock',
    },
    meta: createResponseMeta(),
  });
});
