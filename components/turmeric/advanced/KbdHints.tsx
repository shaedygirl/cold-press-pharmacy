'use client';

type HintProps = {
  kbd: string[];
  label: string;
  aside?: string;
};

export default function KbdHints() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-slate-600">
      <Hint kbd={['⌘', 'K']} label="Focus" aside="Ctrl + K" />
      <Hint kbd={['↑', '↓']} label="Navigate" />
      <Hint kbd={['Enter']} label="Open" />
      <Hint kbd={['Esc']} label="Close" />
    </div>
  );
}

function Hint({ kbd, label, aside }: HintProps) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 shadow-sm ring-1 ring-black/5">
      <span className="inline-flex items-center gap-1">
        {kbd.map((key) => (
          <kbd
            key={key}
            className="turmeric-kbd-gradient rounded-md border border-black/10 px-1.5 py-0.5 text-[11px] font-semibold text-black/70 shadow-inner"
          >
            {key}
          </kbd>
        ))}
      </span>
      <span className="text-xs uppercase tracking-wide text-slate-500">{label}</span>
      {aside && <span className="text-[11px] text-slate-400">({aside})</span>}
    </span>
  );
}
