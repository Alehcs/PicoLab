import { Sparkles } from 'lucide-react';

import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import type { LeagueProgress } from '../../types/profile';

type LeagueProgressCardProps = {
  league: LeagueProgress;
};

export function LeagueProgressCard({ league }: LeagueProgressCardProps) {
  return (
    <Card className="px-5 py-4">
      <div className="mb-2.5 flex items-center gap-2">
        <Sparkles size={13} className="text-[#E8943A]" aria-hidden="true" />
        <span className="text-[13px] font-bold text-pico-text">League progress</span>
      </div>

      <div className="text-[15px] font-extrabold tracking-[-0.02em] text-pico-text">
        {league.currentLeague}
      </div>
      <div className="mt-0.5 text-[12px] text-pico-secondary">
        Only {league.remainingPoints} PicoPoints to {league.nextLeague}.
      </div>

      <div className="mb-1.5 mt-3 flex justify-between">
        <span className="text-[11.5px] font-bold text-[#A86017]">
          {league.points} / {league.nextLeaguePoints} PicoPoints
        </span>
        <span className="text-[11.5px] text-pico-muted">{league.nextLeague}</span>
      </div>
      <ProgressBar
        value={league.points}
        max={league.nextLeaguePoints}
        color="#E8943A"
        label={`${league.points} of ${league.nextLeaguePoints} PicoPoints`}
      />
      <p className="mt-2.5 text-[11.5px] leading-relaxed text-pico-muted">
        Earn PicoPoints by completing missions, improving learning signals, and keeping your daily
        streak.
      </p>
    </Card>
  );
}
