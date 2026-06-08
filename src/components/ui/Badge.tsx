import type { HTMLAttributes, ReactNode } from 'react';

export type BadgeVariant = 'blue' | 'green' | 'coral' | 'yellow' | 'grey';

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  variant?: BadgeVariant;
};

export function Badge({ children, variant = 'grey', className = '', ...props }: BadgeProps) {
  return (
    <span className={`p-badge p-badge-${variant} ${className}`.trim()} {...props}>
      {children}
    </span>
  );
}
