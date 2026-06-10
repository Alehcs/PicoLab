import { Check, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormulaToolbar } from '../components/intake/FormulaToolbar';
import { UploadDropzone } from '../components/intake/UploadDropzone';
import { PageHeader } from '../components/layout/PageHeader';
import { FormulaBlock } from '../components/math/FormulaBlock';
import { PicoNote } from '../components/pico/PicoNote';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Tabs, type TabItem } from '../components/ui/Tabs';
import { sampleProblem, topicChips } from '../data/mockProblem';
import { picolabApi } from '../services/picolabApi';
import { writeCurrentParsedProblem, writeInputSource } from '../services/problemSession';

type AddProblemTab = 'scan' | 'type' | 'formula';

const tabs: Array<TabItem<AddProblemTab>> = [
  { value: 'scan', label: 'Scan image' },
  { value: 'type', label: 'Type problem' },
  { value: 'formula', label: 'Formula editor' },
];

export function AddProblemPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<AddProblemTab>('scan');
  const [uploaded, setUploaded] = useState(false);
  const [problemText, setProblemText] = useState('');
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [formulaText, setFormulaText] = useState('v = v₀ + at');
  const [pendingAction, setPendingAction] = useState<'reading' | 'scanning' | null>(null);

  const toggleChip = (chip: string) => {
    setSelectedChips((current) =>
      current.includes(chip) ? current.filter((item) => item !== chip) : [...current, chip],
    );
  };

  const goToScanConfirm = () => navigate('/scan-confirm');

  const analyzeProblem = async () => {
    if (pendingAction) return;

    setPendingAction('reading');
    writeInputSource('typed');

    try {
      const text = problemText.trim() || sampleProblem.text;
      const result = await picolabApi.parseProblem({
        mode: 'typed',
        text,
        subjectHint: selectedChips.some((chip) => chip === 'Algebra steps' || chip === 'Linear functions')
          ? 'math'
          : 'physics',
      });

      if (result.ok) {
        writeCurrentParsedProblem(result.data);
      }

      goToScanConfirm();
    } catch {
      goToScanConfirm();
    } finally {
      setPendingAction(null);
    }
  };

  const analyzeFormula = async () => {
    if (pendingAction) return;

    setPendingAction('reading');
    writeInputSource('formula');

    try {
      const result = await picolabApi.parseProblem({
        mode: 'formula',
        formula: formulaText,
        text: sampleProblem.text,
        subjectHint: 'physics',
      });

      if (result.ok) {
        writeCurrentParsedProblem(result.data);
      }

      goToScanConfirm();
    } catch {
      goToScanConfirm();
    } finally {
      setPendingAction(null);
    }
  };

  const scanSampleProblem = async () => {
    if (pendingAction) return;

    setPendingAction('scanning');
    writeInputSource('scan');

    try {
      const result = await picolabApi.scanProblem({
        imageId: 'sample-scan',
        subjectHint: 'physics',
      });

      if (result.ok) {
        writeCurrentParsedProblem(result.data);
      }

      goToScanConfirm();
    } catch {
      goToScanConfirm();
    } finally {
      setPendingAction(null);
    }
  };

  return (
    <div className="p-fade max-w-[860px]">
      <PageHeader
        eyebrow="New problem"
        title="Add Problem"
        subtitle="Scan, type, or build a formula. Pico will help structure the details before you solve."
      />

      <div className="mb-7">
        <Tabs items={tabs} value={tab} onChange={setTab} ariaLabel="Add problem method" />
      </div>

      {tab === 'scan' ? (
        <div className="p-fade">
          <UploadDropzone
            uploaded={uploaded}
            onUpload={() => setUploaded(true)}
            onSampleScan={scanSampleProblem}
            disabled={Boolean(pendingAction)}
          />

          {pendingAction === 'scanning' ? (
            <div className="p-fade mt-3.5 rounded-[10px] bg-pico-softBlue px-4 py-2.5 text-[12.5px] font-medium text-[#2A60A8]">
              Pico is scanning the problem...
            </div>
          ) : null}

          <div className="mt-3.5 flex items-center gap-2 rounded-[10px] bg-pico-softGreen px-4 py-2.5 text-[12.5px] text-[#2A7850]">
            <Check size={14} aria-hidden="true" />
            You’ll always confirm the extracted problem before solving.
          </div>
        </div>
      ) : null}

      {tab === 'type' ? (
        <div className="p-fade flex flex-col gap-[18px]">
          <div>
            <textarea
              className="min-h-[128px] w-full rounded-xl border-[1.5px] border-pico-border bg-[#FAFBF8] px-4 py-3.5 text-sm leading-relaxed text-pico-text outline-none transition focus:border-pico-blue focus:bg-white focus:shadow-[0_0_0_3px_rgba(74,144,226,0.10)]"
              placeholder="Example: A car starts from rest and accelerates at 2 m/s² for 5 s. What is its final velocity?"
              value={problemText}
              onChange={(event) => setProblemText(event.target.value)}
            />
            <p className="mt-2 text-[12.5px] leading-relaxed text-pico-muted">
              You can write naturally — Pico will structure the problem for you.
            </p>
          </div>

          <div>
            <div className="p-section-lbl mb-2.5">Topic chips</div>
            <div className="flex flex-wrap gap-2">
              {topicChips.map((chip) => {
                const selected = selectedChips.includes(chip);
                return (
                  <button
                    key={chip}
                    type="button"
                    className={`rounded-full border-[1.5px] px-3.5 py-1.5 text-[12.5px] font-medium transition ${
                      selected
                        ? 'border-[#A8C8EC] bg-pico-softBlue text-[#3A7ACC]'
                        : 'border-pico-border bg-white text-pico-secondary hover:border-[#A8C8EC] hover:bg-pico-softBlue hover:text-[#3A7ACC]'
                    }`}
                    onClick={() => toggleChip(chip)}
                  >
                    {chip}
                  </button>
                );
              })}
            </div>
          </div>

          {pendingAction === 'reading' ? (
            <div className="p-fade rounded-[10px] bg-pico-softBlue px-4 py-2.5 text-[12.5px] font-medium text-[#2A60A8]">
              Pico is reading the problem...
            </div>
          ) : null}

          <Button
            className={`min-w-[160px] ${!problemText.trim() && !pendingAction ? 'opacity-60' : ''}`}
            onClick={analyzeProblem}
            disabled={Boolean(pendingAction)}
            title={!problemText.trim() ? 'Will analyze sample problem' : undefined}
          >
            <Sparkles size={15} />
            {pendingAction === 'reading' ? 'Analyzing...' : 'Analyze problem'}
          </Button>
        </div>
      ) : null}

      {tab === 'formula' ? (
        <div className="p-fade flex flex-col gap-[18px]">
          <FormulaToolbar onTokenClick={(token) => setFormulaText((current) => `${current}${token}`)} />

          <div>
            <div className="p-section-lbl mb-2">Formula input</div>
            <input
              className="p-mono w-full rounded-xl border-[1.5px] border-pico-border bg-[#FAFBF8] px-4 py-3 text-lg text-pico-text outline-none transition focus:border-pico-blue focus:bg-white focus:shadow-[0_0_0_3px_rgba(74,144,226,0.10)]"
              value={formulaText}
              onChange={(event) => setFormulaText(event.target.value)}
            />
          </div>

          <Card className="px-6 py-5">
            <div className="p-section-lbl mb-3">Formula preview</div>
            <FormulaBlock size="lg" className="font-semibold">
              {formulaText}
            </FormulaBlock>
          </Card>

          <PicoNote>Use the formula editor when signs, powers, roots, or units matter.</PicoNote>

          {pendingAction === 'reading' ? (
            <div className="p-fade rounded-[10px] bg-pico-softBlue px-4 py-2.5 text-[12.5px] font-medium text-[#2A60A8]">
              Pico is reading the problem...
            </div>
          ) : null}

          <Button className="w-fit" onClick={analyzeFormula} disabled={Boolean(pendingAction)}>
            <Sparkles size={15} />
            Use this formula
          </Button>
        </div>
      ) : null}

      {tab !== 'scan' ? (
        <Card variant="blue" className="mt-6 px-4 py-3">
          <p className="text-[12.5px] leading-relaxed text-[#2A60A8]">
            Sample problem available for this phase: {sampleProblem.text}
          </p>
        </Card>
      ) : null}
    </div>
  );
}
