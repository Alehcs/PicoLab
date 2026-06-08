type ToggleSwitchProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  accentColor?: string;
  label: string;
};

export function ToggleSwitch({ checked, onChange, accentColor = '#4A90E2', label }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className="relative h-[22px] w-[38px] shrink-0 rounded-full border-0 p-0 transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[rgba(74,144,226,0.18)]"
      style={{ background: checked ? accentColor : '#D4D9CF' }}
    >
      <span
        className="absolute top-[3px] h-4 w-4 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.22)] transition-[left]"
        style={{ left: checked ? 19 : 3 }}
      />
    </button>
  );
}
