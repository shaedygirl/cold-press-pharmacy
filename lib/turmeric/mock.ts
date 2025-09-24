import type { Suggestion } from './types';

const MOCK_DATA: Suggestion[] = [
  {
    title: 'Curcumin Complex',
    meta: 'Nutrient • Anti-inflammatory • RDA: 200 mg',
    url: 'https://example.com/curcumin',
  },
  {
    title: 'Turmeric Latte Mix',
    meta: 'Product • SKU T-109',
    url: 'https://example.com/latte',
  },
  {
    title: 'Bioavailable Turmeric Capsules',
    meta: 'Product • 95% Curcuminoids',
    url: 'https://example.com/capsules',
  },
  {
    title: 'Golden Paste Base',
    meta: 'Formula • Vet Approved',
    url: 'https://example.com/golden-paste',
  },
  {
    title: 'Fresh Turmeric Root',
    meta: 'Inventory • Cold Storage Bay 3',
    url: 'https://example.com/root',
  },
  {
    title: 'Curcumin Interaction Guide',
    meta: 'Documentation • Pharmacology',
    url: 'https://example.com/guide',
  },
];

const NETWORK_LATENCY = 420;

export async function mockSearch(query: string, signal?: AbortSignal): Promise<Suggestion[]> {
  if (signal?.aborted) {
    throw new DOMException('Aborted', 'AbortError');
  }

  const normalized = query.trim().toLowerCase();

  return new Promise<Suggestion[]>((resolve, reject) => {
    const timeout = setTimeout(() => {
      if (signal?.aborted) {
        reject(new DOMException('Aborted', 'AbortError'));
        return;
      }

      const filtered = MOCK_DATA.filter((item) => {
        return (
          item.title.toLowerCase().includes(normalized) ||
          item.meta?.toLowerCase().includes(normalized)
        );
      });

      resolve(filtered);
    }, NETWORK_LATENCY);

    signal?.addEventListener('abort', () => {
      clearTimeout(timeout);
      reject(new DOMException('Aborted', 'AbortError'));
    });
  });
}
