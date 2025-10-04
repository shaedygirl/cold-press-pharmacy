import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn()
}));

import { createClient } from '@supabase/supabase-js';
import { GET } from '../../app/api/search/route';

let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

describe('GET /api/search', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    process.env.SUPABASE_URL = 'https://example.supabase.co';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-role-key';
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('defaults to ingredient type when omitted', async () => {
    const rpc = vi.fn().mockResolvedValue({ data: [], error: null });
    vi.mocked(createClient).mockReturnValue({ rpc } as any);

    await GET(new Request('http://localhost:3000/api/search?query=spinach'));

    expect(rpc).toHaveBeenCalledWith('search_turmeric', { query: 'spinach', type: 'ingredient' });
  });

  it('rejects queries shorter than 2 characters', async () => {
    const response = await GET(new Request('http://localhost:3000/api/search?query=a'));
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'Query must be at least 2 characters.' });
  });

  it('rejects unsupported types', async () => {
    const response = await GET(new Request('http://localhost:3000/api/search?query=spinach&type=foo'));
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'Type must be one of ingredient, drink, nutrient, all' });
  });

  it('returns data from the RPC on success', async () => {
    const rpc = vi.fn().mockResolvedValue({ data: [{ id: 1, name: 'Spinach', match_type: 'ingredient' }], error: null });
    vi.mocked(createClient).mockReturnValue({ rpc } as any);

    const response = await GET(new Request('http://localhost:3000/api/search?query=spinach&type=ingredient'));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual([{ id: 1, name: 'Spinach', match_type: 'ingredient' }]);
    expect(rpc).toHaveBeenCalledWith('search_turmeric', { query: 'spinach', type: 'ingredient' });
  });

  it('calls the RPC with type=all when provided', async () => {
    const rpc = vi.fn().mockResolvedValue({ data: [], error: null });
    vi.mocked(createClient).mockReturnValue({ rpc } as any);

    await GET(new Request('http://localhost:3000/api/search?query=spinach&type=all'));

    expect(rpc).toHaveBeenCalledWith('search_turmeric', { query: 'spinach', type: 'all' });
  });

  it('maps Supabase RPC errors to 502', async () => {
    const rpc = vi.fn().mockResolvedValue({ data: null, error: { message: 'boom' } });
    vi.mocked(createClient).mockReturnValue({ rpc } as any);

    const response = await GET(new Request('http://localhost:3000/api/search?query=spinach'));

    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({ error: 'Search failed.' });
  });

  it('returns server error when env vars missing', async () => {
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;

    const response = await GET(new Request('http://localhost:3000/api/search?query=spinach'));

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: 'Search not configured.' });
  });
});
