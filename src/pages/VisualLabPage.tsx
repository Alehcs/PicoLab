import { ArrowLeft, Bookmark, Target } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormulaBlock } from '../components/math/FormulaBlock';
import { LiveFormulaCard } from '../components/visual-lab/LiveFormulaCard';
import { MotionControls } from '../components/visual-lab/MotionControls';
import { MotionSimulation } from '../components/visual-lab/MotionSimulation';
import { VelocityTimeGraph } from '../components/visual-lab/VelocityTimeGraph';
import { VisualLabCoachPanel } from '../components/visual-lab/VisualLabCoachPanel';
import { VisualModeSelector } from '../components/visual-lab/VisualModeSelector';
import { AskPicoDrawer } from '../components/pico/AskPicoDrawer';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { visualLabCopy, visualLabDefaults, visualModes } from '../data/mockVisualLab';
import {
  clearVisualLabSuggestion,
  getTemplateDescription,
  getTemplateLabel,
  isVisualTemplateId,
  loadVisualLabSuggestion,
} from '../services/visualLabSuggestion';
import type { VisualTemplateId } from '../types/api';

type ActiveVisualMode = Extract<
  VisualTemplateId,
  'motion' | 'units' | 'graph' | 'formula' | 'free-body' | 'function'
>;

type TemplateInfo = {
  title: string;
  subtitle: string;
  detailTitle: string;
  detailItems: string[];
  badge: string;
  notice: string;
  why: string;
  picoNote: string;
  practiceLabel: string;
};

const supportedModes: ActiveVisualMode[] = [
  'motion',
  'units',
  'graph',
  'formula',
  'free-body',
  'function',
];

const isSupportedVisualMode = (mode?: string): mode is ActiveVisualMode =>
  isVisualTemplateId(mode) && supportedModes.includes(mode as ActiveVisualMode);

const toActiveMode = (mode?: string): ActiveVisualMode =>
  isSupportedVisualMode(mode) ? mode : 'motion';

const templateInfo: Record<ActiveVisualMode, TemplateInfo> = {
  motion: {
    title: 'Motion model',
    subtitle: 'Change time and acceleration to see how velocity grows.',
    detailTitle: 'Motion inputs',
    detailItems: ['Initial velocity, acceleration, and time drive the model.', 'The endpoint shows final velocity.'],
    badge: 'Motion meaning',
    notice: 'The final point on the graph is the velocity after the chosen time.',
    why: 'Velocity tells how position changes over time, so direction, sign, and units all matter.',
    picoNote: 'A motion model connects the formula, the graph, and the physical story.',
    practiceLabel: 'Practice motion',
  },
  units: {
    title: 'Unit reasoning',
    subtitle: 'Track how compound units simplify before choosing the final label.',
    detailTitle: 'Unit chain',
    detailItems: ['m/s² × s = m/s', 'One second cancels one power of seconds.', 'The result is velocity, so the unit is m/s.'],
    badge: 'Unit reasoning',
    notice: 'Seconds cancel one power of seconds, leaving meters per second.',
    why: 'The number may be close, but the unit tells us what kind of quantity we found.',
    picoNote: 'Use units as a check on the meaning of the answer before calling it done.',
    practiceLabel: 'Practice units',
  },
  graph: {
    title: 'Graph interpretation',
    subtitle: 'Read axes first, then decide whether slope, endpoint, or area answers the question.',
    detailTitle: 'Graph checks',
    detailItems: ['Slope = rate of change.', 'Endpoint = final value.', 'Area = accumulated quantity.'],
    badge: 'Graph interpretation',
    notice: 'The highlighted feature depends on what the question asks for.',
    why: 'A graph is not just a picture; axis labels and units define what each feature means.',
    picoNote: 'Start with labels, then connect the graph feature to the target quantity.',
    practiceLabel: 'Practice graphs',
  },
  formula: {
    title: 'Formula selection',
    subtitle: 'Match the known values and target before substituting numbers.',
    detailTitle: 'Formula setup',
    detailItems: ['Knowns: v₀ = 0 m/s, a = 2 m/s², t = 5 s.', 'Target: final velocity v.', 'Candidate: v = v₀ + at.'],
    badge: 'Formula selection',
    notice: 'This formula connects initial velocity, acceleration, time, and final velocity.',
    why: 'Choosing the formula before substituting keeps variable meanings from getting swapped.',
    picoNote: 'Name the target, list the givens, then pick the relationship that connects them.',
    practiceLabel: 'Practice formulas',
  },
  'free-body': {
    title: 'Free-body forces',
    subtitle: 'Separate mass, weight, and force direction with a simple force diagram.',
    detailTitle: 'Force labels',
    detailItems: ['Mass is measured in kg.', 'Weight is a force, measured in N.', 'Forces have direction.'],
    badge: 'Force and direction',
    notice: 'The arrows show forces acting on the object, not the object itself.',
    why: 'Weight is the gravitational force on mass, so it uses newtons, not kilograms.',
    picoNote: 'A force diagram helps keep direction and quantity type visible.',
    practiceLabel: 'Practice forces',
  },
  function: {
    title: 'Function structure',
    subtitle: 'Follow inputs through operations in order to protect signs and structure.',
    detailTitle: 'Input/output check',
    detailItems: ['Input: x = -3.', 'Rule: f(x) = 2x + 5.', 'Output: f(-3) = -1.'],
    badge: 'Function structure',
    notice: 'Signs and operation order decide the output.',
    why: 'Substitution works best when each input goes into the same structure every time.',
    picoNote: 'Keep the expression shape steady, then simplify one operation at a time.',
    practiceLabel: 'Practice algebra',
  },
};

