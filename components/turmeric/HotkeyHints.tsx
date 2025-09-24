'use client';

type Hint = {
  label: string;
  keys: string[];
};

const HINTS: Hint[] = [
  { label: 'Focus', keys: ['⌘', 'K'] },
  { label: 'Navigate', keys: ['↑', '↓'] },
  { label: 'Open', keys: ['↩︎'] },
  { label: 'Close', keys: ['Esc'] },
];

export default function HotkeyHints() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-slate-600">
      {HINTS.map((hint) => (
        <span
          key={hint.label}
          className="inline-flex items-center gap-2 rounded-full border border-[#D9A441]/40 bg-white/90 px-3 py-1 text-xs font-medium uppercase tracking-wide text-slate-600 shadow-[0_4px_14px_rgba(0,0,0,0.06)]"
        >
          <span className="flex items-center gap-1">
            {hint.keys.map((key) => (
              <kbd
                key={key}
                className="rounded-md border border-[#D9A441]/40 bg-white px-1.5 py-0.5 text-[11px] font-semibold text-slate-700 shadow-inner"
              >
                {key}
              </kbd>
            ))}
          </span>
          <span>{hint.label}</span>
        </span>
      ))}
    </div>
  );
}
