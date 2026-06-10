import type { ReactNode } from 'react';
import { PicoMascot } from './PicoMascot';

type PicoNoteProps = {
  children: ReactNode;
};

export function PicoNote({ children }: PicoNoteProps) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-pico-softBlue px-3.5 py-3">
      <PicoMascot size={62} className="max-w-[62px]" />
      <div className="p-speech-bubble p-speech-bubble-left min-w-0 flex-1 px-3.5 py-3 text-[12.5px] leading-relaxed text-[#2A60A8]">
        {children}
      </div>
    </div>
  );
}
