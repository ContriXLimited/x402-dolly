'use client';

import { cn } from '@/lib/utils';

export interface Agent {
  id: string;
  name: string;
  description: string;
  avatar: string;
}

interface AgentCardProps {
  agent: Agent;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export function AgentCard({ agent, isSelected, onSelect }: AgentCardProps) {
  return (
    <div
      className={cn(
        'cursor-pointer transition-all duration-300 p-6 rounded-xl card-dark hover:scale-105',
        isSelected && 'ring-2 ring-purple-500 bg-white/10'
      )}
      onClick={() => onSelect(agent.id)}
    >
      <div className="flex flex-col gap-4">
        {/* Avatar */}
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 flex items-center justify-center text-white font-bold text-xl">
          {agent.avatar ? (
            <img
              src={agent.avatar}
              alt={agent.name}
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <span>{agent.name.charAt(0)}</span>
          )}
        </div>

        {/* Name */}
        <h3 className="text-xl font-bold text-white">{agent.name}</h3>

        {/* Description */}
        <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">
          {agent.description}
        </p>
      </div>
    </div>
  );
}
