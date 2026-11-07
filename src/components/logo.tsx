export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <circle cx="16" cy="16" r="15" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 3" />
      <path d="M11 9h10l-2.2 7.5h-5.6L11 9z" fill="currentColor" />
      <path d="M13.6 16.5h4.8L16 24l-2.4-7.5z" fill="currentColor" opacity="0.65" />
    </svg>
  );
}

export function Wordmark() {
  return (
    <span className="flex items-center gap-2 font-display text-lg font-bold tracking-tight text-ink">
      <LogoMark className="h-8 w-8 text-brand" />
      NOZZLE&nbsp;MOTION
    </span>
  );
}
