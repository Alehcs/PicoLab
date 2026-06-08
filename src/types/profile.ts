export type SubjectStatus = 'Strong' | 'Improving' | 'Practicing' | 'Next focus';

export type SubjectProgress = {
  name: string;
  progress: number;
  status: SubjectStatus;
};

export type ProfileStat = {
  label: string;
  value: string;
  icon: 'zap' | 'target' | 'sparkle' | 'award' | 'signal';
  variant: 'blue' | 'green' | 'coral' | 'yellow' | 'purple' | 'orange';
};

export type Achievement = {
  id: string;
  name: string;
  category: 'Consistency' | 'Mastery' | 'Exploration' | 'Growth';
  unlocked: boolean;
  icon: 'target' | 'zap' | 'scan' | 'flask' | 'route' | 'edit' | 'graph' | 'sparkle';
  variant: 'blue' | 'green' | 'coral' | 'yellow' | 'purple' | 'orange' | 'grey';
};

export type LearnerProfile = {
  name: string;
  initials: string;
  label: string;
  description: string;
  track: string;
  league: string;
};

export type LeagueProgress = {
  currentLeague: string;
  nextLeague: string;
  points: number;
  nextLeaguePoints: number;
  remainingPoints: number;
};

export type ProfileProgressSummary = {
  currentPath: string;
  pathProgress: number;
  strongestSkill: string;
  focusArea: string;
  dailyChallengeStreak: string;
  learningSignalsImproved: string;
  picoInsight: string;
};

export type ActivityItem = {
  id: string;
  label: string;
  detail: string;
  icon: 'target' | 'signal' | 'flask' | 'route' | 'sparkle';
  variant: 'blue' | 'green' | 'coral' | 'yellow' | 'purple' | 'orange';
};

export type PicoQuote = {
  text: string;
  author: string;
  note: string;
};