const graphHighlights: Record<string, string> = {
  'graph.slope_confusion': 'Slope is the rate of change.',
  'graph.endpoint_confusion': 'The endpoint gives the final value.',
  'graph.area_under_curve': 'Area gives the accumulated quantity.',
  'graph.axis_interpretation': 'Axis labels define what each coordinate means.',
};

function TemplateDetailsCard({ mode }: { mode: ActiveVisualMode }) {
  const info = templateInfo[mode];

  return (
    <Card className="px-5 py-5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-[17px] font-extrabold tracking-[-0.02em] text-pico-text">
          {info.detailTitle}
        </h2>
        <Badge variant="blue">{getTemplateLabel(mode)}</Badge>
      </div>
      <div className="flex flex-col gap-2">
        {info.detailItems.map((item) => (
          <div
            key={item}
            className="rounded-[10px] bg-pico-soft px-3.5 py-2.5 text-[12.5px] font-medium leading-relaxed text-pico-secondary"
          >
            {item}
          </div>
        ))}
      </div>
    </Card>
  );
}

function UnitsTemplateVisual() {
  return (
    <Card className="px-5 py-5">
      <div className="mb-4">
        <h2 className="text-[18px] font-extrabold tracking-[-0.02em] text-pico-text">
          Unit cancellation
        </h2>
        <p className="mt-1 text-[13px] leading-relaxed text-pico-secondary">
          Follow the units through the multiplication before labeling the final answer.
        </p>
      </div>

      <div className="rounded-[16px] border-[1.5px] border-pico-border bg-[#F8FAF6] px-5 py-5">
        <div className="flex flex-wrap items-center justify-center gap-3 text-center">
          <FormulaBlock size="lg" className="font-bold text-pico-text">
            m/s²
          </FormulaBlock>
          <span className="text-[18px] font-extrabold text-pico-muted">×</span>
          <FormulaBlock size="lg" className="font-bold text-pico-text">
            s
          </FormulaBlock>
          <span className="text-[18px] font-extrabold text-pico-muted">=</span>
          <FormulaBlock size="lg" className="font-bold text-pico-blue">
            m/s
          </FormulaBlock>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-[11px] bg-pico-softCoral px-3.5 py-3 text-center">
            <div className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#9A3030]">
              Cancel
            </div>
            <p className="mt-1 text-[12.5px] leading-relaxed text-[#9A3030]">
              seconds cancel one power of seconds
            </p>
          </div>
          <div className="rounded-[11px] bg-pico-softBlue px-3.5 py-3 text-center">
            <div className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#2A60A8]">
              Leaves
            </div>
            <p className="mt-1 text-[12.5px] leading-relaxed text-[#2A60A8]">
              meters per second
            </p>
          </div>
          <div className="rounded-[11px] bg-pico-softGreen px-3.5 py-3 text-center">
            <div className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#2A7850]">
              Means
            </div>
            <p className="mt-1 text-[12.5px] leading-relaxed text-[#2A7850]">
              the result is velocity
            </p>
          </div>
        </div>
      </div>

      <div className="mt-3 rounded-[10px] bg-pico-softBlue px-3.5 py-2.5 text-[12.5px] font-bold leading-relaxed text-[#2A60A8]">
        The result is velocity, so the unit is m/s.
      </div>
    </Card>
  );
}

