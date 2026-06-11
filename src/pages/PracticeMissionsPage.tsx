import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DailyChallengeCard } from '../components/practice/DailyChallengeCard';
import { FocusMissionCard } from '../components/practice/FocusMissionCard';
import { MissionCompleteCard } from '../components/practice/MissionCompleteCard';
import { PracticeCoachPanel } from '../components/practice/PracticeCoachPanel';
import { RandomMissionCard } from '../components/practice/RandomMissionCard';
import { PageHeader } from '../components/layout/PageHeader';
import { AskPicoDrawer } from '../components/pico/AskPicoDrawer';
import { Card } from '../components/ui/Card';
import { dailyChallenge, focusMission, randomMissions } from '../data/mockMissions';
import { picolabApi } from '../services/picolabApi';
import {
  applyPracticeMissionCompletion,
  loadPracticeProgress,
  type PracticeProgress,
} from '../services/practiceProgress';
import { storeVisualLabSuggestionFromSignals } from '../services/visualLabSuggestion';
import type {
  PracticeAnswerResponse,
  PracticeCompleteResponse,
  PracticeMission,
} from '../types/api';
import type { Mission, PracticeQuestion } from '../types/mission';

const localDailyPractice: PracticeMission = {
  id: dailyChallenge.mission.id,
  title: dailyChallenge.mission.title,
  subject: 'physics',
  topic: dailyChallenge.mission.topic,
  difficulty: 'medium',
  prompt: dailyChallenge.problem,
  rewardPicoPoints: dailyChallenge.mission.reward.points,
};

const localFocusPractice: PracticeMission = {
  id: focusMission.id,
  title: focusMission.title,
  subject: 'physics',
  topic: 'Kinematics',
  difficulty: 'medium',
  prompt: focusMission.question.prompt,
  options: focusMission.question.options,
  rewardPicoPoints: 25,
};

const localRandomPractice: PracticeMission[] = randomMissions.map((mission) => ({
  id: mission.id,
  title: mission.title,
  subject: mission.subject === 'Math' ? 'math' : 'physics',
  topic: mission.topic,
  difficulty: mission.difficulty.toLowerCase() as PracticeMission['difficulty'],
  prompt: mission.title,
  rewardPicoPoints: mission.reward.points,
}));

const randomMissionDescriptions: Record<string, string | undefined> = Object.fromEntries(
  randomMissions.map((mission) => [mission.id, mission.description]),
);

const toMissionCard = (mission: PracticeMission): Mission => ({
  id: mission.id,
  title: mission.title,
  subject: mission.subject === 'math' ? 'Math' : 'Physics',
  topic: mission.topic,
  difficulty:
    mission.difficulty === 'easy' ? 'Easy' : mission.difficulty === 'hard' ? 'Hard' : 'Medium',
  reward: {
    label: `+${mission.rewardPicoPoints} PicoPoints`,
    points: mission.rewardPicoPoints,
  },
  description: randomMissionDescriptions[mission.id],
});

const toPracticeQuestion = (mission: PracticeMission): PracticeQuestion => ({
  id: mission.id,
  prompt: mission.prompt,
  options: mission.options?.length ? mission.options : focusMission.question.options,
  correctOptionId: focusMission.question.correctOptionId,
  feedbackCorrect: focusMission.question.feedbackCorrect,
  feedbackUsefulSignal: focusMission.question.feedbackUsefulSignal,
});

const fallbackAnswerResult = (selectedOptionId: string): PracticeAnswerResponse => {
  const isComplete = selectedOptionId === focusMission.question.correctOptionId;

  return {
    status: isComplete ? 'complete' : 'needsAttention',
    supportiveFeedback: isComplete
      ? focusMission.question.feedbackCorrect
      : focusMission.question.feedbackUsefulSignal,
    explanation: 'Unit cancellation turns m/s² · s into m/s.',
    earnedPicoPoints: isComplete ? 25 : 0,
    picoPointsPreview: isComplete ? 25 : 0,
  };
};

