import { FormulaBlock } from '../math/FormulaBlock';
import { Card } from '../ui/Card';

type VelocityTimeGraphProps = {
  initialVelocity: number;
  time: number;
  finalVelocity: number;
};

const fmt = (value: number) => Number(value.toFixed(1)).toString();

export function VelocityTimeGraph({
  initialVelocity,
  time,
  finalVelocity,
}: VelocityTimeGraphProps) {
  const left = 48;
  const right = 352;
  const top = 24;
  const bottom = 180;
  const width = right - left;
  const height = bottom - top;
  const maxTime = Math.max(6, Math.ceil(time + 1));
  const maxVelocity = Math.max(12, Math.ceil(finalVelocity + 2), Math.ceil(initialVelocity + 2));
  const x = (value: number) => left + (value / maxTime) * width;
  const y = (value: number) => bottom - (value / maxVelocity) * height;
  const finalX = x(time);
  const finalY = y(finalVelocity);
  const startY = y(initialVelocity);
  const timeTicks = Array.from({ length: Math.min(maxTime, 10) + 1 }, (_, index) => index);
  const velocityTicks = [0, Math.round(maxVelocity / 2), maxVelocity];

  return (
    <Card className="px-6 py-5">
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-[17px] font-extrabold tracking-[-0.02em] text-pico-text">
            Velocity-time graph
          </h2>
          <p className="mt-1 text-[12.5px] leading-relaxed text-pico-muted">
            The graph ends at {fmt(finalVelocity)} m/s, so the answer describes velocity.
          </p>
        </div>
      </div>

      <svg viewBox="0 0 400 220" className="w-full" role="img" aria-label="Velocity time graph">
        {timeTicks.map((tick) => (
          <line
            key={`t-${tick}`}
            x1={x(tick)}
            x2={x(tick)}
            y1={top}
            y2={bottom}
            stroke="#E8EDE4"
            strokeWidth="1"
          />
        ))}
        {velocityTicks.map((tick) => (
          <line
            key={`v-${tick}`}
            x1={left}
            x2={right}
            y1={y(tick)}
            y2={y(tick)}
            stroke="#E8EDE4"
            strokeWidth="1"
          />
        ))}

        <line x1={left} x2={left} y1={top - 4} y2={bottom + 16} stroke="#B0B8AE" strokeWidth="1.5" />
        <line x1={left - 8} x2={right + 10} y1={bottom} y2={bottom} stroke="#B0B8AE" strokeWidth="1.5" />

        {timeTicks.filter((tick) => tick > 0).map((tick) => (
          <text
            key={`tx-${tick}`}
            x={x(tick)}
            y={bottom + 28}
            textAnchor="middle"
            fill="#8A9188"
            fontSize="11"
            fontFamily="JetBrains Mono"
          >
            {tick}
          </text>
        ))}
        {velocityTicks.filter((tick) => tick > 0).map((tick) => (
          <text
            key={`vy-${tick}`}
            x={left - 9}
            y={y(tick) + 4}
            textAnchor="end"
            fill="#8A9188"
            fontSize="11"
            fontFamily="JetBrains Mono"
          >
            {tick}
          </text>
        ))}

        <text x={right + 18} y={bottom + 4} fill="#8A9188" fontSize="11" fontFamily="JetBrains Mono">
          time (s)
        </text>
        <text x={left - 4} y={top - 9} textAnchor="middle" fill="#8A9188" fontSize="11" fontFamily="JetBrains Mono">
          velocity (m/s)
        </text>

        <line x1={left} y1={startY} x2={finalX} y2={finalY} stroke="#4A90E2" strokeWidth="3" />
        <circle cx={left} cy={startY} r="4.5" fill="white" stroke="#4A90E2" strokeWidth="2" />
        <circle cx={finalX} cy={finalY} r="12" fill="#5FBF8F" opacity="0.18" />
        <circle cx={finalX} cy={finalY} r="6" fill="#5FBF8F" />
        <text
          x={Math.min(finalX + 14, right - 90)}
          y={Math.max(finalY - 10, top + 12)}
          fill="#2A7850"
          fontSize="12"
          fontFamily="JetBrains Mono"
          fontWeight="700"
        >
          ({fmt(time)} s, {fmt(finalVelocity)} m/s)
        </text>
      </svg>

      <div className="mt-3 rounded-[10px] bg-pico-softBlue px-3.5 py-2.5 text-[12.5px] leading-relaxed text-[#2A60A8]">
        The graph ends at{' '}
        <FormulaBlock size="sm" className="font-bold text-[#2A60A8]">
          {fmt(finalVelocity)} m/s
        </FormulaBlock>
        , so the answer describes velocity.
      </div>
    </Card>
  );
}
