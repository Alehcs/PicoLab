import { apiClient } from './apiClient';
import { mockPicolabApi } from './mockPicolabApi';
import type {
  ApiResult,
  AskPicoRequest,
  AskPicoResponse,
  ExtractedDetail,
  ExtractedDetailKind,
  LearningSignal,
  LearningSignalKind,
  ParsedProblem,
  PracticeAnswerRequest,
  PracticeAnswerResponse,
  PracticeCompleteRequest,
  PracticeCompleteResponse,
  PracticeMission,
  ProblemEntity,
  ProblemInput,
  ProblemScanInput,
  StepCheckRequest,
  VisualLabTemplateRequest,
  StepCheckResponse,
} from '../types/api';

const activeApi = mockPicolabApi;
const ASK_PICO_TIMEOUT_MS = 4000;
const CORE_FLOW_TIMEOUT_MS = 4000;
const PRACTICE_TIMEOUT_MS = 4000;

type BackendAskPicoEnvelope = {
  ok?: boolean;
  data?: {
    message?: {
      id?: unknown;
      role?: unknown;
      text?: unknown;
      content?: unknown;
    };
    suggestedQuestions?: unknown;
    suggestedActions?: unknown;
    actions?: unknown;
    learningSignal?: unknown;
  };
};

const isAction = (value: unknown): value is { label: string; route: string } =>
  Boolean(
    value &&
      typeof value === 'object' &&
      'label' in value &&
      'route' in value &&
      typeof value.label === 'string' &&
      typeof value.route === 'string',
  );

const normalizeAskPicoResponse = (
  payload: BackendAskPicoEnvelope,
): AskPicoResponse | null => {
  if (!payload.ok || !payload.data?.message) return null;

  const { message } = payload.data;
  const text = typeof message.text === 'string' ? message.text : message.content;

  if (message.role !== 'pico' || typeof text !== 'string' || !text.trim()) {
    return null;
  }

  const suggestedQuestions = Array.isArray(payload.data.suggestedQuestions)
    ? payload.data.suggestedQuestions.filter((question): question is string => typeof question === 'string')
    : [];
  const rawActions = payload.data.suggestedActions ?? payload.data.actions;
  const actions = Array.isArray(rawActions) ? rawActions.filter(isAction) : [];

  return {
    message: {
      id: typeof message.id === 'string' ? message.id : `backend-pico-${Date.now()}`,
      role: 'pico',
      text,
    },
    suggestedQuestions,
    actions,
  };
};

const askPicoWithFallback = async (
  request: AskPicoRequest,
): Promise<ApiResult<AskPicoResponse>> => {
  const backendResult = await apiClient.post<BackendAskPicoEnvelope>('/ask-pico', request, {
    timeoutMs: ASK_PICO_TIMEOUT_MS,
  });

  if (backendResult.ok) {
    const normalized = normalizeAskPicoResponse(backendResult.data);

    if (normalized) {
      return {
        ok: true,
        source: 'backend',
        data: normalized,
      };
    }
  }

  if (import.meta.env?.DEV) {
    console.warn('Ask Pico backend unavailable; using local fallback.', backendResult);
  }

  return activeApi.askPico(request);
};

type BackendExtractedDetail = Partial<ExtractedDetail> & {
  description?: unknown;
};

type BackendParsedProblem = {
  id?: unknown;
  draftProblemId?: unknown;
  originalText?: unknown;
  statement?: unknown;
  subject?: unknown;
  topic?: unknown;
  target?: unknown;
  extractedText?: unknown;
  extractedDetails?: unknown;
  ambiguities?: unknown;
  suggestedFormula?: unknown;
  confidence?: unknown;
};

type BackendProblemEnvelope = {
  ok?: boolean;
  data?: BackendParsedProblem & {
    parsedProblem?: BackendParsedProblem;
    source?: unknown;
  };
};

