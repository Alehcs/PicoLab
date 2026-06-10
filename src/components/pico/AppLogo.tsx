type AppLogoProps = {
  size?: number;
  className?: string;
};

export function AppLogo({ size = 36, className }: AppLogoProps) {
  return (
    <img
      src="/assets/picolab-logo.png"
      width={size}
      height={size}
      alt="PicoLab"
      className={`shrink-0 rounded-[10px] object-cover ${className ?? ''}`}
    />
  );
}
