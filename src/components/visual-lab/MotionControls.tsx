import type { ChangeEvent } from 'react';
import { Card } from '../ui/Card';
import { FormulaBlock } from '../math/FormulaBlock';

type MotionControlsProps = {
  initialVelocity: number;
  acceleration: number;
  time: number;
  onInitialVelocityChange: (value: number) => void;
  onAccelerationChange: (value: number) => void;
  onTimeChange: (value: number) => void;
};

type SliderConfig = {
  label: string;
  symbol: string;
  unit: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
};

const fmt = (value: number) => Number(value.toFixed(1)).toString();

function MotionSlider({ label, symbol, unit, value, min, max, step, onChange }: SliderConfig) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(Number(event.target.value));
  };

  return (
    <label className="block">
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <span className="text-[12.5px] font-semibold text-pico-secondary">{label}</span>
        <span className="flex items-baseline gap-1">
          <FormulaBlock size="sm" className="font-bold text-pico-blue">
            {symbol} = {fmt(value)}
          </FormulaBlock>
          <span className="text-[11px] text-pico-muted">{unit}</span>
        </span>
      </div>
      <input
        className="p-range"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-label={`${label} ${symbol}`}
        onInput={handleChange}
        onChange={handleChange}
      />
      <div className="mt-1 flex justify-between text-[10.5px] text-pico-muted">
        <span>
          {fmt(min)} {unit}
        </span>
        <span>
          {fmt(max)} {unit}
        </span>
      </div>
    </label>
  );
}

export function MotionControls({
  initialVelocity,
  acceleration,
  time,
  onInitialVelocityChange,
  onAccelerationChange,
  onTimeChange,
}: MotionControlsProps) {
  const sliders: SliderConfig[] = [
    {
      label: 'Initial velocity',
      symbol: 'v₀',
      unit: 'm/s',
      value: initialVelocity,
      min: 0,
      max: 10,
      step: 0.5,
      onChange: onInitialVelocityChange,
    },
    {
      label: 'Acceleration',
      symbol: 'a',
      unit: 'm/s²',
      value: acceleration,
      min: 0,
      max: 8,
      step: 0.5,
      onChange: onAccelerationChange,
    },
    {
      label: 'Time',
      symbol: 't',
      unit: 's',
      value: time,
      min: 1,
      max: 10,
      step: 0.5,
      onChange: onTimeChange,
    },
  ];

  return (
    <Card className="flex flex-col gap-5 px-5 py-5">
      <div>
        <h2 className="text-[17px] font-extrabold tracking-[-0.02em] text-pico-text">
          Adjust the motion
        </h2>
        <p className="mt-1 text-[12.5px] leading-relaxed text-pico-muted">
          Drag sliders to see how the final velocity changes.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        {sliders.map((slider) => (
          <MotionSlider key={slider.symbol} {...slider} />
        ))}
      </div>
    </Card>
  );
}
