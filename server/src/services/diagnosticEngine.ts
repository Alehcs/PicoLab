import {
  getSignalDefinition,
  getVisualTemplateForSignal,
  prioritizeSignals,
} from '../data/learningSignals.js';
import type {
  DiagnosticEvidence,
  DiagnosticResult,
  LearningSignalCategory,
  LearningSignalInstance,
  LearningSignalSeverity,
} from '../types/learningSignals.js';
import type { LearningSignal } from '../types/api.js';

const categoryBySignalId = (signalId: string): LearningSignalCategory =>
  signalId.split('.')[0] as LearningSignalCategory;

const subtypeBySignalId = (signalId: string) => signalId.split('.')[1] ?? signalId;

const normalize = (value?: string) => value?.trim().toLowerCase() ?? '';

const numberPattern = /-?\d+(?:\.\d+)?/;

const extractNumber = (value?: string) => {
  const match = value?.match(numberPattern);
  return match ? Number(match[0]) : undefined;
};

const extractUnit = (value?: string) => {
  const normalized = normalize(value).replace(/\s+/g, '');
  const units = ['m/s^2', 'm/s²', 'km/h', 'm/s', 'cm', 'kg', 'n', 'min', 's', 'm'];
  return units.find((unit) => normalized.includes(unit));
};

const hasNumber = (value?: string) => numberPattern.test(value ?? '');

const containsAny = (value: string, tokens: string[]) => tokens.some((token) => value.includes(token));

const makeInstance = (
  signalId: string,
  evidence: DiagnosticEvidence,
  severity: LearningSignalSeverity,
  confidence: number,
  evidenceText: string,
): LearningSignalInstance => {
  const definition = getSignalDefinition(signalId);

  return {
    id: `${signalId}:${evidence.source}:${evidence.problemId ?? evidence.missionId ?? 'demo'}:${evidence.stepId ?? 'step'}:${Math.round(confidence * 100)}`,
    signalId,
    category: definition?.category ?? categoryBySignalId(signalId),
    severity,
    status: 'new',
    confidence,
    evidence: evidenceText,
    source: evidence.source,
    createdAt: new Date().toISOString(),
    relatedProblemId: evidence.problemId,
    relatedStepId: evidence.stepId,
    suggestedPractice: definition?.suggestedPractice,
    suggestedVisualTemplate: definition?.suggestedVisualTemplate,
  };
};

const dedupeSignals = (signals: LearningSignalInstance[]) => {
  const seen = new Set<string>();
  return signals.filter((signal) => {
    if (seen.has(signal.signalId)) return false;
    seen.add(signal.signalId);
    return true;
  });
};

const feedbackForSignal = (
  signal: LearningSignalInstance | undefined,
  evidence: DiagnosticEvidence,
) => {
  const definition = signal ? getSignalDefinition(signal.signalId) : undefined;
  const expectedUnit = evidence.expectedUnit;
  const studentUnit = extractUnit(evidence.studentAnswer ?? evidence.studentStep);

  if (!signal || !definition) {
    return {
      supportiveFeedback: 'Nice reasoning. Pico did not find a major learning signal in this step.',
      whatWentWell: 'Your response is aligned with the expected reasoning.',
      whatToAdjust: 'Add a short interpretation of the result.',
      whyItMatters: 'Explaining the result helps connect the math to the concept.',
    };
  }

  if (signal.signalId === 'units.final_unit_mismatch') {
    return {
      supportiveFeedback: definition.supportiveFeedback,
      whatWentWell: 'Your calculation is close.',
      whatToAdjust: 'The final unit needs attention.',
      whyItMatters: expectedUnit
        ? `${evidence.expectedQuantity ?? 'The target quantity'} is measured in ${expectedUnit}${studentUnit ? `, not ${studentUnit}` : ''}.`
        : 'The final unit tells what quantity the result represents.',
    };
  }

  if (signal.signalId === 'algebra.sign_error') {
    return {
      supportiveFeedback: definition.supportiveFeedback,
      whatWentWell: 'The setup is close.',
      whatToAdjust: 'Check the direction/sign in this step.',
      whyItMatters: 'The sign tells us direction, not just size.',
    };
  }

  if (signal.signalId === 'formula.selection_error') {
    return {
      supportiveFeedback: definition.supportiveFeedback,
      whatWentWell: 'You identified the right kind of problem.',
      whatToAdjust: 'Choose a formula that includes the given values and the target variable.',
      whyItMatters: 'The formula should connect what you know to what you need to find.',
    };
  }

  return {
    supportiveFeedback: definition.supportiveFeedback,
    whatWentWell: 'There is useful reasoning in this step.',
    whatToAdjust: definition.studentFriendlyLabel,
    whyItMatters: definition.description,
  };
};