type BackendConfirmEnvelope = {
  ok?: boolean;
  data?: BackendParsedProblem & {
    status?: unknown;
    confirmedAt?: unknown;
  };
};

type BackendStepCheckEnvelope = {
  ok?: boolean;
  data?: {
    status?: unknown;
    stepStatus?: unknown;
    supportiveFeedback?: unknown;
    explanation?: unknown;
    whatWentWell?: unknown;
    whatToAdjust?: unknown;
    whyItMatters?: unknown;
    suggestedNextAction?: unknown;
    suggestedNextStep?: unknown;
    learningSignal?: unknown;
  };
};

type BackendPracticeEnvelope = {
  ok?: boolean;
  data?: Record<string, unknown>;
};

type BackendRandomPracticeEnvelope = {
  ok?: boolean;
  data?: {
    missions?: unknown;
  };
};

type BackendPracticeAnswerEnvelope = {
  ok?: boolean;
  data?: {
    isCorrect?: unknown;
    status?: unknown;
    supportiveFeedback?: unknown;
    explanation?: unknown;
    earnedPicoPoints?: unknown;
    picoPointsPreview?: unknown;
    learningSignal?: unknown;
  };
};

type BackendPracticeCompleteEnvelope = {
  ok?: boolean;
  data?: {
    awardedPicoPoints?: unknown;
    updatedStreak?: unknown;
    updatedLeagueProgress?: unknown;
    unlockedBadges?: unknown;
    improvedSignals?: unknown;
  };
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value && typeof value === 'object');

const extractedDetailKinds: ExtractedDetailKind[] = [
  'number',
  'unit',
  'variable',
  'formula',
  'goal',
  'given',
  'concept',
];

const learningSignalKinds: LearningSignalKind[] = [
  'unitMismatch',
  'signSlip',
  'quantityConfusion',
  'formulaSelection',
  'reasoningGap',
  'graphReading',
];

const normalizeExtractedDetail = (
  value: unknown,
  index: number,
): ExtractedDetail | null => {
  if (!isRecord(value)) return null;

  const label = typeof value.label === 'string' ? value.label : `Detail ${index + 1}`;
  const rawValue = typeof value.value === 'string' ? value.value : label;
  const kind =
    typeof value.kind === 'string' && extractedDetailKinds.includes(value.kind as ExtractedDetailKind)
      ? (value.kind as ExtractedDetailKind)
      : 'given';

  return {
    id: typeof value.id === 'string' ? value.id : `detail-${index + 1}`,
    kind,
    label,
    value: rawValue,
    unit: typeof value.unit === 'string' ? value.unit : undefined,
    confidence: typeof value.confidence === 'number' ? value.confidence : 0.9,
    needsAttention: value.needsAttention === true,
  };
};

const normalizeLearningSignal = (value: unknown): LearningSignal | undefined => {
  if (!isRecord(value)) return undefined;

  return {
    id: typeof value.id === 'string' ? value.id : 'unit-mismatch',
    kind:
      typeof value.kind === 'string' && learningSignalKinds.includes(value.kind as LearningSignalKind)
        ? (value.kind as LearningSignalKind)
        : 'unitMismatch',
    title: typeof value.title === 'string' ? value.title : 'Learning signal',
    description:
      typeof value.description === 'string'
        ? value.description
        : 'A useful pattern appeared in this step.',
    strength: typeof value.strength === 'number' ? value.strength : 1,
    suggestedFocus:
      typeof value.suggestedFocus === 'string' ? value.suggestedFocus : 'Review this step',
  };
};

