type StreakRowProps = {
  days: string[];
};

export function StreakRow({ days }: StreakRowProps) {
  return (
    <div className="flex items-center gap-2">
      {days.map((day, index) => (
        <div key={day} className="flex items-center gap-2">
          <div className="flex flex-col items-center gap-1">
            <div className="h-3 w-3 rounded-full bg-pico-green shadow-[0_0_0_4px_rgba(95,191,143,0.14)]" />
            <span className="text-[10.5px] font-semibold text-pico-muted">{day}</span>
          </div>
          {index < days.length - 1 ? <div className="mb-4 h-px w-5 bg-pico-green/40" /> : null}
        </div>
      ))}
    </div>
  );
}
