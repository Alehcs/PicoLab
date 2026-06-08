import type { SettingGroup, SettingsState } from '../types/settings';

export const initialSettingsState: SettingsState = {
  saveLearningHistory: true,
  useLearningSignals: true,
  coachPanelVisibility: true,
  hintFrequency: 'balanced',
  explanationStyle: 'step-by-step',
  encouragementTone: 'balanced',
  dailyChallengeReminder: true,
  streakReminder: true,
  weeklyProgressSummary: false,
  lightMode: true,
  comfortableLayout: true,
  accentColor: '#4A90E2',
  largerFormulas: false,
  reduceMotion: false,
  highContrastMode: false,
  profileVisibility: true,
};

export const accentColors = ['#4A90E2', '#5FBF8F', '#F47C7C', '#8B6FD4', '#E8943A'];

export const settingGroups: SettingGroup[] = [
  {
    title: 'Privacy & data',
    rows: [
      {
        id: 'saveLearningHistory',
        type: 'toggle',
        label: 'Save learning history',
        description: 'Store your problem attempts and feedback so Pico can show recent work.',
      },
      {
        id: 'useLearningSignals',
        type: 'toggle',
        label: 'Use learning signals to personalize practice',
        description: 'Let Pico adapt Practice Missions from repeated patterns in your work.',
      },
      {
        id: 'export-learning-data',
        type: 'action',
        label: 'Export learning data',
        description: 'Prepare a local export of your history and learning signals.',
        actionLabel: 'Export',
      },
      {
        id: 'delete-learning-data',
        type: 'action',
        label: 'Delete learning data',
        description: 'Mock control for removing saved learning history and signals.',
        actionLabel: 'Delete',
        destructive: true,
        disabled: true,
      },
    ],
  },
  {
    title: 'Pico preferences',
    rows: [
      {
        id: 'coachPanelVisibility',
        type: 'toggle',
        label: 'Coach panel visibility',
        description: 'Show Pico alongside exercises, notebooks, and labs.',
      },
      {
        id: 'hintFrequency',
        type: 'segment',
        label: 'Hint frequency',
        description: 'How often Pico offers hints during practice.',
        options: [
          { label: 'Low', value: 'low' },
          { label: 'Balanced', value: 'balanced' },
          { label: 'High', value: 'high' },
        ],
      },
      {
        id: 'explanationStyle',
        type: 'segment',
        label: 'Explanation style',
        description: 'How Pico explains concepts and feedback.',
        options: [
          { label: 'Simple', value: 'simple' },
          { label: 'Step-by-step', value: 'step-by-step' },
          { label: 'Technical', value: 'technical' },
        ],
      },
      {
        id: 'encouragementTone',
        type: 'segment',
        label: 'Encouragement tone',
        description: 'The style of Pico’s motivational messages.',
        options: [
          { label: 'Calm', value: 'calm' },
          { label: 'Balanced', value: 'balanced' },
          { label: 'More direct', value: 'direct' },
        ],
      },
    ],
  },
  {
    title: 'Notifications',
    rows: [
      {
        id: 'dailyChallengeReminder',
        type: 'toggle',
        label: 'Daily challenge reminder',
        description: 'A gentle nudge each day to keep practice moving.',
      },
      {
        id: 'streakReminder',
        type: 'toggle',
        label: 'Streak reminder',
        description: 'Remind you when the day is nearly over and your streak is open.',
      },
      {
        id: 'weeklyProgressSummary',
        type: 'toggle',
        label: 'Weekly progress summary',
        description: 'A brief digest of your week every Sunday.',
      },
    ],
  },
  {
    title: 'Appearance',
    rows: [
      {
        id: 'lightMode',
        type: 'toggle',
        label: 'Light mode',
        description: 'Keep PicoLab in the light Claude-inspired theme.',
      },
      {
        id: 'comfortableLayout',
        type: 'toggle',
        label: 'Comfortable layout',
        description: 'Use the roomy spacing PicoLab is designed around.',
      },
      {
        id: 'accentColor',
        type: 'segment',
        label: 'Accent color',
        description: 'Choose the highlight color used by mock controls on this page.',
        options: accentColors.map((color) => ({ label: color, value: color })),
      },
    ],
  },
  {
    title: 'Accessibility',
    rows: [
      {
        id: 'largerFormulas',
        type: 'toggle',
        label: 'Larger formulas',
        description: 'Increase the size of mathematical notation throughout practice views.',
      },
      {
        id: 'reduceMotion',
        type: 'toggle',
        label: 'Reduce motion',
        description: 'Minimize animations and transitions.',
      },
      {
        id: 'highContrastMode',
        type: 'toggle',
        label: 'High contrast mode',
        description: 'Increase contrast for better readability.',
      },
    ],
  },
  {
    title: 'Account controls',
    rows: [
      {
        id: 'profileVisibility',
        type: 'toggle',
        label: 'Profile visibility',
        description: 'Control whether your learner profile is visible in shared contexts.',
      },
      {
        id: 'sign-out',
        type: 'action',
        label: 'Sign out',
        description: 'Mock account action for this MVP interface.',
        actionLabel: 'Sign out',
      },
      {
        id: 'delete-account',
        type: 'action',
        label: 'Delete account',
        description: 'Mock destructive account control. Backend handling is not connected yet.',
        actionLabel: 'Delete',
        destructive: true,
        disabled: true,
      },
    ],
  },
];
