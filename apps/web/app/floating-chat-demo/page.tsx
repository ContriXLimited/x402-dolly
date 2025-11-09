'use client';

import { Header } from '@/components/Header';
import { FloatingChat } from '@repo/ui/floating-chat';

// Mock agent data
const DEMO_AGENT = {
  id: '1',
  name: 'Agent Alpha',
  description: 'Specialized in DeFi trading and portfolio management strategies',
  avatar: '',
};

export default function FloatingChatDemo() {
  return (
    <>
      <div className="min-h-screen bg-[#121212] relative">
        {/* Background Image */}
        <div
          className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-100"
          style={{
            backgroundImage: 'url(/bg-1.webp)',
          }}
        />

        {/* Content Layer */}
        <div className="relative z-10">
        <Header />

        {/* Hero Section */}
        <section className="px-8 py-20">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-6xl font-bold tracking-tight mb-6 text-white">
              Floating Chat Component Demo
            </h1>
            <p className="text-gray-400 text-xl mb-8 max-w-2xl mx-auto">
              This page demonstrates the FloatingChat component from @repo/ui package.
              The chat button is in the bottom-right corner.
            </p>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-xl mb-4 mx-auto">
                  1
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">Connect Wallet</h3>
                <p className="text-gray-400 text-sm">
                  Click the wallet button in the header to connect your Solana wallet
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-xl mb-4 mx-auto">
                  2
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">Open Chat</h3>
                <p className="text-gray-400 text-sm">
                  Click the floating button in the bottom-right corner to open the chat dialog
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-xl mb-4 mx-auto">
                  3
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">Send Message</h3>
                <p className="text-gray-400 text-sm">
                  Type a message and it will trigger the X402 payment flow with your wallet
                </p>
              </div>
            </div>

            {/* Info Section */}
            <div className="mt-16 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 text-left max-w-3xl mx-auto">
              <h2 className="text-white font-semibold text-2xl mb-4">Component Features</h2>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-purple-400 font-bold">✓</span>
                  <span>Complete X402 payment flow integration with Solana</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-400 font-bold">✓</span>
                  <span>Wallet connection check and balance validation</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-400 font-bold">✓</span>
                  <span>Glassmorphism UI design with smooth animations</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-400 font-bold">✓</span>
                  <span>Customizable agent name, avatar, and description</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-400 font-bold">✓</span>
                  <span>Error handling with user-friendly messages</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-400 font-bold">✓</span>
                  <span>Transaction signature logging and explorer links</span>
                </li>
              </ul>

              <div className="mt-6 bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
                <p className="text-red-300 text-sm">
                  <strong>⚠️ Important:</strong> You need to run the backend API server for the payment flow to work.
                  The API should be available at <code className="bg-black/30 px-1 rounded">NEXT_PUBLIC_API_ENDPOINT</code>.
                  Without it, you will see a "404 API endpoint not found" error.
                </p>
              </div>

              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                <p className="text-purple-300 text-sm">
                  <strong>Note:</strong> Make sure you have testnet USDC in your wallet. Get it from{' '}
                  <a
                    href="https://faucet.circle.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-purple-200"
                  >
                    Circle Faucet
                  </a>
                </p>
              </div>
            </div>

            {/* Code Example */}
            <div className="mt-16 bg-black/40 backdrop-blur-lg border border-white/10 rounded-2xl p-8 text-left max-w-3xl mx-auto">
              <h2 className="text-white font-semibold text-2xl mb-4">Usage Example</h2>
              <pre className="text-sm text-gray-300 overflow-x-auto">
                <code>{`import { FloatingChat } from '@repo/ui/floating-chat';

export default function MyPage() {
  return (
    <>
      {/* Your page content */}

      <FloatingChat
        agentId="1"
        agentName="Agent Alpha"
        agentDescription="Specialized in DeFi trading"
        position="bottom-right"
        logoUrl="/logo.svg"
      />
    </>
  );
}`}</code>
              </pre>
            </div>
          </div>
        </section>
        </div>
      </div>

      {/* Floating Chat Component - Outside relative container */}
      <FloatingChat
        agentId={DEMO_AGENT.id}
        agentName={DEMO_AGENT.name}
        agentDescription={DEMO_AGENT.description}
        agentAvatar={DEMO_AGENT.avatar}
        position="bottom-right"
        logoUrl="/logo.svg"
      />
    </>
  );
}
