import type { GrowthStep, LearningSignal } from '../types/learning';

export const mockLearningSignals: LearningSignal[] = [
  {
    id: 'unit-mismatch',
    kind: 'unit-mismatch',
    title: 'Unit mismatch',
    description: 'The number is often right, but the unit does not match the physical quantity.',
    seenCount: 4,
    route: '/practice-missions',
  },
  {
    id: 'sign-slips',
    kind: 'sign-slip',
    title: 'Sign slips',
    description: 'Negative signs sometimes disappear when rearranging equations.',
    seenCount: 2,
    route: '/practice-missions',
  },
  {
    id: 'quantity-confusion',
    kind: 'quantity-confusion',
    title: 'Quantity confusion',
    description: 'Velocity and distance are being mixed in motion problems.',
    seenCount: 3,
    route: '/visual-lab',
  },
];

export const mockGrowthSteps: GrowthStep[] = [
  {
    id: 'units-in-kinematics',
    title: 'Units in kinematics',
    status: 'recommended',
    reason: 'Seen in recent learning signals.',
    items: ['Matching formulas with units', 'Checking final answers', 'Distinguishing m, m/s, and m/s2'],
  },
  {
    id: 'velocity-vs-distance',
    title: 'Velocity vs. distance',
    status: 'up-next',
    reason: 'Related to unit reasoning signals.',
    items: ['Reading motion graphs', 'Comparing position and velocity', 'Identifying what the question asks for'],
  },
];
