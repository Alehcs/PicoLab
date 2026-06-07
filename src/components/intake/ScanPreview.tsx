import { scanHighlights } from '../../data/mockProblem';

export function ScanPreview() {
  return (
    <div className="relative aspect-[3/4] shrink-0 overflow-hidden rounded-[14px] border-[1.5px] border-pico-border bg-[#F5F0E8]">
      {Array.from({ length: 14 }).map((_, index) => (
        <div
          // Static notebook ruling, not dynamic data.
          key={`line-${index}`}
          className="absolute left-5 right-5 h-px bg-[rgba(150,160,180,0.18)]"
          style={{ top: `${9 + index * 7.6}%` }}
        />
      ))}

      <div className="absolute left-[9%] right-[7%] top-[12%] font-serif text-[13px] leading-[2.2] text-[#3A3020]">
        <div>A car starts from rest</div>
        <div>
          and accelerates at <strong>2 m/s²</strong>
        </div>
        <div>
          for <strong>5 s</strong>. What is
        </div>
        <div>its final velocity?</div>
        <div className="mt-3 font-mono text-xs">v₀ = 0</div>
        <div className="font-mono text-xs">a = 2 m/s²</div>
        <div className="font-mono text-xs">t = 5 s</div>
        <div className="font-mono text-xs">
          Find: v<sub>f</sub> = ?
        </div>
      </div>

      {scanHighlights.map((highlight) => (
        <div
          key={highlight.id}
          title={highlight.label}
          aria-label={`${highlight.kind}: ${highlight.label}`}
          className={`absolute rounded border-2 transition hover:bg-opacity-25 ${highlight.className}`}
          style={highlight.style}
        />
      ))}
    </div>
  );
}
