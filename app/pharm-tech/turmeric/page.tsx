'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import { Card } from '@/components/ui/card';
import SearchBar from '@/components/turmeric/advanced/SearchBar';
import Suggestions from '@/components/turmeric/advanced/Suggestions';
import KbdHints from '@/components/turmeric/advanced/KbdHints';
import ConnectionStatus from '@/components/turmeric/common/ConnectionStatus';
import { searchTurmeric } from '@/lib/turmeric/client';
import type { Suggestion, SearchStatus } from '@/lib/turmeric/types';
import '@/styles/turmeric.css';

const LISTBOX_ID = 'turmeric-suggestions';
const PAGE_TITLE_ID = 'turmeric-search-title';
const MIN_QUERY_LENGTH = 3;

export default function TurmericSearchPage() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<SearchStatus>('idle');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [shouldPulse, setShouldPulse] = useState(false);
  const showOverlay = isOpen;
  const [activeIndex, setActiveIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const trimmedQuery = query.trim();
  const hasResults = suggestions.length > 0;
  const showList =
    isOpen && (status === 'loading' || status === 'error' || hasResults || status === 'empty');

  const resetController = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;
    return controller;
  }, []);

  const runSearch = useCallback(
    async (searchTerm: string) => {
      const normalized = searchTerm.trim();

      if (normalized.length < MIN_QUERY_LENGTH) {
        setStatus('idle');
        setSuggestions([]);
        setActiveIndex(-1);
        setErrorMessage(null);
        return;
      }

      setStatus('loading');
      setErrorMessage(null);

      const controller = resetController();

      try {
        const items = await searchTurmeric(normalized, controller.signal);
        if (controller.signal.aborted) return;

        if (items.length === 0) {
          setStatus('empty');
          setSuggestions([]);
          setActiveIndex(-1);
        } else {
          setStatus('success');
          setSuggestions(items);
          setActiveIndex(0);
        }
      } catch (error) {
        if (controller.signal.aborted) return;

        setStatus('error');
        setSuggestions([]);
        setActiveIndex(-1);
        setErrorMessage(error instanceof Error ? error.message : 'Unexpected error');
      }
    },
    [resetController]
  );

  useEffect(() => {
    const normalized = query.trim();

    if (normalized.length < MIN_QUERY_LENGTH) {
      abortRef.current?.abort();
      setStatus('idle');
      setSuggestions([]);
      setActiveIndex(-1);
      setErrorMessage(null);
      return;
    }

    const handle = setTimeout(() => runSearch(normalized), 150);

    return () => {
      clearTimeout(handle);
      abortRef.current?.abort();
    };
  }, [query, runSearch]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (!(event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey))) return;

      event.preventDefault();
      inputRef.current?.focus();
      setIsOpen(true);
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleFocus = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
    }
    closeTimer.current = null;
    setIsOpen(true);
    setShouldPulse(true);
  };

  const handleBlur = () => {
    setShouldPulse(false);
    closeTimer.current = setTimeout(() => {
      setIsOpen(false);
      setActiveIndex(-1);
    }, 120);
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (!showList) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((prev) => {
        if (status === 'loading') return prev;
        const next = prev + 1;
        return next >= suggestions.length ? 0 : next;
      });
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((prev) => {
        if (status === 'loading') return prev;
        const next = prev - 1;
        return next < 0 ? suggestions.length - 1 : next;
      });
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        openSuggestion(suggestions[activeIndex]);
      }
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      setIsOpen(false);
      setShouldPulse(false);
      inputRef.current?.blur();
    }
  };

  const openSuggestion = useCallback((suggestion: Suggestion) => {
    if (suggestion.url) {
      window.open(suggestion.url, '_blank', 'noopener');
    }
    setIsOpen(false);
    setShouldPulse(false);
  }, []);

  const handleSelect = useCallback(
    (index: number) => {
      const selected = suggestions[index];
      if (!selected) return;
      openSuggestion(selected);
    },
    [openSuggestion, suggestions]
  );

  const activeDescendantId =
    showList && activeIndex >= 0 ? `${LISTBOX_ID}-option-${activeIndex}` : undefined;

  const labelledBy = useMemo(() => ({ 'aria-labelledby': PAGE_TITLE_ID }), []);

  return (
    <main className="relative isolate min-h-screen bg-turmeric-paper px-4 py-16">
      <ConnectionStatus />
      <div className={showOverlay ? 'turmeric-overlay active' : 'turmeric-overlay'} aria-hidden />
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 turmeric-container">
        <h1 id={PAGE_TITLE_ID} className={`turmeric-title ${isOpen ? 'active' : ''}`}>
          Turmeric Search
        </h1>

        <Card className="w-full bg-white/90 p-6 shadow-xl ring-1 ring-black/5 backdrop-blur-sm">
          <div className="grid gap-4">
            <SearchBar
              id="turmeric-search-input"
              listId={LISTBOX_ID}
              labelledBy={PAGE_TITLE_ID}
              ref={inputRef}
              value={query}
              onValueChange={setQuery}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              status={status}
              isOpen={showList}
              activeDescendantId={activeDescendantId}
              shouldPulse={shouldPulse}
            />

            <KbdHints />

            {showList && (
              <div className="relative" {...labelledBy}>
                <Suggestions
                  id={LISTBOX_ID}
                  labelledBy={PAGE_TITLE_ID}
                  showShimmer={status === 'loading' && trimmedQuery.length >= MIN_QUERY_LENGTH}
                  status={status}
                  suggestions={suggestions}
                  activeIndex={activeIndex}
                  query={query}
                  errorMessage={errorMessage}
                  onHover={setActiveIndex}
                  onSelect={handleSelect}
                />
              </div>
            )}
          </div>
        </Card>
      </div>
    </main>
  );
}
