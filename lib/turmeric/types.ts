export type Suggestion = {
  title: string;
  meta?: string;
  url?: string;
};

export type SearchStatus = 'idle' | 'loading' | 'success' | 'empty' | 'error';

export type SuggestionFetcher = (
  query: string,
  signal?: AbortSignal
) => Promise<Suggestion[]>;
