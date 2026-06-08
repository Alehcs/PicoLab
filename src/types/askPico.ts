export type AskPicoContext =
  | 'notebook'
  | 'visual-lab'
  | 'growth-map'
  | 'growth-path'
  | 'practice'
  | 'profile'
  | 'settings';

export type AskPicoAction = {
  label: string;
  route: string;
};

export type AskPicoContextData = {
  title: string;
  inputPlaceholder: string;
  suggestedQuestions: string[];
  mockResponse: string;
  actions: AskPicoAction[];
};

export type AskPicoMessage = {
  id: string;
  author: 'pico' | 'user';
  text: string;
};
