import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { askPicoContexts, askPicoFirstNote } from '../../data/mockAskPico';
import { picolabApi } from '../../services/picolabApi';
import type { AskPicoContext, AskPicoHistory, AskPicoMessage } from '../../types/askPico';
import type {
  AskPicoContext as ApiAskPicoContext,
  AskPicoMessage as ApiAskPicoMessage,
} from '../../types/api';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { PicoMascot } from './PicoMascot';

type AskPicoDrawerProps = {
  open: boolean;
  context: AskPicoContext;
  onClose: () => void;
};

const HISTORY_STORAGE_KEY = 'picolab.askPico.history';

const createInitialMessages = (context: AskPicoContext): AskPicoMessage[] => [
  {
    id: `${context}-intro`,
    author: 'pico',
    text: askPicoFirstNote,
  },
  {
    id: `${context}-example`,
    author: 'pico',
    text: askPicoContexts[context].mockResponse,
  },
];

const canUseStorage = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const readHistory = (): AskPicoHistory => {
  if (!canUseStorage()) return {};

  try {
    const raw = window.localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
};

const readMessages = (storageKey: string): AskPicoMessage[] | null => {
  const messages = readHistory()[storageKey];
  return Array.isArray(messages) ? messages : null;
};

const writeMessages = (storageKey: string, messages: AskPicoMessage[]) => {
  if (!canUseStorage()) return;

  try {
    const history = readHistory();
    window.localStorage.setItem(
      HISTORY_STORAGE_KEY,
      JSON.stringify({
        ...history,
        [storageKey]: messages,
      }),
    );
  } catch {
    // Keep Ask Pico usable even when storage is unavailable.
  }
};

const clearMessages = (storageKey: string) => {
  if (!canUseStorage()) return;

  try {
    const history = readHistory();
    delete history[storageKey];
    window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
  } catch {
    // Ignore storage errors; local state still resets.
  }
};

const apiContextByDrawerContext: Record<AskPicoContext, ApiAskPicoContext> = {
  notebook: 'notebook',
  'visual-lab': 'visualLab',
  'growth-map': 'growthMap',
  'growth-path': 'growthPath',
  practice: 'practice',
  profile: 'profile',
  settings: 'settings',
};

const toApiMessage = (message: AskPicoMessage): ApiAskPicoMessage => ({
  id: message.id,
  role: message.author === 'user' ? 'learner' : 'pico',
  text: message.text,
});

const getCurrentPage = () => (typeof window === 'undefined' ? '' : window.location.pathname);

const getCurrentState = (context: AskPicoContext) => {
  if (context === 'notebook') {
    return {
      problemId: 'mock-problem-final-velocity',
      stepId: 'step-2',
      topic: 'Kinematics',
    };
  }

  if (context === 'visual-lab') {
    return {
      problemId: 'mock-problem-final-velocity',
      topic: 'Kinematics',
      visualTemplate: 'motion',
    };
  }

  if (context === 'practice') {
    return {
      missionId: 'focus-units-in-motion',
      topic: 'Kinematics',
    };
  }

  return undefined;
};

export function AskPicoDrawer({ open, context, onClose }: AskPicoDrawerProps) {
  const navigate = useNavigate();
  const contextData = askPicoContexts[context];
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<AskPicoMessage[]>(() => createInitialMessages(context));
  const [pending, setPending] = useState(false);
  const requestVersionRef = useRef(0);

  useEffect(() => {
    if (!open) return;

    setInput('');
    setPending(false);
    requestVersionRef.current += 1;
    setMessages(readMessages(contextData.storageKey) ?? createInitialMessages(context));
  }, [context, contextData.storageKey, open]);

  const actionButtons = useMemo(
    () =>
      contextData.actions.map((action) => (
        <Button
          key={action.route}
          variant="secondary"
          size="xs"
          onClick={() => {
            onClose();
            navigate(action.route);
          }}
        >
          {action.label}
        </Button>
      )),
    [contextData.actions, navigate, onClose],
  );

  const updateMessages = (nextMessages: AskPicoMessage[]) => {
    setMessages(nextMessages);
    writeMessages(contextData.storageKey, nextMessages);
  };

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || pending) return;

    const timestamp = Date.now();
    const requestVersion = requestVersionRef.current + 1;
    requestVersionRef.current = requestVersion;
    const userMessage: AskPicoMessage = {
      id: `user-${timestamp}`,
      author: 'user',
      text: trimmed,
    };
    const messagesWithUser = [
      ...messages,
      userMessage,
    ];

    updateMessages(messagesWithUser);
    setInput('');
    setPending(true);

    try {
      const result = await picolabApi.askPico({
        context: apiContextByDrawerContext[context],
        question: trimmed,
        currentPage: getCurrentPage(),
        currentState: getCurrentState(context),
        messages: messagesWithUser.map(toApiMessage),
        history: messages.map(toApiMessage),
      });
      const picoText = result.ok ? result.data.message.text : contextData.mockResponse;
      const picoMessage: AskPicoMessage = {
        id: `pico-${result.source}-${timestamp}`,
        author: 'pico',
        text: picoText,
      };

      if (requestVersionRef.current === requestVersion) {
        updateMessages([...messagesWithUser, picoMessage]);
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn('Ask Pico failed unexpectedly; using local fallback.', error);
      }

      if (requestVersionRef.current === requestVersion) {
        updateMessages([
          ...messagesWithUser,
          {
            id: `pico-localFallback-${timestamp}`,
            author: 'pico',
            text: contextData.mockResponse,
          },
        ]);
      }
    } finally {
      if (requestVersionRef.current === requestVersion) {
        setPending(false);
      }
    }
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendMessage(input);
  };

  const clearChat = () => {
    const initialMessages = createInitialMessages(context);
    clearMessages(contextData.storageKey);
    setMessages(initialMessages);
    setInput('');
    requestVersionRef.current += 1;
    setPending(false);
  };

  if (!open) return null;

  return (
    <div className="pointer-events-none fixed inset-y-0 right-0 z-40 flex justify-end" role="presentation">
      <aside
        className="pointer-events-auto flex h-[100dvh] w-full max-w-[380px] flex-col border-l-[1.5px] border-pico-border bg-white shadow-[0_12px_34px_rgba(38,50,56,0.16)] sm:rounded-l-[22px]"
        aria-label="Ask Pico"
        role="complementary"
      >
        <header className="shrink-0 border-b border-pico-border px-4 py-3.5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2.5">
              <PicoMascot size={38} />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.06em] text-pico-muted">
                  <MessageCircle size={12} aria-hidden="true" />
                  Ask Pico
                </div>
                <div className="mt-0.5 truncate text-[13px] font-bold leading-snug text-pico-secondary">
                  {contextData.contextLabel}
                </div>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <Button variant="ghost" size="xs" onClick={clearChat}>
                Clear chat
              </Button>
              <Button variant="ghost" size="xs" onClick={onClose} aria-label="Close Ask Pico">
                <X size={14} />
              </Button>
            </div>
          </div>
        </header>

        <div className="shrink-0 px-4 pt-3">
          <Card variant="soft" className="px-3.5 py-3">
            <div className="text-[12.5px] font-semibold leading-relaxed text-pico-secondary">
              {contextData.contextNote}
            </div>
            {contextData.contextValue ? (
              <div className="p-mono mt-1.5 w-fit rounded-lg bg-white px-2.5 py-1 text-[13px] font-bold text-pico-text">
                {contextData.contextValue}
              </div>
            ) : null}
          </Card>
        </div>

        <div className="shrink-0 px-4 py-3">
          <div className="p-section-lbl mb-2">Suggested questions</div>
          <div className="flex flex-wrap gap-1.5">
            {contextData.suggestedQuestions.map((question) => (
              <button
                key={question}
                type="button"
                className="rounded-full bg-pico-soft px-2.5 py-1 text-left text-[11.5px] font-semibold leading-snug text-pico-secondary transition hover:bg-pico-softBlue hover:text-[#2A60A8] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[rgba(74,144,226,0.18)] disabled:cursor-not-allowed disabled:opacity-60"
                disabled={pending}
                onClick={() => sendMessage(question)}
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-3">
          <div className="flex flex-col gap-2.5">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.author === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[90%] rounded-[12px] px-3 py-2.5 text-[12.5px] leading-relaxed ${
                    message.author === 'user'
                      ? 'border border-[#B8D8F4] bg-pico-softBlue text-[#2A60A8]'
                      : 'bg-pico-soft text-pico-secondary'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {pending ? (
              <div className="flex justify-start">
                <div className="max-w-[90%] rounded-[12px] bg-pico-soft px-3 py-2.5 text-[12.5px] leading-relaxed text-pico-secondary">
                  Pico is thinking...
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <footer className="shrink-0 border-t border-pico-border bg-white px-4 py-3.5">
          {actionButtons.length ? (
            <div className="mb-3">
              <div className="p-section-lbl mb-2">Context actions</div>
              <div className="flex flex-wrap gap-1.5">{actionButtons}</div>
            </div>
          ) : null}

          <form onSubmit={submit}>
            <label className="sr-only" htmlFor={`ask-pico-input-${context}`}>
              Ask Pico
            </label>
            <div className="flex gap-2">
              <input
                id={`ask-pico-input-${context}`}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder={contextData.inputPlaceholder}
                disabled={pending}
                className="min-w-0 flex-1 rounded-[11px] border-[1.5px] border-pico-border bg-pico-bg px-3 py-2.5 text-[13px] text-pico-text outline-none transition placeholder:text-pico-muted focus:border-pico-blue focus:bg-white focus:ring-4 focus:ring-[rgba(74,144,226,0.13)] disabled:cursor-not-allowed disabled:opacity-70"
              />
              <Button size="sm" type="submit" disabled={pending}>
                <Send size={13} />
                Send
              </Button>
            </div>
          </form>
        </footer>
      </aside>
    </div>
  );
}
