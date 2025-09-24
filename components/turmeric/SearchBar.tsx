'use client';

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';

export type SearchBarHandles = {
  focus: () => void;
  clear: () => void;
};

export type SearchBarProps = {
  value: string;
  onQueryChange: (value: string) => void;
  onSubmit: () => void;
  onClear?: () => void;
  onNavigate?: (direction: 'prev' | 'next') => void;
};

const SearchBar = forwardRef<SearchBarHandles, SearchBarProps>(
  ({ value, onQueryChange, onSubmit, onClear, onNavigate }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(
      ref,
      () => ({
        focus: () => inputRef.current?.focus(),
        clear: () => handleClear(),
      }),
      []
    );

    useEffect(() => {
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
          event.preventDefault();
          inputRef.current?.focus();
        }
      };

      window.addEventListener('keydown', onKeyDown);
      return () => window.removeEventListener('keydown', onKeyDown);
    }, []);

    const handleKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        onNavigate?.('next');
        return;
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        onNavigate?.('prev');
        return;
      }

      if (event.key === 'Enter') {
        event.preventDefault();
        onSubmit();
        return;
      }

      if (event.key === 'Escape') {
        event.preventDefault();
        handleClear();
      }
    };

    const handleClear = () => {
      if (value.length === 0) {
        onClear?.();
        return;
      }

      onQueryChange('');
      onClear?.();
    };

    return (
      <label className="relative flex w-full flex-col gap-2">
        <span className="sr-only">Turmeric search</span>
        <input
          ref={inputRef}
          value={value}
          onChange={(event) => onQueryChange(event.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Turmeric search"
          placeholder="Search Cold Press Clinic…"
          className="w-full rounded-xl border border-[#D9A441] bg-white/90 px-6 py-4 text-lg text-slate-800 shadow-[0_6px_24px_rgba(0,0,0,0.07)] transition focus:outline-none focus:ring-2 focus:ring-[#E2B85B] focus:ring-offset-2 focus:ring-offset-[#FCF5E9]"
        />
      </label>
    );
  }
);

SearchBar.displayName = 'SearchBar';

export default SearchBar;
