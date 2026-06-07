export type SubjectStatus = 'Strong' | 'Improving' | 'Practicing' | 'Next focus';

export type SubjectProgress = {
  name: string;
  progress: number;
  status: SubjectStatus;
};

export type ProfileStat = {
  label: string;
  value: string;
};

export type Achievement = {
  id: string;
  name: string;
  category: string;
  unlocked: boolean;
};
