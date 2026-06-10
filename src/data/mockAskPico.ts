import type { AskPicoContext, AskPicoContextData } from '../types/askPico';

export const askPicoContexts: Record<AskPicoContext, AskPicoContextData> = {
  notebook: {
    title: 'Ask Pico about this step',
    contextLabel: 'Smart Notebook · Step 2',
    contextNote: 'Pico is looking at your current step:',
    contextValue: 'v = 10 m',
    storageKey: 'notebook',
    inputPlaceholder: 'Ask about this step...',
    suggestedQuestions: [
      'Why is the unit m/s?',
      'Explain simpler',
      'Give me a hint',
      'Why do seconds cancel?',
    ],
    mockResponse:
      'The number 10 is correct. The unit changes because acceleration multiplied by time gives velocity: m/s² · s = m/s.',
    actions: [
      { label: 'Open Visual Lab', route: '/visual-lab' },
      { label: 'View Growth Map', route: '/growth-map' },
    ],
  },
  'visual-lab': {
    title: 'Ask Pico about this visual',
    contextLabel: 'Visual Lab · Motion',
    contextNote: 'Pico is looking at your motion graph and unit insight.',
    storageKey: 'visualLab',
    inputPlaceholder: 'Ask about this visual...',
    suggestedQuestions: [
      'What does the graph show?',
      'Explain simpler',
      'Show another example',
      'Why is this velocity, not distance?',
    ],
    mockResponse:
      'The graph shows velocity changing over time. The final point gives the final velocity, so the answer uses m/s.',
    actions: [
      { label: 'Back to notebook', route: '/smart-notebook' },
      { label: 'Practice units', route: '/practice-missions' },
    ],
  },
  'growth-map': {
    title: 'Ask Pico about your learning signals',
    contextLabel: 'Growth Map',
    contextNote: 'Pico is looking at your recent learning signals.',
    storageKey: 'growthMap',
    inputPlaceholder: 'Ask about your learning signals...',
    suggestedQuestions: [
      'What does unit mismatch mean?',
      'Give me a hint',
      'What should I practice next?',
      'Am I improving?',
    ],
    mockResponse:
      'Your formula choice is strong. The repeated signal is mostly about matching the final unit to the physical quantity.',
    actions: [
      { label: 'View Roadmap', route: '/growth-path' },
      { label: 'Practice units', route: '/practice-missions' },
    ],
  },
  'growth-path': {
    title: 'Ask Pico about your roadmap',
    contextLabel: 'Roadmap',
    contextNote: 'Pico is looking at your current roadmap.',
    storageKey: 'growthPath',
    inputPlaceholder: 'Ask about your roadmap...',
    suggestedQuestions: [
      'Why is units in motion first?',
      'Explain simpler',
      'What comes after this?',
      'How long should I practice?',
    ],
    mockResponse:
      'Units in motion is first because it appears in several recent learning signals and helps clarify velocity, distance, and acceleration.',
    actions: [
      { label: 'Start current focus', route: '/practice-missions' },
      { label: 'Review Growth Map', route: '/growth-map' },
    ],
  },
  practice: {
    title: 'Ask Pico about this mission',
    contextLabel: 'Practice Missions',
    contextNote: 'Pico is looking at your current mission.',
    storageKey: 'practice',
    inputPlaceholder: 'Ask about this mission...',
    suggestedQuestions: [
      'Why is this answer m/s?',
      'Can I get a hint?',
      'Give me another example.',
      'What should I do after this?',
    ],
    mockResponse:
      'A useful way to check is to multiply only the units first: m/s² · s leaves m/s. That tells you the result is velocity.',
    actions: [
      { label: 'Open Visual Lab', route: '/visual-lab' },
      { label: 'View Roadmap', route: '/growth-path' },
    ],
  },
  profile: {
    title: 'Ask Pico about your progress',
    contextLabel: 'Profile',
    contextNote: 'Pico is looking at your progress, goals, and league.',
    storageKey: 'profile',
    inputPlaceholder: 'Ask about your progress...',
    suggestedQuestions: [
      'What does my league mean?',
      'What should I focus on today?',
      'How do I earn PicoPoints?',
      'What badge should I try next?',
    ],
    mockResponse:
      'You are close to Wing League. A daily challenge plus one focus mission would move you forward while reinforcing your current goal.',
    actions: [
      { label: 'Start daily challenge', route: '/practice-missions' },
      { label: 'View Roadmap', route: '/growth-path' },
    ],
  },
  settings: {
    title: 'Ask Pico about settings',
    contextLabel: 'Settings',
    contextNote: 'Pico is looking at your preferences.',
    storageKey: 'settings',
    inputPlaceholder: 'Ask about settings...',
    suggestedQuestions: [
      'Which explanation style should I use?',
      'What does learning history do?',
      'How can I reduce distractions?',
      'What is high contrast mode?',
    ],
    mockResponse:
      'If you are practicing new topics, Step-by-step explanations are usually the best starting point.',
    actions: [],
  },
};

export const askPicoFirstNote =
  'I can help with this page, this step, or anything that feels unclear.';
