import { Router } from 'express';
import { createAskPicoResponse } from '../data/mockResponses.js';
import { AppError, createResponseMeta } from '../middleware/errorHandler.js';
import type { AskPicoContext } from '../types/api.js';

const contexts = new Set<AskPicoContext>([
  'notebook',
  'visualLab',
  'growthMap',
  'growthPath',
  'practice',
  'profile',
  'settings',
]);

const normalizeContext = (value: unknown): AskPicoContext => {
  const raw = typeof value === 'string' ? value : 'notebook';
  const normalized =
    raw === 'visual-lab'
      ? 'visualLab'
      : raw === 'growth-map'
        ? 'growthMap'
        : raw === 'growth-path'
          ? 'growthPath'
          : raw;

  if (!contexts.has(normalized as AskPicoContext)) {
    throw new AppError(400, 'BAD_REQUEST', 'Ask Pico context is not supported by the mock API.', {
      context: value,
    });
  }

  return normalized as AskPicoContext;
};

export const askPicoRouter = Router();

askPicoRouter.post('/ask-pico', (req, res) => {
  const context = normalizeContext(req.body?.context ?? req.body?.currentPage);

  res.json({
    ok: true,
    data: createAskPicoResponse(context),
    meta: createResponseMeta(),
  });
});
