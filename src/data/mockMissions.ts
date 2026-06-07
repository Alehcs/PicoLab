import type { PracticeMission } from '../types/mission';

export const mockMissions: PracticeMission[] = [
  {
    id: 'units-in-motion',
    title: 'Units in motion',
    focusArea: 'Unit reasoning',
    questions: [
      {
        id: 'acceleration-times-time',
        prompt: 'If acceleration is measured in m/s2 and time is measured in s, what unit should a times t have?',
        options: ['m', 'm/s', 'm/s2', 's'],
        correctOptionIndex: 1,
        feedbackCorrect: 'Exactly. One second cancels from s2, leaving m/s.',
        feedbackWrong: 'Useful signal. m/s2 times s becomes m/s, so the result describes velocity.',
      },
    ],
  },
];
