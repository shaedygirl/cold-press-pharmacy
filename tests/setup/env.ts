// tests/setup/env.ts

// Provide harmless defaults for Supabase in tests.
// These should NEVER be your real project keys.
process.env.SUPABASE_URL = process.env.SUPABASE_URL ?? 'http://localhost:54321';
process.env.SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY ?? 'test-anon-key';

// If you need service role in local tests (mocked only)
process.env.SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? 'test-service-role';