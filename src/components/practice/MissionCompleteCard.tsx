import { CheckCircle2, Map, Plus, Route, Target } from 'lucide-react';
import { missionComplete } from '../../data/mockMissions';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

type MissionCompleteCardProps = {
  onViewRoadmap: () => void;
  onOpenGrowthMap: () => void;
  onContinueExtraPractice: () => void;
  onAddAnotherProblem: () => void;
  title?: string;
  copy?: string;
  stats?: Array<{
    label: string;
    value: string;
  }>;
  completing?: boolean;
};

export function MissionCompleteCard({
  onViewRoadmap,
  onOpenGrowthMap,
  onContinueExtraPractice,
  onAddAnotherProblem,
  title = missionComplete.title,
  copy = missionComplete.copy,
  stats = missionComplete.stats,
  completing = false,
}: MissionCompleteCardProps) {
  return (
    <Card variant="progress" className="p-fade px-5 py-5">
      <div className="flex items-start gap-3">
        <CheckCircle2 size={22} className="mt-0.5 shrink-0 text-[#2A7850]" aria-hidden="true" />
        <div>
          <h2 className="text-[17px] font-extrabold tracking-[-0.02em] text-[#2A7850]">
            {completing ? 'Saving mission progress' : title}
          </h2>
          <p className="mt-1 text-[13.5px] leading-relaxed text-[#2A7850]">
            {completing ? 'Pico is updating your streak and PicoPoints...' : copy}
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-[10px] bg-white/70 px-3 py-2.5">
            <div className="text-[10.5px] font-bold uppercase tracking-[0.06em] text-[#2A7850]">
              {stat.label}
            </div>
            <div className="mt-1 text-[12.5px] font-semibold text-pico-text">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button size="sm" onClick={onViewRoadmap}>
          <Route size={13} />
          View Roadmap
        </Button>
        <Button variant="secondary" size="sm" onClick={onOpenGrowthMap}>
          <Map size={13} />
          Open Growth Map
        </Button>
        <Button variant="secondary" size="sm" onClick={onContinueExtraPractice}>
          <Target size={13} />
          Continue with extra practice
        </Button>
        <Button variant="ghost" size="sm" onClick={onAddAnotherProblem}>
          <Plus size={13} />
          Add another problem
        </Button>
      </div>
    </Card>
  );
}
