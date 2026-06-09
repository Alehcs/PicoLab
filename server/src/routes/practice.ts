import { Router } from 'express';
import {
  dailyPractice,
  focusPractice,
  randomPractice,
} from '../data/mockResponses.js';
import { createResponseMeta } from '../middleware/errorHandler.js';
import { learningSignalFromInstance, runMockDiagnostic } from '../services/diagnosticEngine.js';

export const practiceRouter = Router();

practiceRouter.get('/practice/daily', (_req, res) => {
  res.json({
    ok: true,
    data: {
      ...dailyPractice,
      source: 'mock',
    },
    meta: createResponseMeta(),
  });
});

practiceRouter.get('/practice/focus', (_req, res) => {
  res.json({
    ok: true,
    data: {
      ...focusPractice,
      source: 'mock',
    },
    meta: createResponseMeta(),
  });
});

practiceRouter.get('/practice/random', (_req, res) => {
  res.json({
    ok: true,
    data: {
      missions: randomPractice,
      source: 'mock',
    },
    meta: createResponseMeta(),
  });
});

practiceRouter.post('/practice/check-answer', (req, res) => {
  const selectedOptionId = req.body?.selectedOptionId ?? req.body?.answer;
  const isCorrect = selectedOptionId === 'meters-per-second' || selectedOptionId === 'm/s';
  const answer = typeof req.body?.answer === 'string' ? req.body.answer : String(selectedOptionId ?? '');
  const diagnostic = isCorrect
    ? undefined
    : runMockDiagnostic({
        source: 'practice',
        studentAnswer: answer,
        expectedAnswer: 'm/s',
        expectedUnit: 'm/s',
        expectedQuantity: 'velocity',
        problemText:
          'If acceleration is measured in m/s² and time is measured in s, what unit should a · t have?',
        missionId: typeof req.body?.missionId === 'string' ? req.body.missionId : 'units-in-motion',
      });
  const learningSignal = learningSignalFromInstance(diagnostic?.primarySignal);

  res.json({
    ok: true,
    data: {
      isCorrect,
      status: isCorrect ? 'strong' : 'needsAttention',
      supportiveFeedback: isCorrect
        ? 'Nice reasoning. The unit simplifies to m/s, which describes velocity.'
        : diagnostic?.supportiveFeedback ?? 'Useful signal. Try reducing the units before choosing the quantity.',
      explanation: diagnostic?.whyItMatters ?? 'm/s² · s cancels one second and leaves m/s.',
      learningSignal,
      primarySignal: diagnostic?.primarySignal,
      signals: diagnostic?.signals ?? [],
      diagnostic,
      picoPointsPreview: isCorrect ? 25 : 0,
      source: 'mock',
    },
    meta: createResponseMeta(),
  });
});

practiceRouter.post('/practice/complete', (_req, res) => {
  res.json({
    ok: true,
    data: {
      awardedPicoPoints: 25,
      updatedStreak: 6,
      updatedLeagueProgress: {
        currentLeague: 'Feather League',
        nextLeague: 'Wing League',
        picoPoints: 345,
        progress: 69,
      },
      unlockedBadges: [{ id: 'daily-builder', name: 'Daily Builder' }],
      source: 'mock',
    },
    meta: createResponseMeta(),
  });
});
