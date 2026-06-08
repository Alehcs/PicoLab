import type {
  Ambiguity,
  AskPicoContext,
  AskPicoResponse,
  ExtractedDetail,
  LearningSignal,
  ParsedProblem,
} from '../types/api.js';

export const mockProblemText =
  'An object starts at 2 m/s and accelerates at 4 m/s² for 2 seconds. Find the final velocity.';

export const unitLearningSignal: LearningSignal = {
  id: 'unit-mismatch',
  kind: 'unitMismatch',
  title: 'Unit mismatch',
  description: 'The calculation is close, and the final unit needs to match velocity.',
  strength: 4,
  suggestedFocus: 'Units in motion',
};

export const extractedDetails: ExtractedDetail[] = [
  {
    id: 'initial-velocity',
    kind: 'given',
    label: 'Initial velocity',
    value: '2',
    unit: 'm/s',
    confidence: 0.96,
  },
  {
    id: 'acceleration',
    kind: 'given',
    label: 'Acceleration',
    value: '4',
    unit: 'm/s²',
    confidence: 0.95,
  },
  {
    id: 'time',
    kind: 'given',
    label: 'Time',
    value: '2',
    unit: 's',
    confidence: 0.93,
  },
  {
    id: 'target',
    kind: 'goal',
    label: 'Find',
    value: 'Final velocity',
    confidence: 0.94,
  },
  {
    id: 'formula',
    kind: 'formula',
    label: 'Suggested formula',
    value: 'v = v₀ + at',
    confidence: 0.91,
  },
];

export const ambiguities: Ambiguity[] = [
  {
    id: 'time-window',
    label: 'Acceleration interval',
    question: 'Does 2 seconds describe the full time the object accelerates?',
    reason: 'The wording implies this, but PicoLab should keep it reviewable.',
  },
];

export const createParsedProblem = (text = mockProblemText): ParsedProblem => ({
  id: 'mock-problem-final-velocity',
  originalText: text.trim() || mockProblemText,
  subject: 'physics',
  topic: 'Kinematics',
  knownValues: [
    { label: 'v₀', value: '2', unit: 'm/s' },
    { label: 'a', value: '4', unit: 'm/s²' },
    { label: 't', value: '2', unit: 's' },
  ],
  target: 'v',
  extractedDetails,
  ambiguities,
  suggestedFormula: 'v = v₀ + at',
  confidence: 0.92,
});

export const notebook = {
  problemSummary: {
    id: 'mock-problem-final-velocity',
    statement: mockProblemText,
    topic: 'Kinematics',
    target: 'Final velocity',
  },
  knownValues: [
    { label: 'v₀', value: '2 m/s', description: 'initial velocity' },
    { label: 'a', value: '4 m/s²', description: 'acceleration' },
    { label: 't', value: '2 s', description: 'time' },
  ],
  steps: [
    {
      id: 'step-1',
      title: 'Choose the formula',
      status: 'strong',
      prompt: 'Use the constant acceleration relationship.',
      studentInput: 'v = v₀ + at',
    },
    {
      id: 'step-2',
      title: 'Substitute values',
      status: 'strong',
      prompt: 'Place each known value into the formula.',
      studentInput: 'v = 2 + 4 · 2',
    },
    {
      id: 'step-3',
      title: 'Compute and label',
      status: 'needsAttention',
      prompt: 'Calculate the final value and include the velocity unit.',
      studentInput: 'v = 10 m',
    },
  ],
  currentLearningSignal: unitLearningSignal,
  suggestedVisualTemplate: 'motion',
};

const askPicoTextByContext: Record<AskPicoContext, string> = {
  notebook:
    'Your setup is strong. The key adjustment is the unit: acceleration times time gives m/s, so the final answer describes velocity.',
  visualLab:
    'The motion visual shows velocity changing over time. The final point is the final velocity, so the unit stays m/s.',
  growthMap:
    'Your current learning signal is about units in motion. That means the number is often close, and unit reasoning is the next focus.',
  growthPath:
    'Units in motion is first because it supports velocity, acceleration, and graph reading at the same time.',
  practice:
    'Try multiplying only the units first: m/s² · s leaves m/s. That tells you the answer is a velocity.',
  profile:
    'You can grow your PicoPoints by completing the daily challenge and one focus mission tied to your current learning signal.',
  settings:
    'Step-by-step explanations are a good default while you are building new problem-solving habits.',
};

const askPicoActionsByContext: Record<AskPicoContext, Array<{ label: string; route: string }>> = {
  notebook: [
    { label: 'Open Visual Lab', route: '/visual-lab' },
    { label: 'View Growth Map', route: '/growth-map' },
  ],
  visualLab: [
    { label: 'Back to notebook', route: '/smart-notebook' },
    { label: 'Practice units', route: '/practice-missions' },
  ],
  growthMap: [
    { label: 'View Growth Path', route: '/growth-path' },
    { label: 'Practice units', route: '/practice-missions' },
  ],
  growthPath: [
    { label: 'Start current focus', route: '/practice-missions' },
    { label: 'Review Growth Map', route: '/growth-map' },
  ],
  practice: [
    { label: 'Open Visual Lab', route: '/visual-lab' },
    { label: 'View Growth Path', route: '/growth-path' },
  ],
  profile: [
    { label: 'Start daily challenge', route: '/practice-missions' },
    { label: 'View Growth Path', route: '/growth-path' },
  ],
  settings: [],
};

