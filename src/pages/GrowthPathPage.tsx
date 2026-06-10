import { FlaskConical, Map, Target } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CurrentGoalCard } from '../components/growth/CurrentGoalCard';
import { GrowthPathStep } from '../components/growth/GrowthPathStep';
import { RoadmapProgressCard } from '../components/growth/RoadmapProgressCard';
import { PageHeader } from '../components/layout/PageHeader';
import { AskPicoButton } from '../components/pico/AskPicoButton';
import { AskPicoDrawer } from '../components/pico/AskPicoDrawer';
import { PicoMascot } from '../components/pico/PicoMascot';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import {
  currentGrowthGoal,
  growthPathPicoPlan,
  growthPathProgress,
  growthPathSteps,
  type GrowthPathStepData,
  recommendedGrowthStep,
} from '../data/mockGrowth';
import {
  getPrioritizedDiagnosticSignals,
  getSuggestedGrowthFocusFromSignals,
  readLearningProgress,
} from '../services/learningProgress';
import { picolabApi } from '../services/picolabApi';
import { storeVisualLabSuggestionFromSignals } from '../services/visualLabSuggestion';
import type { GrowthPathResponse } from '../types/api';

const localGrowthPath: GrowthPathResponse = {
  currentGoal: currentGrowthGoal.value,
  progressPercent: growthPathProgress.percent,
  recommendedFocus: recommendedGrowthStep.skill,
  steps: growthPathSteps.map((step) => ({
    id: step.id,
    title: step.title,
    status:
      step.status === 'recommended' ? 'recommended' : step.status === 'up-next' ? 'upNext' : 'later',
    reason: step.reason,
    items: step.items,
    route: step.route,
  })),
  picoPlan: growthPathPicoPlan,
};

const toStepData = (step: GrowthPathResponse['steps'][number], index: number): GrowthPathStepData => {
  const status =
    step.status === 'recommended'
      ? 'recommended'
      : step.status === 'upNext'
        ? 'up-next'
        : 'later';

  return {
    id: step.id,
    stepLabel: `Step ${index + 1}`,
    title: step.title,
    badge: status === 'recommended' ? 'Recommended' : status === 'up-next' ? 'Up next' : 'Later',
    status,
    reason: step.reason,
    items: step.items,
    metadata: [
      index === 0 ? '5 min' : '7 min',
      status === 'recommended' ? 'Practice' : 'Visual + practice',
      step.title.includes('Algebra') ? 'Algebra' : 'Kinematics',
    ],
    cta: status === 'recommended' ? 'Start' : status === 'up-next' ? 'Preview' : 'Save for later',
    route: step.route,
  };
};

