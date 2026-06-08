import type {
  Achievement,
  ActivityItem,
  LeagueProgress,
  LearnerProfile,
  PicoQuote,
  ProfileProgressSummary,
  ProfileStat,
  SubjectProgress,
} from '../types/profile';

export const learnerProfile: LearnerProfile = {
  name: 'Alex',
  initials: 'A',
  label: 'STEM Explorer',
  description: 'Focused on math and physics foundations.',
  track: 'Engineering foundations',
  league: 'Feather League',
};

export const leagueProgress: LeagueProgress = {
  currentLeague: 'Feather League',
  nextLeague: 'Wing League',
  points: 320,
  nextLeaguePoints: 500,
  remainingPoints: 180,
};

export const learningGoals = [
  'Improve kinematics',
  'Strengthen algebra steps',
  'Prepare for calculus',
];

export const mockProfileStats: ProfileStat[] = [
  { label: 'day streak', value: '5', icon: 'zap', variant: 'coral' },
  { label: 'missions', value: '12', icon: 'target', variant: 'blue' },
  { label: 'PicoPoints', value: '320', icon: 'sparkle', variant: 'orange' },
  { label: 'badges', value: '5', icon: 'award', variant: 'purple' },
  { label: 'signals improved', value: '8', icon: 'signal', variant: 'green' },
];

export const mockSubjectProgress: SubjectProgress[] = [
  { name: 'Algebra', progress: 72, status: 'Improving' },
  { name: 'Functions', progress: 45, status: 'Practicing' },
  { name: 'Calculus', progress: 18, status: 'Next focus' },
  { name: 'Kinematics', progress: 65, status: 'Improving' },
  { name: 'Forces', progress: 38, status: 'Practicing' },
  { name: 'Electromagnetism', progress: 12, status: 'Next focus' },
  { name: 'Graph reading', progress: 80, status: 'Strong' },
  { name: 'Units', progress: 55, status: 'Improving' },
];

export const profileProgressSummary: ProfileProgressSummary = {
  currentPath: 'Units in motion',
  pathProgress: 65,
  strongestSkill: 'Formula setup',
  focusArea: 'Unit reasoning',
  dailyChallengeStreak: '5 days',
  learningSignalsImproved: '8',
  picoInsight:
    'You usually choose the right formula. Your next growth step is making the units match the physical quantity.',
};

export const mockAchievements: Achievement[] = [
  {
    id: 'first-mission',
    name: 'First Mission',
    category: 'Growth',
    unlocked: true,
    icon: 'target',
    variant: 'blue',
  },
  {
    id: 'five-day-streak',
    name: '5-Day Streak',
    category: 'Consistency',
    unlocked: true,
    icon: 'zap',
    variant: 'coral',
  },
  {
    id: 'unit-detective',
    name: 'Unit Detective',
    category: 'Mastery',
    unlocked: true,
    icon: 'scan',
    variant: 'purple',
  },
  {
    id: 'visual-thinker',
    name: 'Visual Thinker',
    category: 'Exploration',
    unlocked: true,
    icon: 'flask',
    variant: 'green',
  },
  {
    id: 'growth-builder',
    name: 'Growth Builder',
    category: 'Growth',
    unlocked: true,
    icon: 'route',
    variant: 'orange',
  },
  {
    id: 'ten-day-streak',
    name: '10-Day Streak',
    category: 'Consistency',
    unlocked: false,
    icon: 'zap',
    variant: 'grey',
  },
  {
    id: 'kinematics-explorer',
    name: 'Kinematics Explorer',
    category: 'Mastery',
    unlocked: false,
    icon: 'route',
    variant: 'grey',
  },
  {
    id: 'algebra-builder',
    name: 'Algebra Builder',
    category: 'Mastery',
    unlocked: false,
    icon: 'edit',
    variant: 'grey',
  },
  {
    id: 'graph-reader',
    name: 'Graph Reader',
    category: 'Exploration',
    unlocked: false,
    icon: 'graph',
    variant: 'grey',
  },
  {
    id: 'calculus-starter',
    name: 'Calculus Starter',
    category: 'Mastery',
    unlocked: false,
    icon: 'sparkle',
    variant: 'grey',
  },
];

export const mockActivity: ActivityItem[] = [
  {
    id: 'completed-mission',
    label: 'Completed Practice Mission',
    detail: 'Units in motion',
    icon: 'target',
    variant: 'green',
  },
  {
    id: 'improved-signal',
    label: 'Improved learning signal',
    detail: 'Unit mismatch',
    icon: 'signal',
    variant: 'blue',
  },
  {
    id: 'opened-visual-lab',
    label: 'Opened Visual Lab',
    detail: 'Final velocity',
    icon: 'flask',
    variant: 'purple',
  },
  {
    id: 'started-growth-path',
    label: 'Started Growth Path',
    detail: 'Kinematics foundations',
    icon: 'route',
    variant: 'coral',
  },
  {
    id: 'completed-daily-challenge',
    label: 'Completed Daily Challenge',
    detail: 'Kinematics · Medium',
    icon: 'sparkle',
    variant: 'orange',
  },
];

export const picoQuotes: PicoQuote[] = [
  {
    text: '“The important thing is not to stop questioning.”',
    author: 'Albert Einstein',
    note: 'A small question today can become tomorrow’s breakthrough.',
  },
  {
    text: '“Mathematics is the language in which the universe has been written.”',
    author: 'Galileo Galilei',
    note: 'Each formula you learn is a sentence in the language of nature.',
  },
  {
    text: '“An investment in knowledge pays the best interest.”',
    author: 'Benjamin Franklin',
    note: 'Every mission you complete is interest compounding.',
  },
  {
    text: '“Somewhere, something incredible is waiting to be known.”',
    author: 'Carl Sagan',
    note: 'Curiosity is the engine. Practice is the fuel.',
  },
];
