import { MessageCircle } from 'lucide-react';

import { Button } from '../ui/Button';

type AskPicoButtonProps = {
  onClick: () => void;
  label?: string;
  fullWidth?: boolean;
};

export function AskPicoButton({ onClick, label = 'Ask Pico', fullWidth = false }: AskPicoButtonProps) {
  return (
    <Button variant="ghost" size="sm" fullWidth={fullWidth} onClick={onClick}>
      <MessageCircle size={13} />
      {label}
    </Button>
  );
}
