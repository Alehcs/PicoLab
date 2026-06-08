import { FlaskConical, Map } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NotebookStepCard } from '../components/notebook/NotebookStepCard';
import { PicoCoachPanel } from '../components/notebook/PicoCoachPanel';
import { ProblemContextPanel } from '../components/notebook/ProblemContextPanel';
import { AskPicoDrawer } from '../components/pico/AskPicoDrawer';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import {
  mockNotebookProblem,
  mockNotebookSteps,
  mockPatternInsight,
  mockPicoCoach,
} from '../data/mockNotebook';

export function SmartNotebookPage() {
  const navigate = useNavigate();
  const [askPicoOpen, setAskPicoOpen] = useState(false);

  const openVisualLab = () => navigate('/visual-lab');
  const viewGrowthMap = () => navigate('/growth-map');
  const viewGrowthPath = () => navigate('/growth-path');

  return (
    <div className="p-fade">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="p-section-lbl mb-1.5">{mockNotebookProblem.eyebrow}</div>
          <h1 className="text-[22px] font-extrabold leading-tight tracking-[-0.03em] text-pico-text">
            {mockNotebookProblem.title}
          </h1>
          <div className="mt-3 flex max-w-[330px] items-center gap-3">
            <div className="p-section-lbl">Progress</div>
            <Badge variant="green">{mockNotebookProblem.progressLabel}</Badge>
            <div className="min-w-[88px] flex-1">
              <ProgressBar
                value={mockNotebookProblem.progressValue}
                max={mockNotebookProblem.progressMax}
                label="Smart Notebook progress"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={openVisualLab}>
            <FlaskConical size={15} />
            Open Visual Lab
          </Button>
          <Button variant="secondary" onClick={viewGrowthMap}>
            <Map size={15} />
            View Growth Map
          </Button>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[240px_minmax(0,1fr)_260px]">
        <aside className="min-w-0">
          <ProblemContextPanel problem={mockNotebookProblem} />
        </aside>

        <section className="min-w-0">
          <div className="mb-4">
            <h2 className="text-[20px] font-extrabold tracking-[-0.03em] text-pico-text">
              Solve step by step
            </h2>
            <p className="mt-1 text-[13px] leading-relaxed text-pico-muted">
              Work through each step. Pico will catch small details as learning signals.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {mockNotebookSteps.map((step) => (
              <NotebookStepCard key={step.id} step={step} onOpenVisual={openVisualLab} />
            ))}
          </div>
        </section>

        <aside className="min-w-0">
          <PicoCoachPanel
            title={mockPicoCoach.title}
            message={mockPicoCoach.message}
            patternInsight={mockPatternInsight}
            onReviewPattern={viewGrowthMap}
            onViewGrowthPath={viewGrowthPath}
            onAskPico={() => setAskPicoOpen(true)}
          />
        </aside>
      </div>

      <AskPicoDrawer
        open={askPicoOpen}
        context="notebook"
        onClose={() => setAskPicoOpen(false)}
      />
    </div>
  );
}
