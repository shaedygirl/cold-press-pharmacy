import { mockSearch } from './mock';
import type { Suggestion } from './types';

export async function searchTurmeric(query: string, signal?: AbortSignal): Promise<Suggestion[]> {
  if (!query.trim()) {
    return [];
  }

  // Placeholder bridge – replace with server actions or API routes when ready.
  return mockSearch(query, signal);
}
