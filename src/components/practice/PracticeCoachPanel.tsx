import { practiceCoach } from '../../data/mockMissions';
import { AskPicoButton } from '../pico/AskPicoButton';
import { PicoMascot } from '../pico/PicoMascot';
import { Card } from '../ui/Card';

type PracticeCoachPanelProps = {
  onAskPico: () => void;
};

export function PracticeCoachPanel({ onAskPico }: PracticeCoachPanelProps) {
  return (
    <Card className="flex flex-col gap-4 px-4 py-5">
      <div className="flex flex-col items-center gap-1.5 border-b border-pico-border pb-4">
        <PicoMascot size={54} />
        <div className="text-[11px] font-bold uppercase tracking-[0.06em] text-pico-muted">
          Pico
        </div>
      </div>

      <div>
        <div className="text-[13.5px] font-bold text-pico-secondary">{practiceCoach.title}</div>
        <div className="p-speech-bubble mt-2 px-3.5 py-3 text-[13px] leading-relaxed text-pico-secondary">
          {practiceCoach.message}
        </div>
      </div>

      <div className="h-px bg-pico-border" />

      <div className="grid gap-2">
        {practiceCoach.stats.map((stat) => (
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
