'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

const PING_INTERVAL_MS = 30_000;
const REQUEST_TIMEOUT_MS = 10_000;

type StatusState = {
  state: 'checking' | 'online' | 'degraded' | 'offline';
  message: string;
};

const INITIAL_STATE: StatusState = {
  state: 'checking',
  message: 'Checking Supabase…',
};

function buildPingUrl() {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return null;
  const trimmed = base.endsWith('/') ? base.slice(0, -1) : base;
  return `${trimmed}/rest/v1/ping?select=status`;
}

function buildHeaders() {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!key) return {};
  return {
    Accept: 'application/json',
    apikey: key,
    Authorization: `Bearer ${key}`,
  } satisfies Record<string, string>;
}

export default function ConnectionStatus() {
  const [status, setStatus] = useState<StatusState>(INITIAL_STATE);
  const [isOnline, setIsOnline] = useState<boolean>(() =>
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const pingUrl = useMemo(buildPingUrl, []);
  const headers = useMemo(buildHeaders, []);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => {
      setIsOnline(false);
      setStatus({ state: 'offline', message: 'Offline ❌' });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    let active = true;

    const runPing = async () => {
      if (!active) return;

      if (!pingUrl) {
        // Fall back to navigator status
        setStatus((current) => {
          if (!isOnline) return { state: 'offline', message: 'Offline ❌' };
          if (current.state === 'online') return current;
          return { state: 'online', message: 'Online ✅' };
        });
        return;
      }

      if (!isOnline) {
        setStatus({ state: 'offline', message: 'Offline ❌' });
        return;
      }

      setStatus((current) =>
        current.state === 'checking'
          ? current
          : { state: 'checking', message: 'Checking Supabase…' }
      );

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

      try {
        const response = await fetch(pingUrl, {
          headers,
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const json = await response.json();
        const ok = Array.isArray(json) && json[0]?.status === 'ok';

        if (!active) return;
        setStatus(
          ok
            ? { state: 'online', message: 'Connected to Supabase ✅' }
            : {
                state: 'degraded',
                message: 'Reachable, but ping view missing ⚠️',
              }
        );
      } catch (error) {
        if (!active) return;
        const reason =
          error instanceof Error
            ? error.name === 'AbortError'
              ? 'Timed out'
              : error.message
            : 'Unknown error';
        setStatus({
          state: 'offline',
          message: `Connection failed ❌ (${reason})`,
        });
      } finally {
        clearTimeout(timeout);
      }
    };

    runPing();
    intervalRef.current = setInterval(runPing, PING_INTERVAL_MS);

    return () => {
      active = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [headers, isOnline, pingUrl]);

  const colorClass =
    status.state === 'online'
      ? 'text-emerald-500'
      : status.state === 'degraded'
      ? 'text-amber-500'
      : status.state === 'checking'
      ? 'text-slate-500'
      : 'text-red-500';

  return (
    <div className="pointer-events-none absolute bottom-6 right-6 text-sm font-medium">
      <span className={`inline-flex items-center rounded-full bg-white/90 px-3 py-1 shadow-md ring-1 ring-black/5 ${colorClass}`}>
        {status.message}
      </span>
    </div>
  );
}
