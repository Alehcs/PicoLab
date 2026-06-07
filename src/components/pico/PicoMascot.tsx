import type { CSSProperties } from 'react';

type PicoMascotProps = {
  size?: number;
  className?: string;
  style?: CSSProperties;
};

export function PicoMascot({ size = 56, className, style }: PicoMascotProps) {
  return (
    <svg
      width={size}
      height={Math.round(size * 1.32)}
      viewBox="0 0 100 132"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ flexShrink: 0, ...style }}
      aria-hidden="true"
    >
      <path
        d="M41 102 C37 116 41 128 50 124 C59 128 63 116 59 102 Q54 112 50 110 Q46 112 41 102Z"
        fill="#D94F4F"
      />
      <path
        d="M50 110 L50 124"
        stroke="#B02828"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M44 107 C42 115 46 121 50 124"
        stroke="#B02828"
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
        opacity="0.5"
      />
      <path
        d="M56 107 C58 115 54 121 50 124"
        stroke="#B02828"
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
        opacity="0.5"
      />

      <ellipse cx="50" cy="79" rx="22" ry="25" fill="#7C8C7A" />
      <ellipse cx="50" cy="84" rx="12" ry="15" fill="#8C9C8A" opacity="0.5" />
      <path d="M30 70 C28 82 30 95 32 103" stroke="#62726A" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M70 70 C72 82 70 95 68 103" stroke="#62726A" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M33 75 C31 85 32 93 34 100" stroke="#7C8C7A" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6" />
      <path d="M67 75 C69 85 68 93 66 100" stroke="#7C8C7A" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6" />

      <ellipse cx="50" cy="56" rx="14" ry="12" fill="#8A9A88" />

      <g transform="rotate(-5, 50, 37)">
        <circle cx="50" cy="37" r="21" fill="#8A9A88" />
        <path
          d="M35 38 C35 26 42 19 50 19 C58 19 65 26 65 38 C65 47 58 54 50 56 C42 54 35 47 35 38Z"
          fill="#BFC9BC"
        />
        <ellipse cx="50" cy="40" rx="10" ry="9" fill="#CED6CB" />
        <circle cx="58" cy="32" r="8.5" fill="#DCE6D9" />
        <circle cx="58" cy="32" r="5.8" fill="#181C16" className="pico-eye" />
        <circle cx="58" cy="32" r="3.2" fill="#0A0C08" />
        <circle cx="60.5" cy="29.5" r="2.4" fill="rgba(255,255,255,0.96)" />
        <circle cx="56.5" cy="34" r="1.1" fill="rgba(255,255,255,0.28)" />
        <ellipse cx="43" cy="33" rx="3" ry="4" fill="#DCE6D9" opacity="0.38" />
        <circle cx="43" cy="34" r="2.5" fill="#181C16" opacity="0.35" />
        <path d="M46 44 Q50 41 54 44 Q53 52 50 54 Q47 52 46 44Z" fill="#38362C" />
        <path d="M47.5 50 Q50 55 52.5 50 L50 54Z" fill="#28261C" />
        <circle cx="48.5" cy="46" r="1.3" fill="rgba(0,0,0,0.22)" />
        <path
          d="M46 18 C45 12 49 9 50 16 C51 9 55 12 54 18"
          stroke="#8A9A88"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
