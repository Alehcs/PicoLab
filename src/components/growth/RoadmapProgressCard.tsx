import type { ReactNode } from 'react';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';

type RoadmapProgressCardProps = {
  percent: number;
  label: string;
  detail: string;
  children?: ReactNode;
};

export function RoadmapProgressCard({ percent, label, detail, children }: RoadmapProgressCardProps) {
  const circumference = 2 * Math.PI * 38;
  const dash = (percent / 100) * circumference;

  return (
    <Card className="px-5 py-5">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">{children}</div>
        <div className="flex shrink-0 items-center gap-4">
          <svg width="90" height="90" viewBox="0 0 90 90" aria-label={label} role="img">
            <circle cx="45" cy="45" r="38" fill="none" stroke="#E1E6DB" strokeWidth="8" />
            <circle
              cx="45"
              cy="45"
              r="38"
              fill="none"
              stroke="#5FBF8F"
              strokeWidth="8"
              strokeDasharray={`${dash} ${circumference}`}
              strokeLinecap="round"
              transform="rotate(-90 45 45)"
            />
            <text
              x="45"
              y="49"
              textAnchor="middle"
              fill="#263238"
              fontSize="15"
              fontWeight="800"
              fontFamily="Plus Jakarta Sans"
            >
              {percent}%
            </text>
          </svg>
          <div className="w-[160px]">
            <div className="text-[13px] font-bold text-pico-text">{label}</div>
            <p className="mt-1 text-[12px] leading-relaxed text-pico-muted">{detail}</p>
            <div className="mt-3">
              <ProgressBar value={percent} label={label} />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
