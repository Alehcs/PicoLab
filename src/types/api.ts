export type ApiError = {
  code: string;
  message: string;
  details?: Record<string, unknown>;
};

export type ApiResult<T> =
  | {
      ok: true;
      data: T;
      source: 'mock' | 'backend';
    }
  | {
      ok: false;
      error: ApiError;
      source: 'mock' | 'backend';
    };

export type SubjectArea = 'math' | 'physics';

export type ProblemInputMode = 'typed' | 'formula' | 'scan';

export type ProblemInput = {
  mode: ProblemInputMode;
  text?: string;
  formula?: string;
  imageId?: string;
  subjectHint?: SubjectArea;
  learnerGoal?: string;
};

export type ProblemScanInput = {
  imageId?: string;
  ocrText?: string;
  subjectHint?: SubjectArea;
};

export type ExtractedDetailKind =
  | 'number'
  | 'unit'
  | 'variable'
  | 'formula'
  | 'goal'
  | 'given'
  | 'concept';

export type ExtractedDetail = {
  id: string;
  kind: ExtractedDetailKind;
  label: string;
  value: string;
  unit?: string;
  confidence: number;
  needsAttention?: boolean;
};

export type Ambiguity = {
  id: string;
  label: string;
  question: string;
  options?: string[];
  reason: string;
};

export type ParsedProblem = {
  draftProblemId: string;
  statement: string;
  subject: SubjectArea;
  topic: string;
  extractedDetails: ExtractedDetail[];
  ambiguities: Ambiguity[];
  suggestedFormula?: string;
  reviewNote: string;
};

export type ProblemEntity = ParsedProblem & {
  id: string;
  status: 'draft' | 'confirmed' | 'inNotebook';
  confirmedAt?: string;
};

export type NotebookStepStatus = 'complete' | 'needsAttention' | 'upcoming';

export type NotebookStep = {
  id: string;
  stepNumber: number;
  title: string;
  prompt: string;
  status: NotebookStepStatus;
  studentInput?: string;
  supportiveFeedback?: string;
  learningSignal?: LearningSignal;
};

export type NotebookResponse = {
  problem: ProblemEntity;
  steps: NotebookStep[];
  currentStepId: string;
  progress: {
    completed: number;
    total: number;
  };
  picoNote: string;
};

export type StepCheckRequest = {
  problemId: string;
  stepId: string;
  studentInput: string;
  notebookContext?: NotebookStep[];
};

export type LearningSignalKind =
  | 'unitMismatch'
  | 'signSlip'
  | 'quantityConfusion'
  | 'formulaSelection'
  | 'reasoningGap'
  | 'graphReading';

export type LearningSignal = {
  id: string;
  kind: LearningSignalKind;
  title: string;
  description: string;
  strength: number;
  suggestedFocus: string;
  sourceProblemId?: string;
};

export type StepCheckResponse = {
  stepStatus: 'complete' | 'needsAttention';
  supportiveFeedback: string;
  explanation: string;
  whatWentWell?: string;
  whatToAdjust?: string;
  whyItMatters?: string;
  suggestedNextStep?: string;
  suggestedNextAction?: string;
  learningSignal?: LearningSignal;
};

export type VisualTemplateId =
  | 'motion'
  | 'graph'
  | 'units'
  | 'formula'
  | 'free-body'
  | 'function'
  | 'energy'
  | 'circuit';

export type VisualLabTemplateRequest = {
  problemId?: string;
  topic: string;
  currentStep?: NotebookStep;
  learningSignal?: LearningSignal;
};

export type VisualLabTemplateResponse = {
  templateId: VisualTemplateId;
  title: string;
  parameters: Record<string, number | string | boolean>;
  explanation: string;
  suggestedControls: Array<{
    id: string;
    label: string;
    value: number | string;
    unit?: string;
  }>;
};

export type GrowthMapResponse = {
  mainFocus: string;
  strongestSkill: string;
  nextOpportunity: string;
  learningSignals: LearningSignal[];
  picoInsight: string;
};

export type GrowthPathStep = {
  id: string;
  title: string;
  status: 'recommended' | 'upNext' | 'later';
  reason: string;
  items: string[];
  route?: string;
};

export type GrowthPathResponse = {
  currentGoal: string;
  progressPercent: number;
  recommendedFocus: string;
  steps: GrowthPathStep[];
  picoPlan: string;
};

export type PracticeMission = {
  id: string;
  title: string;
  subject: SubjectArea;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  prompt: string;
  options?: Array<{
    id: string;
    label: string;
  }>;
  rewardPicoPoints: number;
  focusSignalId?: string;
};

export type PracticeAnswerRequest = {
  missionId: string;
  answer: string;
  selectedOptionId?: string;
};

export type PracticeAnswerResponse = {
  status: 'complete' | 'needsAttention';
  supportiveFeedback: string;
  explanation: string;
  earnedPicoPoints: number;
  learningSignal?: LearningSignal;
};

export type AskPicoContext =
  | 'notebook'
  | 'visualLab'
  | 'growthMap'
  | 'growthPath'
  | 'practice'
  | 'profile'
  | 'settings';

export type AskPicoMessage = {
  id: string;
  role: 'learner' | 'pico';
  text: string;
};

export type AskPicoAction = {
  label: string;
  route: string;
};

export type AskPicoRequest = {
  context: AskPicoContext;
  question?: string;
  currentPage?: string;
  messages?: AskPicoMessage[];
  currentState?: {
    problemId?: string;
    stepId?: string;
    topic?: string;
    visualTemplate?: string;
    missionId?: string;
  };
  problemId?: string;
  pageState?: Record<string, unknown>;
  history?: AskPicoMessage[];
};

export type AskPicoResponse = {
  message: AskPicoMessage;
  suggestedQuestions: string[];
  actions: AskPicoAction[];
  learningSignal?: LearningSignal;
};

export type ProfileResponse = {
  learnerName: string;
  league: string;
  picoPoints: number;
  streakDays: number;
  badges: Array<{
    id: string;
    name: string;
    unlocked: boolean;
  }>;
  recentActivity: Array<{
    id: string;
    label: string;
    detail: string;
  }>;
};

export type SettingsResponse = {
  saveLearningHistory: boolean;
  useLearningSignals: boolean;
  hintFrequency: 'low' | 'balanced' | 'high';
  explanationStyle: 'simple' | 'step-by-step' | 'technical';
  reduceMotion: boolean;
  highContrastMode: boolean;
};