function GraphTemplateVisual({ signalId }: { signalId?: string }) {
  const highlight = signalId ? graphHighlights[signalId] : undefined;

  return (
    <Card className="px-5 py-5">
      <div className="mb-4">
        <h2 className="text-[18px] font-extrabold tracking-[-0.02em] text-pico-text">
          Graph reading
        </h2>
        <p className="mt-1 text-[13px] leading-relaxed text-pico-secondary">
          Read the axes, then choose the graph feature that matches the target.
        </p>
      </div>

      <div className="rounded-[16px] border-[1.5px] border-pico-border bg-[#F8FAF6] px-4 py-4">
        <svg viewBox="0 0 420 220" role="img" aria-label="Velocity time graph" className="h-[220px] w-full">
          <line x1="52" y1="176" x2="365" y2="176" stroke="#8A9188" strokeWidth="2" />
          <line x1="52" y1="176" x2="52" y2="28" stroke="#8A9188" strokeWidth="2" />
          <path d="M72 154 L332 58" fill="none" stroke="#4A90E2" strokeWidth="5" strokeLinecap="round" />
          <path d="M72 176 L72 154 L332 58 L332 176 Z" fill="rgba(74,144,226,0.12)" stroke="none" />
          <circle cx="332" cy="58" r="8" fill="#5FBF8F" />
          <line x1="190" y1="112" x2="242" y2="92" stroke="#F47C7C" strokeWidth="4" strokeLinecap="round" />
          <text x="188" y="84" fill="#9A3030" fontSize="13" fontWeight="700">slope</text>
          <text x="320" y="43" fill="#2A7850" fontSize="13" fontWeight="700">endpoint</text>
          <text x="208" y="168" fill="#2A60A8" fontSize="13" fontWeight="700">area</text>
          <text x="176" y="207" fill="#5F6468" fontSize="13" fontWeight="700">time (s)</text>
          <text x="8" y="92" fill="#5F6468" fontSize="13" fontWeight="700" transform="rotate(-90 16 92)">velocity (m/s)</text>
        </svg>
      </div>

      <div className="mt-3 grid gap-2.5 sm:grid-cols-3">
        {['slope = rate of change', 'endpoint = final value', 'area = accumulated quantity'].map((item) => (
          <div key={item} className="rounded-[10px] bg-pico-soft px-3 py-2.5 text-[12.5px] font-semibold text-pico-secondary">
            {item}
          </div>
        ))}
      </div>
      {highlight ? (
        <div className="mt-3 rounded-[10px] bg-pico-softGreen px-3.5 py-2.5 text-[12.5px] font-bold leading-relaxed text-[#2A7850]">
          {highlight}
        </div>
      ) : null}
    </Card>
  );
}

