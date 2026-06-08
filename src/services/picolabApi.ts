import { mockPicolabApi } from './mockPicolabApi';
import type {
  AskPicoRequest,
  PracticeAnswerRequest,
  ProblemInput,
  StepCheckRequest,
  VisualLabTemplateRequest,
} from '../types/api';

const activeApi = mockPicolabApi;

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
  askPico: (request: AskPicoRequest) => activeApi.askPico(request),
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
