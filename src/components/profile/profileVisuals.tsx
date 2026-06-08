import {
  Award,
  Check,
  Edit3,
  FlaskConical,
  LineChart,
  Pencil,
  Route,
  ScanLine,
  Signal,
  Sparkles,
  Target,
  Zap,
  type LucideIcon,
} from 'lucide-react';

import type { Achievement, ActivityItem, ProfileStat } from '../../types/profile';

export type ProfileVariant = ProfileStat['variant'] | ActivityItem['variant'] | Achievement['variant'];

export const profileVariantStyles: Record<
  ProfileVariant,
  { bg: string; border: string; text: string; bar: string; shadow: string }
> = {
  blue: {
    bg: 'var(--pico-soft-blue)',
    border: 'var(--pico-blue-border)',
    text: '#2770C2',
    bar: 'var(--pico-blue)',
    shadow: 'rgba(74, 144, 226, 0.18)',
  },
  green: {
    bg: 'var(--pico-soft-green)',
    border: 'var(--pico-green-border)',
    text: '#2A7850',
    bar: 'var(--pico-green)',
    shadow: 'rgba(95, 191, 143, 0.18)',
  },
  coral: {
    bg: 'var(--pico-soft-coral)',
    border: 'var(--pico-coral-border)',
    text: '#BF3A3A',
    bar: 'var(--pico-coral)',
    shadow: 'rgba(244, 124, 124, 0.18)',
  },
  yellow: {
    bg: 'var(--pico-soft-yellow)',
    border: 'var(--pico-yellow-border)',
    text: '#886018',
    bar: 'var(--pico-yellow)',
    shadow: 'rgba(246, 200, 95, 0.2)',
  },
  purple: {
    bg: '#F3EEFF',
    border: '#DED0FF',
    text: '#6E55B8',
    bar: '#8B6FD4',
    shadow: 'rgba(139, 111, 212, 0.18)',
  },
  orange: {
    bg: '#FFF3E0',
    border: '#F5D3A5',
    text: '#A86017',
    bar: '#E8943A',
    shadow: 'rgba(232, 148, 58, 0.18)',
  },
  grey: {
    bg: 'var(--pico-soft)',
    border: 'var(--pico-border)',
    text: 'var(--pico-muted)',
    bar: '#C5CEC0',
    shadow: 'rgba(138, 145, 136, 0.14)',
  },
};

const icons: Record<
  ProfileStat['icon'] | Achievement['icon'] | ActivityItem['icon'] | 'check' | 'edit',
  LucideIcon
> = {
  award: Award,
  check: Check,
  edit: Pencil,
  flask: FlaskConical,
  graph: LineChart,
  route: Route,
  scan: ScanLine,
  signal: Signal,
  sparkle: Sparkles,
  target: Target,
  zap: Zap,
};

type ProfileIconProps = {
  name: keyof typeof icons;
  size?: number;
  color?: string;
  className?: string;
};

export function ProfileIcon({ name, size = 14, color = 'currentColor', className }: ProfileIconProps) {
  const Icon = icons[name] ?? Edit3;
  return <Icon size={size} color={color} className={className} aria-hidden="true" />;
}
