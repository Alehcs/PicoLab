import { CheckCircle2, NotebookTabs, Route, Shuffle } from 'lucide-react';
import { missionComplete } from '../../data/mockMissions';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

type MissionCompleteCardProps = {
  onContinueGrowthPath: () => void;
  onTryRandomMission: () => void;
  onReturnToNotebook: () => void;
};

export function MissionCompleteCard({
  onContinueGrowthPath,
  onTryRandomMission,
  onReturnToNotebook,
}: MissionCompleteCardProps) {
  return (
    <Card variant="progress" className="p-fade px-5 py-5">
      <div className="flex items-start gap-3">
        <CheckCircle2 size={22} className="mt-0.5 shrink-0 text-[#2A7850]" aria-hidden="true" />
        <div>
          <h2 className="text-[17px] font-extrabold tracking-[-0.02em] text-[#2A7850]">
            {missionComplete.title}
          </h2>
          <p className="mt-1 text-[13.5px] leading-relaxed text-[#2A7850]">
            {missionComplete.copy}
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        {missionComplete.stats.map((stat) => (
          <div key={stat.label} className="rounded-[10px] bg-white/70 px-3 py-2.5">
            <div className="text-[10.5px] font-bold uppercase tracking-[0.06em] text-[#2A7850]">
              {stat.label}
            </div>
            <div className="mt-1 text-[12.5px] font-semibold text-pico-text">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button size="sm" onClick={onContinueGrowthPath}>
          <Route size={13} />
          Continue Growth Path
        </Button>
        <Button variant="secondary" size="sm" onClick={onTryRandomMission}>
          <Shuffle size={13} />
          Try random mission
        </Button>
        <Button variant="ghost" size="sm" onClick={onReturnToNotebook}>
          <NotebookTabs size={13} />
          Return to notebook
        </Button>
      </div>
    </Card>
  );
}