function FormulaTemplateVisual() {
  return (
    <Card className="px-5 py-5">
      <div className="mb-4">
        <h2 className="text-[18px] font-extrabold tracking-[-0.02em] text-pico-text">
          Formula fit
        </h2>
        <p className="mt-1 text-[13px] leading-relaxed text-pico-secondary">
          Choose the relationship that connects the givens to the target.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-[13px] bg-pico-soft px-4 py-3.5">
          <div className="p-section-lbl mb-2">Known values</div>
          <div className="flex flex-col gap-1.5 text-[13px] font-semibold text-pico-secondary">
            <span>v₀ = 0 m/s</span>
            <span>a = 2 m/s²</span>
            <span>t = 5 s</span>
          </div>
        </div>
        <div className="rounded-[13px] bg-pico-softBlue px-4 py-3.5">
          <div className="p-section-lbl mb-2 text-[#2A60A8]">Target</div>
          <FormulaBlock size="lg" className="font-bold text-[#2A60A8]">
            v
          </FormulaBlock>
          <p className="mt-1 text-[12.5px] text-[#2A60A8]">final velocity</p>
        </div>
        <div className="rounded-[13px] bg-pico-softGreen px-4 py-3.5">
          <div className="p-section-lbl mb-2 text-[#2A7850]">Candidate</div>
          <FormulaBlock className="font-bold text-[#2A7850]">v = v₀ + at</FormulaBlock>
          <p className="mt-1 text-[12.5px] text-[#2A7850]">connects all givens</p>
        </div>
      </div>

      <div className="mt-3 rounded-[13px] border-[1.5px] border-pico-border bg-[#F8FAF6] px-4 py-3.5">
        <div className="p-section-lbl mb-2">Rearrangement example</div>
        <FormulaBlock className="font-semibold text-pico-text">v - v₀ = at</FormulaBlock>
        <FormulaBlock className="mt-1 font-bold text-pico-blue">a = (v - v₀) / t</FormulaBlock>
      </div>
    </Card>
  );
}

function FreeBodyTemplateVisual() {
  return (
    <Card className="px-5 py-5">
      <div className="mb-4">
        <h2 className="text-[18px] font-extrabold tracking-[-0.02em] text-pico-text">
          Force diagram
        </h2>
        <p className="mt-1 text-[13px] leading-relaxed text-pico-secondary">
          Use arrows to separate force direction from mass.
        </p>
      </div>

      <div className="relative min-h-[260px] rounded-[16px] border-[1.5px] border-pico-border bg-[#F8FAF6] px-5 py-5">
        <div className="absolute left-1/2 top-1/2 h-20 w-24 -translate-x-1/2 -translate-y-1/2 rounded-[12px] border-[1.5px] border-[#B8D8F4] bg-pico-softBlue" />
        <div className="absolute left-1/2 top-[34px] h-[74px] w-1 -translate-x-1/2 rounded-full bg-pico-green" />
        <div className="absolute left-1/2 top-[30px] -translate-x-1/2 border-x-[8px] border-b-[12px] border-x-transparent border-b-pico-green" />
        <div className="absolute left-1/2 bottom-[34px] h-[74px] w-1 -translate-x-1/2 rounded-full bg-pico-coral" />
        <div className="absolute left-1/2 bottom-[30px] -translate-x-1/2 border-x-[8px] border-t-[12px] border-x-transparent border-t-pico-coral" />
        <div className="absolute left-[calc(50%+58px)] top-1/2 h-1 w-[82px] -translate-y-1/2 rounded-full bg-pico-blue" />
        <div className="absolute right-[calc(50%-152px)] top-1/2 -translate-y-1/2 border-y-[8px] border-l-[12px] border-y-transparent border-l-pico-blue" />
        <span className="absolute left-[calc(50%+14px)] top-[42px] rounded-full bg-pico-softGreen px-2.5 py-1 text-[11.5px] font-bold text-[#2A7850]">normal force</span>
        <span className="absolute left-[calc(50%+14px)] bottom-[42px] rounded-full bg-pico-softCoral px-2.5 py-1 text-[11.5px] font-bold text-[#9A3030]">weight</span>
        <span className="absolute right-5 top-[108px] rounded-full bg-pico-softBlue px-2.5 py-1 text-[11.5px] font-bold text-[#2A60A8]">applied force</span>
      </div>

      <div className="mt-3 grid gap-2.5 sm:grid-cols-3">
        {['forces have direction', 'mass is kg', 'force is N'].map((item) => (
          <div key={item} className="rounded-[10px] bg-pico-soft px-3 py-2.5 text-[12.5px] font-semibold text-pico-secondary">
            {item}
          </div>
        ))}
      </div>
    </Card>
  );
}

