import { MessageCircle, Route, Signal, Sparkles, Target } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ActivityItem } from '../components/profile/ActivityItem';
import { AchievementBadgeCard } from '../components/profile/AchievementBadgeCard';
import { LeagueProgressCard } from '../components/profile/LeagueProgressCard';
import { LearningGoalsCard } from '../components/profile/LearningGoalsCard';
import { ProfileSummaryCard } from '../components/profile/ProfileSummaryCard';
import { QuoteCard } from '../components/profile/QuoteCard';
import { SubjectFocusCard } from '../components/profile/SubjectFocusCard';
import { PageHeader } from '../components/layout/PageHeader';
import { AskPicoDrawer } from '../components/pico/AskPicoDrawer';
import { PicoMascot } from '../components/pico/PicoMascot';
import { PicoNote } from '../components/pico/PicoNote';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Tabs, type TabItem } from '../components/ui/Tabs';
import {
  leagueProgress,
  learnerProfile,
  learningGoals,
  mockAchievements,
  mockActivity,
  mockProfileStats,
  mockSubjectProgress,
  picoQuotes,
  profileProgressSummary,
} from '../data/mockProfile';

type ProfileTab = 'subjects' | 'progress' | 'achievements' | 'history' | 'quote';

const profileTabs: TabItem<ProfileTab>[] = [
  { label: 'Subject Focus', value: 'subjects' },
  { label: 'Progress', value: 'progress' },
  { label: 'Achievements', value: 'achievements' },
  { label: 'History', value: 'history' },
  { label: 'Pico Quote', value: 'quote' },
];

