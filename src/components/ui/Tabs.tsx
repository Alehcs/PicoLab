export type TabItem<TValue extends string = string> = {
  label: string;
  value: TValue;
};

type TabsProps<TValue extends string = string> = {
  items: Array<TabItem<TValue>>;
  value: TValue;
  onChange: (value: TValue) => void;
  ariaLabel: string;
};

export function Tabs<TValue extends string = string>({
  items,
  value,
  onChange,
  ariaLabel,
}: TabsProps<TValue>) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className="inline-flex w-fit gap-1 rounded-xl bg-pico-soft p-1"
    >
      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          role="tab"
          aria-selected={item.value === value}
          className={`p-tab${item.value === value ? ' active' : ''}`}
          onClick={() => onChange(item.value)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
