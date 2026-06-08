import { askPicoContexts } from '../data/mockAskPico';
import {
  currentGrowthGoal,
  growthLearningSignals,
  growthMapPicoInsight,
  growthMapSummaryCards,
  growthPathPicoPlan,
  growthPathProgress,
  growthPathSteps,
  recommendedGrowthStep,
} from '../data/mockGrowth';
import { mockNotebookProblem, mockNotebookSteps } from '../data/mockNotebook';
import {
  learnerProfile,
  leagueProgress,
  mockAchievements,
  mockActivity,
} from '../data/mockProfile';
import { dailyChallenge, focusMission } from '../data/mockMissions';
import { sampleProblem } from '../data/mockProblem';
import { initialSettingsState } from '../data/mockSettings';
import { visualLabDefaults } from '../data/mockVisualLab';
import type {
  ApiResult,
  AskPicoRequest,
  AskPicoResponse,
  GrowthMapResponse,
  GrowthPathResponse,
  LearningSignal,
  NotebookResponse,
  ParsedProblem,
  PracticeAnswerRequest,
  PracticeAnswerResponse,
  PracticeMission,
  ProblemEntity,
  ProblemInput,
  ProblemScanInput,
  SettingsResponse,
  StepCheckRequest,
  StepCheckResponse,
  VisualLabTemplateRequest,
  VisualLabTemplateResponse,
} from '../types/api';

const MOCK_PROBLEM_ID = 'mock-problem-final-velocity';

const mockLearningSignal: LearningSignal = {
  id: 'unit-mismatch',
  kind: 'unitMismatch',
  title: 'Unit mismatch',
  description: 'The number is on track, and the final unit needs to match velocity.',
  strength: 4,
  suggestedFocus: 'Units in motion',
  sourceProblemId: MOCK_PROBLEM_ID,
};

const withMockResult = async <T>(data: T, latencyMs = 120): Promise<ApiResult<T>> =>
  new Promise((resolve) => {
    globalThis.setTimeout(() => {
      resolve({
        ok: true,
        source: 'mock',
        data,
      });
    }, latencyMs);
  });

const parsedProblem: ParsedProblem = {
  draftProblemId: 'draft-final-velocity',
  statement: sampleProblem.text,
  subject: 'physics',
  topic: 'Kinematics',
  extractedDetails: [
    {
      id: 'initial-velocity',
      kind: 'given',
      label: 'Initial velocity',
      value: '0',
      unit: 'm/s',
      confidence: 0.96,
    },
    {
      id: 'acceleration',
      kind: 'given',
      label: 'Acceleration',
      value: '2',
      unit: 'm/s²',
      confidence: 0.95,
    },
    {
      id: 'time',
      kind: 'given',
      label: 'Time',
      value: '5',
      unit: 's',
      confidence: 0.9,
      needsAttention: true,
    },
    {
      id: 'goal',
      kind: 'goal',
      label: 'Find',
      value: 'Final velocity',
      confidence: 0.93,
    },
  ],
  ambiguities: [
    {
      id: 'time-context',
      label: 'Time value',
      question: 'Does 5 s describe the full acceleration interval?',
      reason: 'The scanned wording should be reviewed before solving.',
    },
  ],
  suggestedFormula: 'v = v₀ + at',
  reviewNote: 'Review the extracted values before starting the Smart Notebook.',
};

const confirmedProblem: ProblemEntity = {
  ...parsedProblem,
  id: MOCK_PROBLEM_ID,
  status: 'confirmed',
  confirmedAt: 'demo-confirmed',
};

const missionFromDaily = (): PracticeMission => ({
  id: dailyChallenge.mission.id,
  title: dailyChallenge.mission.title,
  subject: 'physics',
  topic: dailyChallenge.mission.topic,
  difficulty: 'medium',
  prompt: dailyChallenge.problem,
  rewardPicoPoints: dailyChallenge.mission.reward.points,
});

const missionFromFocus = (): PracticeMission => ({
  id: focusMission.id,
  title: focusMission.title,
  subject: 'physics',
  topic: 'Kinematics',
  difficulty: 'medium',
  prompt: focusMission.question.prompt,
  options: focusMission.question.options,
  rewardPicoPoints: 25,
  focusSignalId: mockLearningSignal.id,
});

