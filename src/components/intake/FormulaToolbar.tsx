import { formulaToolbarGroups } from '../../data/mockProblem';

type FormulaToolbarProps = {
  onTokenClick: (token: string) => void;
};

export function FormulaToolbar({ onTokenClick }: FormulaToolbarProps) {
  return (
    <div className="flex flex-col gap-4">
      {formulaToolbarGroups.map((group) => (
        <div key={group.label}>
          <div className="p-section-lbl mb-2">{group.label}</div>
          <div className="flex flex-wrap gap-1.5">
            {group.tokens.map((token) => (
              <button
                key={token}
                type="button"
                className="rounded-[7px] border-[1.5px] border-pico-border bg-white px-2.5 py-1.5 font-mono text-[13px] text-pico-text transition hover:border-[#A8C8EC] hover:bg-pico-softBlue hover:text-pico-blue"
                onClick={() => onTokenClick(token)}
              >
                {token}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
