export type KnownValue = {
  label: string;
  description: string;
};

export type NotebookStepStatus = 'correct' | 'learning-signal' | 'upcoming';

export type LearningSignalSection = {
  title: 'What went well' | 'What to adjust' | 'Why it matters';
  body: string;
  formula?: string;
};

export type LearningSignal = {
  title: string;
  subtitle: string;
  sections: LearningSignalSection[];
  status: string;
};

export type NotebookStep = {
  id: string;
  stepNumber: number;
  title: string;
  prompt: string;
  status: NotebookStepStatus;
  studentInput?: string;
  feedback?: string;
  learningSignal?: LearningSignal;
};

export type NotebookProblem = {
  eyebrow: string;
  title: string;
  progressLabel: string;
  progressValue: number;
  progressMax: number;
  statement: string;
  knownValues: KnownValue[];
  goal: string;
  suggestedFormula: string;
};

export type PatternInsight = {
  title: string;
  content: string;
  supportCopy: string;
};

export const mockNotebookProblem: NotebookProblem = {
  eyebrow: 'Physics · Kinematics',
  title: 'Final velocity from acceleration',
  progressLabel: 'Step 2 of 4',
  progressValue: 2,
  progressMax: 4,
  statement:
    'A car starts from rest and accelerates at 2 m/s² for 5 s. What is its final velocity?',
  knownValues: [
    { label: 'v₀ = 0', description: 'initial velocity' },
    { label: 'a = 2 m/s²', description: 'acceleration' },
    { label: 't = 5 s', description: 'time' },
  ],
  goal: 'v_f = ?',
  suggestedFormula: 'v = v₀ + at',
};

export const mockNotebookSteps: NotebookStep[] = [
  {
    id: 'step-1',
    stepNumber: 1,
    title: 'Step 1',
    prompt: 'Set up the formula with the known values.',
    status: 'correct',
    studentInput: 'v = 0 + 2 · 5',
    feedback: 'Nice setup. Your substitution is correct.',
  },
  {
    id: 'step-2',
    stepNumber: 2,
    title: 'Step 2',
    prompt: 'Calculate the final value and include the unit.',
    status: 'learning-signal',
    studentInput: 'v = 10 m',
    learningSignal: {
      title: 'Learning signal found',
      subtitle: 'Small detail, big understanding.',
      sections: [
        {
          title: 'What went well',
          body: 'Your calculation is correct.',
        },
        {
          title: 'What to adjust',
          body: 'The unit should be m/s, not m.',
        },
        {
          title: 'Why it matters',
          body: '',
          formula: '(m/s²) · s = m/s',
        },
      ],
      status: 'Added to Growth Map',
    },
  },
  {
    id: 'step-3',
    stepNumber: 3,
    title: 'Step 3',
    prompt: 'Interpret the result',
    status: 'upcoming',
  },
  {
    id: 'step-4',
    stepNumber: 4,
    title: 'Step 4',
    prompt: 'Connect to the graph',
    status: 'upcoming',
  },
];

export const mockPicoCoach = {
  title: 'Pico says',
  message:
    'You’re close. The math is working — we just need the physics unit to match the quantity.',
};

export const mockPatternInsight: PatternInsight = {
  title: 'Pattern insight',
  content: 'Unit mismatch · noticed 3 times',
  supportCopy: 'This may become a focus area in your Growth Path.',
};
