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
