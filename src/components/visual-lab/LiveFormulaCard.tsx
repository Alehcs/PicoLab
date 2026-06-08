import { FormulaBlock } from '../math/FormulaBlock';
import { Card } from '../ui/Card';

type LiveFormulaCardProps = {
  initialVelocity: number;
  acceleration: number;
  time: number;
  finalVelocity: number;
  unitInsight: string;
};

const fmt = (value: number) => Number(value.toFixed(1)).toString();

export function LiveFormulaCard({
  initialVelocity,
  acceleration,
  time,
  finalVelocity,
  unitInsight,
}: LiveFormulaCardProps) {
  return (
    <Card className="px-5 py-5">
      <h2 className="text-[17px] font-extrabold tracking-[-0.02em] text-pico-text">
        Live formula
      </h2>

      <div className="mt-4 flex flex-col gap-2 rounded-xl bg-pico-soft px-4 py-3.5">
        <FormulaBlock size="sm" muted>
          v = v₀ + at
        </FormulaBlock>
        <FormulaBlock className="font-semibold">
          v = {fmt(initialVelocity)} + ({fmt(acceleration)})({fmt(time)})
        </FormulaBlock>
        <FormulaBlock size="lg" className="font-bold text-pico-blue">
          v = {fmt(finalVelocity)} m/s
        </FormulaBlock>
      </div>

      <div className="mt-3 rounded-[10px] bg-pico-softBlue px-3.5 py-2.5">
        <div className="p-section-lbl mb-1 text-[#2A60A8]">Unit reasoning</div>
        <FormulaBlock size="sm" className="font-bold text-[#2A60A8]">
          {unitInsight}
        </FormulaBlock>
      </div>
    </Card>
  );
}
