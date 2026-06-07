const legendItems = [
  { label: 'Numbers', className: 'bg-pico-blue' },
  { label: 'Units', className: 'bg-pico-green' },
  { label: 'Needs check', className: 'bg-[#F6C85F]' },
  { label: 'Variables/formulas', className: 'bg-[#8B6FD4]' },
];

export function HighlightLegend() {
  return (
    <div className="flex flex-wrap gap-2">
      {legendItems.map((item) => (
        <div
          key={item.label}
          className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-pico-secondary"
        >
          <span className={`h-2 w-2 rounded-full ${item.className}`} aria-hidden="true" />
          {item.label}
        </div>
      ))}
    </div>
  );
}
