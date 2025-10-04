export type Suggestion = {
  id?: string;
  title: string;
  meta?: string;
  matchType?: string;
  url?: string;
};

export type SearchStatus = 'idle' | 'loading' | 'success' | 'empty' | 'error';

export type SuggestionFetcher = (
  query: string,
  signal?: AbortSignal
) => Promise<Suggestion[]>;
