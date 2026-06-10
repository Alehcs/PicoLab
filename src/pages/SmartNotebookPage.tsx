import { ArrowRight, Check, FlaskConical, Lightbulb, Map, RotateCcw, Sparkles } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NotebookStepCard, type StepAction, type StepPhase } from '../components/notebook/NotebookStepCard';
import { PicoCoachPanel } from '../components/notebook/PicoCoachPanel';
import { ProblemContextPanel } from '../components/notebook/ProblemContextPanel';
import { AskPicoDrawer } from '../components/pico/AskPicoDrawer';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import {
  mockNotebookProblem,
  mockPatternInsight,
  mockPicoCoach,
  notebookFlow,
  step1FormulaSignal,
  type LearningSignal,
  type LearningSignalSection,
  type NotebookProblem,
} from '../data/mockNotebook';
import { picolabApi } from '../services/picolabApi';
import { readCurrentProblem } from '../services/problemSession';
import {
  storeVisualLabSuggestionFromSignal,
  storeVisualLabSuggestionFromSignals,
} from '../services/visualLabSuggestion';
import type { ProblemEntity, StepCheckResponse } from '../types/api';

type StepNumber = 1 | 2 | 3 | 4;

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

// Deterministic Step 1 check: does the setup connect the right quantities?
const normalizeFormula = (value: string) =>
  value
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/₀/g, '0')
    .replace(/_/g, '')
    .replace(/[·×*]/g, '*');

const isValidStep1Setup = (value: string) => {
  const normalized = normalizeFormula(value);
  return normalized.includes('v0+at') || normalized.includes('2*5');
};

