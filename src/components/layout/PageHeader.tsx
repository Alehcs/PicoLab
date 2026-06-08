import type { ReactNode } from 'react';

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
};

export function PageHeader({ eyebrow, title, subtitle, actions }: PageHeaderProps) {
  return (
    <header className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:gap-5">
      <div>
        {eyebrow ? <div className="p-section-lbl mb-1.5">{eyebrow}</div> : null}
        <h1 className="text-[22px] font-extrabold leading-tight tracking-[-0.03em] text-pico-text">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-1.5 max-w-xl text-[13.5px] leading-relaxed text-pico-secondary">{subtitle}</p>
        ) : null}
      </div>
      {actions ? <div className="mt-0.5 flex max-w-full shrink-0 flex-wrap gap-2">{actions}</div> : null}
    </header>
  );
}
