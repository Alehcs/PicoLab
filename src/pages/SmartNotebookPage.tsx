import { FlaskConical, Map } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NotebookStepCard } from '../components/notebook/NotebookStepCard';
import { PicoCoachPanel } from '../components/notebook/PicoCoachPanel';
import { ProblemContextPanel } from '../components/notebook/ProblemContextPanel';
import { AskPicoDrawer } from '../components/pico/AskPicoDrawer';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import {
  mockNotebookProblem,
  mockNotebookSteps,
  mockPatternInsight,
  mockPicoCoach,
  type NotebookProblem,
} from '../data/mockNotebook';
import { picolabApi } from '../services/picolabApi';
import { readCurrentProblem } from '../services/problemSession';
import type { ProblemEntity, StepCheckResponse } from '../types/api';

const createProblemFromEntity = (problem: ProblemEntity | null): NotebookProblem => {
  if (!problem) return mockNotebookProblem;

  const knownValues = problem.extractedDetails
    .filter((detail) => detail.kind === 'given')
    .slice(0, 4)
    .map((detail) => ({
      label: detail.unit ? `${detail.value} ${detail.unit}` : detail.value,
      description: detail.label,
    }));

  return {
    ...mockNotebookProblem,
    eyebrow: `${problem.subject === 'physics' ? 'Physics' : 'Math'} · ${problem.topic}`,
    statement: problem.statement,
    knownValues: knownValues.length ? knownValues : mockNotebookProblem.knownValues,
    suggestedFormula: problem.suggestedFormula ?? mockNotebookProblem.suggestedFormula,
  };
};

export function SmartNotebookPage() {
  const navigate = useNavigate();
  const [askPicoOpen, setAskPicoOpen] = useState(false);
  const [currentProblem, setCurrentProblem] = useState<ProblemEntity | null>(null);
  const [checkPending, setCheckPending] = useState(false);
  const [stepCheckResult, setStepCheckResult] = useState<StepCheckResponse | null>(null);

  useEffect(() => {
    setCurrentProblem(readCurrentProblem());
  }, []);

  const notebookProblem = useMemo(
    () => createProblemFromEntity(currentProblem),
    [currentProblem],
  );

  const openVisualLab = () => navigate('/visual-lab');
  const viewGrowthMap = () => navigate('/growth-map');
  const viewGrowthPath = () => navigate('/growth-path');

  const checkCurrentStep = async () => {
    if (checkPending) return;

    setCheckPending(true);

    try {
      const result = await picolabApi.checkStep({
        problemId: currentProblem?.id ?? 'mock-problem-final-velocity',
        stepId: 'step-2',
        studentInput: 'v = 10 m',
      });

      if (result.ok) {
        setStepCheckResult(result.data);
      }
    } catch {
      setStepCheckResult({
        stepStatus: 'needsAttention',
        supportiveFeedback: 'Your calculation is on track. The adjustment is the final unit.',
        explanation: 'Acceleration times time leaves m/s, so the result describes velocity.',
        whatWentWell: 'You chose the right motion relationship.',
        whatToAdjust: 'Use m/s for the final answer because it describes velocity.',
        whyItMatters: 'Unit reasoning helps separate position, velocity, and acceleration.',
      });
    } finally {
      setCheckPending(false);
    }
  };

  return (
    <div className="p-fade">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="p-section-lbl mb-1.5">{notebookProblem.eyebrow}</div>
          <h1 className="text-[22px] font-extrabold leading-tight tracking-[-0.03em] text-pico-text">
            {notebookProblem.title}
          </h1>
          <div className="mt-3 flex max-w-[330px] items-center gap-3">
            <div className="p-section-lbl">Progress</div>
            <Badge variant="green">{notebookProblem.progressLabel}</Badge>
            <div className="min-w-[88px] flex-1">
              <ProgressBar
                value={notebookProblem.progressValue}
                max={notebookProblem.progressMax}
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
          <ProblemContextPanel problem={notebookProblem} />
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
              <NotebookStepCard
                key={step.id}
                step={step}
                onOpenVisual={openVisualLab}
                onCheckStep={step.status === 'learning-signal' ? checkCurrentStep : undefined}
                checkPending={step.status === 'learning-signal' && checkPending}
              />
            ))}
          </div>

          {checkPending ? (
            <div className="p-fade mt-4 rounded-[10px] bg-pico-softBlue px-4 py-2.5 text-[12.5px] font-medium text-[#2A60A8]">
              Pico is checking the step...
            </div>
          ) : null}

          {stepCheckResult ? (
            <Card className="p-fade mt-4 border-[#B8D8F4] px-4 py-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div className="text-[14px] font-extrabold text-pico-text">
                  Pico step check
                </div>
                <Badge variant={stepCheckResult.stepStatus === 'complete' ? 'green' : 'coral'}>
                  {stepCheckResult.stepStatus === 'complete' ? 'Strong step' : 'Needs attention'}
                </Badge>
              </div>
              <p className="text-[13px] leading-relaxed text-pico-secondary">
                {stepCheckResult.supportiveFeedback}
              </p>
              <div className="mt-3 grid gap-2.5 sm:grid-cols-3">
                {stepCheckResult.whatWentWell ? (
                  <div className="rounded-[10px] bg-pico-softGreen px-3 py-2.5">
                    <div className="p-section-lbl mb-1">What went well</div>
                    <p className="text-[12.5px] leading-relaxed text-[#2A7850]">
                      {stepCheckResult.whatWentWell}
                    </p>
                  </div>
                ) : null}
                {stepCheckResult.whatToAdjust ? (
                  <div className="rounded-[10px] bg-pico-softCoral px-3 py-2.5">
                    <div className="p-section-lbl mb-1">What to adjust</div>
                    <p className="text-[12.5px] leading-relaxed text-[#9A3030]">
                      {stepCheckResult.whatToAdjust}
                    </p>
                  </div>
                ) : null}
                {stepCheckResult.whyItMatters ? (
                  <div className="rounded-[10px] bg-pico-softBlue px-3 py-2.5">
                    <div className="p-section-lbl mb-1">Why it matters</div>
                    <p className="text-[12.5px] leading-relaxed text-[#2A60A8]">
                      {stepCheckResult.whyItMatters}
                    </p>
                  </div>
                ) : null}
              </div>
              {stepCheckResult.learningSignal ? (
                <div className="mt-3 rounded-[10px] bg-pico-soft px-3.5 py-2.5 text-[12.5px] leading-relaxed text-pico-secondary">
                  Learning signal: {stepCheckResult.learningSignal.title} ·{' '}
                  {stepCheckResult.learningSignal.suggestedFocus}
                </div>
              ) : null}
            </Card>
          ) : null}
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
