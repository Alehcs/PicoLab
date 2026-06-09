import { loadPracticeProgress } from './practiceProgress';
import { loadDiagnosticSignals } from './diagnosticPersistence';
import { getSignalDefinition, prioritizeSignals } from '../data/learningSignals';
import {
  getVisualTemplateForDiagnosticSignal,
  getVisualTemplateForDiagnosticSignals,
} from './visualLabSuggestion';
import type { GrowthSignal } from '../data/mockGrowth';
import type { ActivityItem, Achievement, LeagueProgress, ProfileStat } from '../types/profile';
import type { GrowthMapResponse, LearningSignal, ProfileResponse } from '../types/api';
import type {
  LearningSignalCategory,
  LearningSignalInstance,
  LearningSignalSeverity,
} from '../types/learningSignals';

export type DiagnosticSignalStat = {
  signalId: string;
  title: string;
  studentFriendlyLabel: string;
  category: LearningSignalCategory;
  count: number;
  latestOccurrence: string;
  highestSeverity: LearningSignalSeverity;
  confidence: number;
  suggestedFocus: string;
};

const signalIdFromLabel = (label: string) =>
  label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const severityRank: Record<LearningSignalSeverity, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

const knownCategories: LearningSignalCategory[] = [
  'algebra',
  'units',
  'formula',
  'concept',
  'graph',
  'reading',
  'calculation',
];

const categoryFallbackFocus: Record<LearningSignalCategory, string> = {
  algebra: 'Algebra steps and sign checks',
  units: 'Unit reasoning and dimensional checks',
  formula: 'Formula selection and rearrangement',
  concept: 'Concept meaning and physical quantities',
  graph: 'Graph interpretation and slope meaning',
  reading: 'Problem reading and target identification',
  calculation: 'Calculation accuracy and estimate checks',
};

const learningSignalKindByCategory: Record<LearningSignalCategory, LearningSignal['kind']> = {
  algebra: 'signSlip',
  units: 'unitMismatch',
  formula: 'formulaSelection',
  concept: 'quantityConfusion',
  graph: 'graphReading',
  reading: 'reasoningGap',
  calculation: 'reasoningGap',
};

const isKnownCategory = (category: string | undefined): category is LearningSignalCategory =>
  knownCategories.includes(category as LearningSignalCategory);

const isKnownSeverity = (severity: string | undefined): severity is LearningSignalSeverity =>
  severity === 'high' || severity === 'medium' || severity === 'low';

const normalizeDiagnosticSignal = (signal: LearningSignalInstance): LearningSignalInstance => {
  const definition = getSignalDefinition(signal.signalId);
  const category = isKnownCategory(signal.category)
    ? signal.category
    : definition?.category ?? 'concept';

  return {
    ...signal,
    category,
    severity: isKnownSeverity(signal.severity) ? signal.severity : 'low',
    status: signal.status ?? 'new',
    confidence:
      typeof signal.confidence === 'number' && Number.isFinite(signal.confidence)
        ? signal.confidence
        : 0,
    evidence: signal.evidence ?? definition?.description ?? signal.signalId,
    createdAt: signal.createdAt ?? new Date(0).toISOString(),
    suggestedPractice: signal.suggestedPractice ?? definition?.suggestedPractice,
    suggestedVisualTemplate: signal.suggestedVisualTemplate ?? definition?.suggestedVisualTemplate,
  };
};

const diagnosticSignalToLearningSignal = (signal: LearningSignalInstance): LearningSignal => {
  const normalizedSignal = normalizeDiagnosticSignal(signal);
  const definition = getSignalDefinition(normalizedSignal.signalId);

  return {
    id: normalizedSignal.signalId,
    kind: learningSignalKindByCategory[normalizedSignal.category],
    signalId: normalizedSignal.signalId,
    category: normalizedSignal.category,
    subtype: definition?.subtype ?? normalizedSignal.signalId.split('.')[1],
    studentFriendlyLabel: definition?.studentFriendlyLabel,
    title: definition?.studentFriendlyLabel ?? definition?.title ?? normalizedSignal.signalId,
    description: definition?.description ?? normalizedSignal.evidence,
    strength:
      normalizedSignal.severity === 'high' ? 5 : normalizedSignal.severity === 'medium' ? 3 : 1,
    suggestedFocus:
      definition?.growthPathFocus[0] ??
      definition?.suggestedPractice[0] ??
      categoryFallbackFocus[normalizedSignal.category],
    suggestedPractice: normalizedSignal.suggestedPractice ?? definition?.suggestedPractice,
    suggestedVisualTemplate:
      normalizedSignal.suggestedVisualTemplate ?? definition?.suggestedVisualTemplate,
    sourceProblemId: normalizedSignal.relatedProblemId,
  };
};

