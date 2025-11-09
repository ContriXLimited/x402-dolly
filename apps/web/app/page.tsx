'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { AgentCard, type Agent } from '@/components/AgentCard';

// Mock agent data
const AGENTS: Agent[] = [
  {
    id: '1',
    name: 'Agent Alpha',
    description: 'Specialized in DeFi trading and portfolio management strategies',
    avatar: '',
  },
  {
    id: '2',
    name: 'Agent Beta',
    description: 'NFT market analysis and trend prediction expert',
    avatar: '',
  },
  {
    id: '3',
    name: 'Agent Gamma',
    description: 'Smart contract auditing and security analysis specialist',
    avatar: '',
  },
  {
    id: '4',
    name: 'Agent Delta',
    description: 'Cross-chain bridge optimization and transaction routing',
    avatar: '',
  },
  {
    id: '5',
    name: 'Agent Epsilon',
    description: 'Yield farming strategy optimizer and risk assessor',
    avatar: '',
  },
  {
    id: '6',
    name: 'Agent Zeta',
    description: 'Token launch analysis and early opportunity detection',
    avatar: '',
  },
  {
    id: '7',
    name: 'Agent Eta',
    description: 'DAO governance participation and voting recommendations',
    avatar: '',
  },
  {
    id: '8',
    name: 'Agent Theta',
    description: 'MEV protection and transaction optimization expert',
    avatar: '',
  },
];

export default function Home() {
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
        <Hero />

        {/* Agent Cards Section */}
        <section className="px-8 py-10">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="mb-12 text-center">
              <h2 className="text-4xl font-bold tracking-tight mb-3 text-white">Explore AI Agents</h2>
              <p className="text-gray-400 text-lg">Select a project agent to get started</p>
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
          </div>
        </section>
      </div>
    </div>
  );
}
