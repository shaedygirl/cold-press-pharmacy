import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const TYPE_WHITELIST = new Set(['ingredient', 'drink', 'nutrient']);

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = (url.searchParams.get('query') ?? '').trim();
  const type = (url.searchParams.get('type') ?? 'ingredient').toLowerCase();

  if (query.length < 2) {
    return NextResponse.json(
      { error: 'Query must be at least 2 characters.' },
      { status: 400 }
    );
  }

  if (!TYPE_WHITELIST.has(type)) {
    return NextResponse.json(
      { error: `Type must be one of ${Array.from(TYPE_WHITELIST).join(', ')}` },
      { status: 400 }
    );
  }

  const supabaseUrl =
    process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? undefined;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    undefined;

  if (!supabaseUrl || !supabaseKey) {
    console.error('[search] Missing Supabase environment variables');
    return NextResponse.json({ error: 'Search not configured.' }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false }
  });

  const { data, error } = await supabase.rpc('search_turmeric', {
    query,
    type
  });

  if (error) {
    console.error('[search] RPC error', error);
    return NextResponse.json({ error: 'Search failed.' }, { status: 502 });
  }

  return NextResponse.json(data ?? []);
}
