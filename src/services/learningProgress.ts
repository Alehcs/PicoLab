import { loadPracticeProgress } from './practiceProgress';
import { loadDiagnosticSignals } from './diagnosticPersistence';
import { getSignalDefinition } from '../data/learningSignals';
import type { GrowthSignal } from '../data/mockGrowth';
import type { ActivityItem, Achievement, LeagueProgress, ProfileStat } from '../types/profile';
import type { GrowthMapResponse, LearningSignal, ProfileResponse } from '../types/api';

const signalIdFromLabel = (label: string) =>
  label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export const readLearningProgress = () => loadPracticeProgress();

export const localImprovedSignalsAsLearningSignals = (): LearningSignal[] => {
  const progress = readLearningProgress();
  const diagnosticSignals = loadDiagnosticSignals();
  const persistedSignals = diagnosticSignals.map((signal) => {
    const definition = getSignalDefinition(signal.signalId);

    return {
      id: signal.signalId,
      kind:
        signal.category === 'algebra'
          ? 'signSlip'
          : signal.category === 'formula'
            ? 'formulaSelection'
            : signal.category === 'concept'
              ? 'quantityConfusion'
              : signal.category === 'graph'
                ? 'graphReading'
                : 'unitMismatch',
      signalId: signal.signalId,
      category: signal.category,
      subtype: signal.signalId.split('.')[1],
      studentFriendlyLabel: definition?.studentFriendlyLabel,
      title: definition?.title ?? signal.signalId,
      description: definition?.description ?? signal.evidence,
      strength: signal.severity === 'high' ? 5 : signal.severity === 'medium' ? 3 : 1,
      suggestedFocus: definition?.growthPathFocus[0] ?? definition?.suggestedPractice[0] ?? signal.signalId,
      suggestedPractice: signal.suggestedPractice ?? definition?.suggestedPractice,
      suggestedVisualTemplate: signal.suggestedVisualTemplate ?? definition?.suggestedVisualTemplate,
    } satisfies LearningSignal;
  });

  return [
    ...persistedSignals,
    ...(progress.improvedSignals ?? []).map((signal, index) => ({
      id: `local-${signalIdFromLabel(signal) || index + 1}`,
      kind: 'unitMismatch',
      title: signal,
      description: 'Recent practice shows this signal is improving.',
      strength: 2,
      suggestedFocus: signal,
    }) satisfies LearningSignal),
  ];
};

export const mergeGrowthMapWithLocalProgress = (
  growthMap: GrowthMapResponse,
): GrowthMapResponse => {
  const localSignals = localImprovedSignalsAsLearningSignals();
  if (!localSignals.length) return growthMap;

  const existingIds = new Set(growthMap.learningSignals.map((signal) => signal.id));
  const mergedSignals = [
    ...localSignals.filter((signal) => !existingIds.has(signal.id)),
    ...growthMap.learningSignals,
  ];

  return {
    ...growthMap,
    learningSignals: mergedSignals,
    picoInsight: `${growthMap.picoInsight} Recent practice also shows improvement in ${localSignals
      .map((signal) => signal.title)
      .join(', ')}.`,
  };
};

export const mergeProfileWithLocalProgress = (profile: ProfileResponse): ProfileResponse => {
  const progress = readLearningProgress();
  const localBadges = progress.unlockedBadges ?? [];
  const badgeIds = new Set(profile.badges.map((badge) => badge.id));
  const mergedBadges = [
    ...profile.badges.map((badge) =>
      localBadges.includes(badge.name) ? { ...badge, unlocked: true } : badge,
    ),
    ...localBadges
      .filter((badge) => !badgeIds.has(signalIdFromLabel(badge)))
      .map((badge) => ({
        id: signalIdFromLabel(badge),
        name: badge,
        unlocked: true,
      })),
  ];
  const localActivity = createLocalRecentActivity();

  return {
    ...profile,
    picoPoints: Math.max(profile.picoPoints, progress.picoPoints),
    streakDays: Math.max(profile.streakDays, progress.streak),
    badges: mergedBadges,
    recentActivity: [...localActivity, ...profile.recentActivity].slice(0, 8),
  };
};

