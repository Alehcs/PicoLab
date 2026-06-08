type SegmentOption = {
  label: string;
  value: string;
};

type SegmentedControlProps = {
  value: string;
  options: SegmentOption[];
  onChange: (value: string) => void;
  ariaLabel: string;
};

export function SegmentedControl({ value, options, onChange, ariaLabel }: SegmentedControlProps) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className="flex w-fit max-w-full flex-wrap gap-0.5 rounded-[9px] bg-pico-soft p-[3px]"
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={value === option.value}
          onClick={() => onChange(option.value)}
          className={`rounded-[7px] px-3 py-1.5 text-[12.5px] leading-tight transition ${
            value === option.value
              ? 'bg-white font-semibold text-pico-text shadow-[0_1px_3px_rgba(0,0,0,0.08)]'
              : 'bg-transparent font-normal text-pico-secondary'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