const normalizePracticeMission = (value: unknown): PracticeMission | null => {
  if (!isRecord(value)) return null;

  const id = typeof value.id === 'string' ? value.id : '';
  const title = typeof value.title === 'string' ? value.title : '';
  const prompt =
    typeof value.prompt === 'string' && value.prompt.trim()
      ? value.prompt
      : title;
  const rewardPicoPoints =
    typeof value.rewardPicoPoints === 'number' && Number.isFinite(value.rewardPicoPoints)
      ? value.rewardPicoPoints
      : 0;

  if (!id || !title || !prompt) return null;

  const options = Array.isArray(value.options)
    ? value.options
        .filter(isRecord)
        .map((option) => ({
          id: typeof option.id === 'string' ? option.id : '',
          label: typeof option.label === 'string' ? option.label : '',
        }))
        .filter((option) => option.id && option.label)
    : undefined;

  return {
    id,
    title,
    subject: value.subject === 'math' ? 'math' : 'physics',
    topic: typeof value.topic === 'string' ? value.topic : 'Practice',
    difficulty:
      value.difficulty === 'easy' || value.difficulty === 'hard'
        ? value.difficulty
        : 'medium',
    prompt,
    options,
    rewardPicoPoints,
    focusSignalId: typeof value.focusSignalId === 'string' ? value.focusSignalId : undefined,
  };
};

const normalizePracticeAnswer = (
  payload: BackendPracticeAnswerEnvelope,
): PracticeAnswerResponse | null => {
  if (!payload.ok || !payload.data) return null;

  const { data } = payload;
  const supportiveFeedback =
    typeof data.supportiveFeedback === 'string' ? data.supportiveFeedback : '';
  const explanation = typeof data.explanation === 'string' ? data.explanation : supportiveFeedback;

  if (!supportiveFeedback || !explanation) return null;

  const previewPoints =
    typeof data.picoPointsPreview === 'number'
      ? data.picoPointsPreview
      : typeof data.earnedPicoPoints === 'number'
        ? data.earnedPicoPoints
        : 0;

  return {
    status: data.status === 'strong' || data.status === 'complete' ? 'complete' : 'needsAttention',
    supportiveFeedback,
    explanation,
    earnedPicoPoints: previewPoints,
    picoPointsPreview: previewPoints,
    learningSignal: normalizeLearningSignal(data.learningSignal),
  };
};

const normalizePracticeComplete = (
  payload: BackendPracticeCompleteEnvelope,
): PracticeCompleteResponse | null => {
  if (!payload.ok || !payload.data) return null;

  const { data } = payload;
  const awardedPicoPoints =
    typeof data.awardedPicoPoints === 'number' && Number.isFinite(data.awardedPicoPoints)
      ? data.awardedPicoPoints
      : null;

  if (awardedPicoPoints === null) return null;

  const updatedLeagueProgress = isRecord(data.updatedLeagueProgress)
    ? {
        currentLeague:
          typeof data.updatedLeagueProgress.currentLeague === 'string'
            ? data.updatedLeagueProgress.currentLeague
            : 'Feather League',
        nextLeague:
          typeof data.updatedLeagueProgress.nextLeague === 'string'
            ? data.updatedLeagueProgress.nextLeague
            : undefined,
        picoPoints:
          typeof data.updatedLeagueProgress.picoPoints === 'number'
            ? data.updatedLeagueProgress.picoPoints
            : awardedPicoPoints,
        progress:
          typeof data.updatedLeagueProgress.progress === 'number'
            ? data.updatedLeagueProgress.progress
            : 0,
      }
    : undefined;

  const unlockedBadges = Array.isArray(data.unlockedBadges)
    ? data.unlockedBadges.filter(isRecord).map((badge, index) => ({
        id: typeof badge.id === 'string' ? badge.id : `badge-${index + 1}`,
        name: typeof badge.name === 'string' ? badge.name : 'Practice badge',
      }))
    : undefined;

  const improvedSignals = Array.isArray(data.improvedSignals)
    ? data.improvedSignals.filter((signal): signal is string => typeof signal === 'string')
    : undefined;

  return {
    awardedPicoPoints,
    updatedStreak:
      typeof data.updatedStreak === 'number' && Number.isFinite(data.updatedStreak)
        ? data.updatedStreak
        : undefined,
    updatedLeagueProgress,
    unlockedBadges,
    improvedSignals,
  };
};

