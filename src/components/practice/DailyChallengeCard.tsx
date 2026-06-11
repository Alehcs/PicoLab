import { Check, Play, Route, Send } from 'lucide-react';
import { dailyChallenge } from '../../data/mockMissions';
import type { Mission, PracticeQuestion } from '../../types/mission';
import { FormulaBlock } from '../math/FormulaBlock';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { AnswerOptionButton } from './AnswerOptionButton';
import { MissionRewardBadge } from './MissionRewardBadge';
import { StreakRow } from './StreakRow';

type DailyChallengeCardProps = {
  onStart: () => void;
  mission?: Mission;
  title?: string;
  description?: string;
  problem?: string;
  formulaHint?: string;
  streakLabel?: string;
  streakDays?: string[];
  completed?: boolean;
  // Interactive challenge state (owned by the page).
  started?: boolean;
  question?: PracticeQuestion;
  selectedOptionId?: string | null;
  checked?: boolean;
  answerCorrect?: boolean;
  feedbackTitle?: string;
  feedbackBody?: string;
  completing?: boolean;
  earnedPoints?: number;
  onSelect?: (optionId: string) => void;
  onCheck?: () => void;
  onComplete?: () => void;
};

export function DailyChallengeCard({
  onStart,
  mission = dailyChallenge.mission,
  title = dailyChallenge.title,
  description = dailyChallenge.description,
  problem = dailyChallenge.problem,
  formulaHint = dailyChallenge.formulaHint,
  streakLabel = dailyChallenge.streakLabel,
  streakDays = dailyChallenge.streakDays,
  completed = false,
  started = false,
  question = dailyChallenge.question,
  selectedOptionId = null,
  checked = false,
  answerCorrect = false,
  feedbackTitle,
  feedbackBody,
  completing = false,
  earnedPoints = mission.reward.points,
  onSelect,
  onCheck,
  onComplete,
}: DailyChallengeCardProps) {
  const isInteractive = started && !completed;

  return (
    <Card className="overflow-hidden px-5 py-5">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_240px]">
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Badge variant="blue">{mission.subject}</Badge>
            <Badge variant="grey">{mission.topic}</Badge>
            <Badge variant="yellow">{mission.difficulty}</Badge>
            <MissionRewardBadge reward={mission.reward} />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-[20px] font-extrabold tracking-[-0.025em] text-pico-text">
                {title}
              </h2>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-pico-secondary">
                {description}
              </p>
            </div>
            <div className="w-fit rounded-full bg-pico-softGreen px-3 py-1.5 text-[12px] font-bold text-[#2A7850]">
              {completed ? 'Completed' : streakLabel}
            </div>
          </div>

          {completed ? (
            <div className="mt-4 flex items-start gap-3 rounded-[14px] border-[1.5px] border-[#C0E8D0] bg-pico-softGreen px-4 py-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[#2A7850]">
                <Check size={16} aria-hidden="true" />
              </div>
              <div>
                <div className="text-[13.5px] font-bold text-[#2A7850]">Daily challenge complete</div>
                <p className="mt-0.5 text-[12.5px] leading-relaxed text-[#2A7850]">
                  +{earnedPoints} PicoPoints earned. Your streak is safe — come back tomorrow for the
                  next one.
                </p>
              </div>
            </div>
          ) : isInteractive && question ? (
            <>
              <div className="mt-4 rounded-[14px] bg-pico-soft px-4 py-4">
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
                    onSelect={() => onSelect?.(option.id)}
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

              <div className="mt-4 flex flex-wrap items-center gap-2.5">
                <Button disabled={!selectedOptionId} onClick={onCheck}>
                  <Send size={14} />
                  Check answer
                </Button>
                {checked && answerCorrect ? (
                  <Button variant="green" disabled={completing} onClick={onComplete}>
                    <Check size={14} />
                    {completing ? 'Saving...' : 'Complete daily challenge'}
                  </Button>
                ) : null}
              </div>
            </>
          ) : (
            <>
              <div className="mt-4 rounded-[14px] bg-pico-soft px-4 py-4">
                <div className="p-section-lbl mb-2">Challenge preview</div>
                <p className="text-[13.5px] leading-relaxed text-pico-secondary">{problem}</p>
                <div className="mt-3 inline-flex rounded-[10px] bg-white px-3 py-2">
                  <FormulaBlock size="sm" className="font-semibold text-pico-blue">
                    {formulaHint}
                  </FormulaBlock>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-4">
                <Button onClick={onStart}>
                  <Play size={15} />
                  Start daily challenge
                </Button>
                <StreakRow days={streakDays} />
              </div>
            </>
          )}
        </div>

        <div className="rounded-[16px] border-[1.5px] border-[#B8D8F4] bg-pico-softBlue px-4 py-4">
          <div className="mb-3 flex items-center gap-2 text-[12px] font-bold text-[#2A60A8]">
            <Route size={14} aria-hidden="true" />
            Motion preview
          </div>
          <div className="relative h-[118px] rounded-xl bg-white/70">
            <div className="absolute left-5 right-5 top-[55px] h-1 rounded-full bg-pico-border" />
            <div className="absolute left-5 top-[55px] h-1 w-[78%] rounded-full bg-[rgba(74,144,226,0.45)]" />
            <div className="absolute left-5 top-[45px] h-6 w-px bg-pico-muted" />
            <div className="absolute right-8 top-[40px] h-10 w-px bg-pico-green" />
            <div className="absolute right-5 top-[32px] rounded-full bg-pico-softGreen px-2.5 py-1 text-[11px] font-bold text-[#2A7850]">
              9 m/s
            </div>
            <div className="absolute left-[72%] top-[43px] h-7 w-7 rounded-full bg-pico-blue shadow-[0_6px_14px_rgba(74,144,226,0.22)]" />
            <svg viewBox="0 0 160 64" className="absolute bottom-2 left-4 right-4 h-10 w-[calc(100%-32px)]">
              <line x1="16" y1="48" x2="132" y2="16" stroke="#4A90E2" strokeWidth="3" />
              <circle cx="132" cy="16" r="5" fill="#5FBF8F" />
            </svg>
          </div>
        </div>
      </div>
    </Card>
  );
}
