type ProgressBarProps = {
  value: number;
  max?: number;
  color?: string;
  label?: string;
};

export function ProgressBar({ value, max = 100, color, label }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));

  return (
    <div className="p-pbar-track" aria-label={label} role={label ? 'progressbar' : undefined}>
      <div
        className="p-pbar-fill"
        style={{
          width: `${pct}%`,
          background: color,
        }}
      />
    </div>
  );
}
