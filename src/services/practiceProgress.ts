const PRACTICE_PROGRESS_KEY = 'picolab.practice.progress';

export type PracticeProgress = {
  picoPoints: number;
  streak: number;
  completedMissionIds: string[];
  completedDailyChallengeDate?: string;
  lastCompletedMissionId?: string;
  improvedSignals?: string[];
  unlockedBadges?: string[];
  updatedAt: string;
};

type MissionCompletionInput = {
  missionId: string;
  awardedPicoPoints: number;
  updatedStreak?: number;
  completedDailyChallengeDate?: string;
  improvedSignals?: string[];
  unlockedBadges?: string[];
};

const defaultProgress = (): PracticeProgress => ({
  picoPoints: 320,
  streak: 5,
  completedMissionIds: [],
  improvedSignals: [],
  unlockedBadges: [],
  updatedAt: new Date().toISOString(),
});

const isProgress = (value: unknown): value is PracticeProgress => {
  if (!value || typeof value !== 'object') return false;

  const candidate = value as Partial<PracticeProgress>;

  return (
    typeof candidate.picoPoints === 'number' &&
    typeof candidate.streak === 'number' &&
    Array.isArray(candidate.completedMissionIds) &&
    typeof candidate.updatedAt === 'string'
  );
};

const canUseLocalStorage = () => typeof window !== 'undefined' && Boolean(window.localStorage);

export const loadPracticeProgress = (): PracticeProgress => {
  if (!canUseLocalStorage()) return defaultProgress();

  try {
    const raw = window.localStorage.getItem(PRACTICE_PROGRESS_KEY);
    if (!raw) return defaultProgress();

    const parsed = JSON.parse(raw) as unknown;
    return isProgress(parsed)
      ? {
          ...defaultProgress(),
          ...parsed,
          completedMissionIds: parsed.completedMissionIds.filter(
            (id): id is string => typeof id === 'string',
          ),
          improvedSignals: Array.isArray(parsed.improvedSignals)
            ? parsed.improvedSignals.filter((signal): signal is string => typeof signal === 'string')
            : [],
          unlockedBadges: Array.isArray(parsed.unlockedBadges)
            ? parsed.unlockedBadges.filter((badge): badge is string => typeof badge === 'string')
            : [],
        }
      : defaultProgress();
  } catch {
    return defaultProgress();
  }
};

export const savePracticeProgress = (progress: PracticeProgress) => {
  if (!canUseLocalStorage()) return;

  window.localStorage.setItem(PRACTICE_PROGRESS_KEY, JSON.stringify(progress));
};

export const applyPracticeMissionCompletion = (
  currentProgress: PracticeProgress,
  completion: MissionCompletionInput,
): PracticeProgress => {
  const alreadyCompleted = currentProgress.completedMissionIds.includes(completion.missionId);
  const completedMissionIds = alreadyCompleted
    ? currentProgress.completedMissionIds
    : [...currentProgress.completedMissionIds, completion.missionId];

  const improvedSignals = Array.from(
    new Set([...(currentProgress.improvedSignals ?? []), ...(completion.improvedSignals ?? [])]),
  );
  const unlockedBadges = Array.from(
    new Set([...(currentProgress.unlockedBadges ?? []), ...(completion.unlockedBadges ?? [])]),
  );

  const nextProgress: PracticeProgress = {
    ...currentProgress,
    picoPoints: alreadyCompleted
      ? currentProgress.picoPoints
      : currentProgress.picoPoints + completion.awardedPicoPoints,
    streak:
      typeof completion.updatedStreak === 'number'
        ? Math.max(currentProgress.streak, completion.updatedStreak)
        : currentProgress.streak,
    completedMissionIds,
    completedDailyChallengeDate:
      completion.completedDailyChallengeDate ?? currentProgress.completedDailyChallengeDate,
    lastCompletedMissionId: completion.missionId,
    improvedSignals,
    unlockedBadges,
    updatedAt: new Date().toISOString(),
  };

  savePracticeProgress(nextProgress);
  return nextProgress;
};

export const resetPracticeProgress = () => {
  if (!canUseLocalStorage()) return;

  window.localStorage.removeItem(PRACTICE_PROGRESS_KEY);
};
