import { FormulaBlock } from '../math/FormulaBlock';

type KnownValueRowProps = {
  label: string;
  description: string;
};

export function KnownValueRow({ label, description }: KnownValueRowProps) {
  return (
    <div className="rounded-[10px] bg-pico-soft px-3.5 py-2.5">
      <FormulaBlock size="sm" className="font-semibold">
        {label}
      </FormulaBlock>
      <div className="mt-0.5 text-[11px] text-pico-muted">{description}</div>
    </div>
  );
}
