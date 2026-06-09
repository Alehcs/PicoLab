import type { LearningSignalInstance } from '../types/learningSignals';

const DIAGNOSTIC_SIGNALS_KEY = 'picolab.learning.signals';

const canUseLocalStorage = () => typeof window !== 'undefined' && Boolean(window.localStorage);

export const loadDiagnosticSignals = (): LearningSignalInstance[] => {
  if (!canUseLocalStorage()) return [];

  try {
    const raw = window.localStorage.getItem(DIAGNOSTIC_SIGNALS_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((signal): signal is LearningSignalInstance =>
          Boolean(
            signal &&
              typeof signal === 'object' &&
              'id' in signal &&
              'signalId' in signal &&
              typeof signal.id === 'string' &&
              typeof signal.signalId === 'string',
          ),
        )
      : [];
  } catch {
    return [];
  }
};

export const saveDiagnosticSignals = (signals: LearningSignalInstance[]) => {
  if (!canUseLocalStorage()) return;

  window.localStorage.setItem(DIAGNOSTIC_SIGNALS_KEY, JSON.stringify(signals));
};

export const appendDiagnosticSignals = (signals: LearningSignalInstance[]) => {
  if (!signals.length) return loadDiagnosticSignals();

  const existing = loadDiagnosticSignals();
  const keys = new Set(
    existing.map(
      (signal) =>
        `${signal.signalId}:${signal.source}:${signal.relatedProblemId ?? ''}:${signal.relatedStepId ?? ''}`,
    ),
  );
  const nextSignals = [...existing];

  for (const signal of signals) {
    const key = `${signal.signalId}:${signal.source}:${signal.relatedProblemId ?? ''}:${signal.relatedStepId ?? ''}`;
    if (!keys.has(key)) {
      keys.add(key);
      nextSignals.push(signal);
    }
  }

  saveDiagnosticSignals(nextSignals);
  return nextSignals;
};
