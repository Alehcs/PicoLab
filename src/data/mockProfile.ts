import type { Achievement, ProfileStat, SubjectProgress } from '../types/profile';

export const mockProfileStats: ProfileStat[] = [
  { label: 'day streak', value: '5' },
  { label: 'missions', value: '12' },
  { label: 'PicoPoints', value: '320' },
  { label: 'badges', value: '5' },
  { label: 'signals improved', value: '8' },
];

export const mockSubjectProgress: SubjectProgress[] = [
  { name: 'Algebra', progress: 72, status: 'Improving' },
  { name: 'Functions', progress: 45, status: 'Practicing' },
  { name: 'Kinematics', progress: 65, status: 'Improving' },
  { name: 'Graph reading', progress: 80, status: 'Strong' },
  { name: 'Units', progress: 55, status: 'Improving' },
];

export const mockAchievements: Achievement[] = [
  { id: 'first-mission', name: 'First Mission', category: 'Growth', unlocked: true },
  { id: 'unit-detective', name: 'Unit Detective', category: 'Mastery', unlocked: true },
  { id: 'visual-thinker', name: 'Visual Thinker', category: 'Exploration', unlocked: true },
];