export const runMockDiagnostic = (evidence: DiagnosticEvidence): DiagnosticResult => {
  const answer = normalize(evidence.studentAnswer ?? evidence.studentStep);
  const problemText = normalize(evidence.problemText);
  const expectedUnit = normalize(evidence.expectedUnit);
  const expectedQuantity = normalize(evidence.expectedQuantity ?? evidence.target);
  const formulaUsed = normalize(evidence.formulaUsed ?? evidence.studentStep);
  const expectedFormula = normalize(evidence.expectedFormula);
  const studentUnit = extractUnit(evidence.studentAnswer ?? evidence.studentStep);
  const studentNumber = extractNumber(evidence.studentAnswer ?? evidence.studentStep);
  const expectedNumber = extractNumber(evidence.expectedAnswer);
  const signals: LearningSignalInstance[] = [];

  const add = (
    signalId: string,
    severity: LearningSignalSeverity,
    confidence: number,
    evidenceText: string,
  ) => signals.push(makeInstance(signalId, evidence, severity, confidence, evidenceText));

  if (expectedUnit && hasNumber(answer) && !studentUnit) {
    add('units.missing_unit', 'medium', 0.84, 'Numeric answer is present without a visible unit.');
  }

  if (expectedUnit && studentUnit && studentUnit !== expectedUnit) {
    add('units.final_unit_mismatch', 'high', 0.92, `Expected ${expectedUnit}, saw ${studentUnit}.`);
  }

  if (
    expectedUnit === 'm/s' &&
    (containsAny(answer, ['m/s²', 'm/s^2', '·s', '*s']) ||
      containsAny(problemText, ['m/s²', 'm/s^2', 'accelerat']))
  ) {
    add('units.unit_cancellation', 'medium', 0.76, 'Acceleration and time evidence points to unit cancellation.');
  }

  if (containsAny(`${answer} ${problemText}`, ['cm', 'km/h', 'min']) && containsAny(`${answer} ${problemText}`, ['m/s', 'm ', ' s'])) {
    add('units.conversion_error', 'medium', 0.7, 'Mixed unit systems appear in the evidence.');
  }

  if (typeof studentNumber === 'number' && typeof expectedNumber === 'number') {
    if (Math.sign(studentNumber) !== Math.sign(expectedNumber)) {
      add('algebra.sign_error', 'high', 0.88, 'Student and expected numeric signs differ.');
    }

    const absoluteDelta = Math.abs(studentNumber - expectedNumber);
    if (absoluteDelta > 0 && absoluteDelta <= Math.max(0.2, Math.abs(expectedNumber) * 0.05)) {
      add('calculation.rounding_issue', 'low', 0.65, 'Numeric answer differs by a small rounding-sized amount.');
    } else if (absoluteDelta > 0 && absoluteDelta <= Math.max(2, Math.abs(expectedNumber) * 0.2)) {
      add('calculation.arithmetic_slip', 'medium', 0.68, 'Numeric answer is close to the expected value.');
    }

    const ratio = Math.abs(studentNumber / expectedNumber);
    if ([0.001, 0.01, 0.1, 10, 100, 1000].some((factor) => Math.abs(ratio - factor) < factor * 0.05)) {
      add('calculation.scale_issue', 'medium', 0.72, 'Numeric result differs by a power-of-ten scale.');
    }
  }

  if (expectedFormula && formulaUsed && !formulaUsed.includes(expectedFormula.replace(/\s+/g, ''))) {
    add('formula.selection_error', 'high', 0.82, 'Formula evidence differs from the expected relationship.');
  }

  if (expectedFormula && evidence.target && formulaUsed.includes('=') && !formulaUsed.startsWith(normalize(evidence.target))) {
    add('formula.rearrangement_issue', 'medium', 0.7, 'The formula appears before the target is isolated.');
  }

  if (evidence.target && formulaUsed.includes('=') && formulaUsed.split('=').slice(1).join('=').includes(normalize(evidence.target))) {
    add('algebra.isolation_error', 'medium', 0.66, 'The target variable still appears after the equals sign.');
  }

  if (containsAny(formulaUsed, ['+']) && containsAny(formulaUsed, ['*', '/']) && !containsAny(formulaUsed, ['(', ')'])) {
    add('algebra.order_of_operations', 'low', 0.54, 'Mixed operations appear without grouping evidence.');
  }

  if (expectedFormula && containsAny(expectedFormula, ['*', '·']) && containsAny(formulaUsed, ['/'])) {
    add('algebra.substitution_structure', 'medium', 0.6, 'Formula structure suggests multiplication, while the step uses division.');
  }

  if (expectedFormula && containsAny(expectedFormula, ['v0', 'v₀']) && containsAny(formulaUsed, ['vf', 'final'])) {
    add('formula.variable_mismatch', 'medium', 0.62, 'A related velocity variable appears in a mismatched role.');
  }

  if (expectedFormula && containsAny(expectedFormula, ['v₀', 'v0', '1/2', 'at']) && !containsAny(formulaUsed, ['v₀', 'v0', '1/2', 'at'])) {
    add('formula.incomplete_formula', 'medium', 0.64, 'A needed formula term appears absent.');
  }

  if (evidence.knownValues?.length && evidence.knownValues.some((known) => !answer.includes(String(known.value).toLowerCase()))) {
    add('reading.given_value_missed', 'low', 0.55, 'At least one known value is not visible in the step.');
  }

  if (expectedQuantity.includes('velocity') && studentUnit === 'm') {
    add('concept.quantity_confusion', 'medium', 0.78, 'Velocity target appears with a distance unit.');
  }

  if (expectedQuantity.includes('distance') && studentUnit === 'm/s') {
    add('concept.quantity_confusion', 'medium', 0.78, 'Distance target appears with a velocity unit.');
  }

  if (containsAny(`${answer} ${problemText}`, ['opposite direction', 'slows down', 'negative acceleration']) && !answer.includes('-')) {
    add('concept.direction_confusion', 'medium', 0.62, 'Direction language appears without sign evidence.');
  }

  if (/\b(per second|slope|rate)\b/.test(`${answer} ${problemText}`) && !containsAny(answer, ['/', 'slope', 'per'])) {
    add('concept.rate_of_change', 'medium', 0.62, 'Rate language appears but the answer treats it like a static value.');
  }

  if (containsAny(`${answer} ${problemText} ${evidence.topic ?? ''}`, ['force', 'mass', 'weight']) && containsAny(answer, ['kg', 'n'])) {
    if ((answer.includes('kg') && expectedUnit === 'n') || (answer.includes('n') && expectedUnit === 'kg')) {
      add('concept.force_mass_weight', 'medium', 0.74, 'Force, mass, or weight units appear mixed.');
    }
  }

  if (evidence.graphContext) {
    const graphText = normalize(`${evidence.graphContext.xAxis} ${evidence.graphContext.yAxis} ${evidence.graphContext.expectedInterpretation} ${answer}`);
    if (evidence.graphContext.xAxis && evidence.graphContext.yAxis && answer.includes(normalize(evidence.graphContext.xAxis)) && answer.includes(normalize(evidence.graphContext.yAxis))) {
      add('graph.axis_interpretation', 'medium', 0.58, 'Graph axis evidence needs attention.');
    }
    if (graphText.includes('slope') && containsAny(answer, ['endpoint', 'final', 'area'])) {
      add('graph.slope_confusion', 'high', 0.82, 'Expected slope interpretation but answer points to endpoint or area.');
    }
    if (graphText.includes('area') && containsAny(answer, ['slope', 'endpoint', 'final'])) {
      add('graph.area_under_curve', 'high', 0.82, 'Expected area interpretation but answer points elsewhere.');
    }
    if (containsAny(graphText, ['initial', 'final']) && containsAny(answer, ['middle', 'average'])) {
      add('graph.endpoint_confusion', 'medium', 0.66, 'Endpoint language appears confused with another graph value.');
    }
  }

  if (evidence.target && expectedQuantity && !expectedQuantity.includes(normalize(evidence.target))) {
    add('reading.target_confusion', 'medium', 0.6, 'Target and expected quantity differ.');
  }

  if (containsAny(problemText, ['starts from rest', 'constant acceleration']) && !containsAny(answer, ['0', 'constant', 'v0', 'v₀'])) {
    add('reading.condition_missed', 'medium', 0.67, 'A condition phrase is not visible in the step.');
  }

  if (containsAny(problemText, ['ambiguous', 'unclear', 'not sure'])) {
    add('reading.ambiguous_information', 'low', 0.7, 'Evidence includes an ambiguity marker.');
  }

  if (evidence.knownValues?.some((known) => hasNumber(answer) && answer.includes(String(Number(known.value) + 1)))) {
    add('calculation.numeric_substitution', 'medium', 0.58, 'A nearby known value may have been substituted.');
  }

  const sortedSignals = prioritizeSignals(dedupeSignals(signals));
  const primarySignal = sortedSignals[0];
  const primaryDefinition = primarySignal ? getSignalDefinition(primarySignal.signalId) : undefined;
  const feedback = feedbackForSignal(primarySignal, evidence);
  const suggestedPractice = Array.from(
    new Set(sortedSignals.flatMap((signal) => signal.suggestedPractice ?? [])),
  );

  return {
    primarySignal,
    signals: sortedSignals,
    supportiveFeedback: feedback.supportiveFeedback,
    whatWentWell: feedback.whatWentWell,
    whatToAdjust: feedback.whatToAdjust,
    whyItMatters: feedback.whyItMatters,
    suggestedPractice: suggestedPractice.length ? suggestedPractice : primaryDefinition?.suggestedPractice ?? [],
    suggestedVisualTemplate:
      primarySignal?.suggestedVisualTemplate ??
      (primarySignal ? getVisualTemplateForSignal(primarySignal.signalId) : undefined),
    confidence: primarySignal?.confidence ?? 0.95,
  };
};

export const learningSignalFromInstance = (
  signal: LearningSignalInstance | undefined,
): LearningSignal | undefined => {
  if (!signal) return undefined;

  const definition = getSignalDefinition(signal.signalId);

  return {
    id: signal.signalId,
    kind:
      signal.category === 'algebra'
        ? 'signSlip'
        : signal.category === 'formula'
          ? 'formulaSelection'
          : signal.category === 'concept'
            ? 'quantityConfusion'
            : signal.category === 'graph'
              ? 'graphReading'
              : 'unitMismatch',
    signalId: signal.signalId,
    category: signal.category,
    subtype: subtypeBySignalId(signal.signalId),
    studentFriendlyLabel: definition?.studentFriendlyLabel,
    title: definition?.title ?? signal.signalId,
    description: definition?.description ?? signal.evidence,
    strength: signal.severity === 'high' ? 5 : signal.severity === 'medium' ? 3 : 1,
    suggestedFocus: definition?.growthPathFocus[0] ?? definition?.suggestedPractice[0] ?? 'Review this step',
    suggestedPractice: signal.suggestedPractice ?? definition?.suggestedPractice,
    suggestedVisualTemplate: signal.suggestedVisualTemplate ?? definition?.suggestedVisualTemplate,
  };
};
