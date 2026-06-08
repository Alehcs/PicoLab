import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { PicoMascot } from '../pico/PicoMascot';
import type { LearnerProfile, ProfileStat } from '../../types/profile';
import { ProfileIcon, profileVariantStyles } from './profileVisuals';

type ProfileSummaryCardProps = {
  learner: LearnerProfile;
  stats: ProfileStat[];
};

export function ProfileSummaryCard({ learner, stats }: ProfileSummaryCardProps) {
  return (
    <Card className="px-5 py-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pico-blue to-pico-green text-[22px] font-extrabold text-white shadow-[0_3px_12px_rgba(74,144,226,0.24)]">
          {learner.initials}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-[18px] font-extrabold leading-tight tracking-[-0.02em] text-pico-text">
              {learner.name}
            </h2>
            <Badge variant="blue">{learner.label}</Badge>
            <Badge variant="green">{learner.league}</Badge>
          </div>
          <p className="mt-1.5 text-[12.5px] leading-relaxed text-pico-secondary">
            {learner.description} <span className="text-pico-muted">Track: {learner.track}</span>
          </p>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {stats.map((stat) => {
              const styles = profileVariantStyles[stat.variant];

              return (
                <div
                  key={stat.label}
                  className="flex items-center gap-1.5 rounded-lg px-2.5 py-1"
                  style={{ background: styles.bg }}
                >
                  <ProfileIcon name={stat.icon} size={12} color={styles.text} />
                  <span className="text-[12px] font-bold" style={{ color: styles.text }}>
                    {stat.value}
                  </span>
                  <span className="text-[11.5px]" style={{ color: styles.text, opacity: 0.72 }}>
                    {stat.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <PicoMascot size={50} className="hidden sm:block" />
      </div>
    </Card>
  );
}
