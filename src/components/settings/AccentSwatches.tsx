type AccentSwatchesProps = {
  value: string;
  colors: string[];
  onChange: (value: string) => void;
};

export function AccentSwatches({ value, colors, onChange }: AccentSwatchesProps) {
  return (
    <div className="flex flex-wrap items-center gap-2" role="radiogroup" aria-label="Accent color">
      {colors.map((color) => (
        <button
          key={color}
          type="button"
          role="radio"
          aria-checked={value === color}
          aria-label={`Accent ${color}`}
          title={color}
          onClick={() => onChange(color)}
          className="h-[22px] w-[22px] rounded-full border-0 transition-transform focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[rgba(74,144,226,0.18)]"
          style={{
            background: color,
            outline: value === color ? `2.5px solid ${color}` : '2.5px solid transparent',
            outlineOffset: 2,
            transform: value === color ? 'scale(1.18)' : 'scale(1)',
          }}
        />
      ))}
    </div>
  );
}
