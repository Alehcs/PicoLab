import { ArrowLeft, Bookmark } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LiveFormulaCard } from '../components/visual-lab/LiveFormulaCard';
import { MotionControls } from '../components/visual-lab/MotionControls';
import { MotionSimulation } from '../components/visual-lab/MotionSimulation';
import { VelocityTimeGraph } from '../components/visual-lab/VelocityTimeGraph';
import { VisualLabCoachPanel } from '../components/visual-lab/VisualLabCoachPanel';
import { VisualModeSelector } from '../components/visual-lab/VisualModeSelector';
import { AskPicoDrawer } from '../components/pico/AskPicoDrawer';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { visualLabCopy, visualLabDefaults, visualModes } from '../data/mockVisualLab';

export function VisualLabPage() {
  const navigate = useNavigate();
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
          </div>
          <p className="mt-1.5 max-w-xl text-[13.5px] leading-relaxed text-pico-secondary">
            {visualLabCopy.subtitle}
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
        <VisualModeSelector modes={visualModes} />
        <span className="text-[12.5px] font-medium text-pico-muted">
          Template engine preview
        </span>
      </div>

      <div className="grid gap-5 xl:grid-cols-[250px_minmax(0,1fr)_280px]">
        <aside className="flex min-w-0 flex-col gap-4">
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
        </aside>

        <section className="flex min-w-0 flex-col gap-5">
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
        </section>

        <aside className="min-w-0">
          <VisualLabCoachPanel
            unitInsight={visualLabDefaults.unitInsight}
            finalVelocity={finalVelocity}
            onPracticeUnits={() => navigate('/practice-missions')}
            onViewGrowthPath={() => navigate('/growth-path')}
            onAskPico={() => setAskPicoOpen(true)}
          />
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
