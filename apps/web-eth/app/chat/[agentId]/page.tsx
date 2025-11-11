/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAccount, useSignTypedData } from 'wagmi';
import { Header } from '@/components/Header';
import { ChatMessage, type Message } from '@/components/ChatMessage';
import { ChatInput } from '@/components/ChatInput';
import { sendChatRequest } from '@/lib/agent-service';
import { PaymentError } from '@/lib/x402-payment';
import { fetchAgentById, type Agent } from '@/lib/agents';

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const { address } = useAccount();
  const { signTypedDataAsync } = useSignTypedData();
  const agentId = params.agentId as string;

  const [agent, setAgent] = useState<Agent | null>(null);
  const [agentLoading, setAgentLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);

  const [isTyping, setIsTyping] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch agent data on mount
  useEffect(() => {
    const loadAgent = async () => {
      try {
        setAgentLoading(true);
        const fetchedAgent = await fetchAgentById(agentId);
        setAgent(fetchedAgent);

        // Initialize welcome message once agent is loaded
        if (fetchedAgent) {
          setMessages([
            {
              id: '1',
              content: `Hello! I'm ${fetchedAgent.name}. ${fetchedAgent.description}. How can I help you today?`,
              sender: 'agent',
              timestamp: new Date(),
              agentAvatar: fetchedAgent.avatar,
              agentName: fetchedAgent.name,
            },
          ]);
        }
      } catch (error) {
        console.error('Error loading agent:', error);
        setAgent(null);
      } finally {
        setAgentLoading(false);
      }
    };

    loadAgent();
  }, [agentId]);

  // Auto scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle sending messages with x402 payment
  const handleSendMessage = async (content: string) => {
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
    setIsTyping(true);

    try {
      // Make x402 request with payment (EIP-712 signature)
      const response = await sendChatRequest(
        agentId, // projectId
        content, // message content
        address,
        signTypedDataAsync
      );

      // Add agent response - use actual content from API if available
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.content || 'Payment successful! Waiting for agent response...',
        sender: 'agent',
        timestamp: new Date(),
        agentAvatar: agent?.avatar,
        agentName: agent?.name,
      };

      setMessages((prev) => [...prev, agentMessage]);

      // Log transaction hash if available
      if (response.transactionHash) {
        console.log('Payment transaction:', response.transactionHash);
        console.log(
          `View on Base Sepolia Explorer: https://sepolia.basescan.org/tx/${response.transactionHash}`
        );
      }
    } catch (error) {
      console.error('Error sending message:', error);

      // Handle different error types
      let errorMsg = 'Failed to send message. Please try again.';

      if (error && typeof error === 'object' && 'type' in error) {
        const paymentError = error as PaymentError & Error;
        switch (paymentError.type) {
          case 'insufficient_balance':
            errorMsg = paymentError.message;
            break;
          case 'signing_error':
            errorMsg = 'Transaction signing failed. Please try again.';
            break;
          case 'connection_error':
            errorMsg = paymentError.message;
            break;
          default:
            errorMsg = paymentError.message || errorMsg;
        }
      }

      setErrorMessage(errorMsg);

      // Show error as agent message
      const errorAgentMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Sorry, I encountered an error: ${errorMsg}`,
        sender: 'agent',
        timestamp: new Date(),
        agentAvatar: agent?.avatar,
        agentName: agent?.name,
      };

      setMessages((prev) => [...prev, errorAgentMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // Handle back button
  const handleBack = () => {
    router.push('/');
  };

  // Loading state
  if (agentLoading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h2 className="text-xl">Loading agent...</h2>
        </div>
      </div>
    );
  }

  // Agent not found
  if (!agent) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-white text-center">
          <div className="text-6xl mb-4">🤖</div>
          <h2 className="text-2xl font-bold mb-2">Agent not found</h2>
          <p className="text-gray-400 mb-6">
            The agent you're looking for doesn't exist or is not available.
          </p>
          <button
            onClick={handleBack}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold hover:opacity-90 transition-opacity"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] relative flex flex-col">
      {/* Background Image */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-100"
        style={{
          backgroundImage: 'url(/bg-1.webp)',
        }}
      />

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col h-screen">
        <Header />

        {/* Error Toast */}
        {errorMessage && (
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-50 max-w-md">
            <div className="card-dark border border-red-500/50 px-6 py-4 rounded-lg shadow-lg">
              <div className="flex items-start gap-3">
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
                  <p className="text-red-500 font-semibold mb-1">Error</p>
                  <p className="text-white/80 text-sm">{errorMessage}</p>
                </div>
                <button
                  onClick={() => setErrorMessage(null)}
                  className="text-white/60 hover:text-white/80 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Chat Container - Glass Morphism Card */}
        <div className="flex-1 overflow-hidden px-6 py-6">
          <div className="max-w-5xl mx-auto h-full">
            {/* Glass Morphism Card */}
            <div className="card-dark rounded-xl h-full flex flex-col overflow-hidden">
              {/* Agent Info Bar - Inside Card */}
              <div className="border-b border-white/10 px-6 py-4 flex items-center gap-4">
                {/* Back button */}
                <button
                  onClick={handleBack}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all duration-200 hover:scale-105"
                  aria-label="返回"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5 text-white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                    />
                  </svg>
                </button>

                {/* Agent Avatar */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
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

                {/* Agent Name */}
                <div>
                  <h2 className="text-white font-semibold">{agent.name}</h2>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6">
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}

                {/* Typing indicator */}
                {isTyping && (
                  <div className="flex gap-3 mb-4 px-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
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

              {/* Input Area - Part of the Card */}
              <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
