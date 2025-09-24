'use client';

type ConnectionStatusProps = {
  connected: boolean;
};

export default function ConnectionStatus({ connected }: ConnectionStatusProps) {
  const statusText = connected ? 'Connected to Supabase ✅' : 'Connected to Supabase ❌';
  const statusClass = connected ? 'text-emerald-600' : 'text-red-600';

  return (
    <p role="status" className={`text-sm font-medium ${statusClass}`}>
      {statusText}
    </p>
  );
}
