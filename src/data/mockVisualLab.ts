export type VisualLabDefaults = {
  initialVelocity: number;
  acceleration: number;
  time: number;
  unitInsight: string;
};

export type VisualMode = {
  id: string;
  label: string;
  active?: boolean;
  disabled?: boolean;
};

export const visualLabDefaults: VisualLabDefaults = {
  initialVelocity: 0,
  acceleration: 2,
  time: 5,
  unitInsight: '(m/s²) · s = m/s',
};

export const visualModes: VisualMode[] = [
  { id: 'motion', label: 'Motion', active: true },
  { id: 'graph', label: 'Graph', disabled: true },
  { id: 'units', label: 'Units', disabled: true },
  { id: 'formula', label: 'Formula', disabled: true },
  { id: 'free-body', label: 'Free-body', disabled: true },
  { id: 'function', label: 'Function', disabled: true },
];

export const visualLabCopy = {
  eyebrow: 'Physics · Kinematics',
  title: 'Visual Lab',
  subtitle: 'Explore the concept behind your current step.',
  mission: 'Current mission: Final velocity from acceleration',
  learningSignal: 'Learning signal: Unit mismatch',
};
