import { ArrowRight, Check, Signal } from 'lucide-react';
import type { GrowthSummaryCardData } from '../../data/mockGrowth';
import { Card } from '../ui/Card';

type GrowthSummaryCardProps = {
  card: GrowthSummaryCardData;
};

const variantClasses = {
  signal: {
    card: 'border-pico-coral/25 bg-pico-softCoral',
    icon: 'text-[#BF3A3A]',
    title: 'text-[#9A2A2A]',
  },
  progress: {
    card: 'border-pico-green/30 bg-pico-softGreen',
    icon: 'text-[#2A7850]',
    title: 'text-[#1A5838]',
  },
  blue: {
    card: 'border-[#B8D8F4] bg-pico-softBlue',
    icon: 'text-[#2770C2]',
    title: 'text-[#1A508A]',
  },
};

const icons = {
  signal: Signal,
  progress: Check,
  blue: ArrowRight,
};

export function GrowthSummaryCard({ card }: GrowthSummaryCardProps) {
  const classes = variantClasses[card.variant];
  const Icon = icons[card.variant];

  return (
    <Card className={`${classes.card} px-5 py-5`}>
      <div className="mb-2.5 flex items-center gap-2">
        <Icon size={15} className={classes.icon} aria-hidden="true" />
        <div className={`p-section-lbl ${classes.icon}`}>{card.label}</div>
      </div>
      <div className={`text-[16px] font-extrabold tracking-[-0.02em] ${classes.title}`}>
        {card.title}
      </div>
      <p className={`mt-1.5 text-[12.5px] leading-relaxed ${classes.title}`}>
        {card.description}
      </p>
    </Card>
  );
}