const normalizeParsedProblem = (
  rawProblem: BackendParsedProblem | undefined,
): ParsedProblem | null => {
  if (!rawProblem) return null;

  const statement =
    typeof rawProblem.statement === 'string'
      ? rawProblem.statement
      : typeof rawProblem.originalText === 'string'
        ? rawProblem.originalText
        : typeof rawProblem.extractedText === 'string'
          ? rawProblem.extractedText
          : '';

  if (!statement.trim()) return null;

  const extractedDetails = Array.isArray(rawProblem.extractedDetails)
    ? rawProblem.extractedDetails
        .map((detail, index) => normalizeExtractedDetail(detail as BackendExtractedDetail, index))
        .filter((detail): detail is ExtractedDetail => Boolean(detail))
    : [];

  return {
    draftProblemId:
      typeof rawProblem.draftProblemId === 'string'
        ? rawProblem.draftProblemId
        : typeof rawProblem.id === 'string'
          ? rawProblem.id
          : `draft-${Date.now()}`,
    statement,
    subject: rawProblem.subject === 'math' ? 'math' : 'physics',
    topic: typeof rawProblem.topic === 'string' ? rawProblem.topic : 'Kinematics',
    extractedDetails,
    ambiguities: Array.isArray(rawProblem.ambiguities)
      ? rawProblem.ambiguities.filter(isRecord).map((ambiguity, index) => ({
          id: typeof ambiguity.id === 'string' ? ambiguity.id : `ambiguity-${index + 1}`,
          label: typeof ambiguity.label === 'string' ? ambiguity.label : 'Review detail',
          question:
            typeof ambiguity.question === 'string'
              ? ambiguity.question
              : 'Please review this extracted detail.',
          reason:
            typeof ambiguity.reason === 'string'
              ? ambiguity.reason
              : 'Pico marked this as useful to confirm before solving.',
        }))
      : [],
    suggestedFormula:
      typeof rawProblem.suggestedFormula === 'string' ? rawProblem.suggestedFormula : undefined,
    reviewNote: 'Review the extracted details before starting the Smart Notebook.',
  };
};

const fallbackWithWarning = <T>(
  label: string,
  backendResult: ApiResult<unknown>,
  fallback: Promise<ApiResult<T>>,
) => {
  if (import.meta.env?.DEV) {
    console.warn(`${label} backend unavailable; using local fallback.`, backendResult);
  }

  return fallback;
};

const parseProblemWithFallback = async (
  input: ProblemInput,
): Promise<ApiResult<ParsedProblem>> => {
  const body = {
    inputType: input.mode === 'scan' ? 'scanned' : 'typed',
    text: input.text ?? input.formula,
    subject: input.subjectHint,
  };
  const backendResult = await apiClient.post<BackendProblemEnvelope>('/problems/parse', body, {
    timeoutMs: CORE_FLOW_TIMEOUT_MS,
  });

  if (backendResult.ok) {
    const parsed = normalizeParsedProblem(backendResult.data.data?.parsedProblem);

    if (parsed) {
      return { ok: true, source: 'backend', data: parsed };
    }
  }

  return fallbackWithWarning('Problem parse', backendResult, activeApi.parseProblem(input));
};

const scanProblemWithFallback = async (
  input: ProblemScanInput,
): Promise<ApiResult<ParsedProblem>> => {
  const backendResult = await apiClient.post<BackendProblemEnvelope>('/problems/scan', input, {
    timeoutMs: CORE_FLOW_TIMEOUT_MS,
  });

  if (backendResult.ok) {
    const parsed = normalizeParsedProblem(backendResult.data.data);

    if (parsed) {
      return { ok: true, source: 'backend', data: parsed };
    }
  }

  return fallbackWithWarning('Problem scan', backendResult, activeApi.scanProblem(input));
};

