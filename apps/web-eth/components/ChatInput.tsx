'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSendMessage, disabled = false }: ChatInputProps) {
  const [input, setInput] = useState('');
  const { isConnected } = useAccount();

  const handleSend = () => {
    if (!isConnected) {
      alert('Please connect your wallet first to send messages.');
      return;
    }

    if (input.trim() && !disabled) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-white/10 p-4">
      <div className="flex gap-3 items-center">
        {/* Input field */}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Type a message..."
          className={cn(
            'flex-1 px-4 py-3 rounded-xl',
            'bg-white/5 border border-white/10',
            'text-white placeholder:text-gray-500',
            'focus:outline-none focus:ring-2 focus:ring-purple-500/50',
            'transition-all duration-200',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        />

        {/* Ask button */}
        <button
          onClick={handleSend}
          disabled={disabled || !input.trim() || !isConnected}
          className={cn(
            'px-6 py-3 rounded-xl font-semibold text-white',
            'transition-all duration-200',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            !disabled && input.trim() && isConnected
              ? 'gradient-button hover:scale-105'
              : 'bg-gray-600'
          )}
          title={!isConnected ? 'Please connect your wallet first' : ''}
        >
          Ask
        </button>
      </div>
    </div>
  );
}
