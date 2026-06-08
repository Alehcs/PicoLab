import { Router } from 'express';
import { growthMap, growthPath, unitLearningSignal } from '../data/mockResponses.js';
import { createResponseMeta } from '../middleware/errorHandler.js';

export const growthRouter = Router();

growthRouter.get('/growth-map', (_req, res) => {
  res.json({
    ok: true,
    data: {
      ...growthMap,
      source: 'mock',
    },
    meta: createResponseMeta(),
  });
});

growthRouter.post('/growth-map/signals', (req, res) => {
  const incomingSignal =
    req.body && typeof req.body === 'object' && 'id' in req.body ? req.body : unitLearningSignal;

  res.json({
    ok: true,
    data: {
      learningSignals: [incomingSignal, ...growthMap.learningSignals],
      suggestedDirection: growthMap.suggestedDirection,
      improvementTrend: growthMap.improvementTrend,
      source: 'mock',
    },
    meta: createResponseMeta(),
  });
});

growthRouter.get('/growth-path', (_req, res) => {
  res.json({
    ok: true,
    data: {
      ...growthPath,
      source: 'mock',
    },
    meta: createResponseMeta(),
  });
});

growthRouter.post('/growth-path/regenerate', (req, res) => {
  const goal =
    typeof req.body?.goal === 'string' && req.body.goal.trim().length > 0
      ? req.body.goal
      : growthPath.currentGoal;

  res.json({
    ok: true,
    data: {
      ...growthPath,
      currentGoal: goal,
      source: 'mock',
    },
    meta: createResponseMeta(),
  });
});
