import { getSignalDefinition } from '../data/learningSignals';
import type { LearningSignal, VisualTemplateId } from '../types/api';
import type {
  LearningSignalCategory,
  LearningSignalInstance,
} from '../types/learningSignals';

const VISUAL_LAB_SUGGESTION_KEY = 'picolab.visualLab.suggestedTemplate';

type SignalLike = Pick<
  LearningSignalInstance,
  'signalId' | 'category' | 'suggestedVisualTemplate' | 'createdAt'
> | Pick<LearningSignal, 'signalId' | 'category' | 'suggestedVisualTemplate' | 'title'>;

export type VisualLabSuggestedTemplate = {
  templateId: VisualTemplateId;
  signalId?: string;
  category?: LearningSignalCategory;
  label: string;
  reason: string;
  createdAt: string;
};

const categoryTemplateFallbacks: Record<LearningSignalCategory, VisualTemplateId> = {
  algebra: 'formula',
  units: 'units',
  formula: 'formula',
  concept: 'motion',
  graph: 'graph',
  reading: 'formula',
  calculation: 'formula',
};

const templateLabels: Record<VisualTemplateId, string> = {
  motion: 'Motion',
  graph: 'Graph',
  units: 'Units',
  formula: 'Formula',
  'free-body': 'Free-body',
  function: 'Function',
  energy: 'Energy',
  circuit: 'Circuit',
};

const templateDescriptions: Record<VisualTemplateId, string> = {
  motion: 'Motion meaning',
  graph: 'Graph interpretation',
  units: 'Unit reasoning',
  formula: 'Formula selection',
  'free-body': 'Force and direction',
  function: 'Function structure',
  energy: 'Energy relationship',
  circuit: 'Circuit relationship',
};

const supportedCategories: LearningSignalCategory[] = [
  'algebra',
  'units',
  'formula',
  'concept',
  'graph',
  'reading',
  'calculation',
];

const canUseSessionStorage = () =>
  typeof window !== 'undefined' && Boolean(window.sessionStorage);

const normalizeCategory = (category?: string): LearningSignalCategory | undefined =>
  supportedCategories.includes(category as LearningSignalCategory)
    ? (category as LearningSignalCategory)
    : undefined;

const normalizeTemplateId = (template?: string): VisualTemplateId | undefined => {
  if (!template) return undefined;

  const normalized = template === 'freeBody' ? 'free-body' : template;
  const supportedTemplates: VisualTemplateId[] = [
    'motion',
    'graph',
    'units',
    'formula',
    'free-body',
    'function',
    'energy',
    'circuit',
  ];

  return supportedTemplates.includes(normalized as VisualTemplateId)
    ? (normalized as VisualTemplateId)
    : undefined;
};

export const isVisualTemplateId = (template?: string): template is VisualTemplateId =>
  Boolean(normalizeTemplateId(template));

export const getTemplateLabel = (template?: string) => {
  const templateId = normalizeTemplateId(template);
  return templateId ? templateLabels[templateId] : 'Motion';
};

export const getTemplateDescription = (template?: string) => {
  const templateId = normalizeTemplateId(template);
  return templateId ? templateDescriptions[templateId] : 'Motion meaning';
};

export const getVisualTemplateForDiagnosticSignal = (
  signal?: SignalLike | null,
): VisualLabSuggestedTemplate | null => {
  if (!signal) return null;

  const definition = signal.signalId ? getSignalDefinition(signal.signalId) : undefined;
  const category = normalizeCategory(signal.category) ?? definition?.category;
  const templateId =
    normalizeTemplateId(signal.suggestedVisualTemplate) ??
    normalizeTemplateId(definition?.suggestedVisualTemplate) ??
    (category ? categoryTemplateFallbacks[category] : undefined);

  if (!templateId) return null;

  const signalLabel =
    definition?.studentFriendlyLabel ??
    definition?.title ??
    ('title' in signal ? signal.title : undefined) ??
    signal.signalId ??
    'recent learning signal';

  return {
    templateId,
    signalId: signal.signalId,
    category,
    label: templateLabels[templateId],
    reason: signalLabel,
    createdAt: 'createdAt' in signal ? signal.createdAt : new Date().toISOString(),
  };
};

export const getVisualTemplateForDiagnosticSignals = (
  signals?: SignalLike[] | null,
): VisualLabSuggestedTemplate | null => {
  if (!signals?.length) return null;

  for (const signal of signals) {
    const suggestion = getVisualTemplateForDiagnosticSignal(signal);
    if (suggestion) return suggestion;
  }

  return null;
};

export const storeVisualLabSuggestion = (suggestion?: VisualLabSuggestedTemplate | null) => {
  if (!suggestion || !canUseSessionStorage()) return;

  window.sessionStorage.setItem(VISUAL_LAB_SUGGESTION_KEY, JSON.stringify(suggestion));
};

export const storeVisualLabSuggestionFromSignal = (signal?: SignalLike | null) => {
  const suggestion = getVisualTemplateForDiagnosticSignal(signal);
  storeVisualLabSuggestion(suggestion);
  return suggestion;
};

export const storeVisualLabSuggestionFromSignals = (signals?: SignalLike[] | null) => {
  const suggestion = getVisualTemplateForDiagnosticSignals(signals);
  storeVisualLabSuggestion(suggestion);
  return suggestion;
};

export const loadVisualLabSuggestion = (): VisualLabSuggestedTemplate | null => {
  if (!canUseSessionStorage()) return null;

  try {
    const raw = window.sessionStorage.getItem(VISUAL_LAB_SUGGESTION_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<VisualLabSuggestedTemplate>;
    const templateId = normalizeTemplateId(parsed.templateId);

    return templateId
      ? {
          templateId,
          signalId: typeof parsed.signalId === 'string' ? parsed.signalId : undefined,
          category: normalizeCategory(parsed.category),
          label: templateLabels[templateId],
          reason: typeof parsed.reason === 'string' ? parsed.reason : 'recent learning signal',
          createdAt:
            typeof parsed.createdAt === 'string' ? parsed.createdAt : new Date().toISOString(),
        }
      : null;
  } catch {
    return null;
  }
};

export const readVisualLabSuggestion = loadVisualLabSuggestion;

export const clearVisualLabSuggestion = () => {
  if (!canUseSessionStorage()) return;

  window.sessionStorage.removeItem(VISUAL_LAB_SUGGESTION_KEY);
};