function FunctionTemplateVisual() {
  return (
    <Card className="px-5 py-5">
      <div className="mb-4">
        <h2 className="text-[18px] font-extrabold tracking-[-0.02em] text-pico-text">
          Function flow
        </h2>
        <p className="mt-1 text-[13px] leading-relaxed text-pico-secondary">
          Keep the expression structure steady as an input moves through the rule.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-center">
        <div className="rounded-[13px] bg-pico-softBlue px-4 py-4 text-center">
          <div className="p-section-lbl mb-2 text-[#2A60A8]">Input</div>
          <FormulaBlock size="lg" className="font-bold text-[#2A60A8]">x = -3</FormulaBlock>
        </div>
        <div className="hidden text-[20px] font-extrabold text-pico-muted md:block">→</div>
        <div className="rounded-[13px] bg-pico-soft px-4 py-4 text-center">
          <div className="p-section-lbl mb-2">Rule</div>
          <FormulaBlock className="font-bold text-pico-text">f(x) = 2x + 5</FormulaBlock>
        </div>
        <div className="hidden text-[20px] font-extrabold text-pico-muted md:block">→</div>
        <div className="rounded-[13px] bg-pico-softGreen px-4 py-4 text-center">
          <div className="p-section-lbl mb-2 text-[#2A7850]">Output</div>
          <FormulaBlock size="lg" className="font-bold text-[#2A7850]">-1</FormulaBlock>
        </div>
      </div>

      <div className="mt-3 rounded-[13px] bg-pico-softYellow px-4 py-3.5">
        <div className="p-section-lbl mb-2 text-[#886018]">Structure check</div>
        <FormulaBlock className="font-semibold text-[#886018]">
          f(-3) = 2(-3) + 5 = -6 + 5 = -1
        </FormulaBlock>
      </div>
    </Card>
  );
}

function TemplateCoachPanel({
  mode,
  onAskPico,
  onPractice,
  onViewGrowthPath,
}: {
  mode: ActiveVisualMode;
  onAskPico: () => void;
  onPractice: () => void;
  onViewGrowthPath: () => void;
}) {
  const info = templateInfo[mode];

  return (
    <Card className="flex flex-col gap-4 px-4 py-5">
      <div>
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="text-[13.5px] font-bold text-pico-secondary">Pico explains</div>
          <Badge variant="coral">{info.badge}</Badge>
        </div>

        <div className="flex flex-col gap-2.5">
          <section className="rounded-[11px] bg-pico-soft px-3.5 py-3">
            <div className="p-section-lbl mb-1.5">What to notice</div>
            <p className="text-[13px] leading-relaxed text-pico-secondary">{info.notice}</p>
          </section>

          <section className="rounded-[11px] bg-pico-soft px-3.5 py-3">
            <div className="p-section-lbl mb-1.5">Why it matters</div>
            <p className="text-[13px] leading-relaxed text-pico-secondary">{info.why}</p>
          </section>

          <section className="rounded-[11px] bg-pico-softBlue px-3.5 py-3">
            <div className="p-section-lbl mb-1.5 text-[#2A60A8]">Pico note</div>
            <p className="text-[13px] font-medium leading-relaxed text-[#2A60A8]">
              {info.picoNote}
            </p>
          </section>
        </div>
      </div>

      <div className="h-px bg-pico-border" />

      <div className="flex flex-col gap-2">
        <Button fullWidth onClick={onAskPico}>Ask Pico</Button>
        <Button variant="secondary" size="sm" fullWidth onClick={onPractice}>
          <Target size={13} />
          {info.practiceLabel}
        </Button>
        <Button variant="ghost" size="sm" fullWidth onClick={onViewGrowthPath}>
          View Roadmap
        </Button>
      </div>
    </Card>
  );
}

