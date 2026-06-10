import { RefreshCw } from 'lucide-react';

import { Button } from '../ui/Button';
import { PicoMascot } from '../pico/PicoMascot';
import type { PicoQuote } from '../../types/profile';

type QuoteCardProps = {
  quote: PicoQuote;
  onNewQuote: () => void;
};

export function QuoteCard({ quote, onNewQuote }: QuoteCardProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border-[1.5px] border-pico-border bg-gradient-to-br from-pico-bg to-pico-softBlue px-6 py-7 text-center">
        <div className="p-section-lbl mb-4">Pico’s quote of the day</div>
        <p className="mx-auto max-w-[460px] text-[17px] font-semibold italic leading-relaxed tracking-[-0.01em] text-pico-text">
          {quote.text}
        </p>
        <div className="mt-3 text-[13px] font-medium text-pico-secondary">{quote.author}</div>
      </div>

      <div className="flex flex-col items-center gap-3 px-1 sm:flex-row sm:items-center">
        <PicoMascot size={96} className="max-w-[120px] sm:max-w-[96px]" />
        <div className="p-speech-bubble p-speech-bubble-responsive-left min-w-0 flex-1 px-4 py-3.5">
          <div className="p-section-lbl mb-1.5">Pico says</div>
          <p className="text-[13.5px] italic leading-relaxed text-pico-secondary">
            {quote.note}
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={onNewQuote}>
          <RefreshCw size={13} />
          New quote
        </Button>
      </div>
    </div>
  );
}
