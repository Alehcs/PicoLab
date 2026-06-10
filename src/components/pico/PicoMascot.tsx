import type { CSSProperties } from 'react';

type PicoMascotProps = {
  size?: number;
  className?: string;
  style?: CSSProperties;
  decorative?: boolean;
};

export function PicoMascot({ size = 56, className, style, decorative = false }: PicoMascotProps) {
  return (
    <img
      src="/assets/pico-professor.png"
      width={size}
      height={size}
      alt={decorative ? '' : 'Pico, the African grey parrot learning coach'}
      className={`object-contain ${className ?? ''}`}
      style={{ flexShrink: 0, ...style }}
      aria-hidden={decorative ? 'true' : undefined}
    />
  );
}
