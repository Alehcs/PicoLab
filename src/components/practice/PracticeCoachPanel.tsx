import { practiceCoach } from '../../data/mockMissions';
import { AskPicoButton } from '../pico/AskPicoButton';
import { PicoMascot } from '../pico/PicoMascot';
import { Card } from '../ui/Card';

type CoachStat = { label: string; value: string };

type PracticeCoachPanelProps = {
  onAskPico: () => void;
  stats?: CoachStat[];
};

export function PracticeCoachPanel({ onAskPico, stats = practiceCoach.stats }: PracticeCoachPanelProps) {
  return (
    <Card className="flex flex-col gap-4 px-4 py-5">
      <div className="p-pico-coach-stack">
        <PicoMascot size={132} className="max-w-[78%]" />
        <div className="p-speech-bubble w-full px-4 py-3.5 text-[13px] leading-relaxed text-pico-secondary">
          <div className="p-section-lbl mb-1.5">Pico says</div>
          {practiceCoach.message}
        </div>
      </div>

      <div className="h-px bg-pico-border" />

      <div className="grid gap-2">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-[10px] bg-pico-soft px-3.5 py-2.5">
            <div className="text-[10.5px] font-bold uppercase tracking-[0.06em] text-pico-muted">
              {stat.label}
            </div>
            <div className="mt-1 text-[13px] font-bold text-pico-text">{stat.value}</div>
          </div>
        ))}
      </div>

      <AskPicoButton fullWidth onClick={onAskPico} />
    </Card>
  );
}
