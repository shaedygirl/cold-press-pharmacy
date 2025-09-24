'use client';

import { useState } from 'react';
import LogoWordmark from '@/components/turmeric/LogoWordmark';
import SearchBar from '@/components/turmeric/SearchBar';
import HotkeyHints from '@/components/turmeric/HotkeyHints';
import ConnectionStatus from '@/components/turmeric/ConnectionStatus';

export default function TurmericLandingPage() {
  const [query, setQuery] = useState('');
  const [connected] = useState(true);

  const handleSubmit = () => {
    console.info('[turmeric] submit', query);
  };

  const handleClear = () => {
    setQuery('');
  };

  return (
    <main className="min-h-[calc(100svh-4rem)] grid place-items-center bg-[#FCF5E9]">
      <div className="w-full max-w-2xl px-6 py-16">
        <div className="flex flex-col items-center gap-8 text-center">
          <LogoWordmark />
          <SearchBar
            value={query}
            onQueryChange={setQuery}
            onSubmit={handleSubmit}
            onClear={handleClear}
          />
          <HotkeyHints />
          <ConnectionStatus connected={connected} />
        </div>
      </div>
      <div className="h-3 bg-red-500" />
    </main>
  );
}
