'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { AgentCard } from '@/components/AgentCard';
import { fetchAgents, type Agent } from '@/lib/agents';
import { ApiError } from '@/lib/api-client';

export default function SelectAgentPage() {
  const router = useRouter();
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAgents = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedAgents = await fetchAgents();
      console.log('Fetched agents:', fetchedAgents);
      setAgents(fetchedAgents);
    } catch (err) {
      console.error('Error loading agents:', err);
      if (err instanceof ApiError) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to load agents. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAgents();
  }, []);

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

            {/* Loading State */}
            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div
                    key={i}
                    className="card-dark rounded-2xl p-6 animate-pulse"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gray-700" />
                      <div className="flex-1">
                        <div className="h-5 bg-gray-700 rounded w-3/4 mb-2" />
                        <div className="h-4 bg-gray-700 rounded w-1/2" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-700 rounded w-full" />
                      <div className="h-3 bg-gray-700 rounded w-5/6" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="text-center py-16">
                <div className="inline-flex flex-col items-center gap-6 max-w-md mx-auto">
                  <div className="text-6xl">⚠️</div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      Failed to Load Agents
                    </h2>
                    <p className="text-gray-400 mb-6">{error}</p>
                  </div>
                  <button
                    onClick={loadAgents}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold hover:opacity-90 transition-opacity"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}

            {/* Success State - Agent Cards Grid */}
            {!loading && !error && agents.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {agents.map((agent) => (
                  <AgentCard
                    key={agent.id}
                    agent={agent}
                    isSelected={selectedAgent === agent.id}
                    onSelect={handleAgentSelect}
                  />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && agents.length === 0 && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🤖</div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  No Agents Available
                </h2>
                <p className="text-gray-400">
                  There are currently no agents available. Please check back later.
                </p>
              </div>
            )}

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
