import { FormulaBlock } from '../math/FormulaBlock';

type DetectedValueCardProps = {
  value: string;
  description: string;
};

export function DetectedValueCard({ value, description }: DetectedValueCardProps) {
  return (
    <button
      type="button"
      className="flex flex-col gap-1 rounded-[10px] bg-pico-soft px-3.5 py-2.5 text-left transition hover:bg-pico-softBlue"
    >
      <FormulaBlock size="sm" className="font-semibold">
        {value}
      </FormulaBlock>
      <span className="text-[11px] text-pico-muted">{description}</span>
    </button>
  );
}
