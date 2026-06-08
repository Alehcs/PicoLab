import type { AnswerOption } from '../../types/mission';
import { FormulaBlock } from '../math/FormulaBlock';

type AnswerOptionButtonProps = {
  option: AnswerOption;
  selected: boolean;
  checked: boolean;
  correct: boolean;
  onSelect: () => void;
};

export function AnswerOptionButton({
  option,
  selected,
  checked,
  correct,
  onSelect,
}: AnswerOptionButtonProps) {
  const stateClass = checked
    ? correct
      ? 'border-[#C0E8D0] bg-pico-softGreen text-[#2A7850]'
      : selected
        ? 'border-[#FDE6BA] bg-pico-softYellow text-[#886018]'
        : 'border-pico-border bg-white text-pico-secondary'
    : selected
      ? 'border-[#A8C8EC] bg-pico-softBlue text-pico-blue'
      : 'border-pico-border bg-white text-pico-secondary hover:border-[#A8C8EC] hover:bg-pico-softBlue';

  return (
    <button
      type="button"
      className={`flex items-center gap-3 rounded-xl border-[1.5px] px-4 py-3 text-left text-[13.5px] font-semibold transition ${stateClass}`}
      onClick={onSelect}
      aria-pressed={selected}
    >
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[8px] bg-pico-soft text-[11px] font-bold text-pico-muted">
        {option.id === 'meters'
          ? 'A'
          : option.id === 'meters-per-second'
            ? 'B'
            : option.id === 'meters-per-second-squared'
              ? 'C'
              : 'D'}
      </span>
      <FormulaBlock size="sm" className="font-bold">
        {option.label}
      </FormulaBlock>
    </button>
  );
}
