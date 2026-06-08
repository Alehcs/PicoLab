import { Check } from 'lucide-react';
import type { NotebookStep } from '../../data/mockNotebook';
import { FormulaBlock } from '../math/FormulaBlock';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { LearningSignalCard } from './LearningSignalCard';

type NotebookStepCardProps = {
  step: NotebookStep;
  onOpenVisual: () => void;
  onCheckStep?: () => void;
  checkPending?: boolean;
};

const stepCircleClass = {
  correct: 'bg-pico-softGreen text-[#2A7850]',
  'learning-signal': 'bg-pico-softCoral text-[#BF3A3A]',
  upcoming: 'bg-pico-soft text-pico-muted',
};

export function NotebookStepCard({
  step,
  onOpenVisual,
  onCheckStep,
  checkPending = false,
}: NotebookStepCardProps) {
  const isUpcoming = step.status === 'upcoming';
  const borderClass = step.status === 'learning-signal' ? 'border-[#FDDADA]' : '';

  return (
    <Card className={`${borderClass} overflow-hidden ${isUpcoming ? 'opacity-55' : ''}`.trim()}>
      <div className="flex items-center gap-3 border-b border-pico-soft px-[18px] py-3">
        <div
          className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
            stepCircleClass[step.status]
          }`}
        >
          {step.stepNumber}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-bold text-pico-text">{step.title}</div>
          <div className={`mt-0.5 text-[13px] ${isUpcoming ? 'text-pico-muted' : 'text-pico-secondary'}`}>
            {step.prompt}
          </div>
        </div>
        {step.status === 'correct' ? <Badge variant="green">Correct</Badge> : null}
        {step.status === 'learning-signal' ? <Badge variant="coral">Signal found</Badge> : null}
        {step.status === 'upcoming' ? <Badge variant="grey">Upcoming</Badge> : null}
      </div>

      {isUpcoming ? null : (
        <div className="flex flex-col gap-3.5 px-[18px] py-4">
          {step.studentInput ? (
            <div>
              <div className="p-section-lbl mb-2">Student input</div>
              <div
                className={`rounded-[11px] px-4 py-3 ${
                  step.status === 'learning-signal'
                    ? 'border-[1.5px] border-[#FDDADA] bg-[#FFF8F8]'
                    : 'bg-pico-soft'
                }`}
              >
                <FormulaBlock
                  size="lg"
                  className={`font-semibold ${
                    step.status === 'learning-signal' ? 'text-[#8A3030]' : ''
                  }`}
                >
                  {step.studentInput}
                </FormulaBlock>
              </div>
            </div>
          ) : null}

          {step.feedback ? (
            <div className="flex items-center gap-2 rounded-[10px] bg-pico-softGreen px-3.5 py-2.5 text-[13px] font-medium text-[#2A7850]">
              <Check size={14} aria-hidden="true" />
              {step.feedback}
            </div>
          ) : null}

          {step.learningSignal ? (
            <LearningSignalCard
              signal={step.learningSignal}
              onOpenVisual={onOpenVisual}
              onCheckStep={onCheckStep}
              checkPending={checkPending}
            />
          ) : null}
        </div>
      )}
    </Card>
  );
}
