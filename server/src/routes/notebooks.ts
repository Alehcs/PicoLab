import { Router } from 'express';
import { notebook } from '../data/mockResponses.js';
import { createResponseMeta } from '../middleware/errorHandler.js';
import { learningSignalFromInstance, runMockDiagnostic } from '../services/diagnosticEngine.js';

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
  const expectedUnit = typeof req.body?.expectedUnit === 'string' ? req.body.expectedUnit : 'm/s';
  const expectedQuantity =
    typeof req.body?.expectedQuantity === 'string' ? req.body.expectedQuantity : 'final velocity';
  const diagnostic = runMockDiagnostic({
    source: 'notebook',
    studentStep: stepText,
    studentAnswer: stepText,
    expectedAnswer: typeof req.body?.expectedAnswer === 'string' ? req.body.expectedAnswer : '10 m/s',
    expectedUnit,
    expectedQuantity,
    expectedFormula: typeof req.body?.expectedFormula === 'string' ? req.body.expectedFormula : undefined,
    knownValues: Array.isArray(req.body?.knownValues) ? req.body.knownValues : undefined,
    target: 'velocity',
    topic: 'Kinematics',
    problemText: 'An object starts at 2 m/s and accelerates at 4 m/s² for 2 seconds.',
    problemId: req.params.problemId,
    stepId: typeof req.body?.stepId === 'string' ? req.body.stepId : 'step-2',
  });
  const learningSignal = learningSignalFromInstance(diagnostic.primarySignal);
  const includesVelocityUnit = diagnostic.signals.length === 0 || /m\/s\b/.test(stepText);

  res.json({
    ok: true,
    data: {
      status: includesVelocityUnit ? 'strong' : 'needsAttention',
      supportiveFeedback: includesVelocityUnit
        ? 'Nice adjustment. The final unit now matches velocity.'
        : diagnostic.supportiveFeedback,
      whatWentWell: diagnostic.whatWentWell,
      whatToAdjust: includesVelocityUnit
        ? 'Add a brief interpretation of what the final velocity means.'
        : diagnostic.whatToAdjust,
      whyItMatters: diagnostic.whyItMatters,
      learningSignal: includesVelocityUnit ? undefined : learningSignal,
      primarySignal: diagnostic.primarySignal,
      signals: diagnostic.signals,
      diagnostic,
      suggestedNextAction: includesVelocityUnit
        ? 'Interpret the result.'
        : diagnostic.suggestedVisualTemplate
          ? 'Open the visual support.'
          : 'Try the suggested practice.',
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