const confirmProblemWithFallback = async (
  problemId: string,
  confirmedData?: Partial<ParsedProblem>,
): Promise<ApiResult<ProblemEntity>> => {
  const backendResult = await apiClient.post<BackendConfirmEnvelope>(
    `/problems/${problemId}/confirm`,
    confirmedData,
    {
      timeoutMs: CORE_FLOW_TIMEOUT_MS,
    },
  );

  if (backendResult.ok) {
    const parsed = normalizeParsedProblem(backendResult.data.data);

    if (parsed) {
      return {
        ok: true,
        source: 'backend',
        data: {
          ...parsed,
          id: typeof backendResult.data.data?.id === 'string' ? backendResult.data.data.id : problemId,
          status: 'confirmed',
          confirmedAt:
            typeof backendResult.data.data?.confirmedAt === 'string'
              ? backendResult.data.data.confirmedAt
              : 'backend-confirmed',
        },
      };
    }
  }

  return fallbackWithWarning(
    'Problem confirm',
    backendResult,
    activeApi.confirmProblem(problemId, confirmedData),
  );
};

const checkStepWithFallback = async (
  request: StepCheckRequest,
): Promise<ApiResult<StepCheckResponse>> => {
  const backendResult = await apiClient.post<BackendStepCheckEnvelope>(
    `/notebooks/${request.problemId}/check-step`,
    {
      stepText: request.studentInput,
      context: request.notebookContext,
    },
    {
      timeoutMs: CORE_FLOW_TIMEOUT_MS,
    },
  );

  if (backendResult.ok && backendResult.data.data) {
    const data = backendResult.data.data;
    const supportiveFeedback =
      typeof data.supportiveFeedback === 'string' ? data.supportiveFeedback : undefined;

    if (supportiveFeedback) {
      const status = data.stepStatus ?? data.status;

      return {
        ok: true,
        source: 'backend',
        data: {
          stepStatus: status === 'strong' || status === 'complete' ? 'complete' : 'needsAttention',
          supportiveFeedback,
          explanation:
            typeof data.explanation === 'string'
              ? data.explanation
              : typeof data.whyItMatters === 'string'
                ? data.whyItMatters
                : supportiveFeedback,
          whatWentWell: typeof data.whatWentWell === 'string' ? data.whatWentWell : undefined,
          whatToAdjust: typeof data.whatToAdjust === 'string' ? data.whatToAdjust : undefined,
          whyItMatters: typeof data.whyItMatters === 'string' ? data.whyItMatters : undefined,
          suggestedNextStep:
            typeof data.suggestedNextStep === 'string' ? data.suggestedNextStep : undefined,
          suggestedNextAction:
            typeof data.suggestedNextAction === 'string' ? data.suggestedNextAction : undefined,
          learningSignal: normalizeLearningSignal(data.learningSignal),
        },
      };
    }
  }

  return fallbackWithWarning('Notebook check-step', backendResult, activeApi.checkStep(request));
};

const getDailyPracticeWithFallback = async (): Promise<ApiResult<PracticeMission>> => {
  const backendResult = await apiClient.get<BackendPracticeEnvelope>('/practice/daily', {
    timeoutMs: PRACTICE_TIMEOUT_MS,
  });

  if (backendResult.ok) {
    const mission = normalizePracticeMission(backendResult.data.data);

    if (mission) {
      return { ok: true, source: 'backend', data: mission };
    }
  }

  return fallbackWithWarning('Practice daily', backendResult, activeApi.getDailyPractice());
};

const getFocusPracticeWithFallback = async (): Promise<ApiResult<PracticeMission>> => {
  const backendResult = await apiClient.get<BackendPracticeEnvelope>('/practice/focus', {
    timeoutMs: PRACTICE_TIMEOUT_MS,
  });

  if (backendResult.ok) {
    const mission = normalizePracticeMission(backendResult.data.data);

    if (mission?.options?.length) {
      return { ok: true, source: 'backend', data: mission };
    }
  }

  return fallbackWithWarning('Practice focus', backendResult, activeApi.getFocusPractice());
};

