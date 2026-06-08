import { Check, Edit3, RefreshCw, RotateCw, Search, ZoomIn, ZoomOut } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DetectedValueCard } from '../components/intake/DetectedValueCard';
import { HighlightLegend } from '../components/intake/HighlightLegend';
import { ScanPreview } from '../components/intake/ScanPreview';
import { PageHeader } from '../components/layout/PageHeader';
import { FormulaBlock } from '../components/math/FormulaBlock';
import { PicoMascot } from '../components/pico/PicoMascot';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { sampleProblem } from '../data/mockProblem';
import { picolabApi } from '../services/picolabApi';
import {
  readCurrentParsedProblem,
  writeCurrentParsedProblem,
  writeCurrentProblem,
} from '../services/problemSession';
import type { ParsedProblem } from '../types/api';

export function ScanConfirmPage() {
  const navigate = useNavigate();
  const [problemText, setProblemText] = useState(sampleProblem.text);
  const [parsedProblem, setParsedProblem] = useState<ParsedProblem | null>(null);
  const [reviewState, setReviewState] = useState<'ready' | 'details' | 'rechecked'>('ready');
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    const storedProblem = readCurrentParsedProblem();

    if (storedProblem) {
      setParsedProblem(storedProblem);
      setProblemText(storedProblem.statement);
    }
  }, []);

  const detectedDetails = useMemo(() => {
    if (!parsedProblem?.extractedDetails.length) {
      return sampleProblem.detectedValues;
    }

    return parsedProblem.extractedDetails.map((detail) => ({
      value: detail.unit ? `${detail.value} ${detail.unit}` : detail.value,
      description: detail.label,
    }));
  }, [parsedProblem]);

  const primaryAmbiguity = parsedProblem?.ambiguities[0];

  const startNotebook = async () => {
    if (confirming) return;

    setConfirming(true);

    try {
      const problemForConfirm: ParsedProblem =
        parsedProblem ?? {
          draftProblemId: 'draft-final-velocity',
          statement: sampleProblem.text,
          subject: 'physics',
          topic: 'Kinematics',
          extractedDetails: [],
          ambiguities: [],
          suggestedFormula: 'v = v₀ + at',
          reviewNote: 'Review the extracted details before starting the Smart Notebook.',
        };
      const reviewedProblem = {
        ...problemForConfirm,
        statement: problemText,
      };
      writeCurrentParsedProblem(reviewedProblem);

      const result = await picolabApi.confirmProblem(reviewedProblem.draftProblemId, reviewedProblem);

      if (result.ok) {
        writeCurrentProblem(result.data);
      }

      navigate('/smart-notebook');
    } catch {
      navigate('/smart-notebook');
    } finally {
      setConfirming(false);
    }
  };

  return (
    <div className="p-fade">
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <PageHeader
          eyebrow="Review scan → Start solving"
          title="Check the details"
          subtitle="Pico highlighted the numbers, signs, formulas, and units it found. Review them before solving."
        />

        <div className="flex w-fit items-center gap-2 rounded-full border-[1.5px] border-pico-border bg-white px-3 py-2 text-[12px] font-semibold text-pico-secondary">
          <span className="rounded-full bg-pico-softBlue px-2 py-1 text-pico-blue">Review scan</span>
          <span className="text-pico-muted">→</span>
          <span>Start solving</span>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
        <aside className="flex flex-col gap-4 rounded-[18px] border-[1.5px] border-pico-border bg-white p-5 lg:p-6">
          <div>
            <h2 className="text-[17px] font-extrabold tracking-[-0.02em] text-pico-text">
              Original scan
            </h2>
            <p className="mt-1 text-[12.5px] leading-relaxed text-pico-secondary">
              Zoom in to check exponents, negative signs, and units.
            </p>
          </div>

          <ScanPreview />
          <HighlightLegend />

          <div className="flex flex-wrap gap-2">
            <Button variant="ghost" size="sm">
              <ZoomIn size={13} />
              Zoom in
            </Button>
            <Button variant="ghost" size="sm">
              <ZoomOut size={13} />
              Zoom out
            </Button>
            <Button variant="ghost" size="sm">
              <RotateCw size={13} />
              Rotate
            </Button>
            <Button variant="ghost" size="sm">
              <RefreshCw size={13} />
              Replace image
            </Button>
          </div>
        </aside>

        <section className="flex min-w-0 flex-col gap-[18px]">
          <Card className="px-[22px] py-[18px]">
            <div className="p-section-lbl mb-2.5">Extracted problem</div>
            <textarea
              className="min-h-[96px] w-full rounded-xl border-[1.5px] border-pico-border bg-[#FAFBF8] px-4 py-3 text-sm leading-[1.7] text-pico-text outline-none transition focus:border-pico-blue focus:bg-white focus:shadow-[0_0_0_3px_rgba(74,144,226,0.10)]"
              value={problemText}
              onChange={(event) => setProblemText(event.target.value)}
            />
            <p className="mt-2 text-[12.5px] leading-relaxed text-pico-muted">
              Edit anything that looks off. Pico will use this version for the notebook.
            </p>
          </Card>

          <Card className="px-[22px] py-[18px]">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="p-section-lbl">Detected details</div>
              <Badge variant="blue">Editable</Badge>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {detectedDetails.map((detail) => (
                <DetectedValueCard
                  key={detail.value}
                  value={detail.value}
                  description={detail.description}
                />
              ))}
            </div>
          </Card>

          <Card variant="hint" className="px-4 py-3.5">
            <div className="flex gap-3">
              <Search size={16} className="mt-0.5 shrink-0 text-[#8A6018]" aria-hidden="true" />
              <div>
                <div className="text-[13px] font-bold text-[#7A5010]">Needs a quick check</div>
                <p className="mt-1 text-[13px] leading-relaxed text-[#7A5010]">
                  {primaryAmbiguity ? (
                    primaryAmbiguity.question
                  ) : (
                    <>
                      I’m not sure if this says{' '}
                      <FormulaBlock size="sm" className="font-bold text-[#7A5010]">
                        5 s
                      </FormulaBlock>{' '}
                      or{' '}
                      <FormulaBlock size="sm" className="font-bold text-[#7A5010]">
                        55 s
                      </FormulaBlock>
                      .
                    </>
                  )}{' '}
                  Please confirm before solving.
                </p>
              </div>
            </div>
          </Card>

          <Card className="border-[#B8D8F4] bg-pico-softBlue px-4 py-3.5">
            <div className="flex items-start gap-3">
              <PicoMascot size={34} />
              <p className="text-[13.5px] leading-[1.65] text-[#2A60A8]">
                I found a motion problem. The units suggest we are solving for final velocity, so
                the answer should likely be in{' '}
                <FormulaBlock size="sm" className="font-bold text-[#2A60A8]">
                  m/s
                </FormulaBlock>
                .
              </p>
            </div>
          </Card>

          {reviewState !== 'ready' ? (
            <div className="p-fade rounded-[10px] bg-pico-softGreen px-4 py-2.5 text-[12.5px] font-medium text-[#2A7850]">
              {reviewState === 'details'
                ? 'Details are ready for editing.'
                : 'Pico re-checked the visible details in this mock scan.'}
            </div>
          ) : null}

          {confirming ? (
            <div className="p-fade rounded-[10px] bg-pico-softBlue px-4 py-2.5 text-[12.5px] font-medium text-[#2A60A8]">
              Pico is setting up your notebook...
            </div>
          ) : null}

          <div className="flex flex-wrap gap-2.5">
            <Button variant="secondary" onClick={() => setReviewState('ready')} disabled={confirming}>
              <Check size={15} />
              Looks good
            </Button>
            <Button variant="secondary" onClick={() => setReviewState('details')} disabled={confirming}>
              <Edit3 size={14} />
              Edit details
            </Button>
            <Button variant="secondary" onClick={() => setReviewState('rechecked')} disabled={confirming}>
              <RefreshCw size={14} />
              Re-check details
            </Button>
            <Button onClick={startNotebook} disabled={confirming}>
              Start solving in Smart Notebook
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
