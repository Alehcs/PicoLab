import { Badge, type BadgeVariant } from '../ui/Badge';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import type { SubjectProgress, SubjectStatus } from '../../types/profile';

const subjectStatusStyles: Record<SubjectStatus, { badge: BadgeVariant; bar: string }> = {
  Strong: { badge: 'green', bar: 'var(--pico-green)' },
  Improving: { badge: 'blue', bar: 'var(--pico-blue)' },
  Practicing: { badge: 'yellow', bar: 'var(--pico-yellow)' },
  'Next focus': { badge: 'grey', bar: '#C5CEC0' },
};

type SubjectFocusCardProps = {
  subject: SubjectProgress;
};

export function SubjectFocusCard({ subject }: SubjectFocusCardProps) {
  const styles = subjectStatusStyles[subject.status];

  return (
    <Card className="px-3.5 py-3">
      <div className="mb-2 text-[13px] font-semibold leading-snug text-pico-text">{subject.name}</div>
      <ProgressBar value={subject.progress} color={styles.bar} label={`${subject.name} progress`} />
      <div className="mt-2 flex items-center justify-between gap-2">
        <Badge variant={styles.badge}>{subject.status}</Badge>
        <span className="text-[11px] font-semibold text-pico-muted">{subject.progress}%</span>
      </div>
    </Card>
  );
}
