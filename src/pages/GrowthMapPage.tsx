import { MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GrowthSummaryCard } from '../components/growth/GrowthSummaryCard';
import { LearningSignalRow } from '../components/growth/LearningSignalRow';
import { SuggestedDirectionCard } from '../components/growth/SuggestedDirectionCard';
import { PageHeader } from '../components/layout/PageHeader';
import { AskPicoDrawer } from '../components/pico/AskPicoDrawer';
import { PicoMascot } from '../components/pico/PicoMascot';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Tabs, type TabItem } from '../components/ui/Tabs';
import {
  growthFilters,
  growthLearningSignals,
  growthMapPicoInsight,
  growthMapSuggestedDirection,
  growthMapSummaryCards,
  type GrowthFilter,
} from '../data/mockGrowth';

const filterTabs: Array<TabItem<GrowthFilter>> = growthFilters.map((filter) => ({
  label: filter.label,
  value: filter.value,
}));

export function GrowthMapPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<GrowthFilter>('week');
  const [askPicoOpen, setAskPicoOpen] = useState(false);

  const goToRoute = (route?: string) => {
    if (route) navigate(route);
  };

  return (
    <div className="p-fade">
      <PageHeader
        eyebrow="Learning analytics"
        title="Growth Map"
        subtitle="Pico turns repeated mistakes into learning signals you can improve."
        actions={
          <>
            <Tabs
              items={filterTabs}
              value={filter}
              onChange={setFilter}
              ariaLabel="Growth Map time range"
            />
            <Button variant="ghost" size="sm" onClick={() => setAskPicoOpen(true)}>
              <MessageCircle size={13} />
              Ask Pico
            </Button>
          </>
        }
      />

      <SuggestedDirectionCard
        title={growthMapSuggestedDirection.title}
        content={growthMapSuggestedDirection.content}
        cta={growthMapSuggestedDirection.cta}
        onContinue={() => navigate(growthMapSuggestedDirection.route)}
      />

      <div className="mb-7 grid gap-3.5 lg:grid-cols-3">
        {growthMapSummaryCards.map((card) => (
          <GrowthSummaryCard key={card.label} card={card} />
        ))}
      </div>

      <section className="mb-7">
        <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-[16px] font-extrabold tracking-[-0.02em] text-pico-text">
              Learning Signals
            </h2>
            <p className="mt-1 text-[12.5px] leading-relaxed text-pico-muted">
              Diagnosis only: repeated patterns, helpful next actions, and what Pico is noticing.
            </p>
          </div>
          <div className="text-[12px] font-semibold text-pico-muted">
            Showing {growthFilters.find((item) => item.value === filter)?.label}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {growthLearningSignals.map((signal) => (
            <LearningSignalRow key={signal.id} signal={signal} onAction={goToRoute} />
          ))}
        </div>
      </section>

      <Card className="px-5 py-5">
        <div className="flex items-start gap-4">
          <PicoMascot size={52} />
          <div>
            <div className="p-section-lbl mb-2">Pico insight</div>
            <p className="max-w-3xl text-[14px] leading-relaxed text-pico-secondary">
              {growthMapPicoInsight}
            </p>
          </div>
        </div>
      </Card>

      <AskPicoDrawer
        open={askPicoOpen}
        context="growth-map"
        onClose={() => setAskPicoOpen(false)}
      />
    </div>
  );
}
