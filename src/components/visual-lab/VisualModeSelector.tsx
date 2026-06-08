import type { VisualMode } from '../../data/mockVisualLab';

type VisualModeSelectorProps = {
  modes: VisualMode[];
};

export function VisualModeSelector({ modes }: VisualModeSelectorProps) {
  return (
    <div className="flex flex-wrap items-center gap-1 rounded-xl bg-pico-soft p-1">
      {modes.map((mode) => (
        <button
          key={mode.id}
          type="button"
          disabled={mode.disabled}
          className={`rounded-[9px] px-3 py-1.5 text-[12.5px] font-semibold transition ${
            mode.active
              ? 'bg-pico-softBlue text-pico-blue'
              : 'text-pico-muted disabled:cursor-not-allowed disabled:opacity-55'
          }`}
          aria-pressed={mode.active ? true : undefined}
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
}
