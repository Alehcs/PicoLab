import { ChevronRight, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FormulaBlock } from '../components/math/FormulaBlock';
import { PicoMascot } from '../components/pico/PicoMascot';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { homeStats, homeSummaryCards } from '../data/mockHome';

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="p-fade flex flex-col gap-6 xl:-m-8 xl:h-[calc(100vh-0px)] xl:flex-row xl:overflow-hidden">
      <section className="min-w-0 flex-1 xl:overflow-y-auto xl:px-9 xl:py-8">
        <header className="mb-7">
          <h1 className="text-[26px] font-extrabold leading-[1.15] tracking-[-0.035em] text-pico-text">
            Welcome back, Alex.
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-pico-secondary">
            Ready to turn today's mistakes into learning signals?
          </p>
        </header>

        <Card className="p-dot-grid mb-5 overflow-hidden rounded-[22px]">
          <div className="relative bg-white/80 px-7 py-8 md:px-9">
            <div className="pointer-events-none absolute right-6 top-6 select-none text-[36px] font-bold tracking-[-0.02em] text-[rgba(74,144,226,0.07)] md:right-8 md:text-[42px]">
              <FormulaBlock size="lg" className="text-[rgba(74,144,226,0.07)]">
                v = v₀ + at
              </FormulaBlock>
            </div>

            <Badge variant="blue" className="mb-3.5">
              Start here
            </Badge>
            <h2 className="max-w-[460px] text-[21px] font-extrabold leading-tight tracking-[-0.03em] text-pico-text">
              Learn from the step,
              <br />
              not just the answer.
            </h2>
            <p className="mt-2.5 max-w-[500px] text-[13.5px] leading-[1.7] text-pico-secondary">
              Solve math and physics step by step, visualize what matters, and turn mistakes into
              practice.
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              <Button onClick={() => navigate('/add-problem')}>
                <Target size={15} />
                Start a mission
              </Button>
              <Button variant="secondary" onClick={() => navigate('/smart-notebook')}>
                Try sample problem
              </Button>
            </div>
          </div>
        </Card>

        <Card className="mb-5 px-5 py-[18px] md:px-[22px]">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0 flex-1">
              <div className="p-section-lbl mb-2.5">Recent learning signal</div>
              <div className="mb-2.5 flex flex-wrap items-center gap-2.5">
                <span className="text-xs font-medium text-pico-secondary">Issue</span>
                <Badge variant="coral">Unit mismatch</Badge>
                <FormulaBlock size="md" className="font-semibold">
                  v = 10 m → 10 m/s
                </FormulaBlock>
              </div>
              <div className="rounded-[11px] bg-pico-softCoral px-3.5 py-2.5 text-[13px] leading-relaxed text-[#B83030]">
                <span className="font-bold">Unit mismatch: </span>
                Your calculation was right, but the final unit needed adjustment.
              </div>
            </div>

            <div className="shrink-0 md:pt-1 md:text-center">
              <Badge variant="coral">Learning signal noticed</Badge>
              <div className="mt-2.5">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs"
                  onClick={() => navigate('/smart-notebook')}
                >
                  Open Notebook
                  <ChevronRight size={13} />
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid gap-3.5 md:grid-cols-3">
          {homeSummaryCards.map((card) => (
            <div
              key={card.label}
              className={`rounded-2xl border-[1.5px] px-5 py-[18px] ${card.className}`}
            >
              <div className="p-section-lbl mb-2 opacity-75">{card.label}</div>
              <div className="mb-1 text-[15px] font-bold leading-snug">{card.title}</div>
              <p className="text-xs leading-relaxed opacity-75">{card.description}</p>
            </div>
          ))}
        </div>
      </section>

      <aside className="flex shrink-0 flex-col gap-[18px] border-pico-border bg-white p-4 xl:w-56 xl:overflow-y-auto xl:border-l-[1.5px] xl:px-4 xl:py-[22px]">
        <div className="flex flex-col items-center gap-1.5 border-b-[1.5px] border-pico-border pb-4">
          <PicoMascot size={72} />
          <div className="text-[11px] font-bold uppercase tracking-[0.06em] text-pico-muted">
            Pico
          </div>
        </div>

        <div className="text-[13.5px] font-bold text-pico-secondary">Pico's note</div>

        <div className="p-speech-bubble px-3.5 py-3 text-[13.5px] leading-[1.65] text-pico-secondary">
          “Mistakes are useful here. I’ll help you turn each one into a learning signal.”
        </div>

        <div className="p-divider" />

        <div>
          <div className="p-section-lbl mb-2.5">Today's goal</div>
          <Card variant="hint" className="px-3.5 py-3">
            <p className="text-[12.5px] leading-relaxed text-[#886018]">
              Finish 2 practice missions and review 1 visual explanation.
            </p>
            <div className="mt-3">
              <ProgressBar value={45} color="#F6C85F" label="Today's goal progress" />
            </div>
          </Card>
        </div>

        <div className="p-divider" />

        <div>
          <div className="p-section-lbl mb-2.5">Today's snapshot</div>
          <div className="flex flex-col gap-2.5">
            {homeStats.map((stat) => (
              <div key={stat} className="flex items-center gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-pico-green" aria-hidden="true" />
                <span className="text-[12.5px] font-semibold text-pico-secondary">{stat}</span>
              </div>
            ))}
          </div>
        </div>

        <Button
          variant="primary"
          size="sm"
          fullWidth
          className="mt-auto"
          onClick={() => navigate('/growth-path')}
        >
          View Growth Path
          <ChevronRight size={13} />
        </Button>
      </aside>
    </div>
  );
}
