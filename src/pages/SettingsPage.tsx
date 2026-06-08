import { MessageCircle } from 'lucide-react';
import { useState } from 'react';

import { AccentSwatches } from '../components/settings/AccentSwatches';
import { SegmentedControl } from '../components/settings/SegmentedControl';
import { SettingsGroup, SettingsRow } from '../components/settings/SettingsGroup';
import { ToggleSwitch } from '../components/settings/ToggleSwitch';
import { PageHeader } from '../components/layout/PageHeader';
import { AskPicoDrawer } from '../components/pico/AskPicoDrawer';
import { PicoNote } from '../components/pico/PicoNote';
import { Button } from '../components/ui/Button';
import { accentColors, initialSettingsState, settingGroups } from '../data/mockSettings';
import type { SettingOptionKey, SettingToggleKey, SettingsState } from '../types/settings';

export function SettingsPage() {
  const [settings, setSettings] = useState<SettingsState>(initialSettingsState);
  const [lastMockAction, setLastMockAction] = useState<string | null>(null);
  const [askPicoOpen, setAskPicoOpen] = useState(false);

  const setToggle = (key: SettingToggleKey, value: boolean) => {
    setSettings((current) => ({ ...current, [key]: value }));
  };

  const setOption = (key: SettingOptionKey, value: string) => {
    setSettings((current) => ({ ...current, [key]: value }));
  };

  return (
    <div className="p-fade">
      <PageHeader
        title="Settings"
        subtitle="Personalize PicoLab, manage your data, and adjust how Pico supports you."
        actions={
          <Button variant="ghost" size="sm" onClick={() => setAskPicoOpen(true)}>
            <MessageCircle size={13} />
            Ask Pico
          </Button>
        }
      />

      <div className="flex max-w-[680px] flex-col gap-6">
        {lastMockAction ? (
          <PicoNote>{lastMockAction} is mocked for this MVP. No account or data changes were made.</PicoNote>
        ) : null}

        {settingGroups.map((group) => (
          <SettingsGroup key={group.title} title={group.title}>
            {group.rows.map((row, index) => {
              const isLast = index === group.rows.length - 1;

              if (row.type === 'toggle') {
                return (
                  <SettingsRow
                    key={row.id}
                    label={row.label}
                    description={row.description}
                    isLast={isLast}
                    control={
                      <ToggleSwitch
                        checked={settings[row.id]}
                        onChange={(checked) => setToggle(row.id, checked)}
                        accentColor={settings.accentColor}
                        label={row.label}
                      />
                    }
                  />
                );
              }

              if (row.type === 'segment') {
                return (
                  <SettingsRow
                    key={row.id}
                    label={row.label}
                    description={row.description}
                    stacked
                    isLast={isLast}
                    control={
                      row.id === 'accentColor' ? (
                        <AccentSwatches
                          value={settings.accentColor}
                          colors={accentColors}
                          onChange={(value) => setOption(row.id, value)}
                        />
                      ) : (
                        <SegmentedControl
                          value={settings[row.id]}
                          options={row.options}
                          onChange={(value) => setOption(row.id, value)}
                          ariaLabel={row.label}
                        />
                      )
                    }
                  />
                );
              }

              return (
                <SettingsRow
                  key={row.id}
                  label={row.label}
                  description={row.description}
                  isLast={isLast}
                  control={
                    <Button
                      variant={row.destructive ? 'coral' : 'secondary'}
                      size="sm"
                      disabled={row.disabled}
                      className={row.disabled ? 'cursor-not-allowed opacity-60' : ''}
                      onClick={() => setLastMockAction(row.label)}
                    >
                      {row.actionLabel}
                    </Button>
                  }
                />
              );
            })}
          </SettingsGroup>
        ))}
      </div>

      <AskPicoDrawer
        open={askPicoOpen}
        context="settings"
        onClose={() => setAskPicoOpen(false)}
      />
    </div>
  );
}
