import type { BadgeVariant } from '../components/ui/Badge';

export type GrowthFilter = 'session' | 'week' | 'all';

export type GrowthSummaryCardData = {
  label: string;
  title: string;
  description: string;
  variant: 'signal' | 'progress' | 'blue';
};

export type LearningSignalAction = {
  label: string;
  route?: string;
};

export type GrowthSignal = {
  id: string;
  title: string;
  badge: string;
  description: string;
  whyItMatters?: string;
  bestNextAction: LearningSignalAction;
  variant: BadgeVariant;
  strength: number;
};

export type GrowthPathStepStatus = 'recommended' | 'up-next' | 'later';

export type GrowthPathStepData = {
  id: string;
  stepLabel: string;
  title: string;
  badge: string;
  status: GrowthPathStepStatus;
  reason: string;
  items: string[];
  metadata: string[];
  cta: string;
  route?: string;
};

export const growthFilters: Array<{ label: string; value: GrowthFilter }> = [
  { label: 'This session', value: 'session' },
  { label: 'This week', value: 'week' },
  { label: 'All time', value: 'all' },
];

export const growthMapSummaryCards: GrowthSummaryCardData[] = [
  {
    label: 'Main focus',
    title: 'Units in motion',
    description: 'Your calculations are often correct, but units need more attention.',
    variant: 'signal',
  },
  {
    label: 'Strongest skill',
    title: 'Formula setup',
    description: 'You are choosing the right equations consistently.',
    variant: 'progress',
  },
  {
    label: 'Next opportunity',
    title: 'Velocity vs. distance',
    description: 'A short visual practice can help separate these concepts.',
    variant: 'blue',
  },
];

export const growthLearningSignals: GrowthSignal[] = [
  {
    id: 'units.final_unit_mismatch',
    title: 'Unit mismatch',
    badge: 'Seen 4 times',
    description: 'You often get the number right, but the unit does not match the quantity.',
    whyItMatters:
      'This usually means the calculation is close, but dimensional reasoning needs practice.',
    bestNextAction: { label: 'Practice units', route: '/practice-missions' },
    variant: 'coral',
    strength: 4,
  },
  {
    id: 'algebra.sign_error',
    title: 'Sign slips',
    badge: 'Seen 2 times',
    description: 'Negative signs sometimes disappear when rearranging equations.',
    bestNextAction: { label: 'Practice algebra steps', route: '/practice-missions' },
    variant: 'yellow',
    strength: 2,
  },
  {
    id: 'concept.quantity_confusion',
    title: 'Quantity confusion',
    badge: 'Seen 3 times',
    description: 'Velocity and distance are being mixed in motion problems.',
    bestNextAction: { label: 'Open visual comparison', route: '/visual-lab' },
    variant: 'blue',
    strength: 3,
  },
];

export const growthMapSuggestedDirection = {
  title: 'Suggested direction',
  content:
    'Based on your recent learning signals, your best next focus is Units in motion.',
  cta: 'Continue in Roadmap',
  route: '/growth-path',
};

export const growthMapPicoInsight =
  'You usually choose the right formula. The next growth step is making the units match the physical quantity.';

export const currentGrowthGoal = {
  title: 'Current goal',
  value: 'Improve kinematics fundamentals',
  copy: 'Pico uses your goal and learning signals to prioritize your next steps.',
};

export const growthPathProgress = {
  percent: 65,
  label: '65% of current roadmap completed',
  detail: '2 of 3 focus areas completed',
};

export const recommendedGrowthStep = {
  title: 'Recommended next',
  skill: 'Units in motion',
  text:
    'Pico noticed that your calculations are usually close, but the units sometimes do not match the physical quantity.',
  why:
    'Units help you know whether an answer describes position, velocity, acceleration, force, or energy.',
};

export const growthPathSteps: GrowthPathStepData[] = [
  {
    id: 'units-in-kinematics',
    stepLabel: 'Step 1',
    title: 'Units in kinematics',
    badge: 'Recommended',
    status: 'recommended',
    reason: 'Seen in 4 recent learning signals.',
    items: [
      'matching formulas with units',
      'checking final answers',
      'distinguishing m, m/s, and m/s²',
    ],
    metadata: ['5 min', 'Visual + practice', 'Kinematics'],
    cta: 'Start',
    route: '/practice-missions',
  },
  {
    id: 'velocity-vs-distance',
    stepLabel: 'Step 2',
    title: 'Velocity vs. distance',
    badge: 'Up next',
    status: 'up-next',
    reason: 'Related to your unit signals.',
    items: [
      'reading motion graphs',
      'comparing position and velocity',
      'identifying what a question asks for',
    ],
    metadata: ['7 min', 'Visual lesson', 'Motion graphs'],
    cta: 'Preview',
    route: '/visual-lab',
  },
  {
    id: 'algebra-signs',
    stepLabel: 'Step 3',
    title: 'Algebra signs',
    badge: 'Later',
    status: 'later',
    reason: 'A smaller pattern appeared in equation rearranging.',
    items: ['negative signs', 'moving terms', 'checking equivalent equations'],
    metadata: ['4 min', 'Practice', 'Algebra'],
    cta: 'Save for later',
  },
];

export const growthPathPicoPlan =
  'We’ll start with the smallest detail that unlocks the most understanding: units. Once that feels natural, velocity and distance will become easier to separate.';
