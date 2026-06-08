import { Target } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

type CurrentGoalCardProps = {
  title: string;
  value: string;
  copy: string;
};

export function CurrentGoalCard({ title, value, copy }: CurrentGoalCardProps) {
  return (
    <Card className="px-5 py-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-pico-softGreen text-[#2A7850]">
            <Target size={18} aria-hidden="true" />
          </div>
          <div>
            <div className="p-section-lbl mb-1">{title}</div>
            <div className="text-[18px] font-extrabold tracking-[-0.02em] text-pico-text">
              {value}
            </div>
            <p className="mt-1 text-[12.5px] leading-relaxed text-pico-secondary">{copy}</p>
          </div>
        </div>
        <Button variant="secondary" size="sm">Edit goal</Button>
      </div>
    </Card>
  );
}
