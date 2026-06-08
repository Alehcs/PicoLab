import { Clock, Eye, Tag } from 'lucide-react';
import type { GrowthPathStepData } from '../../data/mockGrowth';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

type GrowthPathStepProps = {
  step: GrowthPathStepData;
  isLast?: boolean;
  onAction: (route?: string) => void;
};

const badgeVariant = {
  recommended: 'green',
  'up-next': 'blue',
  later: 'grey',
} as const;

const dotClass = {
  recommended: 'bg-pico-green border-[#C0E8D0]',
  'up-next': 'bg-pico-blue border-[#B8D8F4]',
  later: 'bg-pico-border border-pico-border',
};

const cardClass = {
  recommended: 'border-[#C0E8D0] bg-[#FBFFFC]',
  'up-next': '',
  later: 'opacity-75',
};

const metadataIcons = [Clock, Eye, Tag];

export function GrowthPathStep({ step, isLast = false, onAction }: GrowthPathStepProps) {
  return (
    <div className="flex gap-4">
      <div className="flex w-5 shrink-0 flex-col items-center">
        <div className={`mt-5 h-4 w-4 rounded-full border-2 ${dotClass[step.status]}`} />
        {!isLast ? <div className="mt-2 min-h-[34px] w-px flex-1 bg-pico-border" /> : null}
      </div>

      <div className="min-w-0 flex-1 pb-4">
        <Card className={`${cardClass[step.status]} px-5 py-4`}>
          <div className="mb-2.5 flex flex-wrap items-center gap-2">
            <span className="text-[12px] font-bold uppercase tracking-[0.06em] text-pico-muted">
              {step.stepLabel}
            </span>
            <h3 className="text-[15px] font-bold text-pico-text">{step.title}</h3>
            <Badge variant={badgeVariant[step.status]}>{step.badge}</Badge>
          </div>

          <p className="text-[12.5px] leading-relaxed text-pico-muted">{step.reason}</p>

          <div className="mt-3 grid gap-1.5">
            {step.items.map((item) => (
              <div key={item} className="flex items-center gap-2 text-[13px] text-pico-secondary">
                <span className="h-1.5 w-1.5 rounded-full bg-pico-green" aria-hidden="true" />
                {item}
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {step.metadata.map((meta, index) => {
              const Icon = metadataIcons[index] ?? Tag;
              return (
                <span
                  key={meta}
                  className="inline-flex items-center gap-1.5 rounded-full bg-pico-soft px-2.5 py-1 text-[11.5px] font-semibold text-pico-secondary"
                >
                  <Icon size={12} aria-hidden="true" />
                  {meta}
                </span>
              );
            })}
            <Button
              variant={step.status === 'recommended' ? 'green' : 'secondary'}
              size="sm"
              className="ml-0 sm:ml-auto"
              onClick={() => onAction(step.route)}
            >
              {step.cta}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
