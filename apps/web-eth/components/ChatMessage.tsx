'use client';

import { cn } from '@/lib/utils';

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  agentAvatar?: string;
  agentName?: string;
}

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isAgent = message.sender === 'agent';

  return (
    <div
      className={cn(
        'flex gap-3 mb-4 px-2',
        isAgent ? 'justify-start' : 'justify-end'
      )}
    >
      {/* Agent avatar - only show for agent messages on the left */}
      {isAgent && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
          {message.agentAvatar ? (
            <img
              src={message.agentAvatar}
              alt={message.agentName || 'Agent'}
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <span>{message.agentName?.charAt(0) || 'A'}</span>
          )}
        </div>
      )}

      {/* Message bubble - simple styling without glass morphism */}
      <div className="flex flex-col gap-1 max-w-[75%]">
        <div
          className={cn(
            'px-4 py-2.5 rounded-2xl',
            isAgent
              ? 'bg-white/10 text-white rounded-tl-sm'
              : 'bg-purple-500/20 text-white rounded-tr-sm'
          )}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        </div>
        <p className={cn(
          "text-gray-400 text-xs px-2",
          isAgent ? 'text-left' : 'text-right'
        )}>
          {message.timestamp.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
    </div>
  );
}
