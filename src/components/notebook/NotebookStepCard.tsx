import type { ReactNode } from 'react';
import { Check, Lightbulb } from 'lucide-react';
import type { LearningSignal } from '../../data/mockNotebook';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { LearningSignalCard } from './LearningSignalCard';

export type StepPhase = 'active' | 'resolved' | 'needsAttention' | 'upcoming' | 'completed';

type StepActionVariant = 'primary' | 'secondary' | 'ghost' | 'green' | 'coral' | 'yellow';

export type StepAction = {
  key: string;
  label: string;
  onClick: () => void;
  variant?: StepActionVariant;
  icon?: ReactNode;
  disabled?: boolean;
};

type NotebookStepCardProps = {
  stepNumber: number;
  title: string;
  instruction: string;
  phase: StepPhase;
  showInput?: boolean;
  inputValue?: string;
  placeholder?: string;
  inputHelp?: string;
  onInputChange?: (value: string) => void;
  prompt?: string | null;
  hint?: string | null;
  signal?: LearningSignal | null;
  resolvedTitle?: string;
  resolvedMessage?: string;
  infoMessage?: string | null;
  checkPending?: boolean;
  actions?: StepAction[];
};

const circleClass: Record<StepPhase, string> = {
  active: 'bg-pico-softBlue text-[#2A60A8]',
  resolved: 'bg-pico-softGreen text-[#2A7850]',
  completed: 'bg-pico-softGreen text-[#2A7850]',
  needsAttention: 'bg-pico-softCoral text-[#BF3A3A]',
  upcoming: 'bg-pico-soft text-pico-muted',
};

function PhaseBadge({ phase }: { phase: StepPhase }) {
  switch (phase) {
    case 'active':
      return <Badge variant="blue">Active step</Badge>;
    case 'resolved':
      return <Badge variant="green">Resolved</Badge>;
    case 'completed':
      return <Badge variant="green">Done</Badge>;
    case 'needsAttention':
      return <Badge variant="coral">Signal found</Badge>;
    default:
      return <Badge variant="grey">Upcoming</Badge>;
  }
}

export function NotebookStepCard({
  stepNumber,
  title,
  instruction,
  phase,
  showInput = false,
  inputValue = '',
  placeholder,
  inputHelp,
  onInputChange,
  prompt,
  hint,
  signal,
  resolvedTitle = 'Step resolved',
  resolvedMessage,
  infoMessage,
  checkPending = false,
  actions = [],
}: NotebookStepCardProps) {
  const isUpcoming = phase === 'upcoming';
  const isResolved = phase === 'resolved';
  const isNeedsAttention = phase === 'needsAttention';

  const borderClass = isResolved
    ? 'border-[#BBE3CC] ring-1 ring-[#BBE3CC]'
    : phase === 'active'
      ? 'border-[#B8D8F4] ring-1 ring-[#B8D8F4]'
      : isNeedsAttention
        ? 'border-[#FDDADA]'
        : '';

  const inputBorder = isResolved
    ? 'border-[#BBE3CC]'
    : isNeedsAttention
      ? 'border-[#FDDADA]'
      : 'border-[#B8D8F4]';
  const inputText = isResolved
    ? 'text-[#2A7850]'
    : isNeedsAttention
      ? 'text-[#8A3030]'
      : 'text-pico-text';

  return (
    <Card className={`${borderClass} overflow-hidden ${isUpcoming ? 'opacity-55' : ''}`.trim()}>
      <div className="flex items-center gap-3 border-b border-pico-soft px-[18px] py-3">
        <div
          className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${circleClass[phase]}`}
        >
          {phase === 'resolved' || phase === 'completed' ? <Check size={12} aria-hidden="true" /> : stepNumber}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-bold text-pico-text">{title}</div>
          <div className={`mt-0.5 text-[13px] ${isUpcoming ? 'text-pico-muted' : 'text-pico-secondary'}`}>
            {instruction}
          </div>
        </div>
        <PhaseBadge phase={phase} />
      </div>

      {isUpcoming ? null : (
        <div className="flex flex-col gap-3.5 px-[18px] py-4">
          {showInput ? (
            <div>
              <div className="p-section-lbl mb-2">Your work</div>
              <div className={`rounded-[11px] border-[1.5px] ${inputBorder} bg-white px-4 py-3`}>
                <input
                  type="text"
                  aria-label={`${title} answer`}
                  className={`w-full bg-transparent p-mono text-lg font-semibold outline-none placeholder:font-normal placeholder:text-pico-muted ${inputText}`}
                  value={inputValue}
                  placeholder={placeholder}
                  onChange={(event) => onInputChange?.(event.target.value)}
                />
              </div>
              {inputHelp ? <p className="mt-1.5 text-[11.5px] text-pico-muted">{inputHelp}</p> : null}
            </div>
          ) : null}

          {prompt ? (
            <div className="flex items-start gap-2 rounded-[10px] bg-pico-softYellow px-3.5 py-2.5 text-[12.5px] font-medium leading-relaxed text-[#886018]">
              <Lightbulb size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
              {prompt}
            </div>
          ) : null}

          {checkPending ? (
            <div className="p-fade rounded-[10px] bg-pico-softBlue px-3.5 py-2.5 text-[12.5px] font-medium text-[#2A60A8]">
              Pico is checking the step...
            </div>
          ) : null}

          {signal ? <LearningSignalCard signal={signal} /> : null}

          {hint ? (
            <div className="flex items-start gap-2 rounded-[10px] border-[1.5px] border-[#F0D58A] bg-pico-softYellow px-3.5 py-2.5 text-[12.5px] leading-relaxed text-[#886018]">
              <Lightbulb size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
              <span>
                <span className="font-bold">Hint: </span>
                {hint}
              </span>
            </div>
          ) : null}

          {isResolved && resolvedMessage ? (
            <div className="flex items-start gap-3 rounded-[12px] border-[1.5px] border-[#BBE3CC] bg-pico-softGreen px-4 py-3.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[#2A7850]">
                <Check size={16} aria-hidden="true" />
              </div>
              <div>
                <div className="text-[13.5px] font-bold text-[#2A7850]">{resolvedTitle}</div>
                <p className="mt-0.5 text-[12.5px] leading-relaxed text-[#3A8860]">{resolvedMessage}</p>
              </div>
            </div>
          ) : null}

          {infoMessage ? (
            <div className="rounded-[12px] border-[1.5px] border-[#B8D8F4] bg-pico-softBlue px-4 py-3.5 text-[13px] leading-relaxed text-[#2A60A8]">
              {infoMessage}
            </div>
          ) : null}

          {actions.length ? (
            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              {actions.map((action) => (
                <Button
                  key={action.key}
                  variant={action.variant ?? 'secondary'}
                  size="sm"
                  onClick={action.onClick}
                  disabled={action.disabled}
                >
                  {action.icon}
                  {action.label}
                </Button>
              ))}
            </div>
          ) : null}
        </div>
      )}
    </Card>
  );
}
