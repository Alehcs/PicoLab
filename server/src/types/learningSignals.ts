export type LearningSignalCategory =
  | 'algebra'
  | 'units'
  | 'formula'
  | 'concept'
  | 'graph'
  | 'reading'
  | 'calculation';

export type LearningSignalSeverity = 'low' | 'medium' | 'high';

export type LearningSignalStatus = 'new' | 'practicing' | 'improving' | 'stable';

export type LearningSignalSource =
  | 'notebook'
  | 'practice'
  | 'askPico'
  | 'growthMap'
  | 'mockDiagnostic';

export interface LearningSignalDefinition {
  id: string;
  category: LearningSignalCategory;
  subtype: string;
  title: string;
  studentFriendlyLabel: string;
  description: string;
  evidenceExamples: string[];
  commonPatterns: string[];
  supportiveFeedback: string;
  suggestedPractice: string[];
  suggestedVisualTemplate?: string;
  growthPathFocus: string[];
}

export interface LearningSignalInstance {
  id: string;
  signalId: string;
  category: LearningSignalCategory;
  severity: LearningSignalSeverity;
  status: LearningSignalStatus;
  confidence: number;
  evidence: string;
  source: LearningSignalSource;
  createdAt: string;
  relatedProblemId?: string;
  relatedStepId?: string;
  suggestedPractice?: string[];
  suggestedVisualTemplate?: string;
}

export interface DiagnosticEvidence {
  source: 'notebook' | 'practice' | 'askPico' | 'mockDiagnostic';
  studentAnswer?: string;
  expectedAnswer?: string;
  studentStep?: string;
  expectedUnit?: string;
  expectedQuantity?: string;
  formulaUsed?: string;
  expectedFormula?: string;
  knownValues?: Array<{
    symbol: string;
    value: string | number;
    unit?: string;
  }>;
  target?: string;
  topic?: string;
  graphContext?: {
    xAxis?: string;
    yAxis?: string;
    expectedInterpretation?: string;
  };
  problemText?: string;
  stepId?: string;
  problemId?: string;
  missionId?: string;
}

export interface DiagnosticResult {
  primarySignal?: LearningSignalInstance;
  signals: LearningSignalInstance[];
  supportiveFeedback: string;
  whatWentWell?: string;
  whatToAdjust?: string;
  whyItMatters?: string;
  suggestedPractice: string[];
  suggestedVisualTemplate?: string;
  confidence: number;
}
