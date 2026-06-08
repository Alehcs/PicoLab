import type { Achievement } from '../../types/profile';
import { ProfileIcon, profileVariantStyles } from './profileVisuals';

type AchievementBadgeCardProps = {
  achievement: Achievement;
};

export function AchievementBadgeCard({ achievement }: AchievementBadgeCardProps) {
  const styles = profileVariantStyles[achievement.variant];

  return (
    <div
      className={`flex min-h-[126px] flex-col items-center gap-2 rounded-[13px] px-2 py-3 text-center ${
        achievement.unlocked ? '' : 'opacity-65'
      }`}
      style={{ background: styles.bg }}
    >
      <div
        className="flex h-9 w-9 items-center justify-center rounded-full"
        style={{
          background: achievement.unlocked ? 'white' : 'var(--pico-border)',
          boxShadow: achievement.unlocked ? `0 2px 8px ${styles.shadow}` : undefined,
        }}
      >
        <ProfileIcon name={achievement.icon} size={16} color={styles.text} />
      </div>
      <div className="text-[11px] font-semibold leading-snug text-pico-text">{achievement.name}</div>
      <span
        className="text-[9.5px] font-bold uppercase leading-tight tracking-[0.05em]"
        style={{ color: styles.text }}
      >
        {achievement.category}
      </span>
    </div>
  );
}
