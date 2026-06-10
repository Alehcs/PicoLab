import { Check, Edit3, Target } from 'lucide-react';

import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

type LearningGoalsCardProps = {
  goals: string[];
  onEditGoals: () => void;
};

export function LearningGoalsCard({ goals, onEditGoals }: LearningGoalsCardProps) {
  return (
    <Card className="px-5 py-4">
      <div className="mb-2.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Target size={13} className="text-pico-blue" aria-hidden="true" />
          <span className="text-[13px] font-bold text-pico-text">Learning goals</span>
        </div>
        <Button variant="ghost" size="xs" onClick={onEditGoals}>
          <Edit3 size={11} />
          Edit goals
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        {goals.map((goal) => (
          <div key={goal} className="flex items-center gap-2">
            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-pico-softBlue">
              <Check size={9} className="text-pico-blue" aria-hidden="true" />
            </span>
            <span className="text-[13px] text-pico-text">{goal}</span>
          </div>
        ))}
      </div>

      <div className="mt-3 rounded-lg bg-pico-softBlue px-3 py-2">
        <p className="text-[11.5px] leading-relaxed text-[#2A60A8]">
          Pico uses your goals to personalize your Roadmap and Practice Missions.
        </p>
      </div>
    </Card>
  );
}
