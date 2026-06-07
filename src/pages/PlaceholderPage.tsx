import type { ReactNode } from 'react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { FormulaBlock } from '../components/math/FormulaBlock';
import { PicoNote } from '../components/pico/PicoNote';
import { PageHeader } from '../components/layout/PageHeader';

type PlaceholderPageProps = {
  eyebrow?: string;
  title: string;
  subtitle: string;
  badge?: string;
  children?: ReactNode;
};

export function PlaceholderPage({
  eyebrow,
  title,
  subtitle,
  badge = 'Phase 1 foundation',
  children,
}: PlaceholderPageProps) {
  return (
    <div className="p-fade">
      <PageHeader eyebrow={eyebrow} title={title} subtitle={subtitle} />

      <Card className="mb-5 overflow-hidden">
        <div className="relative bg-white px-7 py-7">
          <div className="pointer-events-none absolute right-7 top-6 select-none text-[42px] font-bold tracking-[-0.02em] text-[rgba(74,144,226,0.07)]">
            <FormulaBlock size="lg">v = v0 + at</FormulaBlock>
          </div>
          <Badge variant="blue" className="mb-3">
            {badge}
          </Badge>
          <h2 className="max-w-lg text-[21px] font-extrabold leading-tight tracking-[-0.03em] text-pico-text">
            Preserving the Claude design language.
          </h2>
          <p className="mt-2 max-w-xl text-[13.5px] leading-[1.7] text-pico-secondary">
            This page is intentionally a placeholder. The production migration starts with shared
            tokens, routing, layout, and reusable UI components before the full page content is moved.
          </p>
          <div className="mt-5 flex flex-wrap gap-2.5">
            <Button>Primary action</Button>
            <Button variant="secondary">Secondary action</Button>
          </div>
        </div>
      </Card>

      <div className="grid gap-3 md:grid-cols-3">
        <Card variant="hint" className="px-5 py-4">
          <div className="p-section-lbl mb-2 text-[#886018]">Learning signal</div>
          <div className="text-sm font-bold text-[#886018]">Mistakes become data</div>
          <p className="mt-1 text-xs leading-relaxed text-[#886018] opacity-80">
            The signal loop remains the central product idea.
          </p>
        </Card>
        <Card variant="signal" className="px-5 py-4">
          <div className="p-section-lbl mb-2 text-[#BF3A3A]">Current focus</div>
          <div className="text-sm font-bold text-[#BF3A3A]">Unit reasoning</div>
          <p className="mt-1 text-xs leading-relaxed text-[#BF3A3A] opacity-80">
            The visual style keeps Pico calm, useful, and specific.
          </p>
        </Card>
        <Card variant="blue" className="px-5 py-4">
          <div className="p-section-lbl mb-2 text-[#2770C2]">Design token</div>
          <div className="text-sm font-bold text-[#2770C2]">Route ready</div>
          <div className="mt-3">
            <ProgressBar value={65} color="#4A90E2" label={`${title} setup progress`} />
          </div>
        </Card>
      </div>

      <div className="mt-5">
        <PicoNote>
          Pico remains contextual and secondary. The Ask Pico drawer exists as a component, but this
          phase does not make the app chat-first.
        </PicoNote>
      </div>

      {children}
    </div>
  );
}