export function PracticeMissionsPage() {
  const navigate = useNavigate();
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [checking, setChecking] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [missionsLoading, setMissionsLoading] = useState(true);
  const [dailyPracticeMission, setDailyPracticeMission] = useState(localDailyPractice);
  const [focusPracticeMission, setFocusPracticeMission] = useState(localFocusPractice);
  const [randomPracticeList, setRandomPracticeList] = useState(localRandomPractice);
  const [answerResult, setAnswerResult] = useState<PracticeAnswerResponse | null>(null);
  const [completionResult, setCompletionResult] = useState<PracticeCompleteResponse | null>(null);
  const [progress, setProgress] = useState<PracticeProgress>(() => loadPracticeProgress());
  const [randomPreview, setRandomPreview] = useState(randomMissions[0].title);
  const [askPicoOpen, setAskPicoOpen] = useState(false);
  const [dailyStarted, setDailyStarted] = useState(false);
  const [dailySelectedOptionId, setDailySelectedOptionId] = useState<string | null>(null);
  const [dailyChecked, setDailyChecked] = useState(false);
  const [dailyCompleting, setDailyCompleting] = useState(false);
  const [extraPracticeActive, setExtraPracticeActive] = useState(false);
  const randomSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;

    const loadMissions = async () => {
      setMissionsLoading(true);

      try {
        const [dailyResult, focusResult, randomResult] = await Promise.all([
          picolabApi.getDailyPractice(),
          picolabApi.getFocusPractice(),
          picolabApi.getRandomPractice(),
        ]);

        if (!isMounted) return;

        if (dailyResult.ok) setDailyPracticeMission(dailyResult.data);
        if (focusResult.ok) setFocusPracticeMission(focusResult.data);
        if (randomResult.ok) {
          setRandomPracticeList(randomResult.data);
          setRandomPreview(randomResult.data[0]?.title ?? randomMissions[0].title);
        }
      } catch {
        if (import.meta.env?.DEV) {
          console.warn('Practice missions failed to load; using local fallback.');
        }
      } finally {
        if (isMounted) setMissionsLoading(false);
      }
    };

    loadMissions();

    return () => {
      isMounted = false;
    };
  }, []);

  const dailyMission = useMemo(() => toMissionCard(dailyPracticeMission), [dailyPracticeMission]);
  const focusQuestion = useMemo(
    () => toPracticeQuestion(focusPracticeMission),
    [focusPracticeMission],
  );
  const randomMissionCards = useMemo(
    () => randomPracticeList.map(toMissionCard),
    [randomPracticeList],
  );
  const focusMissionCompleted = progress.completedMissionIds.includes(focusPracticeMission.id);
  const isComplete = answerResult?.status === 'complete' || focusMissionCompleted;

  const completionStats = useMemo(() => {
    const improvedSignal =
      completionResult?.improvedSignals?.[0] ??
      answerResult?.learningSignal?.title ??
      'Units in motion';
    const badge =
      completionResult?.unlockedBadges?.[0]?.name ??
      progress.unlockedBadges?.[0] ??
      'Daily Builder';

    return [
      { label: 'PicoPoints', value: `${progress.picoPoints}` },
      { label: 'Current streak', value: `${progress.streak} days` },
      { label: 'Learning signal improved', value: improvedSignal || badge },
    ];
  }, [
    answerResult,
    completionResult,
    progress.picoPoints,
    progress.streak,
    progress.unlockedBadges,
  ]);
  const completionCopy = 'Pico saved your progress and marked this focus area as improved.';

  const completeFocusMission = async (result: PracticeAnswerResponse) => {
    if (progress.completedMissionIds.includes(focusPracticeMission.id)) {
      setCompletionResult({
        awardedPicoPoints: 0,
        updatedStreak: progress.streak,
        improvedSignals: result.learningSignal ? [result.learningSignal.title] : ['Units in motion'],
      });
      return;
    }

    setCompleting(true);

    try {
      const completion = await picolabApi.completePracticeMission({
        missionId: focusPracticeMission.id,
        status: 'complete',
      });
      const completionData = completion.ok
        ? completion.data
        : {
            awardedPicoPoints: result.earnedPicoPoints || focusPracticeMission.rewardPicoPoints,
            updatedStreak: progress.streak + 1,
            improvedSignals: result.learningSignal ? [result.learningSignal.title] : ['Units in motion'],
          };

      setCompletionResult(completionData);
      setProgress((currentProgress) =>
        applyPracticeMissionCompletion(currentProgress, {
          missionId: focusPracticeMission.id,
          awardedPicoPoints: completionData.awardedPicoPoints,
          updatedStreak: completionData.updatedStreak,
          improvedSignals:
            completionData.improvedSignals ??
            (result.learningSignal ? [result.learningSignal.title] : ['Units in motion']),
          unlockedBadges: completionData.unlockedBadges?.map((badge) => badge.name),
        }),
      );
    } catch {
      const localCompletion = {
        awardedPicoPoints: result.earnedPicoPoints || focusPracticeMission.rewardPicoPoints,
        updatedStreak: progress.streak + 1,
        improvedSignals: result.learningSignal ? [result.learningSignal.title] : ['Units in motion'],
      };

      setCompletionResult(localCompletion);
      setProgress((currentProgress) =>
        applyPracticeMissionCompletion(currentProgress, {
          missionId: focusPracticeMission.id,
          awardedPicoPoints: localCompletion.awardedPicoPoints,
          updatedStreak: localCompletion.updatedStreak,
          improvedSignals: localCompletion.improvedSignals,
        }),
      );
    } finally {
      setCompleting(false);
    }
  };

  const checkAnswer = async () => {
    if (!selectedOptionId || checking) return;

    const selectedOption = focusQuestion.options.find((option) => option.id === selectedOptionId);

    setChecking(true);
    setChecked(false);
    setAnswerResult(null);
    setCompletionResult(null);

    try {
      const result = await picolabApi.checkPracticeAnswer({
        missionId: focusPracticeMission.id,
        selectedOptionId,
        answer: selectedOption?.label ?? selectedOptionId,
      });
      const nextAnswer = result.ok ? result.data : fallbackAnswerResult(selectedOptionId);

      setAnswerResult(nextAnswer);
      setChecked(true);

      if (nextAnswer.status === 'complete') {
        await completeFocusMission(nextAnswer);
      }
    } catch {
      const nextAnswer = fallbackAnswerResult(selectedOptionId);

      setAnswerResult(nextAnswer);
      setChecked(true);

      if (nextAnswer.status === 'complete') {
        await completeFocusMission(nextAnswer);
      }
    } finally {
      setChecking(false);
    }
  };

  const selectOption = (optionId: string) => {
    setSelectedOptionId(optionId);
    setChecked(false);
    setAnswerResult(null);
    setCompletionResult(null);
  };

  const continueExtraPractice = () => {
    // Select the first random mission that isn't already selected, then bring the
    // optional Random Missions section into view. No new solving flow is added.
    const firstUnselected =
      randomMissionCards.find((mission) => mission.title !== randomPreview) ??
      randomMissionCards[0];
    if (firstUnselected) setRandomPreview(firstUnselected.title);
    setExtraPracticeActive(true);
    randomSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const openVisualLab = () => {
    storeVisualLabSuggestionFromSignals(
      answerResult?.signals ??
        (answerResult?.primarySignal ? [answerResult.primarySignal] : undefined),
    );
    navigate('/visual-lab');
  };

  const coachStats = useMemo(
    () => [
      { label: "Today's reward", value: `+${focusPracticeMission.rewardPicoPoints} PicoPoints` },
      { label: 'Current streak', value: `${progress.streak} days` },
      { label: 'Focus area', value: 'Units in motion' },
    ],
    [focusPracticeMission.rewardPicoPoints, progress.streak],
  );

  // --- Daily Challenge (interactive, in-page, deterministic) -------------------
  const dailyQuestion = dailyChallenge.question;
  const dailyCompleted = progress.completedMissionIds.includes(dailyPracticeMission.id);
  const dailyAnswerCorrect = dailySelectedOptionId === dailyQuestion.correctOptionId;
  const dailyFeedbackTitle = dailyAnswerCorrect
    ? 'Nice work.'
    : dailySelectedOptionId === 'nine-m'
      ? 'Useful signal.'
      : 'Almost there.';
  const dailyFeedbackBody = dailyAnswerCorrect
    ? dailyQuestion.feedbackCorrect
    : dailySelectedOptionId === 'nine-m'
      ? dailyQuestion.feedbackUsefulSignal
      : 'Not quite — multiply acceleration by time: 1.5 m/s² × 6 s = 9 m/s.';

  const startDailyChallenge = () => {
    setDailyStarted(true);
    setDailySelectedOptionId(null);
    setDailyChecked(false);
  };

  const selectDailyOption = (optionId: string) => {
    setDailySelectedOptionId(optionId);
    setDailyChecked(false);
  };

  const checkDailyAnswer = () => {
    if (!dailySelectedOptionId) return;
    setDailyChecked(true);
  };

  const completeDailyChallenge = async () => {
    if (dailyCompleting || dailyCompleted) return;

    setDailyCompleting(true);
    const completedDailyChallengeDate = new Date().toISOString();

    try {
      const completion = await picolabApi.completePracticeMission({
        missionId: dailyPracticeMission.id,
        status: 'complete',
      });

      if (completion.ok) {
        const data = completion.data;
        setProgress((current) =>
          applyPracticeMissionCompletion(current, {
            missionId: dailyPracticeMission.id,
            awardedPicoPoints: data.awardedPicoPoints,
            updatedStreak: data.updatedStreak,
            completedDailyChallengeDate,
            improvedSignals: data.improvedSignals,
            unlockedBadges: data.unlockedBadges?.map((badge) => badge.name),
          }),
        );
      } else {
        setProgress((current) =>
          applyPracticeMissionCompletion(current, {
            missionId: dailyPracticeMission.id,
            awardedPicoPoints: dailyPracticeMission.rewardPicoPoints,
            updatedStreak: progress.streak + 1,
            completedDailyChallengeDate,
          }),
        );
      }
    } catch {
      setProgress((current) =>
        applyPracticeMissionCompletion(current, {
          missionId: dailyPracticeMission.id,
          awardedPicoPoints: dailyPracticeMission.rewardPicoPoints,
          updatedStreak: progress.streak + 1,
          completedDailyChallengeDate,
        }),
      );
    } finally {
      setDailyCompleting(false);
    }
  };

  return (
    <div className="p-fade">
      <PageHeader
        eyebrow="Practice"
        title="Practice Missions"
        subtitle="Start with today's challenge, strengthen your current focus, then add optional practice for extra PicoPoints."
      />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
        <main className="min-w-0">
          {missionsLoading ? (
            <Card variant="blue" className="mb-6 px-4 py-3">
              <span className="text-[13px] font-bold text-[#2A60A8]">
                Pico is preparing your missions...
              </span>
            </Card>
          ) : null}

          <section className="mb-6">
            <div className="mb-2.5 flex items-baseline gap-2">
              <span className="p-section-lbl">Start here</span>
              <span className="text-[12px] text-pico-muted">Step 1 · today's streak task</span>
            </div>
            <DailyChallengeCard
              mission={dailyMission}
              title="Daily Challenge"
              problem={dailyPracticeMission.prompt}
              completed={dailyCompleted}
              started={dailyStarted}
              question={dailyQuestion}
              selectedOptionId={dailySelectedOptionId}
              checked={dailyChecked}
              answerCorrect={dailyAnswerCorrect}
              feedbackTitle={dailyFeedbackTitle}
              feedbackBody={dailyFeedbackBody}
              completing={dailyCompleting}
              earnedPoints={dailyPracticeMission.rewardPicoPoints}
              onStart={startDailyChallenge}
              onSelect={selectDailyOption}
              onCheck={checkDailyAnswer}
              onComplete={completeDailyChallenge}
            />
          </section>

          <section className="mb-6">
            <div className="mb-2.5 flex items-baseline gap-2">
              <span className="p-section-lbl">Pico’s recommended practice</span>
              <span className="text-[12px] text-pico-muted">Step 2 · strengthen the skill Pico noticed</span>
            </div>
            <FocusMissionCard
              selectedOptionId={selectedOptionId}
              checked={checked}
              checking={checking}
              question={focusQuestion}
              title={focusPracticeMission.title}
              description={focusMission.description}
              context={focusMission.context}
              progressLabel={focusMissionCompleted ? 'Completed' : focusMission.progressLabel}
              answerResult={answerResult}
              completed={focusMissionCompleted}
              onSelect={selectOption}
              onCheck={checkAnswer}
              onOpenVisualLab={openVisualLab}
              onViewGrowthPath={() => navigate('/growth-path')}
            />
          </section>

          {isComplete ? (
            <section className="mb-6">
              <MissionCompleteCard
                onViewRoadmap={() => navigate('/growth-path')}
                onOpenGrowthMap={() => navigate('/growth-map')}
                onContinueExtraPractice={continueExtraPractice}
                onAddAnotherProblem={() => navigate('/add-problem')}
                copy={completionCopy}
                stats={completionStats}
                completing={completing}
              />
            </section>
          ) : null}

          <section ref={randomSectionRef} className="scroll-mt-6">
            <div className="mb-3">
              <span className="p-section-lbl">Optional extra practice</span>
              <span className="ml-2 text-[12px] text-pico-muted">Step 3 · pick another short mission for extra PicoPoints</span>
            </div>
            <div className="mb-4 flex flex-col gap-1">
              <h2 className="text-[18px] font-extrabold tracking-[-0.02em] text-pico-text">
                Random Missions
              </h2>
              <p className="text-[13px] leading-relaxed text-pico-secondary">
                Optional and separate from your focus mission — choose a short mission for extra
                PicoPoints.
              </p>
            </div>

            {extraPracticeActive ? (
              <Card variant="blue" className="p-fade mb-4 px-4 py-2.5">
                <span className="text-[12.5px] font-semibold text-[#2A60A8]">
                  Extra practice selected. Pick a short mission below to keep going.
                </span>
              </Card>
            ) : null}

            <div className="grid gap-3 md:grid-cols-3">
              {randomMissionCards.map((mission) => (
                <RandomMissionCard
                  key={mission.id}
                  mission={mission}
                  completed={progress.completedMissionIds.includes(mission.id)}
                  selected={mission.title === randomPreview}
                  onStart={() => setRandomPreview(mission.title)}
                />
              ))}
            </div>
          </section>
        </main>

        <aside className="min-w-0">
          <PracticeCoachPanel stats={coachStats} onAskPico={() => setAskPicoOpen(true)} />
        </aside>
      </div>

      <AskPicoDrawer
        open={askPicoOpen}
        context="practice"
        onClose={() => setAskPicoOpen(false)}
      />
    </div>
  );
}