export const createLocalGrowthSignalRows = (): GrowthSignal[] =>
  localImprovedSignalsAsLearningSignals().map((signal) => ({
    id: signal.id,
    title: signal.title,
    badge: 'Improving',
    description: signal.description,
    whyItMatters: 'Practice progress is showing movement on this learning signal.',
    bestNextAction: { label: 'Practice again', route: '/practice-missions' },
    variant: 'green',
    strength: Math.max(2, signal.strength),
  }));

export const createLocalRecentActivity = (): ActivityItem[] => {
  const progress = readLearningProgress();
  const activity: ActivityItem[] = [];

  if (progress.lastCompletedMissionId) {
    activity.push({
      id: `local-completed-${progress.lastCompletedMissionId}`,
      label: 'Completed Practice Mission',
      detail: progress.lastCompletedMissionId.replace(/-/g, ' '),
      icon: 'target',
      variant: 'green',
    });
  }

  if (progress.completedDailyChallengeDate) {
    activity.push({
      id: 'local-daily-challenge',
      label: 'Completed Daily Challenge',
      detail: progress.completedDailyChallengeDate,
      icon: 'sparkle',
      variant: 'orange',
    });
  }

  for (const signal of progress.improvedSignals ?? []) {
    activity.push({
      id: `local-signal-${signalIdFromLabel(signal)}`,
      label: 'Improved learning signal',
      detail: signal,
      icon: 'signal',
      variant: 'blue',
    });
  }

  return activity;
};

export const mergeProfileStatsWithLocalProgress = (stats: ProfileStat[]): ProfileStat[] => {
  const progress = readLearningProgress();
  const completedMissionCount = progress.completedMissionIds.length;
  const improvedSignalCount = progress.improvedSignals?.length ?? 0;
  const badgeCount = progress.unlockedBadges?.length ?? 0;

  return stats.map((stat) => {
    if (stat.label === 'day streak') {
      return { ...stat, value: String(Math.max(Number(stat.value), progress.streak)) };
    }
    if (stat.label === 'missions') {
      return { ...stat, value: String(Math.max(Number(stat.value), completedMissionCount)) };
    }
    if (stat.label === 'PicoPoints') {
      return { ...stat, value: String(Math.max(Number(stat.value), progress.picoPoints)) };
    }
    if (stat.label === 'badges') {
      return { ...stat, value: String(Math.max(Number(stat.value), badgeCount)) };
    }
    if (stat.label === 'signals improved') {
      return { ...stat, value: String(Math.max(Number(stat.value), improvedSignalCount)) };
    }

    return stat;
  });
};

export const mergeLeagueWithLocalProfile = (
  league: LeagueProgress,
  profile: ProfileResponse,
): LeagueProgress => {
  const points = Math.max(league.points, profile.picoPoints);

  return {
    ...league,
    currentLeague: profile.league || league.currentLeague,
    points,
    remainingPoints: Math.max(0, league.nextLeaguePoints - points),
  };
};

export const mergeAchievementsWithLocalProfile = (
  achievements: Achievement[],
  profile: ProfileResponse,
): Achievement[] => {
  const backendBadges = new Set(profile.badges.filter((badge) => badge.unlocked).map((badge) => badge.name));
  const existingNames = new Set(achievements.map((achievement) => achievement.name));
  const localOnlyBadges = profile.badges.filter((badge) => badge.unlocked && !existingNames.has(badge.name));

  return [
    ...achievements.map((achievement) =>
      backendBadges.has(achievement.name) ? { ...achievement, unlocked: true } : achievement,
    ),
    ...localOnlyBadges.map((badge) => ({
      id: badge.id,
      name: badge.name,
      category: 'Growth' as const,
      unlocked: true,
      icon: 'target' as const,
      variant: 'green' as const,
    })),
  ];
};
