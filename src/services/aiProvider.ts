export interface AiProvider {
  parseProblem(input: unknown): Promise<unknown>;
  checkStep(input: unknown): Promise<unknown>;
  askPico(input: unknown): Promise<unknown>;
  generatePractice(input: unknown): Promise<unknown>;
}

export type AiProviderKind = 'demoMock' | 'openai' | 'gemini' | 'qwen' | 'customBackend';

export type AiProviderDescriptor = {
  kind: AiProviderKind;
  label: string;
  responsibility: string;
};

export const futureAiProviders: AiProviderDescriptor[] = [
  {
    kind: 'demoMock',
    label: 'Demo mock provider',
    responsibility: 'Return deterministic educational responses for frontend and backend demos.',
  },
  {
    kind: 'openai',
    label: 'OpenAI provider',
    responsibility: 'Power parsing, step feedback, Ask Pico, and practice generation later.',
  },
  {
    kind: 'gemini',
    label: 'Gemini provider',
    responsibility: 'Optional multimodal scan and explanation provider later.',
  },
  {
    kind: 'qwen',
    label: 'Qwen provider',
    responsibility: 'Optional model provider for math and visual reasoning experiments later.',
  },
  {
    kind: 'customBackend',
    label: 'Custom backend provider',
    responsibility: 'Route requests through a server-owned orchestration layer.',
  },
];
