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
  getDailyPractice: () => activeApi.getDailyPractice(),
  getFocusPractice: () => activeApi.getFocusPractice(),
  checkPracticeAnswer: (request: PracticeAnswerRequest) => activeApi.checkPracticeAnswer(request),
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
  checkPracticeAnswer,
  askPico,
  getProfile,
  getSettings,
} = picolabApi;