export const mockPicolabApi = {
  parseProblem: (_input: ProblemInput) => withMockResult(parsedProblem),

  scanProblem: (_input: ProblemScanInput) => withMockResult(parsedProblem),

  confirmProblem: (_problemId: string, _confirmedData?: unknown) => withMockResult(confirmedProblem),

  getNotebook: (_problemId: string): Promise<ApiResult<NotebookResponse>> =>
    withMockResult({
      problem: confirmedProblem,
      steps: mockNotebookSteps.map((step) => ({
        id: step.id,
        stepNumber: step.stepNumber,
        title: step.title,
        prompt: step.prompt,
        status:
          step.status === 'correct'
            ? 'complete'
            : step.status === 'learning-signal'
              ? 'needsAttention'
              : 'upcoming',
        studentInput: step.studentInput,
        supportiveFeedback: step.feedback,
        learningSignal: step.status === 'learning-signal' ? mockLearningSignal : undefined,
      })),
      currentStepId: 'step-2',
      progress: {
        completed: mockNotebookProblem.progressValue,
        total: mockNotebookProblem.progressMax,
      },
      picoNote: 'You are close. The calculation is working; now match the unit to velocity.',
    }),

  checkStep: (_request: StepCheckRequest): Promise<ApiResult<StepCheckResponse>> =>
    withMockResult({
      stepStatus: 'needsAttention',
      supportiveFeedback: 'Your calculation is on track. The adjustment is the final unit.',
      explanation: 'Acceleration times time leaves m/s, so the result describes velocity.',
      suggestedNextStep: 'Rewrite the final answer with m/s and explain what it represents.',
      learningSignal: mockLearningSignal,
    }),

  selectVisualTemplate: (
    _request: VisualLabTemplateRequest,
  ): Promise<ApiResult<VisualLabTemplateResponse>> =>
    withMockResult({
      templateId: 'motion',
      title: 'Motion model',
      parameters: {
        initialVelocity: visualLabDefaults.initialVelocity,
        acceleration: visualLabDefaults.acceleration,
        time: visualLabDefaults.time,
      },
      explanation: 'A motion template helps connect acceleration, time, and final velocity.',
      suggestedControls: [
        { id: 'initialVelocity', label: 'Initial velocity', value: 0, unit: 'm/s' },
        { id: 'acceleration', label: 'Acceleration', value: 2, unit: 'm/s²' },
        { id: 'time', label: 'Time', value: 5, unit: 's' },
      ],
    }),

  getGrowthMap: (): Promise<ApiResult<GrowthMapResponse>> =>
    withMockResult({
      mainFocus: growthMapSummaryCards[0].title,
      strongestSkill: growthMapSummaryCards[1].title,
      nextOpportunity: growthMapSummaryCards[2].title,
      learningSignals: growthLearningSignals.map((signal) => ({
        id: signal.id,
        kind:
          signal.id === 'sign-slips'
            ? 'signSlip'
            : signal.id === 'quantity-confusion'
              ? 'quantityConfusion'
              : 'unitMismatch',
        title: signal.title,
        description: signal.description,
        strength: signal.strength,
        suggestedFocus: signal.bestNextAction.label,
      })),
      picoInsight: growthMapPicoInsight,
    }),

  getGrowthPath: (): Promise<ApiResult<GrowthPathResponse>> =>
    withMockResult({
      currentGoal: currentGrowthGoal.value,
      progressPercent: growthPathProgress.percent,
      recommendedFocus: recommendedGrowthStep.skill,
      steps: growthPathSteps.map((step) => ({
        id: step.id,
        title: step.title,
        status:
          step.status === 'up-next'
            ? 'upNext'
            : step.status === 'recommended'
              ? 'recommended'
              : 'later',
        reason: step.reason,
        items: step.items,
        route: step.route,
      })),
      picoPlan: growthPathPicoPlan,
    }),

  getDailyPractice: () => withMockResult(missionFromDaily()),

  getFocusPractice: () => withMockResult(missionFromFocus()),

  checkPracticeAnswer: (
    request: PracticeAnswerRequest,
  ): Promise<ApiResult<PracticeAnswerResponse>> =>
    withMockResult({
      status:
        request.selectedOptionId === focusMission.question.correctOptionId ? 'complete' : 'needsAttention',
      supportiveFeedback:
        request.selectedOptionId === focusMission.question.correctOptionId
          ? focusMission.question.feedbackCorrect
          : focusMission.question.feedbackUsefulSignal,
      explanation: 'Unit cancellation turns m/s² · s into m/s.',
      earnedPicoPoints: request.selectedOptionId === focusMission.question.correctOptionId ? 25 : 0,
      learningSignal:
        request.selectedOptionId === focusMission.question.correctOptionId
          ? undefined
          : mockLearningSignal,
    }),

  askPico: (request: AskPicoRequest): Promise<ApiResult<AskPicoResponse>> => {
    const contextKeyByApiContext = {
      notebook: 'notebook',
      visualLab: 'visual-lab',
      growthMap: 'growth-map',
      growthPath: 'growth-path',
      practice: 'practice',
      profile: 'profile',
      settings: 'settings',
    } as const;
    const key = contextKeyByApiContext[request.context];
    const context = askPicoContexts[key];

    return withMockResult({
      message: {
        id: 'mock-pico-response',
        role: 'pico',
        text: context.mockResponse,
      },
      suggestedQuestions: context.suggestedQuestions,
      actions: context.actions,
    });
  },

  getProfile: () =>
    withMockResult({
      learnerName: learnerProfile.name,
      league: leagueProgress.currentLeague,
      picoPoints: leagueProgress.points,
      streakDays: 5,
      badges: mockAchievements.map((achievement) => ({
        id: achievement.id,
        name: achievement.name,
        unlocked: achievement.unlocked,
      })),
      recentActivity: mockActivity.map((activity) => ({
        id: activity.id,
        label: activity.label,
        detail: activity.detail,
      })),
    }),

  getSettings: (): Promise<ApiResult<SettingsResponse>> =>
    withMockResult({
      saveLearningHistory: initialSettingsState.saveLearningHistory,
      useLearningSignals: initialSettingsState.useLearningSignals,
      hintFrequency: 'balanced',
      explanationStyle: 'step-by-step',
      reduceMotion: initialSettingsState.reduceMotion,
      highContrastMode: initialSettingsState.highContrastMode,
    }),
};
