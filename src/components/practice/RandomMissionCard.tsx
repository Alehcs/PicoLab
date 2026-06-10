import { Check, Play } from 'lucide-react';
import type { Mission, MissionDifficulty } from '../../types/mission';
import { Badge, type BadgeVariant } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { MissionRewardBadge } from './MissionRewardBadge';

type RandomMissionCardProps = {
  mission: Mission;
  onStart: () => void;
  completed?: boolean;
  selected?: boolean;
};

const difficultyVariant: Record<MissionDifficulty, BadgeVariant> = {
  Easy: 'green',
  Medium: 'yellow',
  Hard: 'coral',
};

export function RandomMissionCard({
  mission,
  onStart,
  completed = false,
  selected = false,
}: RandomMissionCardProps) {
  return (
    <Card
      className={`flex h-full flex-col px-4 py-4 ${
        selected ? 'border-[#A8C8EC] ring-1 ring-[#A8C8EC]' : ''
      }`.trim()}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="text-[15px] font-bold leading-snug text-pico-text">{mission.title}</h3>
        {selected ? <Badge variant="blue">Selected</Badge> : null}
      </div>

      <div className="flex flex-wrap gap-1.5">
        <Badge variant="blue">{mission.subject}</Badge>
        <Badge variant="grey">{mission.topic}</Badge>
        <Badge variant={difficultyVariant[mission.difficulty]}>{mission.difficulty}</Badge>
        <MissionRewardBadge reward={mission.reward} />
        {completed ? <Badge variant="green">Completed</Badge> : null}
      </div>

      {mission.description ? (
        <p className="mt-3 text-[12.5px] leading-relaxed text-pico-secondary">
          {mission.description}
        </p>
      ) : null}

      <Button
        variant={selected ? 'primary' : 'secondary'}
        size="sm"
        className="mt-auto w-fit"
        onClick={onStart}
      >
        {selected ? <Check size={13} /> : <Play size={13} />}
        {selected ? 'Selected' : 'Start mission'}
      </Button>
    </Card>
  );
}
