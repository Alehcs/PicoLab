import { FlaskConical, Route, Send } from 'lucide-react';
import { focusMission } from '../../data/mockMissions';
import type { PracticeAnswerResponse } from '../../types/api';
import type { PracticeQuestion } from '../../types/mission';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { AnswerOptionButton } from './AnswerOptionButton';

type FocusMissionCardProps = {
  selectedOptionId: string | null;
  checked: boolean;
  checking: boolean;
  question?: PracticeQuestion;
  title?: string;
  description?: string;
  context?: string;
  progressLabel?: string;
  answerResult: PracticeAnswerResponse | null;
  completed?: boolean;
  onSelect: (optionId: string) => void;
  onCheck: () => void;
  onOpenVisualLab: () => void;
  onViewGrowthPath: () => void;
};

export function FocusMissionCard({
  selectedOptionId,
  checked,
  checking,
  question = focusMission.question,
  title = focusMission.title,
  description = focusMission.description,
  context = focusMission.context,
  progressLabel = focusMission.progressLabel,
  answerResult,
  completed = false,
  onSelect,
  onCheck,
  onOpenVisualLab,
  onViewGrowthPath,
}: FocusMissionCardProps) {
  const isComplete = answerResult?.status === 'complete' || completed;
  const feedback =
    answerResult?.supportiveFeedback ??
    (isComplete ? question.feedbackCorrect : question.feedbackUsefulSignal);
  const feedbackTitle = isComplete
    ? 'Nice reasoning.'
    : answerResult?.learningSignal
      ? 'Learning signal found.'
      : 'Almost there.';

  return (
    <Card className="px-5 py-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-[18px] font-extrabold tracking-[-0.02em] text-pico-text">
            {title}
          </h2>
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-pico-secondary">
            {description}
          </p>
          <p className="mt-1 text-[12.5px] font-semibold text-pico-muted">{context}</p>
        </div>
        <div className="w-full shrink-0 md:w-[130px]">
          <div className="mb-1.5 text-right text-[12px] font-bold text-pico-green">
            {completed ? 'Completed' : progressLabel}
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
            correct={
              option.id === question.correctOptionId ||
              (isComplete && selectedOptionId === option.id)
            }
            onSelect={() => onSelect(option.id)}
          />
        ))}
      </div>

      {checking ? (
        <div className="p-fade mt-4 rounded-[14px] border-[1.5px] border-[#B8D8F4] bg-pico-softBlue px-4 py-3.5">
          <div className="text-[13px] font-bold text-[#2A60A8]">
            Pico is checking your answer...
          </div>
        </div>
      ) : null}

      {checked && selectedOptionId ? (
        <div
          className={`p-fade mt-4 rounded-[14px] px-4 py-3.5 ${
            isComplete
              ? 'border-[1.5px] border-[#C0E8D0] bg-pico-softGreen'
              : 'border-[1.5px] border-[#FDE6BA] bg-pico-softYellow'
          }`}
        >
          <div className={`text-[13px] font-bold ${isComplete ? 'text-[#2A7850]' : 'text-[#886018]'}`}>
            {feedbackTitle}
          </div>
          <p className={`mt-1 text-[13px] leading-relaxed ${isComplete ? 'text-[#2A7850]' : 'text-[#7A5010]'}`}>
            {feedback}
          </p>
          {answerResult?.explanation ? (
            <p className={`mt-1 text-[13px] leading-relaxed ${isComplete ? 'text-[#2A7850]' : 'text-[#7A5010]'}`}>
              {answerResult.explanation}
            </p>
          ) : null}
          {typeof answerResult?.picoPointsPreview === 'number' && answerResult.picoPointsPreview > 0 ? (
            <div className="mt-2 text-[12px] font-bold text-[#2A7850]">
              +{answerResult.picoPointsPreview} PicoPoints ready
            </div>
          ) : null}
          {answerResult?.learningSignal ? (
            <div className="mt-2 text-[12px] font-bold text-[#886018]">
              Small adjustment: {answerResult.learningSignal.suggestedFocus}
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-2">
        <Button disabled={!selectedOptionId || checking} onClick={onCheck}>
          <Send size={14} />
          {checking ? 'Checking...' : 'Check answer'}
        </Button>
        <Button variant="secondary" onClick={onOpenVisualLab}>
          <FlaskConical size={14} />
          Open Visual Lab
        </Button>
        <Button variant="ghost" onClick={onViewGrowthPath}>
          <Route size={14} />
          View Roadmap
        </Button>
      </div>
    </Card>
  );
}
