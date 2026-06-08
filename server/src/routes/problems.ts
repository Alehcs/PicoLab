import { Router } from 'express';
import { ambiguities, createParsedProblem, extractedDetails } from '../data/mockResponses.js';
import { createResponseMeta } from '../middleware/errorHandler.js';

export const problemsRouter = Router();

problemsRouter.post('/problems/parse', (req, res) => {
  const text =
    typeof req.body?.text === 'string' && req.body.text.trim().length > 0
      ? req.body.text
      : undefined;

  res.json({
    ok: true,
    data: {
      parsedProblem: createParsedProblem(text),
      source: 'mock',
    },
    meta: createResponseMeta(),
  });
});

problemsRouter.post('/problems/scan', (_req, res) => {
  res.json({
    ok: true,
    data: {
      extractedText:
        'An object starts at 2 m/s and accelerates at 4 m/s² for 2 seconds. Find the final velocity.',
      extractedDetails,
      ambiguities,
      confidence: 0.89,
      source: 'mock',
    },
    meta: createResponseMeta(),
  });
});

problemsRouter.post('/problems/:problemId/confirm', (req, res) => {
  const parsedProblem = createParsedProblem(req.body?.originalText);

  res.json({
    ok: true,
    data: {
      ...parsedProblem,
      id: req.params.problemId,
      status: 'confirmed',
      confirmedAt: 'mock-confirmed',
      source: 'mock',
    },
    meta: createResponseMeta(),
  });
});
