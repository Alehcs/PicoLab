import { Compass, MessageCircle } from 'lucide-react';
import type { PatternInsight } from '../../data/mockNotebook';
import { PicoMascot } from '../pico/PicoMascot';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

type PicoCoachPanelProps = {
  title: string;
  message: string;
  patternInsight: PatternInsight;
  onReviewPattern: () => void;
  onViewGrowthPath: () => void;
};

export function PicoCoachPanel({
  title,
  message,
  patternInsight,
  onReviewPattern,
  onViewGrowthPath,
}: PicoCoachPanelProps) {
  return (
    <Card className="flex flex-col gap-4 px-4 py-5">
      <div className="flex flex-col items-center gap-1.5 border-b border-pico-border pb-4">
        <PicoMascot size={54} />
        <div className="text-[11px] font-bold uppercase tracking-[0.06em] text-pico-muted">
          Pico
        </div>
      </div>

      <div>
        <div className="text-[13.5px] font-bold text-pico-secondary">{title}</div>
        <div className="p-speech-bubble mt-2 px-3.5 py-3 text-[13px] leading-relaxed text-pico-secondary">
          {message}
        </div>
      </div>

      <div className="h-px bg-pico-border" />

      <div>
        <div className="p-section-lbl mb-2.5">{patternInsight.title}</div>
        <div className="rounded-[11px] bg-pico-softCoral px-3.5 py-3">
          <div className="flex items-center gap-2 text-[13px] font-bold text-[#BF3A3A]">
            <Compass size={14} aria-hidden="true" />
            {patternInsight.content}
          </div>
        </div>
        <p className="mt-2 text-[12.5px] leading-relaxed text-pico-secondary">
          {patternInsight.supportCopy}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Button variant="secondary" size="sm" fullWidth onClick={onReviewPattern}>
          Review pattern
        </Button>
        <Button variant="ghost" size="sm" fullWidth onClick={onViewGrowthPath}>
          View Growth Path
        </Button>
        <Button variant="ghost" size="sm" fullWidth>
          <MessageCircle size={13} />
          Ask Pico
        </Button>
      </div>
    </Card>
  );
}
