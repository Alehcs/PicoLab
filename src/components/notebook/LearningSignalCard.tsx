import { Check, Lightbulb, Sparkles } from 'lucide-react';
import type { LearningSignal } from '../../data/mockNotebook';
import { FormulaBlock } from '../math/FormulaBlock';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

type LearningSignalCardProps = {
  signal: LearningSignal;
  onOpenVisual: () => void;
  onCheckStep?: () => void;
  checkPending?: boolean;
  resolved?: boolean;
};

export function LearningSignalCard({
  signal,
  onOpenVisual,
  onCheckStep,
  checkPending = false,
  resolved = false,
}: LearningSignalCardProps) {
  if (resolved) {
    return (
      <Card className="p-fade flex flex-col gap-3.5 border-[#BBE3CC] bg-pico-softGreen px-4 py-4">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[#2A7850]">
            <Check size={16} aria-hidden="true" />
          </div>
          <div>
            <div className="text-[13.5px] font-bold text-[#2A7850]">Step resolved</div>
            <div className="mt-0.5 text-[12px] font-medium text-[#3A8860]">
              The final unit now matches velocity (m/s).
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-0.5">
          <Button variant="coral" size="sm" onClick={onCheckStep} disabled={checkPending}>
            {checkPending ? 'Pico is checking...' : 'Check this step'}
          </Button>
          <Button variant="secondary" size="sm" onClick={onOpenVisual}>
            <Sparkles size={13} />
            Open visual explanation
          </Button>
          <Badge variant="green" className="ml-0 sm:ml-auto">
            Resolved
          </Badge>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="signal" className="p-fade flex flex-col gap-3.5 px-4 py-4">
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[#C04040]">
          <Lightbulb size={16} aria-hidden="true" />
        </div>
        <div>
          <div className="text-[13.5px] font-bold text-[#B83030]">{signal.title}</div>
          <div className="mt-0.5 text-[12px] font-medium text-[#C05050]">
            {signal.subtitle}
          </div>
        </div>
      </div>

      <div className="grid gap-2.5">
        {signal.sections.map((section) => (
          <div key={section.title} className="rounded-[10px] bg-white/60 px-3.5 py-3">
            <div className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#B85050]">
              {section.title}
            </div>
            {section.body ? (
              <p className="mt-1.5 text-[13px] leading-relaxed text-pico-secondary">
                {section.body}
              </p>
            ) : null}
            {section.formula ? (
              <FormulaBlock size="sm" className="mt-1.5 font-bold text-[#7A2020]">
                {section.formula}
              </FormulaBlock>
            ) : null}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-0.5">
        <Button variant="coral" size="sm" onClick={onCheckStep} disabled={checkPending}>
          {checkPending ? 'Pico is checking...' : 'Check this step'}
        </Button>
        <Button variant="secondary" size="sm" onClick={onOpenVisual}>
          <Sparkles size={13} />
          Open visual explanation
        </Button>
        <Button variant="yellow" size="sm">Give me a hint</Button>
        <Badge variant="grey" className="ml-0 sm:ml-auto">
          {signal.status}
        </Badge>
      </div>
    </Card>
  );
}
