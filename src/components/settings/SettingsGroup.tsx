import type { ReactNode } from 'react';

import { Card } from '../ui/Card';

type SettingsGroupProps = {
  title: string;
  children: ReactNode;
};

type SettingsRowProps = {
  label: string;
  description?: string;
  control: ReactNode;
  stacked?: boolean;
  isLast?: boolean;
};

export function SettingsGroup({ title, children }: SettingsGroupProps) {
  return (
    <section>
      <div className="p-section-lbl mb-2.5">{title}</div>
      <Card className="overflow-hidden">{children}</Card>
    </section>
  );
}

export function SettingsRow({
  label,
  description,
  control,
  stacked = false,
  isLast = false,
}: SettingsRowProps) {
  if (stacked) {
    return (
      <div className={`px-5 py-3.5 ${isLast ? '' : 'border-b border-pico-soft'}`}>
        <div className="mb-2.5">
          <div className="text-[13.5px] font-medium leading-snug text-pico-text">{label}</div>
          {description ? (
            <div className="mt-1 text-[12.5px] leading-relaxed text-pico-muted">{description}</div>
          ) : null}
        </div>
        {control}
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-between gap-4 px-5 py-3.5 ${
        isLast ? '' : 'border-b border-pico-soft'
      }`}
    >
      <div className="min-w-0 flex-1">
        <div className="text-[13.5px] font-medium leading-snug text-pico-text">{label}</div>
        {description ? (
          <div className="mt-1 text-[12.5px] leading-relaxed text-pico-muted">{description}</div>
        ) : null}
      </div>
      <div className="shrink-0">{control}</div>
    </div>
  );
}
