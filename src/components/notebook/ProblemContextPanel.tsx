import type { NotebookProblem } from '../../data/mockNotebook';
import { FormulaBlock } from '../math/FormulaBlock';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { KnownValueRow } from './KnownValueRow';

type ProblemContextPanelProps = {
  problem: NotebookProblem;
};

export function ProblemContextPanel({ problem }: ProblemContextPanelProps) {
  return (
    <Card className="flex flex-col gap-5 px-5 py-5">
      <div>
        <h2 className="text-[17px] font-extrabold tracking-[-0.02em] text-pico-text">
          Current problem
        </h2>
        <p className="mt-2 text-[13px] leading-relaxed text-pico-secondary">
          {problem.statement}
        </p>
      </div>

      <div>
        <div className="p-section-lbl mb-2.5">Known values</div>
        <div className="flex flex-col gap-2">
          {problem.knownValues.map((value) => (
            <KnownValueRow
              key={value.label}
              label={value.label}
              description={value.description}
            />
          ))}
        </div>
      </div>

      <div>
        <div className="p-section-lbl mb-2.5">Goal</div>
        <div className="inline-flex rounded-[10px] bg-pico-softBlue px-3.5 py-2">
          <FormulaBlock size="sm" className="font-bold text-pico-blue">
            {problem.goal}
          </FormulaBlock>
        </div>
      </div>

      <div>
        <div className="p-section-lbl mb-2.5">Suggested formula</div>
        <div className="rounded-xl bg-pico-soft px-3.5 py-3">
          <FormulaBlock className="font-semibold">{problem.suggestedFormula}</FormulaBlock>
        </div>
        <Button variant="ghost" size="xs" className="mt-2 text-pico-blue">
          Why this formula?
        </Button>
      </div>
    </Card>
  );
}
