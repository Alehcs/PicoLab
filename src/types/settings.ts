export type SettingToggleKey =
  | 'saveLearningHistory'
  | 'useLearningSignals'
  | 'coachPanelVisibility'
  | 'dailyChallengeReminder'
  | 'streakReminder'
  | 'weeklyProgressSummary'
  | 'lightMode'
  | 'comfortableLayout'
  | 'largerFormulas'
  | 'reduceMotion'
  | 'highContrastMode'
  | 'profileVisibility';

export type SettingOptionKey = 'hintFrequency' | 'explanationStyle' | 'encouragementTone' | 'accentColor';

export type SettingsState = Record<SettingToggleKey, boolean> &
  Record<SettingOptionKey, string>;

export type SettingRowData =
  | {
      id: SettingToggleKey;
      type: 'toggle';
      label: string;
      description?: string;
    }
  | {
      id: SettingOptionKey;
      type: 'segment';
      label: string;
      description?: string;
      options: Array<{ label: string; value: string }>;
    }
  | {
      id: string;
      type: 'action';
      label: string;
      description?: string;
      actionLabel: string;
      destructive?: boolean;
      disabled?: boolean;
    };

export type SettingGroup = {
  title: string;
  rows: SettingRowData[];
};
