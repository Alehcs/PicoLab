import { MessageCircle } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
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
  type GrowthSignal,
  type GrowthSummaryCardData,
  type GrowthFilter,
} from '../data/mockGrowth';
import {
  getPrioritizedDiagnosticSignals,
  getSuggestedGrowthFocusFromSignals,
  mergeGrowthMapWithLocalProgress,
} from '../services/learningProgress';
import { picolabApi } from '../services/picolabApi';
import { storeVisualLabSuggestionFromSignals } from '../services/visualLabSuggestion';
import type { GrowthMapResponse, LearningSignal } from '../types/api';

const filterTabs: Array<TabItem<GrowthFilter>> = growthFilters.map((filter) => ({
  label: filter.label,
  value: filter.value,
}));

const localGrowthMap: GrowthMapResponse = {
  mainFocus: growthMapSummaryCards[0].title,
  strongestSkill: growthMapSummaryCards[1].title,
  nextOpportunity: growthMapSummaryCards[2].title,
  learningSignals: growthLearningSignals.map((signal) => ({
    id: signal.id,
    kind:
      signal.id.startsWith('algebra.')
        ? 'signSlip'
        : signal.id.startsWith('concept.')
          ? 'quantityConfusion'
          : 'unitMismatch',
    title: signal.title,
    description: signal.description,
    strength: signal.strength,
    suggestedFocus: signal.bestNextAction.label,
  })),
  picoInsight: growthMapPicoInsight,
};

const toSummaryCards = (growthMap: GrowthMapResponse): GrowthSummaryCardData[] => [
  {
    ...growthMapSummaryCards[0],
    title: growthMap.mainFocus,
  },
  {
    ...growthMapSummaryCards[1],
    title: growthMap.strongestSkill,
  },
  {
    ...growthMapSummaryCards[2],
    title: growthMap.nextOpportunity,
  },
];

const signalActionByKind: Record<LearningSignal['kind'], GrowthSignal['bestNextAction']> = {
  unitMismatch: { label: 'Practice units', route: '/practice-missions' },
  signSlip: { label: 'Practice algebra steps', route: '/practice-missions' },
  quantityConfusion: { label: 'Open visual comparison', route: '/visual-lab' },
  formulaSelection: { label: 'Review Roadmap', route: '/growth-path' },
  reasoningGap: { label: 'Open Smart Notebook', route: '/smart-notebook' },
  graphReading: { label: 'Open visual lesson', route: '/visual-lab' },
};

const signalVariantByKind: Record<LearningSignal['kind'], GrowthSignal['variant']> = {
  unitMismatch: 'coral',
  signSlip: 'yellow',
  quantityConfusion: 'blue',
  formulaSelection: 'green',
  reasoningGap: 'yellow',
  graphReading: 'blue',
};

const toGrowthSignal = (signal: LearningSignal): GrowthSignal => ({
  id: signal.id,
  title: signal.studentFriendlyLabel ?? signal.title,
  badge: signal.id.startsWith('local-') ? 'Improving' : `Seen ${signal.strength} times`,
  description: signal.description,
  whyItMatters:
    signal.id.startsWith('local-')
      ? 'Recent practice progress shows this signal is moving.'
      : undefined,
  bestNextAction: signalActionByKind[signal.kind],
  variant: signal.id.startsWith('local-') ? 'green' : signalVariantByKind[signal.kind],
  strength: signal.strength,
});

export function GrowthMapPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<GrowthFilter>('week');
  const [askPicoOpen, setAskPicoOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [growthMap, setGrowthMap] = useState(() => mergeGrowthMapWithLocalProgress(localGrowthMap));

  useEffect(() => {
    let isMounted = true;

    const loadGrowthMap = async () => {
      setLoading(true);

      try {
        const result = await picolabApi.getGrowthMap();

        if (isMounted && result.ok) {
          setGrowthMap(mergeGrowthMapWithLocalProgress(result.data));
        }
      } catch {
        if (import.meta.env?.DEV) {
          console.warn('Growth Map backend unavailable; using local fallback.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadGrowthMap();

    return () => {
      isMounted = false;
    };
  }, []);

  const summaryCards = useMemo(() => toSummaryCards(growthMap), [growthMap]);
  const learningSignals = useMemo(
    () => growthMap.learningSignals.map(toGrowthSignal),
    [growthMap.learningSignals],
  );
  const prioritizedSignals = useMemo(() => getPrioritizedDiagnosticSignals(4), []);
  const diagnosticFocus = useMemo(
    () => getSuggestedGrowthFocusFromSignals(prioritizedSignals),
    [prioritizedSignals],
  );

  const goToRoute = (route?: string) => {
    if (route === '/visual-lab') {
      storeVisualLabSuggestionFromSignals(prioritizedSignals);
    }
    if (route) navigate(route);
  };

  return (
    <div className="p-fade">
      <PageHeader
        eyebrow="Learning analytics"
        title="Growth Map"
        subtitle="Pico turns repeated patterns into learning signals you can improve."
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
        content={`Based on your recent learning signals, your best next focus is ${diagnosticFocus ?? growthMap.mainFocus}.`}
        cta={growthMapSuggestedDirection.cta}
        onContinue={() => navigate(growthMapSuggestedDirection.route)}
      />

      {loading ? (
        <Card variant="blue" className="mb-5 px-4 py-3">
          <span className="text-[13px] font-bold text-[#2A60A8]">
            Pico is reviewing your learning signals...
          </span>
        </Card>
      ) : null}

      <div className="mb-7 grid gap-3.5 lg:grid-cols-3">
        {summaryCards.map((card) => (
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
          {learningSignals.map((signal) => (
            <LearningSignalRow key={signal.id} signal={signal} onAction={goToRoute} />
          ))}
        </div>
      </section>

      <Card className="px-5 py-5">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <PicoMascot size={118} className="max-w-[150px] sm:max-w-[118px]" />
          <div className="p-speech-bubble p-speech-bubble-responsive-left min-w-0 flex-1 px-4 py-3.5">
            <div className="p-section-lbl mb-2">Pico insight</div>
            <p className="text-[14px] leading-relaxed text-pico-secondary">
              {growthMap.picoInsight}
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
