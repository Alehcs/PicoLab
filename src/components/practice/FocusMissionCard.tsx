import { FlaskConical, Route, Send } from 'lucide-react';
import { focusMission } from '../../data/mockMissions';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { AnswerOptionButton } from './AnswerOptionButton';

type FocusMissionCardProps = {
  selectedOptionId: string | null;
  checked: boolean;
  onSelect: (optionId: string) => void;
  onCheck: () => void;
  onOpenVisualLab: () => void;
  onViewGrowthPath: () => void;
};

export function FocusMissionCard({
  selectedOptionId,
  checked,
  onSelect,
  onCheck,
  onOpenVisualLab,
  onViewGrowthPath,
}: FocusMissionCardProps) {
  const question = focusMission.question;
  const isCorrect = selectedOptionId === question.correctOptionId;
  const feedback = isCorrect ? question.feedbackCorrect : question.feedbackUsefulSignal;

  return (
    <Card className="px-5 py-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-[18px] font-extrabold tracking-[-0.02em] text-pico-text">
            {focusMission.title}
          </h2>
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-pico-secondary">
            {focusMission.description}
          </p>
          <p className="mt-1 text-[12.5px] font-semibold text-pico-muted">{focusMission.context}</p>
        </div>
        <div className="w-full shrink-0 md:w-[130px]">
          <div className="mb-1.5 text-right text-[12px] font-bold text-pico-green">
            {focusMission.progressLabel}
          </div>
          <ProgressBar value={1} max={5} label="Focus mission progress" />
        </div>
      </div>

      <div className="mt-5 rounded-[14px] bg-pico-soft px-4 py-4">
        <div className="p-section-lbl mb-2">Question</div>
        <p className="text-[15px] font-semibold leading-relaxed text-pico-text">{question.prompt}</p>
      </div>

      <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
        {question.options.map((option) => (
          <AnswerOptionButton
            key={option.id}
            option={option}
            selected={selectedOptionId === option.id}
            checked={checked}
            correct={option.id === question.correctOptionId}
            onSelect={() => onSelect(option.id)}
          />
        ))}
      </div>

      {checked && selectedOptionId ? (
        <div
          className={`p-fade mt-4 rounded-[14px] px-4 py-3.5 ${
            isCorrect
              ? 'border-[1.5px] border-[#C0E8D0] bg-pico-softGreen'
              : 'border-[1.5px] border-[#FDE6BA] bg-pico-softYellow'
          }`}
        >
          <div className={`text-[13px] font-bold ${isCorrect ? 'text-[#2A7850]' : 'text-[#886018]'}`}>
            {isCorrect ? 'Exactly.' : 'Useful signal.'}
          </div>
          <p className={`mt-1 text-[13px] leading-relaxed ${isCorrect ? 'text-[#2A7850]' : 'text-[#7A5010]'}`}>
            {feedback}
          </p>
        </div>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-2">
        <Button disabled={!selectedOptionId} onClick={onCheck}>
          <Send size={14} />
          Check answer
        </Button>
        <Button variant="secondary" onClick={onOpenVisualLab}>
          <FlaskConical size={14} />
          Open Visual Lab
        </Button>
        <Button variant="ghost" onClick={onViewGrowthPath}>
          <Route size={14} />
          View Growth Path
        </Button>
      </div>
    </Card>
  );
}
