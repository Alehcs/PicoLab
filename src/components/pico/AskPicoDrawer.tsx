import { FormEvent, useEffect, useMemo, useState } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { askPicoContexts, askPicoFirstNote } from '../../data/mockAskPico';
import type { AskPicoContext, AskPicoMessage } from '../../types/askPico';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { PicoMascot } from './PicoMascot';

type AskPicoDrawerProps = {
  open: boolean;
  context: AskPicoContext;
  onClose: () => void;
};

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

export function AskPicoDrawer({ open, context, onClose }: AskPicoDrawerProps) {
  const navigate = useNavigate();
  const contextData = askPicoContexts[context];
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<AskPicoMessage[]>(() => createInitialMessages(context));

  useEffect(() => {
    if (open) {
      setInput('');
      setMessages(createInitialMessages(context));
    }
  }, [context, open]);

  const actionButtons = useMemo(
    () =>
      contextData.actions.map((action) => (
        <Button
          key={action.route}
          variant="secondary"
          size="sm"
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

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setMessages((current) => [
      ...current,
      {
        id: `user-${Date.now()}`,
        author: 'user',
        text: trimmed,
      },
      {
        id: `pico-${Date.now()}`,
        author: 'pico',
        text: contextData.mockResponse,
      },
    ]);
    setInput('');
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendMessage(input);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 bg-[#F7F8F4]/70 backdrop-blur-[2px]" role="presentation">
      <aside
        className="ml-auto flex h-full w-full max-w-[390px] flex-col border-l-[1.5px] border-pico-border bg-white shadow-xl sm:rounded-l-[22px]"
        aria-label="Ask Pico"
        aria-modal="true"
        role="dialog"
      >
        <div className="flex items-start justify-between gap-4 border-b border-pico-border px-5 py-4">
          <div className="flex items-center gap-3">
            <PicoMascot size={44} />
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.06em] text-pico-muted">
                <MessageCircle size={12} aria-hidden="true" />
                Ask Pico
              </div>
              <div className="mt-0.5 text-[14px] font-extrabold leading-snug tracking-[-0.01em] text-pico-text">
                {contextData.title}
              </div>
            </div>
          </div>
          <Button variant="ghost" size="xs" onClick={onClose} aria-label="Close Ask Pico">
            <X size={14} />
          </Button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          <div className="mb-4">
            <div className="p-section-lbl mb-2">Suggested questions</div>
            <div className="flex flex-wrap gap-1.5">
              {contextData.suggestedQuestions.map((question) => (
                <button
                  key={question}
                  type="button"
                  className="rounded-full bg-pico-soft px-3 py-1.5 text-left text-[12px] font-semibold leading-snug text-pico-secondary transition hover:bg-pico-softBlue hover:text-[#2A60A8] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[rgba(74,144,226,0.18)]"
                  onClick={() => sendMessage(question)}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4 flex flex-col gap-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.author === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[88%] rounded-[14px] px-3.5 py-3 text-[13px] leading-relaxed ${
                    message.author === 'user'
                      ? 'bg-pico-blue text-white'
                      : 'p-speech-bubble bg-pico-soft text-pico-secondary'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          {actionButtons.length ? (
            <Card variant="blue" className="px-3.5 py-3">
              <div className="p-section-lbl mb-2 text-[#2A60A8]">Context actions</div>
              <div className="flex flex-wrap gap-2">{actionButtons}</div>
            </Card>
          ) : null}
        </div>

        <form onSubmit={submit} className="border-t border-pico-border bg-white px-5 py-4">
          <label className="sr-only" htmlFor={`ask-pico-input-${context}`}>
            Ask Pico
          </label>
          <div className="flex gap-2">
            <input
              id={`ask-pico-input-${context}`}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={contextData.inputPlaceholder}
              className="min-w-0 flex-1 rounded-[11px] border-[1.5px] border-pico-border bg-pico-bg px-3.5 py-2.5 text-[13px] text-pico-text outline-none transition placeholder:text-pico-muted focus:border-pico-blue focus:bg-white focus:ring-4 focus:ring-[rgba(74,144,226,0.13)]"
            />
            <Button size="sm" type="submit">
              <Send size={13} />
              Send
            </Button>
          </div>
        </form>
      </aside>
    </div>
  );
}
