import type { ReactNode } from 'react';
import { Info } from 'lucide-react';

type PicoNoteProps = {
  children: ReactNode;
};

export function PicoNote({ children }: PicoNoteProps) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl bg-pico-softBlue px-3.5 py-3">
      <Info size={15} className="mt-0.5 shrink-0 text-pico-blue" aria-hidden="true" />
      <div className="text-[12.5px] leading-relaxed text-[#2A60A8]">{children}</div>
    </div>
  );
}
