import type { Mission } from '../../types/mission';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { MissionRewardBadge } from './MissionRewardBadge';

type RandomMissionCardProps = {
  mission: Mission;
  onStart: () => void;
  completed?: boolean;
};

export function RandomMissionCard({ mission, onStart, completed = false }: RandomMissionCardProps) {
  return (
    <Card className="flex h-full flex-col px-4 py-4">
      <h3 className="text-[15px] font-bold text-pico-text">{mission.title}</h3>
      <div className="mt-3 flex flex-wrap gap-1.5">
        <Badge variant="blue">{mission.subject}</Badge>
        <Badge variant="grey">{mission.topic}</Badge>
        <Badge variant="green">{mission.difficulty}</Badge>
        <MissionRewardBadge reward={mission.reward} />
        {completed ? <Badge variant="yellow">Completed</Badge> : null}
      </div>
      <Button variant="secondary" size="sm" className="mt-5 w-fit" onClick={onStart}>
        Start
      </Button>
    </Card>
  );
}
