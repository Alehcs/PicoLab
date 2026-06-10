import { Target } from 'lucide-react';
import { FormulaBlock } from '../math/FormulaBlock';
import { AskPicoButton } from '../pico/AskPicoButton';
import { PicoMascot } from '../pico/PicoMascot';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

type VisualLabCoachPanelProps = {
  unitInsight: string;
  finalVelocity: number;
  onPracticeUnits: () => void;
  onViewGrowthPath: () => void;
  onAskPico: () => void;
};

const fmt = (value: number) => Number(value.toFixed(1)).toString();

export function VisualLabCoachPanel({
  unitInsight,
  finalVelocity,
  onPracticeUnits,
  onViewGrowthPath,
  onAskPico,
}: VisualLabCoachPanelProps) {
  return (
    <Card className="flex flex-col gap-4 px-4 py-5">
      <div className="p-pico-coach-stack">
        <PicoMascot size={132} className="max-w-[78%]" />
        <div className="p-speech-bubble w-full px-4 py-3.5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div className="p-section-lbl">Pico explains</div>
            <Badge variant="coral">Learning signal: Unit mismatch</Badge>
          </div>

          <div className="flex flex-col gap-2.5">
            <section className="rounded-[11px] bg-pico-soft px-3.5 py-3">
              <div className="p-section-lbl mb-1.5">What to notice</div>
              <p className="text-[13px] leading-relaxed text-pico-secondary">
                The final point on the graph is {fmt(finalVelocity)} m/s.
              </p>
            </section>

            <section className="rounded-[11px] bg-pico-soft px-3.5 py-3">
              <div className="p-section-lbl mb-1.5">Why it matters</div>
              <p className="text-[13px] leading-relaxed text-pico-secondary">
                Velocity tells how fast position changes over time, so its unit is meters per second.
              </p>
            </section>

            <section className="rounded-[11px] bg-pico-softBlue px-3.5 py-3">
              <div className="p-section-lbl mb-1.5 text-[#2A60A8]">Unit insight</div>
              <FormulaBlock size="sm" className="font-bold text-[#2A60A8]">
                {unitInsight}
              </FormulaBlock>
            </section>
          </div>
        </div>
      </div>

      <div className="h-px bg-pico-border" />

      <div className="flex flex-col gap-2">
        <AskPicoButton fullWidth onClick={onAskPico} />
        <Button variant="secondary" size="sm" fullWidth onClick={onPracticeUnits}>
          <Target size={13} />
          Practice units
        </Button>
        <Button variant="ghost" size="sm" fullWidth onClick={onViewGrowthPath}>
          View Roadmap
        </Button>
      </div>
    </Card>
  );
}
