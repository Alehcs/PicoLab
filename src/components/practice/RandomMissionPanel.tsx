import { Check, Send, Shuffle } from 'lucide-react';
import type { Mission, MissionDifficulty } from '../../types/mission';
import { Badge, type BadgeVariant } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { AnswerOptionButton } from './AnswerOptionButton';
import { MissionRewardBadge } from './MissionRewardBadge';

type RandomMissionPanelProps = {
  mission: Mission;
  selectedOptionId: string | null;
  checked: boolean;
  completed: boolean;
  completing: boolean;
  onSelect: (optionId: string) => void;
  onCheck: () => void;
  onComplete: () => void;
  onTryAnother: () => void;
};

const difficultyVariant: Record<MissionDifficulty, BadgeVariant> = {
  Easy: 'green',
  Medium: 'yellow',
  Hard: 'coral',
};

export function RandomMissionPanel({
  mission,
  selectedOptionId,
  checked,
  completed,
  completing,
  onSelect,
  onCheck,
  onComplete,
  onTryAnother,
}: RandomMissionPanelProps) {
  const question = mission.question;
  const answerCorrect = Boolean(question && selectedOptionId === question.correctOptionId);
  const feedbackTitle = answerCorrect ? 'Nice work.' : 'Almost there.';
  const feedbackBody = question
    ? answerCorrect
      ? question.feedbackCorrect
      : question.feedbackUsefulSignal
    : '';

  return (
    <Card className="p-fade border-[#B8D8F4] px-5 py-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Shuffle size={16} className="text-pico-blue" aria-hidden="true" />
            <h2 className="text-[17px] font-extrabold tracking-[-0.02em] text-pico-text">
              Random mission
            </h2>
          </div>
          <p className="mt-1 text-[13px] leading-relaxed text-pico-secondary">
            A short extra practice picked by Pico.
          </p>
        </div>
        {completed ? <Badge variant="green">Completed</Badge> : <Badge variant="blue">Optional</Badge>}
      </div>

      <div className="mt-4 rounded-[14px] bg-pico-soft px-4 py-4">
        <h3 className="text-[15px] font-bold text-pico-text">{mission.title}</h3>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <Badge variant="blue">{mission.subject}</Badge>
          <Badge variant="grey">{mission.topic}</Badge>
          <Badge variant={difficultyVariant[mission.difficulty]}>{mission.difficulty}</Badge>
          <MissionRewardBadge reward={mission.reward} />
        </div>
        {mission.description ? (
          <p className="mt-2.5 text-[12.5px] leading-relaxed text-pico-secondary">
            {mission.description}
          </p>
        ) : null}
      </div>

      {completed ? (
        <div className="mt-4 flex items-start gap-3 rounded-[14px] border-[1.5px] border-[#C0E8D0] bg-pico-softGreen px-4 py-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[#2A7850]">
            <Check size={16} aria-hidden="true" />
          </div>
          <div>
            <div className="text-[13.5px] font-bold text-[#2A7850]">Random mission complete</div>
            <p className="mt-0.5 text-[12.5px] leading-relaxed text-[#2A7850]">
              +{mission.reward.points} PicoPoints earned. Nice extra practice.
            </p>
          </div>
        </div>
      ) : question ? (
        <>
          <div className="mt-4 rounded-[14px] bg-white px-4 py-4 ring-1 ring-pico-border">
            <div className="p-section-lbl mb-2">Question</div>
            <p className="text-[14.5px] font-semibold leading-relaxed text-pico-text">
              {question.prompt}
            </p>
          </div>

          <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
            {question.options.map((option, index) => (
              <AnswerOptionButton
                key={option.id}
                option={option}
                letter={String.fromCharCode(65 + index)}
                selected={selectedOptionId === option.id}
                checked={checked}
                correct={option.id === question.correctOptionId}
                onSelect={() => onSelect(option.id)}
              />
            ))}
          </div>

          {checked && feedbackBody ? (
            <div
              className={`p-fade mt-3 rounded-[14px] px-4 py-3.5 ${
                answerCorrect
                  ? 'border-[1.5px] border-[#C0E8D0] bg-pico-softGreen'
                  : 'border-[1.5px] border-[#FDE6BA] bg-pico-softYellow'
              }`}
            >
              <div
                className={`text-[13px] font-bold ${answerCorrect ? 'text-[#2A7850]' : 'text-[#886018]'}`}
              >
                {feedbackTitle}
              </div>
              <p
                className={`mt-1 text-[13px] leading-relaxed ${answerCorrect ? 'text-[#2A7850]' : 'text-[#7A5010]'}`}
              >
                {feedbackBody}
              </p>
            </div>
          ) : null}
        </>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center gap-2.5">
        {completed ? (
          <Button size="sm" onClick={onTryAnother}>
            <Shuffle size={13} />
            Try another random mission
          </Button>
        ) : (
          <>
            <Button size="sm" disabled={!selectedOptionId} onClick={onCheck}>
              <Send size={13} />
              Check answer
            </Button>
            {checked && answerCorrect ? (
              <Button variant="green" size="sm" disabled={completing} onClick={onComplete}>
                <Check size={13} />
                {completing ? 'Saving...' : 'Complete mission'}
              </Button>
            ) : null}
            <Button variant="ghost" size="sm" onClick={onTryAnother}>
              <Shuffle size={13} />
              Try another
            </Button>
          </>
        )}
      </div>
    </Card>
  );
}
