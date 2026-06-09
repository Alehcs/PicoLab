import { Router } from 'express';
import {
  dailyPractice,
  focusPractice,
  randomPractice,
  unitCancellationLearningSignal,
} from '../data/mockResponses.js';
import { createResponseMeta } from '../middleware/errorHandler.js';

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

  res.json({
    ok: true,
    data: {
      isCorrect,
      status: isCorrect ? 'strong' : 'needsAttention',
      supportiveFeedback: isCorrect
        ? 'Nice reasoning. The unit simplifies to m/s, which describes velocity.'
        : 'Useful signal. Try reducing the units before choosing the quantity.',
      explanation: 'm/s² · s cancels one second and leaves m/s.',
      learningSignal: isCorrect ? undefined : unitCancellationLearningSignal,
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