export function SmartNotebookPage() {
  const navigate = useNavigate();
  const [askPicoOpen, setAskPicoOpen] = useState(false);
  const [currentProblem, setCurrentProblem] = useState<ProblemEntity | null>(null);

  // Local step machine — no global state, no new endpoints.
  const [statuses, setStatuses] = useState<Record<StepNumber, StepPhase>>({
    1: 'active',
    2: 'upcoming',
    3: 'upcoming',
    4: 'upcoming',
  });
  const [inputs, setInputs] = useState<Record<StepNumber, string>>({
    1: notebookFlow.step1.defaultInput,
    2: notebookFlow.step2.defaultInput,
    3: '',
    4: '',
  });
  const [checkingStep, setCheckingStep] = useState<StepNumber | null>(null);
  const [step1Prompt, setStep1Prompt] = useState<string | null>(null);
  const [step1Signal, setStep1Signal] = useState<LearningSignal | null>(null);
  const [step2Prompt, setStep2Prompt] = useState<string | null>(null);
  const [step2Result, setStep2Result] = useState<StepCheckResponse | null>(null);
  const [step2Hint, setStep2Hint] = useState(false);
  const [step3Prompt, setStep3Prompt] = useState<string | null>(null);
  const [growthToast, setGrowthToast] = useState(false);
  const toastTimer = useRef<number>();

  useEffect(() => {
    setCurrentProblem(readCurrentProblem());
  }, []);

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  const notebookProblem = useMemo(() => createProblemFromEntity(currentProblem), [currentProblem]);

  const setInput = (step: StepNumber, value: string) =>
    setInputs((prev) => ({ ...prev, [step]: value }));

  const triggerGrowthToast = () => {
    setGrowthToast(true);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setGrowthToast(false), 3600);
  };

  const openVisualLab = () => {
    if (step2Result?.signals?.length || step2Result?.primarySignal) {
      storeVisualLabSuggestionFromSignals(step2Result.signals ?? [step2Result.primarySignal!]);
    } else {
      storeVisualLabSuggestionFromSignal({
        signalId: 'units.final_unit_mismatch',
        category: 'units',
        suggestedVisualTemplate: 'units',
        title: 'The final unit needs attention',
      });
    }
    navigate('/visual-lab');
  };

  const viewGrowthMap = () => navigate('/growth-map');
  const viewGrowthPath = () => navigate('/growth-path');

  // --- Step 1: formula / setup -------------------------------------------------
  const checkStep1 = () => {
    const value = inputs[1].trim();
    if (!value) {
      setStep1Prompt(notebookFlow.step1.emptyPrompt);
      setStep1Signal(null);
      return;
    }

    setStep1Prompt(null);
    if (isValidStep1Setup(value)) {
      setStep1Signal(null);
      setStatuses((prev) => ({ ...prev, 1: 'resolved' }));
    } else {
      setStep1Signal(step1FormulaSignal);
      setStatuses((prev) => ({ ...prev, 1: 'needsAttention' }));
    }
  };

  const retryStep1 = () => {
    setStep1Signal(null);
    setStep1Prompt(null);
    setStatuses((prev) => ({ ...prev, 1: 'active' }));
  };

  const continueToStep2 = () =>
    setStatuses((prev) => ({ ...prev, 1: 'completed', 2: 'active' }));

  // --- Step 2: final value + unit (backend-first / fallback) -------------------
  const checkStep2 = async () => {
    if (checkingStep) return;
    const value = inputs[2].trim();
    if (!value) {
      setStep2Prompt(notebookFlow.step2.emptyPrompt);
      return;
    }

    setStep2Prompt(null);
    setCheckingStep(2);

    const applyResult = (result: StepCheckResponse) => {
      setStep2Result(result);
      if (result.stepStatus === 'complete') {
        setStep2Hint(false);
        setStatuses((prev) => ({ ...prev, 2: 'resolved' }));
      } else {
        setStatuses((prev) => ({ ...prev, 2: 'needsAttention' }));
        triggerGrowthToast();
      }
    };

    try {
      const result = await picolabApi.checkStep({
        problemId: currentProblem?.id ?? 'mock-problem-final-velocity',
        stepId: 'step-2',
        studentInput: inputs[2],
      });
      if (result.ok) {
        applyResult(result.data);
      }
    } catch {
      applyResult({
        stepStatus: 'needsAttention',
        supportiveFeedback: 'Your calculation is on track. The adjustment is the final unit.',
        explanation: 'Acceleration times time leaves m/s, so the result describes velocity.',
        whatWentWell: 'You chose the right motion relationship.',
        whatToAdjust: 'Use m/s for the final answer because it describes velocity.',
        whyItMatters: 'Unit reasoning helps separate position, velocity, and acceleration.',
      });
    } finally {
      setCheckingStep(null);
    }
  };

  const retryStep2 = () => {
    setStep2Result(null);
    setStep2Prompt(null);
    setStep2Hint(false);
    setStatuses((prev) => ({ ...prev, 2: 'active' }));
  };

  const goToStep3 = (step2Final: StepPhase) =>
    setStatuses((prev) => ({ ...prev, 2: step2Final, 3: 'active' }));

  // --- Step 3: interpret -------------------------------------------------------
  const checkStep3 = () => {
    const value = inputs[3].trim();
    if (!value) {
      setStep3Prompt(notebookFlow.step3.emptyPrompt);
      return;
    }
    setStep3Prompt(null);
    setStatuses((prev) => ({ ...prev, 3: 'resolved' }));
  };

  const continueToStep4 = () => setStatuses((prev) => ({ ...prev, 4: 'active' }));

  // --- Step 4: visual connection ----------------------------------------------
  const openVisualLabFromStep4 = () => {
    setStatuses((prev) => ({ ...prev, 4: 'completed' }));
    openVisualLab();
  };

  // --- Derived view ------------------------------------------------------------
  const doneCount = ([1, 2, 3, 4] as StepNumber[]).filter(
    (n) => statuses[n] === 'resolved' || statuses[n] === 'completed',
  ).length;
  const reached = ([1, 2, 3, 4] as StepNumber[]).filter((n) => statuses[n] !== 'upcoming');
  const currentStepNumber = reached.length ? Math.max(...reached) : 1;
  const progressLabel = doneCount === 4 ? 'Complete' : `Step ${currentStepNumber} of 4`;

  const buildStep2Signal = (result: StepCheckResponse): LearningSignal => {
    const sections: LearningSignalSection[] = [];
    if (result.whatWentWell) {
      sections.push({ title: 'What went well', body: result.whatWentWell });
    }
    if (result.whatToAdjust) {
      sections.push({ title: 'What to adjust', body: result.whatToAdjust });
    }
    if (result.whyItMatters) {
      sections.push({
        title: 'Why it matters',
        body: result.whyItMatters,
        formula: '(m/s²) · s = m/s',
      });
    }
    return {
      title: result.learningSignal?.title ?? 'Final unit mismatch',
      subtitle: result.supportiveFeedback,
      status: 'Learning signal',
      sections,
    };
  };

  const step2Signal: LearningSignal | null =
    statuses[2] === 'needsAttention' && step2Result ? buildStep2Signal(step2Result) : null;

  const step1Actions = (): StepAction[] => {
    if (statuses[1] === 'resolved') {
      return [
        {
          key: 'continue',
          label: 'Continue to Step 2',
          variant: 'primary',
          icon: <ArrowRight size={14} />,
          onClick: continueToStep2,
        },
      ];
    }
    if (statuses[1] === 'completed') return [];
    const actions: StepAction[] = [
      {
        key: 'check',
        label: 'Check this step',
        variant: 'primary',
        icon: <Check size={14} />,
        onClick: checkStep1,
        disabled: checkingStep !== null,
      },
    ];
    if (statuses[1] === 'needsAttention') {
      actions.unshift({
        key: 'retry',
        label: 'Try again',
        variant: 'secondary',
        icon: <RotateCcw size={13} />,
        onClick: retryStep1,
      });
    }
    return actions;
  };

  const step2Actions = (): StepAction[] => {
    if (statuses[2] === 'resolved') {
      return [
        {
          key: 'continue',
          label: 'Continue to Step 3',
          variant: 'primary',
          icon: <ArrowRight size={14} />,
          onClick: () => goToStep3('resolved'),
        },
        {
          key: 'visual',
          label: 'Open visual explanation',
          variant: 'secondary',
          icon: <Sparkles size={13} />,
          onClick: openVisualLab,
        },
      ];
    }
    if (statuses[2] === 'needsAttention') {
      return [
        {
          key: 'retry',
          label: 'Try again',
          variant: 'secondary',
          icon: <RotateCcw size={13} />,
          onClick: retryStep2,
        },
        {
          key: 'visual',
          label: 'Open visual explanation',
          variant: 'secondary',
          icon: <Sparkles size={13} />,
          onClick: openVisualLab,
        },
        {
          key: 'hint',
          label: 'Give me a hint',
          variant: 'yellow',
          icon: <Lightbulb size={13} />,
          onClick: () => setStep2Hint(true),
        },
        {
          key: 'understand',
          label: 'I understand — continue',
          variant: 'primary',
          icon: <ArrowRight size={14} />,
          onClick: () => goToStep3('completed'),
        },
      ];
    }
    if (statuses[2] === 'completed') return [];
    return [
      {
        key: 'check',
        label: 'Check this step',
        variant: 'primary',
        icon: <Check size={14} />,
        onClick: checkStep2,
        disabled: checkingStep !== null,
      },
    ];
  };

  const step3Actions = (): StepAction[] => {
    if (statuses[3] === 'resolved') {
      return [
        {
          key: 'continue',
          label: 'Continue to Step 4',
          variant: 'primary',
          icon: <ArrowRight size={14} />,
          onClick: continueToStep4,
        },
      ];
    }
    if (statuses[3] === 'upcoming') return [];
    return [
      {
        key: 'check',
        label: 'Check this step',
        variant: 'primary',
        icon: <Check size={14} />,
        onClick: checkStep3,
      },
    ];
  };

  const step4Actions = (): StepAction[] => {
    if (statuses[4] === 'active') {
      return [
        {
          key: 'visual',
          label: 'Open Visual Lab',
          variant: 'primary',
          icon: <FlaskConical size={14} />,
          onClick: openVisualLabFromStep4,
        },
      ];
    }
    return [];
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
            <Badge variant="green">{progressLabel}</Badge>
            <div className="min-w-[88px] flex-1">
              <ProgressBar value={doneCount} max={4} label="Smart Notebook progress" />
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
          <div className="mb-4">
            <div className="text-[20px] font-extrabold tracking-[-0.03em] text-pico-text">Problem</div>
            <p className="mt-1 text-[13px] leading-relaxed text-pico-muted">Setup and known values.</p>
          </div>
          <ProblemContextPanel problem={notebookProblem} />
        </aside>

        <section className="min-w-0">
          <div className="mb-4">
            <h2 className="text-[20px] font-extrabold tracking-[-0.03em] text-pico-text">
              Solve step by step
            </h2>
            <p className="mt-1 text-[13px] leading-relaxed text-pico-muted">
              Work through each step yourself. Pico checks your answer and turns small slips into
              learning signals.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <NotebookStepCard
              stepNumber={1}
              title={notebookFlow.step1.title}
              instruction={notebookFlow.step1.instruction}
              phase={statuses[1]}
              showInput={statuses[1] !== 'upcoming'}
              inputValue={inputs[1]}
              placeholder={notebookFlow.step1.placeholder}
              inputHelp="Pico checks the structure, not the exact spacing."
              onInputChange={(value) => setInput(1, value)}
              prompt={step1Prompt}
              signal={step1Signal}
              resolvedTitle={notebookFlow.step1.resolvedTitle}
              resolvedMessage={notebookFlow.step1.resolvedMessage}
              actions={step1Actions()}
            />

            <NotebookStepCard
              stepNumber={2}
              title={notebookFlow.step2.title}
              instruction={notebookFlow.step2.instruction}
              phase={statuses[2]}
              showInput={statuses[2] !== 'upcoming'}
              inputValue={inputs[2]}
              placeholder={notebookFlow.step2.placeholder}
              inputHelp={
                statuses[2] === 'resolved'
                  ? 'Looks good — the unit now matches velocity.'
                  : 'Include the unit, for example m/s.'
              }
              onInputChange={(value) => setInput(2, value)}
              prompt={step2Prompt}
              hint={statuses[2] === 'needsAttention' && step2Hint ? notebookFlow.step2.hint : null}
              signal={step2Signal}
              resolvedTitle={notebookFlow.step2.resolvedTitle}
              resolvedMessage={notebookFlow.step2.resolvedMessage}
              checkPending={checkingStep === 2}
              actions={step2Actions()}
            />

            <NotebookStepCard
              stepNumber={3}
              title={notebookFlow.step3.title}
              instruction={notebookFlow.step3.instruction}
              phase={statuses[3]}
              showInput={statuses[3] !== 'upcoming'}
              inputValue={inputs[3]}
              placeholder={notebookFlow.step3.placeholder}
              inputHelp="A sentence is enough."
              onInputChange={(value) => setInput(3, value)}
              prompt={step3Prompt}
              resolvedTitle={notebookFlow.step3.resolvedTitle}
              resolvedMessage={notebookFlow.step3.resolvedMessage}
              actions={step3Actions()}
            />

            <NotebookStepCard
              stepNumber={4}
              title={notebookFlow.step4.title}
              instruction={notebookFlow.step4.instruction}
              phase={statuses[4]}
              infoMessage={statuses[4] === 'active' ? notebookFlow.step4.message : null}
              actions={step4Actions()}
            />
          </div>
        </section>

        <aside className="min-w-0">
          <div className="mb-4">
            <div className="text-[20px] font-extrabold tracking-[-0.03em] text-pico-text">Pico</div>
            <p className="mt-1 text-[13px] leading-relaxed text-pico-muted">Coaching as you solve.</p>
          </div>
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

      {growthToast ? (
        <div
          className="p-fade fixed bottom-6 right-6 z-40 flex max-w-[300px] items-start gap-3 rounded-[14px] border-[1.5px] border-[#BBE3CC] bg-white px-4 py-3 shadow-[0_12px_34px_rgba(38,50,56,0.16)]"
          role="status"
          aria-live="polite"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pico-softGreen text-[#2A7850]">
            <Map size={15} aria-hidden="true" />
          </div>
          <div>
            <div className="text-[13px] font-bold text-pico-text">Added to Growth Map</div>
            <p className="mt-0.5 text-[12px] leading-relaxed text-pico-secondary">
              Pico saved this as a learning signal.
            </p>
          </div>
        </div>
      ) : null}

      <AskPicoDrawer open={askPicoOpen} context="notebook" onClose={() => setAskPicoOpen(false)} />
    </div>
  );
}
