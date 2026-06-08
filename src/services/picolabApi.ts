import { apiClient } from './apiClient';
import { mockPicolabApi } from './mockPicolabApi';
import type {
  ApiResult,
  AskPicoRequest,
  AskPicoResponse,
  PracticeAnswerRequest,
  ProblemInput,
  StepCheckRequest,
  VisualLabTemplateRequest,
} from '../types/api';

const activeApi = mockPicolabApi;
const ASK_PICO_TIMEOUT_MS = 4000;

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

export const picolabApi = {
  parseProblem: (input: ProblemInput) => activeApi.parseProblem(input),
  confirmProblem: (draftProblemId: string) => activeApi.confirmProblem(draftProblemId),
  getNotebook: (problemId: string) => activeApi.getNotebook(problemId),
  checkStep: (request: StepCheckRequest) => activeApi.checkStep(request),
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
