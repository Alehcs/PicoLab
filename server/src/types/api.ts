export type ApiMode = 'mock';

export type ApiMeta = {
  mode: ApiMode;
  source: 'mock';
};

export type ApiError = {
  code: string;
  message: string;
  details?: Record<string, unknown>;
};

export type ApiSuccess<T> = {
  ok: true;
  data: T;
  meta: ApiMeta;
};

export type ApiFailure = {
  ok: false;
  error: ApiError;
  meta: ApiMeta;
};

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export type LearningSignal = {
  id: string;
  kind: 'unitMismatch' | 'signSlip' | 'quantityConfusion' | 'formulaSelection';
  title: string;
  description: string;
  strength: number;
  suggestedFocus: string;
};

export type ExtractedDetail = {
  id: string;
  kind: 'number' | 'unit' | 'variable' | 'formula' | 'goal' | 'given';
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
  reason: string;
  options?: string[];
};

export type ParsedProblem = {
  id: string;
  originalText: string;
  subject: 'math' | 'physics';
  topic: string;
  knownValues: Array<{ label: string; value: string; unit?: string }>;
  target: string;
  extractedDetails: ExtractedDetail[];
  ambiguities: Ambiguity[];
  suggestedFormula: string;
  confidence: number;
};

export type AskPicoContext =
  | 'notebook'
  | 'visualLab'
  | 'growthMap'
  | 'growthPath'
  | 'practice'
  | 'profile'
  | 'settings';

export type AskPicoAction = {
  label: string;
  route: string;
};

export type AskPicoResponse = {
  message: {
    id: string;
    role: 'pico';
    text: string;
  };
  suggestedActions: AskPicoAction[];
  learningSignal?: LearningSignal;
  source: 'mock';
};
