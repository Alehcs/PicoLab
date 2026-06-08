import { Play } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DailyChallengeCard } from '../components/practice/DailyChallengeCard';
import { FocusMissionCard } from '../components/practice/FocusMissionCard';
import { MissionCompleteCard } from '../components/practice/MissionCompleteCard';
import { PracticeCoachPanel } from '../components/practice/PracticeCoachPanel';
import { RandomMissionCard } from '../components/practice/RandomMissionCard';
import { PageHeader } from '../components/layout/PageHeader';
import { AskPicoDrawer } from '../components/pico/AskPicoDrawer';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { focusMission, randomMissions } from '../data/mockMissions';

export function PracticeMissionsPage() {
  const navigate = useNavigate();
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [randomPreview, setRandomPreview] = useState(randomMissions[0].title);
  const [askPicoOpen, setAskPicoOpen] = useState(false);

  const isComplete = useMemo(
    () => checked && selectedOptionId === focusMission.question.correctOptionId,
    [checked, selectedOptionId],
  );

  const selectOption = (optionId: string) => {
    setSelectedOptionId(optionId);
    setChecked(false);
  };

  const tryRandomMission = () => {
    const currentIndex = randomMissions.findIndex((mission) => mission.title === randomPreview);
    const nextMission = randomMissions[(currentIndex + 1) % randomMissions.length];
    setRandomPreview(nextMission.title);
  };

  return (
    <div className="p-fade">
      <PageHeader
        eyebrow="Practice"
        title="Practice Missions"
        subtitle="Short exercises designed around your current focus area."
        actions={
          <>
            <Badge variant="yellow">Focus: Units in motion</Badge>
            <Button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <Play size={15} />
              Start daily challenge
            </Button>
          </>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
        <main className="min-w-0">
          <section className="mb-6">
            <DailyChallengeCard onStart={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
          </section>

          <section className="mb-6">
            <FocusMissionCard
              selectedOptionId={selectedOptionId}
              checked={checked}
              onSelect={selectOption}
              onCheck={() => setChecked(true)}
              onOpenVisualLab={() => navigate('/visual-lab')}
              onViewGrowthPath={() => navigate('/growth-path')}
            />
          </section>

          {isComplete ? (
            <section className="mb-6">
              <MissionCompleteCard
                onContinueGrowthPath={() => navigate('/growth-path')}
                onTryRandomMission={tryRandomMission}
                onReturnToNotebook={() => navigate('/smart-notebook')}
              />
            </section>
          ) : null}

          <section>
            <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-[18px] font-extrabold tracking-[-0.02em] text-pico-text">
                  Random Missions
                </h2>
                <p className="mt-1 text-[13px] leading-relaxed text-pico-secondary">
                  Keep practicing after the daily challenge and earn extra PicoPoints.
                </p>
              </div>
              <Card variant="blue" className="w-fit px-3 py-2">
                <span className="text-[12px] font-semibold text-[#2A60A8]">
                  Previewing: {randomPreview}
                </span>
              </Card>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {randomMissions.map((mission) => (
                <RandomMissionCard
                  key={mission.id}
                  mission={mission}
                  onStart={() => setRandomPreview(mission.title)}
                />
              ))}
            </div>
          </section>
        </main>

        <aside className="min-w-0">
          <PracticeCoachPanel onAskPico={() => setAskPicoOpen(true)} />
        </aside>
      </div>

      <AskPicoDrawer
        open={askPicoOpen}
        context="practice"
        onClose={() => setAskPicoOpen(false)}
      />
    </div>
  );
}
