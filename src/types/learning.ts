export type LearningSignalKind = 'unit-mismatch' | 'sign-slip' | 'quantity-confusion';

export type LearningSignal = {
  id: string;
  kind: LearningSignalKind;
  title: string;
  description: string;
  seenCount: number;
  route: string;
};

export type GrowthStepStatus = 'recommended' | 'up-next' | 'later';

export type GrowthStep = {
  id: string;
  title: string;
  status: GrowthStepStatus;
  reason: string;
  items: string[];
};