const dedupeSignalsBySignalId = (signals: LearningSignalInstance[]) => {
  const seen = new Set<string>();
  const deduped: LearningSignalInstance[] = [];

  for (const signal of signals) {
    if (seen.has(signal.signalId)) continue;

    seen.add(signal.signalId);
    deduped.push(signal);
  }

  return deduped;
};

export const readLearningProgress = () => loadPracticeProgress();

export const getPersistedDiagnosticSignals = (): LearningSignalInstance[] =>
  loadDiagnosticSignals().map(normalizeDiagnosticSignal);

export const getPrioritizedDiagnosticSignals = (limit?: number): LearningSignalInstance[] => {
  const prioritizedSignals = prioritizeSignals(getPersistedDiagnosticSignals());
  return typeof limit === 'number' ? prioritizedSignals.slice(0, limit) : prioritizedSignals;
};

export const getRecentDiagnosticSignals = (limit = 3): LearningSignalInstance[] =>
  [...getPersistedDiagnosticSignals()]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);

export const getSignalStats = (): DiagnosticSignalStat[] => {
  const stats = new Map<string, DiagnosticSignalStat>();

  for (const signal of getPersistedDiagnosticSignals()) {
    const definition = getSignalDefinition(signal.signalId);
    const existing = stats.get(signal.signalId);

    if (!existing) {
      stats.set(signal.signalId, {
        signalId: signal.signalId,
        title: definition?.title ?? signal.signalId,
        studentFriendlyLabel: definition?.studentFriendlyLabel ?? signal.signalId,
        category: signal.category,
        count: 1,
        latestOccurrence: signal.createdAt,
        highestSeverity: signal.severity,
        confidence: signal.confidence,
        suggestedFocus:
          definition?.growthPathFocus[0] ??
          definition?.suggestedPractice[0] ??
          categoryFallbackFocus[signal.category],
      });
      continue;
    }

    const latestOccurrence =
      new Date(signal.createdAt).getTime() > new Date(existing.latestOccurrence).getTime()
        ? signal.createdAt
        : existing.latestOccurrence;

    stats.set(signal.signalId, {
      ...existing,
      count: existing.count + 1,
      latestOccurrence,
      highestSeverity:
        severityRank[signal.severity] > severityRank[existing.highestSeverity]
          ? signal.severity
          : existing.highestSeverity,
      confidence: Math.max(existing.confidence, signal.confidence),
    });
  }

  return [...stats.values()].sort((a, b) => {
    const severityDelta = severityRank[b.highestSeverity] - severityRank[a.highestSeverity];
    if (severityDelta) return severityDelta;

    const countDelta = b.count - a.count;
    if (countDelta) return countDelta;

    return new Date(b.latestOccurrence).getTime() - new Date(a.latestOccurrence).getTime();
  });
};

export const getSuggestedGrowthFocusFromSignals = (
  signals = getPrioritizedDiagnosticSignals(4),
): string | null => {
  if (!signals.length) return null;

  const categoryCounts = signals.reduce<Record<LearningSignalCategory, number>>(
    (counts, signal) => ({
      ...counts,
      [signal.category]: counts[signal.category] + 1,
    }),
    {
      algebra: 0,
      units: 0,
      formula: 0,
      concept: 0,
      graph: 0,
      reading: 0,
      calculation: 0,
    },
  );
  const primarySignal = signals[0];
  const primaryCategory = knownCategories.reduce(
    (current, category) =>
      categoryCounts[category] > categoryCounts[current] ? category : current,
    primarySignal.category,
  );
  const definition = getSignalDefinition(primarySignal.signalId);

  return definition?.growthPathFocus[0] ?? categoryFallbackFocus[primaryCategory];
};

export const getSuggestedVisualTemplateFromSignal = getVisualTemplateForDiagnosticSignal;
export const getSuggestedVisualTemplateFromSignals = getVisualTemplateForDiagnosticSignals;

const practiceImprovedSignalsAsLearningSignals = (): LearningSignal[] => {
  const progress = readLearningProgress();

  return (progress.improvedSignals ?? []).map((signal, index) => ({
    id: `local-${signalIdFromLabel(signal) || index + 1}`,
    kind: 'unitMismatch',
    title: signal,
    description: 'Recent practice shows this signal is improving.',
    strength: 2,
    suggestedFocus: signal,
  }) satisfies LearningSignal);
};

export const localImprovedSignalsAsLearningSignals = (): LearningSignal[] => {
  const persistedSignals = dedupeSignalsBySignalId(getPrioritizedDiagnosticSignals(6)).map(
    diagnosticSignalToLearningSignal,
  );

  return [...persistedSignals, ...practiceImprovedSignalsAsLearningSignals()];
};