export function ProfilePage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<ProfileTab>('subjects');
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [goalsTouched, setGoalsTouched] = useState(false);
  const [askPicoOpen, setAskPicoOpen] = useState(false);

  const unlockedAchievements = mockAchievements.filter((achievement) => achievement.unlocked);
  const upcomingAchievements = mockAchievements.filter((achievement) => !achievement.unlocked);

  const renderTab = () => {
    if (tab === 'subjects') {
      return (
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          {mockSubjectProgress.map((subject) => (
            <SubjectFocusCard key={subject.name} subject={subject} />
          ))}
        </div>
      );
    }

    if (tab === 'progress') {
      return (
        <div className="flex flex-col gap-3.5">
          <div className="grid gap-3 md:grid-cols-3">
            <Card variant="blue" className="px-4 py-3">
              <div className="mb-1.5 flex items-center gap-1.5">
                <Route size={13} className="text-[#2770C2]" aria-hidden="true" />
                <span className="p-section-lbl text-[#2770C2]">Current path</span>
              </div>
              <div className="text-[14px] font-extrabold tracking-[-0.02em] text-pico-text">
                {profileProgressSummary.currentPath}
              </div>
              <div className="mt-2">
                <ProgressBar
                  value={profileProgressSummary.pathProgress}
                  color="var(--pico-blue)"
                  label="Path progress"
                />
              </div>
              <div className="mt-1.5 text-[11.5px] text-pico-secondary">
                {profileProgressSummary.pathProgress}% complete
              </div>
            </Card>

            <Card variant="progress" className="px-4 py-3">
              <div className="mb-1.5 flex items-center gap-1.5">
                <Sparkles size={13} className="text-[#2A7850]" aria-hidden="true" />
                <span className="p-section-lbl text-[#2A7850]">Strongest skill</span>
              </div>
              <div className="text-[14px] font-extrabold tracking-[-0.02em] text-pico-text">
                {profileProgressSummary.strongestSkill}
              </div>
              <div className="mt-1 text-[11.5px] text-pico-secondary">
                Consistent across sessions
              </div>
            </Card>

            <Card variant="hint" className="px-4 py-3">
              <div className="mb-1.5 flex items-center gap-1.5">
                <Signal size={13} className="text-[#886018]" aria-hidden="true" />
                <span className="p-section-lbl text-[#886018]">Focus area</span>
              </div>
              <div className="text-[14px] font-extrabold tracking-[-0.02em] text-pico-text">
                {profileProgressSummary.focusArea}
              </div>
              <div className="mt-1 text-[11.5px] text-pico-secondary">
                Improving across missions
              </div>
            </Card>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <div className="flex items-center gap-2.5 rounded-[11px] bg-pico-softCoral px-4 py-2">
              <span className="text-[17px] font-extrabold text-[#BF3A3A]">
                {profileProgressSummary.dailyChallengeStreak}
              </span>
              <span className="text-[12.5px] text-[#BF3A3A]/80">daily challenge streak</span>
            </div>
            <div className="flex items-center gap-2.5 rounded-[11px] bg-pico-softGreen px-4 py-2">
              <span className="text-[17px] font-extrabold text-[#2A7850]">
                {profileProgressSummary.learningSignalsImproved}
              </span>
              <span className="text-[12.5px] text-[#2A7850]/80">learning signals improved</span>
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-[14px] bg-pico-soft p-4 sm:flex-row sm:items-start">
            <PicoMascot size={36} />
            <div className="min-w-0 flex-1">
              <p className="text-[13.5px] italic leading-relaxed text-pico-text">
                {profileProgressSummary.picoInsight}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button size="sm" onClick={() => navigate('/growth-path')}>
                  <Route size={13} />
                  View Growth Path
                </Button>
                <Button variant="secondary" size="sm" onClick={() => navigate('/practice-missions')}>
                  Start next mission
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setTab('achievements')}>
                  Review achievements
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (tab === 'achievements') {
      return (
        <div className="flex flex-col gap-5">
          <section>
            <div className="mb-3 text-[12.5px] font-bold text-pico-text">
              Unlocked badges{' '}
              <span className="ml-1 font-medium text-pico-muted">{unlockedAchievements.length} badges</span>
            </div>
            <div className="grid gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
              {unlockedAchievements.map((achievement) => (
                <AchievementBadgeCard key={achievement.id} achievement={achievement} />
              ))}
            </div>
          </section>

          <section className="border-t border-pico-border pt-4">
            <div className="mb-3 text-[12.5px] font-bold text-pico-text">
              Upcoming badges <span className="ml-1 font-medium text-pico-muted">keep going</span>
            </div>
            <div className="grid gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
              {upcomingAchievements.map((achievement) => (
                <AchievementBadgeCard key={achievement.id} achievement={achievement} />
              ))}
            </div>
          </section>
        </div>
      );
    }

    if (tab === 'history') {
      return (
        <div>
          {mockActivity.map((activity, index) => (
            <ActivityItem
              key={activity.id}
              activity={activity}
              isLast={index === mockActivity.length - 1}
            />
          ))}
        </div>
      );
    }

    return (
      <QuoteCard
        quote={picoQuotes[quoteIndex]}
        onNewQuote={() => setQuoteIndex((index) => (index + 1) % picoQuotes.length)}
      />
    );
  };

  return (
    <div className="p-fade">
      <PageHeader
        title="Profile"
        subtitle="Your learning identity, goals, progress, and achievements with Pico."
        actions={
          <>
            <Button onClick={() => navigate('/practice-missions')}>
              <Target size={15} />
              Start daily challenge
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setAskPicoOpen(true)}>
              <MessageCircle size={13} />
              Ask Pico
            </Button>
          </>
        }
      />

      <div className="flex max-w-[900px] flex-col gap-3.5">
        <ProfileSummaryCard learner={learnerProfile} stats={mockProfileStats} />

        <div className="grid gap-3.5 lg:grid-cols-2">
          <LeagueProgressCard league={leagueProgress} />
          <LearningGoalsCard goals={learningGoals} onEditGoals={() => setGoalsTouched(true)} />
        </div>

        {goalsTouched ? (
          <PicoNote>Goal editing is mocked for this migration. Your current goals stay visible.</PicoNote>
        ) : null}

        <Card className="overflow-hidden">
          <div className="border-b border-pico-border px-5 py-3">
            <div className="overflow-x-auto">
              <Tabs items={profileTabs} value={tab} onChange={setTab} ariaLabel="Profile tabs" />
            </div>
          </div>
          <div key={tab} className="p-fade px-5 py-5">
            {renderTab()}
          </div>
        </Card>

        <div className="flex flex-wrap gap-2 pt-1">
          <Badge variant="blue">Current league: {learnerProfile.league}</Badge>
          <Badge variant="yellow">{leagueProgress.points} PicoPoints</Badge>
          <Badge variant="green">{unlockedAchievements.length} badges unlocked</Badge>
        </div>
      </div>

      <AskPicoDrawer
        open={askPicoOpen}
        context="profile"
        onClose={() => setAskPicoOpen(false)}
      />
    </div>
  );
}