export function VisualLabPage() {
  const navigate = useNavigate();
  const [suggestedTemplate, setSuggestedTemplate] = useState(() => loadVisualLabSuggestion());
  const [activeMode, setActiveMode] = useState<ActiveVisualMode>(() =>
    toActiveMode(loadVisualLabSuggestion()?.templateId),
  );
  const [initialVelocity, setInitialVelocity] = useState(visualLabDefaults.initialVelocity);
  const [acceleration, setAcceleration] = useState(visualLabDefaults.acceleration);
  const [time, setTime] = useState(visualLabDefaults.time);
  const [currentTime, setCurrentTime] = useState(visualLabDefaults.time);
  const [playing, setPlaying] = useState(false);
  const [slowMotion, setSlowMotion] = useState(false);
  const [askPicoOpen, setAskPicoOpen] = useState(false);

  const finalVelocity = useMemo(
    () => initialVelocity + acceleration * time,
    [acceleration, initialVelocity, time],
  );
  const currentVelocity = useMemo(
    () => initialVelocity + acceleration * currentTime,
    [acceleration, currentTime, initialVelocity],
  );
  const activeTemplate = templateInfo[activeMode];
  const modeOptions = useMemo(
    () =>
      visualModes.map((mode) => ({
        ...mode,
        disabled: false,
        active: mode.id === activeMode,
      })),
    [activeMode],
  );
  const showSuggestion = suggestedTemplate?.templateId === activeMode;
  const suggestionDescription = suggestedTemplate
    ? getTemplateDescription(suggestedTemplate.templateId)
    : null;

  useEffect(() => {
    if (!playing) return undefined;

    const step = slowMotion ? 0.04 : 0.08;
    const interval = window.setInterval(() => {
      setCurrentTime((current) => {
        const next = current + step;
        if (next >= time) {
          window.clearInterval(interval);
          setPlaying(false);
          return time;
        }
        return next;
      });
    }, 40);

    return () => window.clearInterval(interval);
  }, [playing, slowMotion, time]);

  const syncToFinalTime = (nextTime = time) => {
    setPlaying(false);
    setCurrentTime(nextTime);
  };

  const resetLab = () => {
    setPlaying(false);
    setSlowMotion(false);
    setInitialVelocity(visualLabDefaults.initialVelocity);
    setAcceleration(visualLabDefaults.acceleration);
    setTime(visualLabDefaults.time);
    setCurrentTime(visualLabDefaults.time);
  };

  const play = () => {
    if (currentTime >= time) {
      setCurrentTime(0);
    }
    setPlaying(true);
  };

  const selectMode = (modeId: string) => {
    setPlaying(false);
    setActiveMode(toActiveMode(modeId));
  };

  const clearSuggestion = () => {
    clearVisualLabSuggestion();
    setSuggestedTemplate(null);
  };

  const renderLeftPanel = () => {
    if (activeMode === 'motion') {
      return (
        <>
          <MotionControls
            initialVelocity={initialVelocity}
            acceleration={acceleration}
            time={time}
            onInitialVelocityChange={(value) => {
              setInitialVelocity(value);
              syncToFinalTime();
            }}
            onAccelerationChange={(value) => {
              setAcceleration(value);
              syncToFinalTime();
            }}
            onTimeChange={(value) => {
              setTime(value);
              syncToFinalTime(value);
            }}
          />
          <LiveFormulaCard
            initialVelocity={initialVelocity}
            acceleration={acceleration}
            time={time}
            finalVelocity={finalVelocity}
            unitInsight={visualLabDefaults.unitInsight}
          />
        </>
      );
    }

    return <TemplateDetailsCard mode={activeMode} />;
  };

  const renderCenterPanel = () => {
    if (activeMode === 'motion') {
      return (
        <>
          <MotionSimulation
            time={time}
            currentTime={currentTime}
            currentVelocity={currentVelocity}
            finalVelocity={finalVelocity}
            playing={playing}
            slowMotion={slowMotion}
            onPlay={play}
            onPause={() => setPlaying(false)}
            onReset={resetLab}
            onSlowMotion={() => setSlowMotion((current) => !current)}
          />
          <VelocityTimeGraph
            initialVelocity={initialVelocity}
            time={time}
            finalVelocity={finalVelocity}
          />
        </>
      );
    }

    if (activeMode === 'units') return <UnitsTemplateVisual />;
    if (activeMode === 'graph') return <GraphTemplateVisual signalId={suggestedTemplate?.signalId} />;
    if (activeMode === 'formula') return <FormulaTemplateVisual />;
    if (activeMode === 'free-body') return <FreeBodyTemplateVisual />;
    return <FunctionTemplateVisual />;
  };

  const renderRightPanel = () => {
    if (activeMode === 'motion') {
      return (
        <VisualLabCoachPanel
          unitInsight={visualLabDefaults.unitInsight}
          finalVelocity={finalVelocity}
          onPracticeUnits={() => navigate('/practice-missions')}
          onViewGrowthPath={() => navigate('/growth-path')}
          onAskPico={() => setAskPicoOpen(true)}
        />
      );
    }

    return (
      <TemplateCoachPanel
        mode={activeMode}
        onPractice={() => navigate('/practice-missions')}
        onViewGrowthPath={() => navigate('/growth-path')}
        onAskPico={() => setAskPicoOpen(true)}
      />
    );
  };

  return (
    <div className="p-fade">
      <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <div className="p-section-lbl mb-1.5">{visualLabCopy.eyebrow}</div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-[22px] font-extrabold leading-tight tracking-[-0.03em] text-pico-text">
              {visualLabCopy.title}
            </h1>
            <Badge variant="blue">{visualLabCopy.mission}</Badge>
            {showSuggestion && suggestionDescription ? (
              <Badge variant="green">Suggested by recent signal: {suggestionDescription}</Badge>
            ) : null}
          </div>
          <p className="mt-1.5 max-w-xl text-[13.5px] leading-relaxed text-pico-secondary">
            {activeTemplate.subtitle}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => navigate('/smart-notebook')}>
            <ArrowLeft size={15} />
            Back to notebook
          </Button>
          <Button variant="secondary">
            <Bookmark size={15} />
            Save visual insight
          </Button>
        </div>
      </div>

      <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <VisualModeSelector modes={modeOptions} onSelect={selectMode} />
        <div className="flex flex-wrap items-center gap-2 text-[12.5px] font-medium text-pico-muted">
          <span>{activeTemplate.title}</span>
          {showSuggestion ? <span>Based on: {suggestedTemplate.reason}</span> : null}
          {suggestedTemplate ? (
            <button
              type="button"
              onClick={clearSuggestion}
              className="rounded-full bg-pico-soft px-2.5 py-1 text-[11.5px] font-bold text-pico-secondary transition hover:bg-pico-softBlue hover:text-pico-blue"
            >
              Clear suggestion
            </button>
          ) : null}
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[250px_minmax(0,1fr)_280px]">
        <aside className="flex min-w-0 flex-col gap-4">
          {renderLeftPanel()}
        </aside>

        <section className="flex min-w-0 flex-col gap-5">
          {renderCenterPanel()}
        </section>

        <aside className="min-w-0">
          {renderRightPanel()}
        </aside>
      </div>

      <AskPicoDrawer
        open={askPicoOpen}
        context="visual-lab"
        onClose={() => setAskPicoOpen(false)}
      />
    </div>
  );
}
