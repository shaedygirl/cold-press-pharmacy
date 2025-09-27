import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn()
}));

import { createClient } from '@supabase/supabase-js';
import { GET } from '../../app/api/search/route';

describe('GET /api/search', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    process.env.SUPABASE_URL = 'https://example.supabase.co';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-role-key';
  });

  it('rejects queries shorter than 2 characters', async () => {
    const response = await GET(new Request('https://example.com/api/search?query=a'));
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'Query must be at least 2 characters.' });
  });

  it('rejects unsupported types', async () => {
    const response = await GET(new Request('https://example.com/api/search?query=spinach&type=foo'));
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'Type must be one of ingredient, drink, nutrient' });
  });

  it('returns data from the RPC on success', async () => {
    const rpc = vi.fn().mockResolvedValue({ data: [{ id: 1, name: 'Spinach', match_type: 'ingredient' }], error: null });
    vi.mocked(createClient).mockReturnValue({ rpc } as any);

    const response = await GET(new Request('https://example.com/api/search?query=spinach&type=ingredient'));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual([{ id: 1, name: 'Spinach', match_type: 'ingredient' }]);
    expect(rpc).toHaveBeenCalledWith('search_turmeric', { query: 'spinach', type: 'ingredient' });
  });

  it('maps Supabase RPC errors to 502', async () => {
    const rpc = vi.fn().mockResolvedValue({ data: null, error: { message: 'boom' } });
    vi.mocked(createClient).mockReturnValue({ rpc } as any);

    const response = await GET(new Request('https://example.com/api/search?query=spinach'));

    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({ error: 'Search failed.' });
  });

  it('returns server error when env vars missing', async () => {
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;

    const response = await GET(new Request('https://example.com/api/search?query=spinach'));

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: 'Search not configured.' });
  });
});
