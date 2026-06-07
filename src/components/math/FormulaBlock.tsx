import type { HTMLAttributes, ReactNode } from 'react';

type FormulaBlockProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  muted?: boolean;
};

const sizeClass = {
  sm: 'text-[13px]',
  md: 'text-[16px]',
  lg: 'text-[20px]',
};

export function FormulaBlock({
  children,
  size = 'md',
  muted = false,
  className = '',
  ...props
}: FormulaBlockProps) {
  return (
    <span
      className={`p-mono inline-flex leading-relaxed ${sizeClass[size]} ${
        muted ? 'text-pico-muted' : 'text-pico-text'
      } ${className}`.trim()}
      {...props}
    >
      {children}
    </span>
  );
}
