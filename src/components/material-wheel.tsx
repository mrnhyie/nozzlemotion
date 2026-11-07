export function MaterialWheel({ materials }: { materials: string[] }) {
  const label = materials.map((m) => m.toUpperCase()).join("  ·  ") + "  ·  ";

  return (
    <div className="relative h-[300px] w-[300px] sm:h-[340px] sm:w-[340px]">
      <div className="animate-wheel absolute inset-0">
        <svg viewBox="0 0 380 380" className="h-full w-full" role="img" aria-label={`Materials we keep on the shelf: ${materials.join(", ")}`}>
          <defs>
            <path id="material-ring" d="M190 190 m-168 0 a168 168 0 1 1 336 0 a168 168 0 1 1 -336 0" />
          </defs>
          <text className="fill-ink font-mono" fontSize="16" letterSpacing="0.5">
            <textPath href="#material-ring" startOffset="0">
              {label}
            </textPath>
          </text>
        </svg>
      </div>

      {/* hub */}
      <div className="absolute inset-[31%] flex flex-col items-center justify-center rounded-full border border-line bg-white">
        <svg viewBox="0 0 48 48" className="h-9 w-9 text-brand" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <circle cx="24" cy="24" r="17" />
          <circle cx="24" cy="24" r="6" />
          <path d="M24 7v6M24 35v6M7 24h6M35 24h6M12 12l4 4M36 12l-4 4M12 36l4-4M36 36l-4-4" />
        </svg>
        <p className="font-display mt-2 text-sm font-bold">Filament</p>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft">on the shelf</p>
      </div>

      {/* filament strand leaving the spool */}
      <svg viewBox="0 0 120 60" className="absolute -bottom-1 left-1/2 h-12 w-28 -translate-x-1/2 text-brand" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
        <path d="M4 52c18-26 34 6 52-16s34 8 60-20" />
      </svg>
    </div>
  );
}
