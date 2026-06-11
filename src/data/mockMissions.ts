import type { Mission, PracticeQuestion } from '../types/mission';

export const dailyChallenge = {
  id: 'daily-final-velocity',
  title: 'Daily Challenge',
  description: 'Solve today’s visual STEM problem to keep your streak alive.',
  problem:
    'A runner starts from rest and accelerates at 1.5 m/s² for 6 s. What is the final velocity?',
  formulaHint: 'v = v₀ + at',
  streakLabel: '5-day streak',
  streakDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  mission: {
    id: 'daily-final-velocity-mission',
    title: 'Final velocity warmup',
    subject: 'Physics',
    topic: 'Kinematics',
    difficulty: 'Medium',
    reward: { label: '+25 PicoPoints', points: 25 },
  } satisfies Mission,
  question: {
    id: 'daily-final-velocity-q',
    prompt:
      'A runner starts from rest and accelerates at 1.5 m/s² for 6 s. What is the final velocity?',
    options: [
      { id: 'six-mps', label: '6 m/s' },
      { id: 'nine-mps', label: '9 m/s' },
      { id: 'nine-m', label: '9 m' },
      { id: 'one-point-five-mps', label: '1.5 m/s' },
    ],
    correctOptionId: 'nine-mps',
    feedbackCorrect: 'Nice work. Acceleration times time gives velocity, so the unit is m/s.',
    feedbackUsefulSignal:
      'Useful signal: the number is close, but final velocity should use m/s, not m.',
  } satisfies PracticeQuestion,
};

export const focusMission = {
  id: 'units-in-motion',
  title: 'Focus Mission: Units in motion',
  description:
    'Your goal is to make the unit match the physical quantity, not just the number.',
  context: 'Based on 4 recent learning signals.',
  progressLabel: '1 of 5',
  question: {
    id: 'acceleration-times-time',
    prompt:
      'If acceleration is measured in m/s² and time is measured in s, what unit should a · t have?',
    options: [
      { id: 'meters', label: 'm' },
      { id: 'meters-per-second', label: 'm/s' },
      { id: 'meters-per-second-squared', label: 'm/s²' },
      { id: 'seconds', label: 's' },
    ],
    correctOptionId: 'meters-per-second',
    feedbackCorrect:
      'Nice reasoning. One second cancels from s², leaving m/s. That means a · t describes a change in velocity.',
    feedbackUsefulSignal:
      'Useful signal. Let’s look at the units: m/s² · s = m/s. The result describes velocity, not distance.',
  } satisfies PracticeQuestion,
};

export const randomMissions: Mission[] = [
  {
    id: 'graph-reading-sprint',
    title: 'Graph reading sprint',
    subject: 'Math',
    topic: 'Functions',
    difficulty: 'Easy',
    reward: { label: '+10 PicoPoints', points: 10 },
    description: 'Read a graph and decide what the slope is telling you.',
  },
  {
    id: 'velocity-vs-distance',
    title: 'Velocity vs. distance',
    subject: 'Physics',
    topic: 'Motion graphs',
    difficulty: 'Medium',
    reward: { label: '+15 PicoPoints', points: 15 },
    description: 'Tell velocity and distance apart from a motion graph.',
  },
  {
    id: 'algebra-sign-check',
    title: 'Algebra sign check',
    subject: 'Math',
    topic: 'Algebra',
    difficulty: 'Easy',
    reward: { label: '+10 PicoPoints', points: 10 },
    description: 'Catch the sign slip before it changes the answer.',
  },
];

export const practiceCoach = {
  title: 'Pico’s practice note',
  message:
    'Daily practice works best when it is small, visual, and consistent. Today, we’ll focus on units in motion.',
  stats: [
    { label: 'Today’s reward', value: '+25 PicoPoints' },
    { label: 'Current streak', value: '5 days' },
    { label: 'Focus area', value: 'Units in motion' },
  ],
};

export const missionComplete = {
  title: 'Mission complete',
  copy: 'You earned +15 PicoPoints and strengthened Units in motion.',
  stats: [
    { label: 'Skill practiced', value: 'Units in motion' },
    { label: 'Learning signal improved', value: 'Unit mismatch' },
    { label: 'Next recommendation', value: 'Velocity vs. distance' },
  ],
};
