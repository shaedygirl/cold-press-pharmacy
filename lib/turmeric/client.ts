import type { Suggestion } from './types';

type SearchResponse = {
  id: string | number;
  name: string;
  match_type: string;
};

const MATCH_LABELS: Record<string, string> = {
  ingredient: 'Ingredient',
  drink: 'Drink',
  nutrient: 'Nutrient',
  ingredient_with_nutrient: 'Ingredient (nutrient match)',
};

export async function searchTurmeric(query: string, signal?: AbortSignal): Promise<Suggestion[]> {
  const normalized = query.trim();

  if (!normalized) {
    return [];
  }

  const params = new URLSearchParams({ query: normalized, type: 'all' });

  let response: Response;
  try {
    response = await fetch(`/api/search?${params.toString()}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error;
    }

    throw new Error('Network error while fetching search results.');
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch (error) {
    if (!response.ok) {
      throw new Error('Search failed.');
    }
    throw new Error('Unexpected response from search API.');
  }

  if (!response.ok) {
    const message =
      typeof payload === 'object' && payload !== null && 'error' in payload
        ? String((payload as { error?: unknown }).error ?? 'Search failed.')
        : 'Search failed.';
    throw new Error(message);
  }

  if (!Array.isArray(payload)) {
    throw new Error('Malformed search response.');
  }

  return (payload as SearchResponse[]).map((item) => ({
    id: String(item.id),
    title: item.name,
    matchType: item.match_type,
    meta: MATCH_LABELS[item.match_type] ?? item.match_type,
  }));
}
