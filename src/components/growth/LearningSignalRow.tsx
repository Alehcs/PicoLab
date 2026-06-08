import { ArrowRight } from 'lucide-react';
import type { GrowthSignal } from '../../data/mockGrowth';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';

type LearningSignalRowProps = {
  signal: GrowthSignal;
  onAction: (route?: string) => void;
};

const barColor = {
  coral: '#F47C7C',
  yellow: '#F6C85F',
  blue: '#4A90E2',
  green: '#5FBF8F',
  grey: '#8A9188',
};

export function LearningSignalRow({ signal, onAction }: LearningSignalRowProps) {
  return (
    <Card className="px-5 py-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2.5">
            <h3 className="text-[15px] font-bold text-pico-text">{signal.title}</h3>
            <Badge variant={signal.variant}>{signal.badge}</Badge>
          </div>
          <p className="text-[13.5px] leading-relaxed text-pico-secondary">
            {signal.description}
          </p>
          {signal.whyItMatters ? (
            <p className="mt-2 text-[12.5px] leading-relaxed text-pico-muted">
              <span className="font-bold text-pico-secondary">Why it matters: </span>
              {signal.whyItMatters}
            </p>
          ) : null}
        </div>

        <div className="w-full shrink-0 lg:w-[92px]">
          <ProgressBar value={signal.strength} max={5} color={barColor[signal.variant]} />
          <div className="mt-1.5 text-center text-[11px] text-pico-muted">{signal.strength}/5</div>
        </div>

        <Button variant="secondary" size="sm" onClick={() => onAction(signal.bestNextAction.route)}>
          {signal.bestNextAction.label}
          <ArrowRight size={13} />
        </Button>
      </div>
    </Card>
  );
}
