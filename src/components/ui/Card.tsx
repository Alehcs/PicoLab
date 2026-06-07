import type { HTMLAttributes, ReactNode } from 'react';

type CardVariant = 'default' | 'soft' | 'signal' | 'hint' | 'progress' | 'blue';

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  variant?: CardVariant;
};

const variantClass: Record<CardVariant, string> = {
  default: 'p-card',
  soft: 'p-card-soft',
  signal: 'p-card-signal',
  hint: 'p-card-hint',
  progress: 'p-card-progress',
  blue: 'p-card-blue',
};

export function Card({ children, variant = 'default', className = '', ...props }: CardProps) {
  return (
    <div className={`${variantClass[variant]} ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}