export const createAskPicoResponse = (context: AskPicoContext): AskPicoResponse => ({
  message: {
    id: `mock-pico-${context}-${Date.now()}`,
    role: 'pico',
    text: askPicoTextByContext[context],
  },
  suggestedActions: askPicoActionsByContext[context],
  learningSignal: ['notebook', 'growthMap', 'practice'].includes(context)
    ? unitLearningSignal
    : undefined,
  source: 'mock',
});

export const visualTemplate = {
  templateId: 'motion',
  title: 'Motion model',
  parameters: {
    initialVelocity: 2,
    acceleration: 4,
    time: 2,
  },
  explanation: 'A motion template connects acceleration and time to final velocity.',
  unitInsight: 'm/s² · s = m/s',
};

export const visualRenderState = {
  formula: 'v = v₀ + at',
  result: '10 m/s',
  graphPoints: [
    { time: 0, velocity: 2 },
    { time: 1, velocity: 6 },
    { time: 2, velocity: 10 },
  ],
  visualState: {
    position: 12,
    velocity: 10,
    acceleration: 4,
  },
  explanation: 'The object begins at 2 m/s and gains 8 m/s over 2 seconds.',
};

export const growthMap = {
  learningSignals: [
    unitLearningSignal,
    {
      id: 'quantity-confusion',
      kind: 'quantityConfusion',
      title: 'Quantity confusion',
      description: 'Velocity and distance sometimes need clearer separation.',
      strength: 3,
      suggestedFocus: 'Velocity vs. distance',
    },
  ],
  strengths: ['Formula setup', 'Substitution'],
  focusAreas: ['Units in motion', 'Velocity vs. distance'],
  suggestedDirection: {
    label: 'Continue in Growth Path',
    route: '/growth-path',
  },
  improvementTrend: 'Unit reasoning is becoming more consistent across recent practice.',
};

export const growthPath = {
  currentGoal: 'Improve kinematics fundamentals',
  progress: {
    percent: 65,
    completed: 2,
    total: 3,
  },
  recommendedStep: {
    id: 'units-in-motion',
    title: 'Units in motion',
    reason: 'This learning signal appears most often and supports the next physics topics.',
  },
  nextSteps: [
    { id: 'velocity-vs-distance', title: 'Velocity vs. distance', route: '/visual-lab' },
    { id: 'graph-reading', title: 'Motion graph reading', route: '/practice-missions' },
  ],
  laterSteps: [{ id: 'algebra-signs', title: 'Algebra signs' }],
};

export const dailyPractice = {
  id: 'daily-final-velocity',
  title: 'Daily Challenge',
  subject: 'physics',
  topic: 'Kinematics',
  difficulty: 'medium',
  prompt: 'A runner starts from rest and accelerates at 1.5 m/s² for 6 s. What is the final velocity?',
  rewardPicoPoints: 25,
};

export const focusPractice = {
  id: 'focus-units-in-motion',
  title: 'Focus Mission: Units in motion',
  subject: 'physics',
  topic: 'Kinematics',
  difficulty: 'medium',
  prompt: 'If acceleration is measured in m/s² and time is measured in s, what unit should a · t have?',
  options: [
    { id: 'meters', label: 'm' },
    { id: 'meters-per-second', label: 'm/s' },
    { id: 'meters-per-second-squared', label: 'm/s²' },
    { id: 'seconds', label: 's' },
  ],
  rewardPicoPoints: 25,
};

export const randomPractice = [
  {
    id: 'graph-reading-sprint',
    title: 'Graph reading sprint',
    subject: 'math',
    topic: 'Functions',
    difficulty: 'easy',
    prompt: 'Identify the slope from a simple line graph.',
    rewardPicoPoints: 10,
  },
  {
    id: 'velocity-vs-distance',
    title: 'Velocity vs. distance',
    subject: 'physics',
    topic: 'Motion graphs',
    difficulty: 'medium',
    prompt: 'Choose whether a value describes distance or velocity.',
    rewardPicoPoints: 15,
  },
];

export const profile = {
  learner: {
    name: 'Alex',
    label: 'STEM Explorer',
    track: 'Engineering foundations',
  },
  picoPoints: 320,
  league: {
    current: 'Feather League',
    next: 'Wing League',
    progress: 64,
  },
  streak: {
    days: 5,
    label: '5-day streak',
  },
  badges: [
    { id: 'first-mission', name: 'First Mission', unlocked: true },
    { id: 'unit-detective', name: 'Unit Detective', unlocked: true },
    { id: 'ten-day-streak', name: '10-Day Streak', unlocked: false },
  ],
  goals: ['Improve kinematics', 'Strengthen algebra steps', 'Prepare for calculus'],
  recentActivity: [
    { id: 'completed-mission', label: 'Completed Practice Mission', detail: 'Units in motion' },
    { id: 'improved-signal', label: 'Improved learning signal', detail: 'Unit mismatch' },
  ],
};

export const settings = {
  saveLearningHistory: true,
  useLearningSignals: true,
  hintFrequency: 'balanced',
  explanationStyle: 'step-by-step',
  reduceMotion: false,
  highContrastMode: false,
};
