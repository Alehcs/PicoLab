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

// Interactive Smart Notebook flow copy. The notebook progresses step by step
// using local React state; this is the static, deterministic content the page
// pairs with the backend-first/fallback step-2 check.
export const notebookFlow = {
  step1: {
    title: 'Step 1',
    instruction: 'Set up the formula with the known values.',
    placeholder: 'Write the formula setup, for example: v = v₀ + at',
    defaultInput: 'v = 0 + 2 · 5',
    resolvedTitle: 'Nice setup',
    resolvedMessage: 'Your formula connects the known values to the target.',
    emptyPrompt: 'Try writing the formula or substituting the known values first.',
  },
  step2: {
    title: 'Step 2',
    instruction: 'Calculate the final value and include the unit.',
    placeholder: 'Write the final value with its unit, for example: v = 10 m/s',
    defaultInput: 'v = 10 m',
    resolvedTitle: 'Step resolved',
    resolvedMessage: 'Nice adjustment — the quantity and unit now match.',
    emptyPrompt: 'Add the final value with its unit before checking, for example v = 10 m/s.',
    hint: 'Multiply the units first: m/s² × s leaves m/s. So the final answer is v = 10 m/s.',
  },
  step3: {
    title: 'Step 3',
    instruction: 'Interpret the result.',
    placeholder: 'Write what 10 m/s means in this problem…',
    resolvedTitle: 'Nice interpretation',
    resolvedMessage: 'You connected the result back to the problem.',
    emptyPrompt: 'Try writing what the final velocity means for the car.',
  },
  step4: {
    title: 'Step 4',
    instruction: 'Connect the result to a visual model.',
    message: 'Use Visual Lab to see why acceleration over time changes velocity.',
  },
} as const;

// Shown when Step 1's setup does not connect the right quantities.
export const step1FormulaSignal: LearningSignal = {
  title: 'Formula setup needs attention',
  subtitle: 'Let’s connect the right quantities.',
  status: 'Learning signal',
  sections: [
    { title: 'What went well', body: 'You started the solution.' },
    {
      title: 'What to adjust',
      body: 'Use a formula that connects initial velocity, acceleration, time, and final velocity.',
    },
    {
      title: 'Why it matters',
      body: 'The setup tells Pico which quantities you are connecting.',
    },
  ],
};

export const mockPicoCoach = {
  title: 'Pico says',
  message:
    'You’re close. The math is working — we just need the physics unit to match the quantity.',
};

export const mockPatternInsight: PatternInsight = {
  title: 'Pattern insight',
  content: 'Unit mismatch · noticed 3 times',
  supportCopy: 'This may become a focus area in your Roadmap.',
};
