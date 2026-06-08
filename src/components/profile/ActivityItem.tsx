import type { ActivityItem as ActivityItemType } from '../../types/profile';
import { ProfileIcon, profileVariantStyles } from './profileVisuals';

type ActivityItemProps = {
  activity: ActivityItemType;
  isLast?: boolean;
};

export function ActivityItem({ activity, isLast = false }: ActivityItemProps) {
  const styles = profileVariantStyles[activity.variant];

  return (
    <div
      className={`flex items-center gap-3.5 px-1 py-3 ${isLast ? '' : 'border-b border-pico-border'}`}
    >
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px]"
        style={{ background: styles.bg }}
      >
        <ProfileIcon name={activity.icon} size={14} color={styles.text} />
      </div>
      <div className="min-w-0">
        <div className="text-[12px] leading-snug text-pico-muted">{activity.label}</div>
        <div className="mt-0.5 text-[13.5px] font-semibold leading-snug text-pico-text">
          {activity.detail}
        </div>
      </div>
    </div>
  );
}
