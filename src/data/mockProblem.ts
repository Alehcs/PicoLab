export type ScanHighlightKind = 'number' | 'unit' | 'ambiguous' | 'formula';

export type ScanHighlight = {
  id: string;
  label: string;
  kind: ScanHighlightKind;
  className: string;
  style: {
    top: string;
    left: string;
    width: string;
    height: string;
  };
};

export const sampleProblem = {
  text: 'A car starts from rest and accelerates at 2 m/s² for 5 s. What is its final velocity?',
  detectedValues: [
    { value: 'v₀ = 0', description: 'initial velocity' },
    { value: 'a = 2 m/s²', description: 'acceleration' },
    { value: 't = 5 s', description: 'time' },
    { value: 'Find: v_f', description: 'final velocity' },
  ],
};

export const scanHighlights: ScanHighlight[] = [
  {
    id: 'acceleration-number',
    label: '2',
    kind: 'number',
    className: 'border-pico-blue bg-[rgba(74,144,226,0.10)]',
    style: { top: '19%', left: '49%', width: '10%', height: '6%' },
  },
  {
    id: 'acceleration-unit',
    label: 'm/s²',
    kind: 'unit',
    className: 'border-pico-green bg-[rgba(95,191,143,0.12)]',
    style: { top: '19%', left: '60%', width: '17%', height: '6%' },
  },
  {
    id: 'time-check',
    label: '5 s',
    kind: 'ambiguous',
    className: 'border-[#F6C85F] bg-[rgba(246,200,95,0.18)]',
    style: { top: '28%', left: '13%', width: '12%', height: '6%' },
  },
  {
    id: 'v0-formula',
    label: 'v₀ = 0',
    kind: 'formula',
    className: 'border-[#8B6FD4] bg-[rgba(139,111,212,0.12)]',
    style: { top: '52%', left: '18%', width: '28%', height: '5.5%' },
  },
  {
    id: 'a-formula',
    label: 'a = 2 m/s²',
    kind: 'formula',
    className: 'border-[#8B6FD4] bg-[rgba(139,111,212,0.12)]',
    style: { top: '61%', left: '18%', width: '38%', height: '5.5%' },
  },
  {
    id: 't-formula',
    label: 't = 5 s',
    kind: 'formula',
    className: 'border-[#8B6FD4] bg-[rgba(139,111,212,0.12)]',
    style: { top: '70%', left: '18%', width: '24%', height: '5.5%' },
  },
];

export const topicChips = ['Kinematics', 'Linear functions', 'Units', 'Graph reading', 'Algebra steps'];

export const formulaToolbarGroups = [
  {
    label: 'Math symbols',
    tokens: ['x²', '√', 'π', 'Δ', 'θ', '±', '≤', '≥', '→'],
  },
  {
    label: 'Units',
    tokens: ['m/s', 'm/s²', 'N', 'J'],
  },
];
