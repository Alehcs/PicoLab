import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import { Button } from '../ui/Button';
import { PicoMascot } from './PicoMascot';

type AskPicoDrawerProps = {
  open: boolean;
  contextTitle?: string;
  children?: ReactNode;
  onClose: () => void;
};

export function AskPicoDrawer({
  open,
  contextTitle = 'Contextual help',
  children,
  onClose,
}: AskPicoDrawerProps) {
  if (!open) return null;

  return (
    <aside
      className="fixed inset-y-0 right-0 z-40 flex w-full max-w-[360px] flex-col border-l-[1.5px] border-pico-border bg-white p-5 shadow-xl"
      aria-label="Ask Pico"
    >
      <div className="flex items-start justify-between gap-4 border-b border-pico-border pb-4">
        <div className="flex items-center gap-3">
          <PicoMascot size={42} />
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.06em] text-pico-muted">Ask Pico</div>
            <div className="text-sm font-bold text-pico-text">{contextTitle}</div>
          </div>
        </div>
        <Button variant="ghost" size="xs" onClick={onClose} aria-label="Close Ask Pico">
          <X size={14} />
        </Button>
      </div>
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto py-5 text-[13.5px] leading-relaxed text-pico-secondary">
        {children ?? (
          <p>
            Pico will answer questions about the current problem, step, graph, or learning signal without
            turning the app into a main chat surface.
          </p>
        )}
      </div>
    </aside>
  );
}
