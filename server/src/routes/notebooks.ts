import { Router } from 'express';
import { notebook, unitLearningSignal } from '../data/mockResponses.js';
import { createResponseMeta } from '../middleware/errorHandler.js';

export const notebooksRouter = Router();

notebooksRouter.get('/notebooks/:problemId', (req, res) => {
  res.json({
    ok: true,
    data: {
      ...notebook,
      problemSummary: {
        ...notebook.problemSummary,
        id: req.params.problemId,
      },
      source: 'mock',
    },
    meta: createResponseMeta(),
  });
});

notebooksRouter.post('/notebooks/:problemId/check-step', (req, res) => {
  const stepText = typeof req.body?.stepText === 'string' ? req.body.stepText : '';
  const includesVelocityUnit = /m\/s\b/.test(stepText);

  res.json({
    ok: true,
    data: {
      status: includesVelocityUnit ? 'strong' : 'needsAttention',
      supportiveFeedback: includesVelocityUnit
        ? 'Nice adjustment. The final unit now matches velocity.'
        : 'Your calculation is close. The next adjustment is matching the unit to velocity.',
      whatWentWell: 'You used the motion formula and substitution clearly.',
      whatToAdjust: includesVelocityUnit
        ? 'Add a brief interpretation of what the final velocity means.'
        : 'Use m/s for the final answer because the result describes velocity.',
      whyItMatters: 'Unit reasoning helps separate position, velocity, and acceleration.',
      learningSignal: includesVelocityUnit ? undefined : unitLearningSignal,
      suggestedNextAction: includesVelocityUnit ? 'Interpret the result.' : 'Open the units visual.',
      source: 'mock',
    },
    meta: createResponseMeta(),
  });
});

notebooksRouter.post('/notebooks/:problemId/hint', (_req, res) => {
  res.json({
    ok: true,
    data: {
      hint: 'Multiply the units first: m/s² times s leaves m/s.',
      suggestedAction: { label: 'Open Visual Lab', route: '/visual-lab' },
      source: 'mock',
    },
    meta: createResponseMeta(),
  });
});

notebooksRouter.post('/notebooks/:problemId/explain-step', (_req, res) => {
  res.json({
    ok: true,
    data: {
      explanation:
        'The formula v = v₀ + at combines the starting velocity with the change in velocity from acceleration over time.',
      visualTemplateId: 'motion',
      source: 'mock',
    },
    meta: createResponseMeta(),
  });
});
