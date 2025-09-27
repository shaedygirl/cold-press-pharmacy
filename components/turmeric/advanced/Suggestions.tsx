'use client';

import { Fragment, useMemo } from 'react';
import { AlertTriangle, Inbox } from 'lucide-react';
import ScrollArea from '@/components/ui/scroll-area';
import ShimmerList from '@/components/turmeric/advanced/ShimmerList';
import type { Suggestion, SearchStatus } from '@/lib/turmeric/types';

type SuggestionsProps = {
  id: string;
  labelledBy: string;
  showShimmer: boolean;
  status: SearchStatus;
  suggestions: Suggestion[];
  activeIndex: number;
  query: string;
  errorMessage: string | null;
  onHover: (index: number) => void;
  onSelect: (index: number) => void;
};

const SHIMMER_COUNT = 1;

export default function Suggestions({
  id,
  labelledBy,
  showShimmer,
  status,
  suggestions,
  activeIndex,
  query,
  errorMessage,
  onHover,
  onSelect,
}: SuggestionsProps) {
  const isLoading = showShimmer;
  const isEmpty = !isLoading && status === 'empty';
  const isError = !isLoading && status === 'error';

  const highlight = useMemo(() => createHighlighter(query), [query]);

  return (
    <div
      id={id}
      role="listbox"
      aria-labelledby={labelledBy}
      aria-busy={isLoading}
      className="turmeric-panel mt-1 w-full shadow-2xl"
    >
      {isLoading && (
        <div className="px-2 py-3" aria-live="polite">
          <ShimmerList count={SHIMMER_COUNT} className="space-y-2" rowClassName="h-14 rounded-xl" />
        </div>
      )}

      {isEmpty && (
        <div className="flex items-center gap-3 px-4 py-5 text-sm text-slate-600" role="status">
          <Inbox className="h-5 w-5 text-turmeric" aria-hidden />
          <span>No matches for “{query}”. Try a broader term.</span>
        </div>
      )}

      {isError && (
        <div className="flex items-center gap-3 px-4 py-5 text-sm text-red-600" role="alert">
          <AlertTriangle className="h-5 w-5" aria-hidden />
          <span>{errorMessage ?? 'Something went wrong fetching results.'}</span>
        </div>
      )}

      {!isLoading && suggestions.length > 0 && (
        <ScrollArea className="turmeric-scroll max-h-72">
          <ul className="turmeric-options">
            {suggestions.map((suggestion, index) => {
              const isActive = index === activeIndex;

              return (
                <li
                  key={`${suggestion.title}-${index}`}
                  role="option"
                  id={`${id}-option-${index}`}
                  aria-selected={isActive}
                  tabIndex={-1}
                  className={`turmeric-option${isActive ? ' is-active' : ''}`}
                  onMouseEnter={() => onHover(index)}
                  onMouseMove={() => onHover(index)}
                  onClick={() => onSelect(index)}
                >
                  <div className="flex flex-col gap-1 text-left">
                    <span className="text-base font-semibold text-slate-900">
                      {highlight(suggestion.title)}
                    </span>
                    {suggestion.meta && (
                      <span className="text-xs uppercase tracking-wide text-slate-500">
                        {highlight(suggestion.meta)}
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </ScrollArea>
      )}
    </div>
  );
}

function escapeRegex(value: string) {
  return value.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
}

function createHighlighter(query: string) {
  if (!query.trim()) {
    return (text: string) => text;
  }

  const pattern = new RegExp(`(${escapeRegex(query)})`, 'ig');

  return (text: string) => {
    const segments = text.split(pattern);

    return (
      <Fragment>
        {segments.map((segment, index) =>
          index % 2 === 1 ? (
            <mark key={`${segment}-${index}`} className="turmeric-highlight">
              {segment}
            </mark>
          ) : (
            <span key={`${segment}-${index}`}>{segment}</span>
          )
        )}
      </Fragment>
    );
  };
}