export function GrowthPathPage() {
  const navigate = useNavigate();
  const [askPicoOpen, setAskPicoOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [growthPath, setGrowthPath] = useState(localGrowthPath);
  const [localProgress] = useState(() => readLearningProgress());
  const [diagnosticSignals] = useState(() => getPrioritizedDiagnosticSignals(4));

  useEffect(() => {
    let isMounted = true;

    const loadGrowthPath = async () => {
      setLoading(true);

      try {
        const result = await picolabApi.getGrowthPath();

        if (isMounted && result.ok) {
          setGrowthPath(result.data);
        }
      } catch {
        if (import.meta.env?.DEV) {
          console.warn('Roadmap backend unavailable; using local fallback.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadGrowthPath();

    return () => {
      isMounted = false;
    };
  }, []);

  const pathProgress = Math.min(
    100,
    Math.max(growthPath.progressPercent, growthPathProgress.percent) +
      Math.min(localProgress.completedMissionIds.length, 3),
  );
  const roadmapSteps = useMemo(
    () => growthPath.steps.map(toStepData),
    [growthPath.steps],
  );
  const recommendedStep = roadmapSteps[0] ?? growthPathSteps[0];
  const diagnosticFocus = useMemo(
    () => getSuggestedGrowthFocusFromSignals(diagnosticSignals),
    [diagnosticSignals],
  );
  const recommendedFocus = diagnosticFocus ?? growthPath.recommendedFocus;

  const regeneratePath = async () => {
    if (regenerating) return;

    setRegenerating(true);

    try {
      const result = await picolabApi.regenerateGrowthPath({ goal: growthPath.currentGoal });

      if (result.ok) {
        setGrowthPath(result.data);
      }
    } catch {
      if (import.meta.env?.DEV) {
        console.warn('Roadmap regenerate unavailable; keeping local roadmap.');
      }
    } finally {
      setRegenerating(false);
    }
  };

  const goToRoute = (route?: string) => {
    if (route === '/visual-lab') {
      storeVisualLabSuggestionFromSignals(diagnosticSignals);
    }
    if (route) navigate(route);
  };

  const openVisualLesson = () => {
    storeVisualLabSuggestionFromSignals(diagnosticSignals);
    navigate('/visual-lab');
  };

  return (
    <div className="p-fade">
      <PageHeader
        eyebrow="Personalized roadmap"
        title="Roadmap"
        subtitle="A personalized path built from your learning signals."
        actions={
          <>
            <Button onClick={() => navigate('/practice-missions')}>
              <Target size={15} />
              Start current focus
            </Button>
            <Button variant="secondary" onClick={() => navigate('/growth-map')}>
              <Map size={15} />
              Review Growth Map
            </Button>
          </>
        }
      />

      <div className="mb-5">
        <CurrentGoalCard
          title={currentGrowthGoal.title}
          value={growthPath.currentGoal}
          copy={currentGrowthGoal.copy}
          onEditGoal={regeneratePath}
          editing={regenerating}
        />
      </div>

      {loading ? (
        <Card variant="blue" className="mb-5 px-4 py-3">
          <span className="text-[13px] font-bold text-[#2A60A8]">
            Pico is refreshing your roadmap...
          </span>
        </Card>
      ) : null}

      <div className="mb-7">
        <RoadmapProgressCard
          percent={pathProgress}
          label={`${pathProgress}% of current roadmap completed`}
          detail={
            localProgress.completedMissionIds.length
              ? 'Progress updated from recent practice.'
              : growthPathProgress.detail
          }
        >
          <Badge variant="blue">{recommendedGrowthStep.title}</Badge>
          {diagnosticSignals.length ? (
            <Badge variant="green">Recommended from recent signals</Badge>
          ) : null}
          {localProgress.completedMissionIds.length ? (
            <Badge variant="green">Practice progress synced</Badge>
          ) : null}
          <h2 className="mt-3 text-[21px] font-extrabold tracking-[-0.025em] text-pico-text">
            {recommendedFocus}
          </h2>
          <p className="mt-2 max-w-2xl text-[13.5px] leading-relaxed text-pico-secondary">
            {recommendedStep.reason}
          </p>
          <div className="mt-4 rounded-xl bg-pico-softBlue px-4 py-3">
            <div className="text-[12px] font-bold text-[#2A60A8]">Why this matters</div>
            <p className="mt-1 text-[13px] leading-relaxed text-[#2A60A8]">
              {growthPath.picoPlan}
            </p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button onClick={() => navigate('/practice-missions')}>
              <Target size={14} />
              Start practice mission
            </Button>
            <Button variant="secondary" onClick={openVisualLesson}>
              <FlaskConical size={14} />
              Open visual lesson
            </Button>
          </div>
        </RoadmapProgressCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
        <section className="min-w-0">
          <div className="mb-4">
            <h2 className="text-[16px] font-extrabold tracking-[-0.02em] text-pico-text">
              Your roadmap
            </h2>
            <p className="mt-1 text-[12.5px] leading-relaxed text-pico-muted">
              Start with the focus area that gives the clearest next step, then build outward.
            </p>
          </div>

          <div>
            {roadmapSteps.map((step, index) => (
              <GrowthPathStep
                key={step.id}
                step={step}
                isLast={index === roadmapSteps.length - 1}
                onAction={goToRoute}
              />
            ))}
          </div>
        </section>

        <aside className="min-w-0">
          <Card className="px-4 py-5">
            <div className="p-pico-coach-stack">
              <PicoMascot size={132} className="max-w-[78%]" />
              <div className="p-speech-bubble w-full px-4 py-3.5 text-[13px] leading-relaxed text-pico-secondary">
                <div className="p-section-lbl mb-1.5">Pico Roadmap</div>
                {growthPath.picoPlan}
              </div>
              <div className="mt-3">
                <AskPicoButton fullWidth onClick={() => setAskPicoOpen(true)} />
              </div>
            </div>
          </Card>
        </aside>
      </div>

      <AskPicoDrawer
        open={askPicoOpen}
        context="growth-path"
        onClose={() => setAskPicoOpen(false)}
      />
    </div>
  );
}
