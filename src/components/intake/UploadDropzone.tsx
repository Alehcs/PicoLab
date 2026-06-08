import { Check, UploadCloud } from 'lucide-react';
import { Button } from '../ui/Button';

type UploadDropzoneProps = {
  uploaded: boolean;
  onUpload: () => void;
  onSampleScan: () => void;
  disabled?: boolean;
};

export function UploadDropzone({
  uploaded,
  onUpload,
  onSampleScan,
  disabled = false,
}: UploadDropzoneProps) {
  return (
    <div className="rounded-[18px] border-2 border-dashed border-[#D4D9CF] bg-[#FAFBF8] px-7 py-9 text-center transition hover:border-pico-blue hover:bg-[#F0F7FF]">
      <UploadCloud size={38} className="mx-auto text-[#B0B8AE]" aria-hidden="true" />
      <h3 className="mt-4 text-[17px] font-bold text-pico-text">
        Scan a worksheet or notebook page
      </h3>
      <p className="mx-auto mt-2 max-w-[430px] text-[13.5px] leading-relaxed text-pico-secondary">
        Upload a clear image. Pico will help extract numbers, signs, formulas, and units before
        you review them.
      </p>

      <div className="mt-5 flex flex-wrap justify-center gap-2.5">
        <Button onClick={onUpload} disabled={disabled}>
          Upload image
        </Button>
        <Button variant="secondary" onClick={onSampleScan} disabled={disabled}>
          Try sample scan
        </Button>
      </div>

      {uploaded ? (
        <div className="mx-auto mt-4 flex w-fit items-center gap-2 rounded-[10px] bg-pico-softGreen px-3.5 py-2 text-[12.5px] text-[#2A7850]">
          <Check size={14} aria-hidden="true" />
          Mock image ready for review.
        </div>
      ) : null}
    </div>
  );
}
