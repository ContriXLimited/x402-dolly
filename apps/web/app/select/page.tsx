'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { AgentCard } from '@/components/AgentCard';
import { AGENTS } from '@/lib/agents';

export default function SelectAgentPage() {
  const router = useRouter();
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  const handleAgentSelect = (id: string) => {
    setSelectedAgent(id);
    // Navigate to chat page
    router.push(`/chat/${id}`);
  };

  return (
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

        {/* Agent Selection Section */}
        <section className="px-8 py-16">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="mb-12 text-center">
              <h1 className="text-5xl font-bold tracking-tight mb-4 text-white">
                Choose Your Project Agent
              </h1>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Select a specialized AI agent to chat with. Each query costs just 0.01 USDC.
              </p>
            </div>

            {/* Agent Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {AGENTS.map((agent) => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  isSelected={selectedAgent === agent.id}
                  onSelect={handleAgentSelect}
                />
              ))}
            </div>

            {/* Helpful Info */}
            <div className="mt-16 text-center">
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full card-dark">
                <span className="text-2xl">💡</span>
                <span className="text-gray-400">
                  Make sure you have USDC in your Solana wallet before chatting
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
