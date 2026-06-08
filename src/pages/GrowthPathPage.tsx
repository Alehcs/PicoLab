import { FlaskConical, Map, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CurrentGoalCard } from '../components/growth/CurrentGoalCard';
import { GrowthPathStep } from '../components/growth/GrowthPathStep';
import { RoadmapProgressCard } from '../components/growth/RoadmapProgressCard';
import { PageHeader } from '../components/layout/PageHeader';
import { PicoMascot } from '../components/pico/PicoMascot';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import {
  currentGrowthGoal,
  growthPathPicoPlan,
  growthPathProgress,
  growthPathSteps,
  recommendedGrowthStep,
} from '../data/mockGrowth';

export function GrowthPathPage() {
  const navigate = useNavigate();

  const goToRoute = (route?: string) => {
    if (route) navigate(route);
  };

  return (
    <div className="p-fade">
      <PageHeader
        eyebrow="Personalized roadmap"
        title="Growth Path"
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
          value={currentGrowthGoal.value}
          copy={currentGrowthGoal.copy}
        />
      </div>

      <div className="mb-7">
        <RoadmapProgressCard
          percent={growthPathProgress.percent}
          label={growthPathProgress.label}
          detail={growthPathProgress.detail}
        >
          <Badge variant="blue">{recommendedGrowthStep.title}</Badge>
          <h2 className="mt-3 text-[21px] font-extrabold tracking-[-0.025em] text-pico-text">
            {recommendedGrowthStep.skill}
          </h2>
          <p className="mt-2 max-w-2xl text-[13.5px] leading-relaxed text-pico-secondary">
            {recommendedGrowthStep.text}
          </p>
          <div className="mt-4 rounded-xl bg-pico-softBlue px-4 py-3">
            <div className="text-[12px] font-bold text-[#2A60A8]">Why this matters</div>
            <p className="mt-1 text-[13px] leading-relaxed text-[#2A60A8]">
              {recommendedGrowthStep.why}
            </p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button onClick={() => navigate('/practice-missions')}>
              <Target size={14} />
              Start practice mission
            </Button>
            <Button variant="secondary" onClick={() => navigate('/visual-lab')}>
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
            {growthPathSteps.map((step, index) => (
              <GrowthPathStep
                key={step.id}
                step={step}
                isLast={index === growthPathSteps.length - 1}
                onAction={goToRoute}
              />
            ))}
          </div>
        </section>

        <aside className="min-w-0">
          <Card className="px-4 py-5">
            <div className="flex flex-col items-center gap-1.5 border-b border-pico-border pb-4">
              <PicoMascot size={54} />
              <div className="text-[11px] font-bold uppercase tracking-[0.06em] text-pico-muted">
                Pico
              </div>
            </div>
            <div className="mt-4">
              <div className="text-[13.5px] font-bold text-pico-secondary">Pico plan</div>
              <div className="p-speech-bubble mt-2 px-3.5 py-3 text-[13px] leading-relaxed text-pico-secondary">
                {growthPathPicoPlan}
              </div>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
