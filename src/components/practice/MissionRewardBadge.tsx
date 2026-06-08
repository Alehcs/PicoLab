import { Zap } from 'lucide-react';
import type { MissionReward } from '../../types/mission';

type MissionRewardBadgeProps = {
  reward: MissionReward;
};

export function MissionRewardBadge({ reward }: MissionRewardBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-pico-softYellow px-2.5 py-1 text-[11.5px] font-bold text-[#886018]">
      <Zap size={12} aria-hidden="true" />
      {reward.label}
    </span>
  );
}
