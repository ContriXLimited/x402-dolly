'use client';

import { useState, useEffect, useRef } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { MessageCircle, X, Send } from 'lucide-react';
import { sendChatRequest } from './lib/agent-service';
import { PaymentError } from './lib/x402-payment';

// Add keyframes animation for the button pulse effect
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes floatingChatPulse {
      0%, 100% {
        opacity: 1;
        transform: scale(1);
      }
      50% {
        opacity: 0.8;
        transform: scale(1.1);
      }
    }
  `;
  if (!document.getElementById('floating-chat-animations')) {
    style.id = 'floating-chat-animations';
    document.head.appendChild(style);
  }
}

export interface FloatingChatProps {
  agentId: string;
  agentName?: string;
  agentAvatar?: string;
  agentDescription?: string;
  position?: 'bottom-right' | 'bottom-left';
  logoUrl?: string;
  apiEndpoint?: string; // API endpoint for chat requests
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  agentAvatar?: string;
  agentName?: string;
}

export function FloatingChat({
  agentId,
  agentName = 'AI Agent',
  agentAvatar = '',
  agentDescription = 'How can I help you today?',
  position = 'bottom-right',
  logoUrl = '/logo.svg',
  apiEndpoint = 'http://localhost:3000', // Default API endpoint
}: FloatingChatProps) {
  const wallet = useWallet();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-close error toast after 3 seconds
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  // Debug: Log component mount and state
  useEffect(() => {
    console.log('FloatingChat mounted', { isOpen, agentId, agentName, position });
    console.log('Button should be visible:', !isOpen);
  }, []);

  useEffect(() => {
    console.log('FloatingChat isOpen changed:', isOpen);
    console.log('Button should be visible:', !isOpen);
  }, [isOpen]);

  // Initialize with greeting message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: '1',
          content: `Hello! I'm ${agentName}. ${agentDescription}`,
          sender: 'agent',
          timestamp: new Date(),
          agentAvatar,
          agentName,
        },
      ]);
    }
  }, [isOpen, messages.length, agentName, agentDescription, agentAvatar]);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle send message
  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    // Clear any previous error
    setErrorMessage(null);

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Make x402 request with payment
      const response = await sendChatRequest(
        {
          agentId,
          message: content,
        },
        wallet,
        apiEndpoint
      );

      // Add agent response
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.content || `Payment successful! Here's your response: This is a mock result. The x402 payment flow completed successfully.`,
        sender: 'agent',
        timestamp: new Date(),
        agentAvatar,
        agentName,
      };

      setMessages((prev) => [...prev, agentMessage]);

      // Log transaction signature if available
      if (response.transactionSignature) {
        console.log('Payment transaction:', response.transactionSignature);
        console.log(
          `View on Solana Explorer: https://explorer.solana.com/tx/${response.transactionSignature}?cluster=devnet`
        );
      }
    } catch (error) {
      // Log full error details to console
      console.error('❌ Error sending message:', error);
      console.error('Full error details:', {
        error,
        message: error instanceof Error ? error.message : String(error),
        type: error && typeof error === 'object' && 'type' in error ? (error as any).type : 'unknown',
      });

      // Create short, user-friendly error message for UI
      let shortErrorMsg = 'Failed to send message. Please try again.';
      let detailedError = '';

      if (error && typeof error === 'object' && 'type' in error) {
        const paymentError = error as PaymentError & Error;
        detailedError = paymentError.message;

        switch (paymentError.type) {
          case 'insufficient_balance':
            shortErrorMsg = 'Insufficient USDC balance';
            break;
          case 'signing_error':
            shortErrorMsg = 'Transaction signing failed';
            break;
          case 'connection_error':
            shortErrorMsg = 'Cannot connect to API server';
            break;
          default:
            // For unknown errors, check for common patterns
            if (paymentError.message.includes('404')) {
              shortErrorMsg = 'API endpoint not found';
              detailedError = 'The backend API is not running. Please start the API server.';
            } else if (paymentError.message.includes('402')) {
              shortErrorMsg = 'Payment validation failed';
            } else {
              // Truncate long error messages
              shortErrorMsg = paymentError.message.length > 100
                ? paymentError.message.substring(0, 100) + '...'
                : paymentError.message;
            }
        }
      }

      // Log user-friendly message
      console.warn('💬 User-friendly error:', shortErrorMsg);
      if (detailedError) {
        console.info('📋 Details:', detailedError);
      }

      setErrorMessage(shortErrorMsg);

      // Show error as agent message with concise text
      const errorAgentMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Sorry, I encountered an error: ${shortErrorMsg}${detailedError ? '\n\n' + detailedError : ''}`,
        sender: 'agent',
        timestamp: new Date(),
        agentAvatar,
        agentName,
      };

      setMessages((prev) => [...prev, errorAgentMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  const positionStyle = position === 'bottom-right' ? { right: '24px' } : { left: '24px' };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <div
          className="floating-chat-container"
          style={{
            position: 'fixed',
            bottom: '24px',
            ...positionStyle,
            zIndex: 9999,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {/* Pulsing glow effect */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              width: '64px',
              height: '64px',
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.25), rgba(59, 130, 246, 0.25))',
              filter: 'blur(16px)',
              animation: 'floatingChatPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }}
          />

          {/* Main button */}
          <button
            onClick={() => setIsOpen(true)}
            className="relative rounded-full flex items-center justify-center group overflow-hidden"
            style={{
              width: '64px',
              height: '64px',
              background: 'transparent',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 4px 16px rgba(139, 92, 246, 0.2)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            onMouseEnter={(e) => {
              const container = e.currentTarget.parentElement;
              if (container) {
                container.style.transform = 'translateY(-4px)';
              }
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(139, 92, 246, 0.3)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
            }}
            onMouseLeave={(e) => {
              const container = e.currentTarget.parentElement;
              if (container) {
                container.style.transform = 'translateY(0)';
              }
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(139, 92, 246, 0.2)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            }}
            aria-label="Open chat"
            title="Chat with AI Agent"
          >
            {/* Gradient overlay on hover */}
            <div
              className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1))',
              }}
            />

            {/* Icon */}
            <div className="relative z-10">
              {logoUrl ? (
                <img src={logoUrl} alt="Chat" className="w-10 h-10 drop-shadow-lg" />
              ) : (
                <MessageCircle className="w-8 h-8 text-white drop-shadow-lg" />
              )}
            </div>
          </button>
        </div>
      )}

      {/* Chat Dialog */}
      {isOpen && (
        <div
          className="border border-white/10 rounded-2xl shadow-2xl flex flex-col"
          style={{
            position: 'fixed',
            bottom: '24px',
            ...positionStyle,
            width: '400px',
            height: '600px',
            zIndex: 9999,
            background: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(20px)',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div className="border-b border-white/10 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Agent Avatar */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                {agentAvatar ? (
                  <img
                    src={agentAvatar}
                    alt={agentName}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <span>{agentName.charAt(0)}</span>
                )}
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">{agentName}</h3>
                <p className="text-white/60 text-xs">
                  {wallet.connected ? 'Connected' : 'Connect wallet to chat'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all duration-200"
              aria-label="Close chat"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Error Toast - Inside dialog, below header */}
          {errorMessage && (
            <div
              className="px-4 py-2 bg-red-500/10 border-b border-red-500/50"
              style={{
                animation: 'slideDown 0.3s ease-out',
              }}
            >
              <div className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  />
                </svg>
                <div className="flex-1">
                  <p className="text-red-300 text-sm font-medium">{errorMessage}</p>
                </div>
                <button
                  onClick={() => setErrorMessage(null)}
                  className="text-red-400/60 hover:text-red-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.sender === 'agent' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                    {message.agentAvatar ? (
                      <img
                        src={message.agentAvatar}
                        alt={message.agentName}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <span>{message.agentName?.charAt(0) || 'A'}</span>
                    )}
                  </div>
                )}
                <div
                  className={`max-w-[75%] px-4 py-2.5 rounded-2xl ${message.sender === 'user'
                    ? 'bg-gradient-to-r from-purple-500/95 to-blue-500/95 text-white rounded-br-sm border border-white/20 shadow-lg'
                    : 'bg-white/10 text-white rounded-tl-sm border border-white/5'
                    }`}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                  {agentAvatar ? (
                    <img
                      src={agentAvatar}
                      alt={agentName}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <span>{agentName.charAt(0)}</span>
                  )}
                </div>
                <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-white/10">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-white/10 p-4">
            <div className="flex gap-2 items-end">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={wallet.connected ? 'Type a message...' : 'Connect wallet to send messages'}
                disabled={!wallet.connected || isTyping}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none min-h-[44px] max-h-[120px] disabled:opacity-50 disabled:cursor-not-allowed"
                rows={1}
              />
              <button
                onClick={() => handleSendMessage(inputValue)}
                disabled={!wallet.connected || !inputValue.trim() || isTyping}
                className="w-11 h-11 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                aria-label="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            {!wallet.connected && (
              <p className="text-white/40 text-xs mt-2 text-center">
                Please connect your Solana wallet to start chatting
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
