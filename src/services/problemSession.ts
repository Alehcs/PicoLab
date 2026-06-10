import type { ParsedProblem, ProblemEntity } from '../types/api';

export const CURRENT_PARSED_PROBLEM_KEY = 'picolab.currentParsedProblem';
export const CURRENT_PROBLEM_KEY = 'picolab.currentProblem';
export const INPUT_SOURCE_KEY = 'picolab.inputSource';

export type InputSource = 'typed' | 'scan' | 'formula';

const canUseSessionStorage = () =>
  typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined';

const readJson = <T>(key: string): T | null => {
  if (!canUseSessionStorage()) return null;

  try {
    const raw = window.sessionStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

const writeJson = (key: string, value: unknown) => {
  if (!canUseSessionStorage()) return;

  try {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Session persistence is helpful for demos, but the UI can fall back to mock data.
  }
};

export const readCurrentParsedProblem = () =>
  readJson<ParsedProblem>(CURRENT_PARSED_PROBLEM_KEY);

export const writeCurrentParsedProblem = (problem: ParsedProblem) => {
  writeJson(CURRENT_PARSED_PROBLEM_KEY, problem);
};

export const readCurrentProblem = () => readJson<ProblemEntity>(CURRENT_PROBLEM_KEY);

export const writeCurrentProblem = (problem: ProblemEntity) => {
  writeJson(CURRENT_PROBLEM_KEY, problem);
};

export const readInputSource = () => readJson<InputSource>(INPUT_SOURCE_KEY);

export const writeInputSource = (source: InputSource) => {
  writeJson(INPUT_SOURCE_KEY, source);
};
