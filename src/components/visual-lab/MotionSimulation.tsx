import { Pause, Play, RotateCcw, Turtle } from 'lucide-react';
import { FormulaBlock } from '../math/FormulaBlock';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

type MotionSimulationProps = {
  time: number;
  currentTime: number;
  currentVelocity: number;
  finalVelocity: number;
  playing: boolean;
  slowMotion: boolean;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onSlowMotion: () => void;
};

const fmt = (value: number) => Number(value.toFixed(1)).toString();

export function MotionSimulation({
  time,
  currentTime,
  currentVelocity,
  finalVelocity,
  playing,
  slowMotion,
  onPlay,
  onPause,
  onReset,
  onSlowMotion,
}: MotionSimulationProps) {
  const progress = time > 0 ? Math.min(1, currentTime / time) : 0;

  return (
    <Card className="px-6 py-5">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-[17px] font-extrabold tracking-[-0.02em] text-pico-text">
            Motion simulation
          </h2>
          <p className="mt-1 text-[12.5px] leading-relaxed text-pico-muted">
            At t = {fmt(time)} s, velocity is {fmt(finalVelocity)} m/s
          </p>
        </div>
        <div className="w-fit rounded-full bg-pico-softGreen px-3 py-1.5 text-[12px] font-bold text-[#2A7850]">
          Final velocity
        </div>
      </div>

      <div className="relative min-h-[154px] overflow-hidden rounded-[16px] border-[1.5px] border-pico-border bg-[#F8FAF6] px-5 py-5">
        <div className="absolute left-7 right-7 top-[82px] h-1 rounded-full bg-pico-border">
          <div
            className="h-1 rounded-full bg-[rgba(74,144,226,0.45)] transition-all"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        <div className="absolute left-7 top-[61px] h-11 w-px bg-pico-muted" />
        <div className="absolute bottom-7 left-5 font-mono text-[11px] text-pico-muted">start</div>

        <div className="absolute right-7 top-[56px] h-[54px] w-px bg-pico-green" />
        <div className="absolute bottom-7 right-4 font-mono text-[11px] font-bold text-[#2A7850]">
          {fmt(finalVelocity)} m/s
        </div>

        <div
          className="absolute top-[58px] flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-[0_6px_16px_rgba(74,144,226,0.18)] transition-all duration-200"
          style={{ left: `${7 + progress * 82}%`, transform: 'translateX(-50%)' }}
          aria-label="Moving car marker"
        >
          <svg width="42" height="24" viewBox="0 0 42 24" aria-hidden="true">
            <rect x="4" y="10" width="34" height="10" rx="4" fill="#4A90E2" />
            <rect x="10" y="4" width="19" height="8" rx="3" fill="#3A7FD0" />
            <circle cx="12" cy="21" r="4" fill="#263238" />
            <circle cx="12" cy="21" r="2" fill="#8A9A88" />
            <circle cx="31" cy="21" r="4" fill="#263238" />
            <circle cx="31" cy="21" r="2" fill="#8A9A88" />
          </svg>
        </div>

        <div className="absolute left-5 top-4 rounded-full bg-white px-3 py-1.5 text-[12px] text-pico-secondary">
          Time <FormulaBlock size="sm" className="ml-1 font-bold text-pico-blue">{fmt(currentTime)} s</FormulaBlock>
        </div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-pico-softBlue px-3 py-1.5 text-[12px] text-[#2A60A8]">
          Velocity <FormulaBlock size="sm" className="ml-1 font-bold text-[#2A60A8]">{fmt(currentVelocity)} m/s</FormulaBlock>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Button size="sm" onClick={onPlay}>
          <Play size={14} />
          Play
        </Button>
        <Button variant="secondary" size="sm" onClick={onPause}>
          <Pause size={14} />
          Pause
        </Button>
        <Button variant="secondary" size="sm" onClick={onReset}>
          <RotateCcw size={14} />
          Reset
        </Button>
        <Button
          variant={slowMotion ? 'yellow' : 'ghost'}
          size="sm"
          onClick={onSlowMotion}
          className="ml-0 sm:ml-auto"
        >
          <Turtle size={14} />
          Slow motion
        </Button>
        {playing ? (
          <span className="text-[12px] font-medium text-pico-muted">
            Playing at {slowMotion ? '0.5x' : '1x'}
          </span>
        ) : null}
      </div>
    </Card>
  );
}
