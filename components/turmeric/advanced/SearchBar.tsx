'use client';

import { forwardRef, type KeyboardEvent } from 'react';
import { Loader2 } from 'lucide-react';
import type { SearchStatus } from '@/lib/turmeric/types';

type SearchBarProps = {
  id: string;
  listId: string;
  labelledBy: string;
  value: string;
  status: SearchStatus;
  isOpen: boolean;
  activeDescendantId?: string;
  onValueChange: (value: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
};

const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  (
    {
      id,
      listId,
      labelledBy,
      value,
      status,
      isOpen,
      activeDescendantId,
      onValueChange,
      onFocus,
      onBlur,
      onKeyDown,
    },
    ref
  ) => {
    const showSpinner = status === 'loading';

    return (
      <div className="relative">
        <input
          ref={ref}
          id={id}
          type="search"
          className="turmeric-input w-full rounded-2xl border bg-white px-4 py-3 text-base shadow-inner outline-none transition focus:-translate-y-0.5"
          placeholder="Search nutrients, compounds, or products…"
          value={value}
          autoComplete="off"
          spellCheck={false}
          onFocus={onFocus}
          onBlur={onBlur}
          onChange={(event) => onValueChange(event.target.value)}
          onKeyDown={onKeyDown}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls={listId}
          aria-labelledby={labelledBy}
          aria-activedescendant={activeDescendantId}
          aria-haspopup="listbox"
          aria-busy={showSpinner}
        />
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
          {showSpinner ? (
            <Loader2 className="h-5 w-5 animate-spin text-turmeric-bright" aria-hidden />
          ) : (
            <kbd className="turmeric-kbd-gradient hidden rounded-lg border border-black/10 px-2 py-1 text-xs font-semibold text-black/60 sm:inline-flex">
              ⌘K
            </kbd>
          )}
        </div>
      </div>
    );
  }
);

SearchBar.displayName = 'SearchBar';

export default SearchBar;
