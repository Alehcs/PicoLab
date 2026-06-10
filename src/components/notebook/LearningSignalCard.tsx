import { Lightbulb } from 'lucide-react';
import type { LearningSignal } from '../../data/mockNotebook';
import { FormulaBlock } from '../math/FormulaBlock';
import { Card } from '../ui/Card';

type LearningSignalCardProps = {
  signal: LearningSignal;
};

// Display-only learning-signal panel. Action buttons (Try again, Open visual
// explanation, Give me a hint, ...) are owned by the step card so the whole
// step shares one consistent button row.
export function LearningSignalCard({ signal }: LearningSignalCardProps) {
  return (
    <Card variant="signal" className="p-fade flex flex-col gap-3.5 px-4 py-4">
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[#C04040]">
          <Lightbulb size={16} aria-hidden="true" />
        </div>
        <div>
          <div className="text-[13.5px] font-bold text-[#B83030]">{signal.title}</div>
          {signal.subtitle ? (
            <div className="mt-0.5 text-[12px] font-medium text-[#C05050]">{signal.subtitle}</div>
          ) : null}
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
    </Card>
  );
}
