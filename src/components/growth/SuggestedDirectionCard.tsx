import { Route } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

type SuggestedDirectionCardProps = {
  title: string;
  content: string;
  cta: string;
  onContinue: () => void;
};

export function SuggestedDirectionCard({
  title,
  content,
  cta,
  onContinue,
}: SuggestedDirectionCardProps) {
  return (
    <Card variant="blue" className="mb-5 px-5 py-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-pico-blue">
            <Route size={18} aria-hidden="true" />
          </div>
          <div>
            <div className="text-[14px] font-bold text-[#2A60A8]">{title}</div>
            <p className="mt-1 text-[13px] leading-relaxed text-[#2A60A8]">{content}</p>
          </div>
        </div>
        <Button size="sm" onClick={onContinue}>
          {cta}
        </Button>
      </div>
    </Card>
  );
}