export const mergeGrowthMapWithDiagnosticSignals = (
  growthMap: GrowthMapResponse,
): GrowthMapResponse => {
  const diagnosticSignals = getPrioritizedDiagnosticSignals(6);
  if (!diagnosticSignals.length) return growthMap;

  const diagnosticLearningSignals = dedupeSignalsBySignalId(diagnosticSignals).map(
    diagnosticSignalToLearningSignal,
  );
  const existingIds = new Set(
    growthMap.learningSignals.map((signal) => signal.signalId ?? signal.id),
  );
  const mergedSignals = [
    ...diagnosticLearningSignals.filter(
      (signal) => !existingIds.has(signal.signalId ?? signal.id),
    ),
    ...growthMap.learningSignals,
  ];
  const focus = getSuggestedGrowthFocusFromSignals(diagnosticSignals);
  const primarySignal = diagnosticLearningSignals[0];

  return {
    ...growthMap,
    mainFocus: focus ?? growthMap.mainFocus,
    nextOpportunity: primarySignal?.title ?? growthMap.nextOpportunity,
    learningSignals: mergedSignals,
    picoInsight: `${growthMap.picoInsight} Recent diagnostic signals point toward ${focus ?? primarySignal?.suggestedFocus ?? 'the next focused practice step'}.`,
  };
};

export const mergeGrowthMapWithLocalProgress = (
  growthMap: GrowthMapResponse,
): GrowthMapResponse => {
  const signalAwareGrowthMap = mergeGrowthMapWithDiagnosticSignals(growthMap);
  const localSignals = practiceImprovedSignalsAsLearningSignals();
  if (!localSignals.length) return signalAwareGrowthMap;

  const existingIds = new Set(signalAwareGrowthMap.learningSignals.map((signal) => signal.id));
  const mergedSignals = [
    ...localSignals.filter((signal) => !existingIds.has(signal.id)),
    ...signalAwareGrowthMap.learningSignals,
  ];

  return {
    ...signalAwareGrowthMap,
    learningSignals: mergedSignals,
    picoInsight: `${signalAwareGrowthMap.picoInsight} Recent practice also shows movement in ${localSignals
      .map((signal) => signal.title)
      .join(', ')}.`,
  };
};

export const mergeProfileWithDiagnosticSignals = (profile: ProfileResponse): ProfileResponse => {
  const recentDiagnosticActivity = createDiagnosticRecentActivity();

  if (!recentDiagnosticActivity.length) return profile;

  return {
    ...profile,
    recentActivity: [...recentDiagnosticActivity, ...profile.recentActivity].slice(0, 8),
  };
};

export const mergeProfileWithLocalProgress = (profile: ProfileResponse): ProfileResponse => {
  const signalAwareProfile = mergeProfileWithDiagnosticSignals(profile);
  const progress = readLearningProgress();
  const localBadges = progress.unlockedBadges ?? [];
  const badgeIds = new Set(signalAwareProfile.badges.map((badge) => badge.id));
  const mergedBadges = [
    ...signalAwareProfile.badges.map((badge) =>
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
    ...signalAwareProfile,
    picoPoints: Math.max(signalAwareProfile.picoPoints, progress.picoPoints),
    streakDays: Math.max(signalAwareProfile.streakDays, progress.streak),
    badges: mergedBadges,
    recentActivity: [...localActivity, ...signalAwareProfile.recentActivity].slice(0, 8),
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

export const createDiagnosticRecentActivity = (): ActivityItem[] =>
  getRecentDiagnosticSignals(3).map((signal) => {
    const definition = getSignalDefinition(signal.signalId);

    return {
      id: `diagnostic-signal-${signal.id}`,
      label: 'Learning signal noticed',
      detail:
        definition?.studentFriendlyLabel ??
        definition?.title ??
        categoryFallbackFocus[signal.category],
      icon: 'signal',
      variant:
        signal.severity === 'high' ? 'coral' : signal.severity === 'medium' ? 'blue' : 'green',
    };
  });

export const mergeProfileStatsWithLocalProgress = (stats: ProfileStat[]): ProfileStat[] => {
  const progress = readLearningProgress();
  const completedMissionCount = progress.completedMissionIds.length;
  const diagnosticSignalCount = getSignalStats().length;
  const improvedSignalCount = Math.max(progress.improvedSignals?.length ?? 0, diagnosticSignalCount);
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
  const backendBadges = new Set(
    profile.badges.filter((badge) => badge.unlocked).map((badge) => badge.name),
  );
  const existingNames = new Set(achievements.map((achievement) => achievement.name));
  const localOnlyBadges = profile.badges.filter(
    (badge) => badge.unlocked && !existingNames.has(badge.name),
  );

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