const getRandomPracticeWithFallback = async (): Promise<ApiResult<PracticeMission[]>> => {
  const backendResult = await apiClient.get<BackendRandomPracticeEnvelope>('/practice/random', {
    timeoutMs: PRACTICE_TIMEOUT_MS,
  });

  if (backendResult.ok && Array.isArray(backendResult.data.data?.missions)) {
    const missions = backendResult.data.data.missions
      .map(normalizePracticeMission)
      .filter((mission): mission is PracticeMission => Boolean(mission));

    if (missions.length) {
      return { ok: true, source: 'backend', data: missions };
    }
  }

  return fallbackWithWarning('Practice random', backendResult, activeApi.getRandomPractice());
};

const checkPracticeAnswerWithFallback = async (
  request: PracticeAnswerRequest,
): Promise<ApiResult<PracticeAnswerResponse>> => {
  const backendResult = await apiClient.post<BackendPracticeAnswerEnvelope>(
    '/practice/check-answer',
    request,
    {
      timeoutMs: PRACTICE_TIMEOUT_MS,
    },
  );

  if (backendResult.ok) {
    const answer = normalizePracticeAnswer(backendResult.data);

    if (answer) {
      return { ok: true, source: 'backend', data: answer };
    }
  }

  return fallbackWithWarning(
    'Practice answer check',
    backendResult,
    activeApi.checkPracticeAnswer(request),
  );
};

const completePracticeMissionWithFallback = async (
  request: PracticeCompleteRequest,
): Promise<ApiResult<PracticeCompleteResponse>> => {
  const backendResult = await apiClient.post<BackendPracticeCompleteEnvelope>(
    '/practice/complete',
    request,
    {
      timeoutMs: PRACTICE_TIMEOUT_MS,
    },
  );

  if (backendResult.ok) {
    const completion = normalizePracticeComplete(backendResult.data);

    if (completion) {
      return { ok: true, source: 'backend', data: completion };
    }
  }

  return fallbackWithWarning(
    'Practice mission completion',
    backendResult,
    activeApi.completePracticeMission(request),
  );
};

export const picolabApi = {
  parseProblem: (input: ProblemInput) => parseProblemWithFallback(input),
  scanProblem: (input: ProblemScanInput) => scanProblemWithFallback(input),
  confirmProblem: (problemId: string, confirmedData?: Partial<ParsedProblem>) =>
    confirmProblemWithFallback(problemId, confirmedData),
  getNotebook: (problemId: string) => activeApi.getNotebook(problemId),
  checkStep: (request: StepCheckRequest) => checkStepWithFallback(request),
  selectVisualTemplate: (request: VisualLabTemplateRequest) =>
    activeApi.selectVisualTemplate(request),
  getGrowthMap: () => activeApi.getGrowthMap(),
  getGrowthPath: () => activeApi.getGrowthPath(),
  getDailyPractice: () => getDailyPracticeWithFallback(),
  getFocusPractice: () => getFocusPracticeWithFallback(),
  getRandomPractice: () => getRandomPracticeWithFallback(),
  checkPracticeAnswer: (request: PracticeAnswerRequest) => checkPracticeAnswerWithFallback(request),
  completePracticeMission: (request: PracticeCompleteRequest) =>
    completePracticeMissionWithFallback(request),
  askPico: (request: AskPicoRequest) => askPicoWithFallback(request),
  getProfile: () => activeApi.getProfile(),
  getSettings: () => activeApi.getSettings(),
};

export const {
  parseProblem,
  scanProblem,
  confirmProblem,
  getNotebook,
  checkStep,
  selectVisualTemplate,
  getGrowthMap,
  getGrowthPath,
  getDailyPractice,
  getFocusPractice,
  getRandomPractice,
  checkPracticeAnswer,
  completePracticeMission,
  askPico,
  getProfile,
  getSettings,
} = picolabApi;
