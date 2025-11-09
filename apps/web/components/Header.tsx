'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export function Header() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="border-b border-white/10 px-3 py-3 bg-[#121212] backdropheader-blur-md">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo and Title */}
        <div className="flex items-center">
          <div className="w-8 flex items-center justify-center">
            <Image
              src="/logo.svg"
              alt="x402Dolly Logo"
              width={20}
              height={20}
              className="object-contain"
            />
          </div>
          <h1 className="text-lg font-bold tracking-tight text-white">X402DOLLY</h1>
        </div>

        {/* Wallet Connect Button - Only render on client to avoid hydration mismatch */}
        {mounted && <WalletMultiButton className="gradient-button" />}
      </div>
    </header>
  );
}
