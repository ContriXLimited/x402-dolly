import React from 'react';
import { Header } from '@/components/Header';
import { DocSidebar } from '@/components/docs/DocSidebar';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { PropsTable } from '@/components/docs/PropsTable';
import { Alert } from '@/components/docs/Alert';
import Image from 'next/image';

const sections = [
  { id: 'introduction', title: 'Introduction' },
  { id: 'quick-start', title: 'Quick Start', subsections: [
    { id: 'installation', title: 'Installation' },
    { id: 'basic-usage', title: 'Basic Usage' },
  ]},
  { id: 'api-reference', title: 'API Reference' },
  { id: 'configuration', title: 'Configuration Guide', subsections: [
    { id: 'environment-variables', title: 'Environment Variables' },
    { id: 'wallet-setup', title: 'Wallet Provider Setup' },
    { id: 'api-endpoint', title: 'API Endpoint Configuration' },
  ]},
  { id: 'payment-flow', title: 'Payment Flow' },
  { id: 'styling', title: 'Styling & Customization', subsections: [
    { id: 'position', title: 'Position Options' },
    { id: 'branding', title: 'Custom Branding' },
  ]},
  { id: 'integration', title: 'Integration Examples' },
  { id: 'troubleshooting', title: 'Troubleshooting' },
  { id: 'best-practices', title: 'Best Practices' },
  { id: 'faq', title: 'FAQ' },
];

const propsData = [
  {
    name: 'agentId',
    type: 'string',
    required: true,
    description: 'Agent identifier for API requests',
  },
  {
    name: 'agentName',
    type: 'string',
    required: false,
    default: "'AI Agent'",
    description: 'Display name for the agent',
  },
  {
    name: 'agentAvatar',
    type: 'string',
    required: false,
    default: "''",
    description: 'Agent avatar image URL',
  },
  {
    name: 'agentDescription',
    type: 'string',
    required: false,
    default: "'How can I help you today?'",
    description: 'Welcome message description',
  },
  {
    name: 'position',
    type: "'bottom-right' | 'bottom-left'",
    required: false,
    default: "'bottom-right'",
    description: 'Position of the floating button',
  },
  {
    name: 'logoUrl',
    type: 'string',
    required: false,
    default: "'/logo.svg'",
    description: 'Logo to display in floating button',
  },
  {
    name: 'apiEndpoint',
    type: 'string',
    required: false,
    default: "'http://localhost:3000'",
    description: 'Backend API endpoint URL',
  },
];

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[#121212] relative">
      {/* Background */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/bg-1.webp)' }}
      />

      {/* Content */}
      <div className="relative z-10">
        <Header />
        <div className="max-w-[1400px] mx-auto px-8 py-24">
          <div className="flex gap-12">
            {/* Sidebar */}
            <DocSidebar sections={sections} />

            {/* Main Content */}
            <main className="flex-1 max-w-[900px]">
              {/* Hero Section */}
              <section id="introduction" className="mb-20">
                <h1 className="text-6xl font-bold text-white mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  FloatingChat Documentation
                </h1>
                <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                  Embeddable X402 payment widget for Solana - a beautiful floating chat interface with built-in USDC payment support.
                </p>
                <div className="flex gap-4">
                  <a
                    href="#quick-start"
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium rounded-xl hover:scale-105 transition-transform"
                  >
                    Get Started
                  </a>
                  <a
                    href="/floating-chat-demo"
                    className="px-6 py-3 bg-white/5 backdrop-blur-lg border border-white/10 text-white font-medium rounded-xl hover:bg-white/10 transition-colors"
                  >
                    View Demo
                  </a>
                </div>
              </section>

              {/* Quick Start */}
              <section id="quick-start" className="mb-20">
                <h2 className="text-4xl font-bold text-white mb-8">Quick Start</h2>

                <div id="installation" className="mb-12">
                  <h3 className="text-2xl font-semibold text-white mb-4">Installation</h3>
                  <Alert type="info" title="Package Manager">
                    This project uses <code className="text-purple-400">pnpm</code> as the package manager. Make sure you have it installed.
                  </Alert>
                  <div className="mt-6">
                    <CodeBlock
                      language="bash"
                      code={`# Install the package (when published to npm)
npm install @dolly/x402-embed-sdk

# Or use the local package in your monorepo
pnpm add @dolly/x402-embed-sdk`}
                      showLineNumbers={false}
                    />
                  </div>
                </div>

                <div id="basic-usage" className="mb-12">
                  <h3 className="text-2xl font-semibold text-white mb-4">Basic Usage</h3>
                  <p className="text-gray-300 mb-6">
                    The FloatingChat component must be wrapped in a Solana WalletProvider. Here's a complete example:
                  </p>

                  <div className="mb-6">
                    <CodeBlock
                      title="app/layout.tsx"
                      language="typescript"
                      code={`import { WalletProvider } from '@/components/WalletProvider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <WalletProvider>
          {children}
        </WalletProvider>
      </body>
    </html>
  );
}`}
                    />
                  </div>

                  <div className="mb-6">
                    <CodeBlock
                      title="app/page.tsx"
                      language="typescript"
                      code={`import { FloatingChat } from '@dolly/x402-embed-sdk';

export default function MyPage() {
  return (
    <div>
      {/* Your page content */}
      <h1>Welcome to my app</h1>

      {/* Add FloatingChat widget */}
      <FloatingChat
        agentId="1"
        agentName="Agent Alpha"
        agentDescription="Specialized in DeFi trading"
        position="bottom-right"
        logoUrl="/logo.svg"
        apiEndpoint="http://localhost:3000"
      />
    </div>
  );
}`}
                    />
                  </div>

                  <Alert type="success" title="That's it!">
                    The FloatingChat widget will now appear in the bottom-right corner of your page with full X402 payment integration.
                  </Alert>
                </div>
              </section>

              {/* API Reference */}
              <section id="api-reference" className="mb-20">
                <h2 className="text-4xl font-bold text-white mb-8">API Reference</h2>
                <p className="text-gray-300 mb-6">
                  Complete list of props accepted by the FloatingChat component:
                </p>
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden">
                  <PropsTable props={propsData} />
                </div>
                <div className="mt-4">
                  <Alert type="info">
                    Properties marked with <span className="text-red-400">*</span> are required.
                  </Alert>
                </div>
              </section>

              {/* Configuration Guide */}
              <section id="configuration" className="mb-20">
                <h2 className="text-4xl font-bold text-white mb-8">Configuration Guide</h2>

                <div id="environment-variables" className="mb-12">
                  <h3 className="text-2xl font-semibold text-white mb-4">Environment Variables</h3>
                  <p className="text-gray-300 mb-6">
                    Create a <code className="text-purple-400">.env.local</code> file in your app root:
                  </p>
                  <CodeBlock
                    title=".env.local"
                    language="bash"
                    code={`# Optional: Solana RPC URL (defaults to Devnet)
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com

# Optional: Your API endpoint
NEXT_PUBLIC_API_ENDPOINT=http://localhost:3000`}
                    showLineNumbers={false}
                  />
                </div>

                <div id="wallet-setup" className="mb-12">
                  <h3 className="text-2xl font-semibold text-white mb-4">Wallet Provider Setup</h3>
                  <p className="text-gray-300 mb-6">
                    The FloatingChat component requires a Solana wallet context. Create a WalletProvider component:
                  </p>
                  <CodeBlock
                    title="components/WalletProvider.tsx"
                    language="typescript"
                    code={`'use client';

import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  ConnectionProvider,
  WalletProvider as SolanaWalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import { useMemo } from 'react';

require('@solana/wallet-adapter-react-ui/styles.css');

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
}`}
                  />
                </div>

                <div id="api-endpoint" className="mb-12">
                  <h3 className="text-2xl font-semibold text-white mb-4">API Endpoint Configuration</h3>
                  <p className="text-gray-300 mb-6">
                    The FloatingChat component communicates with your backend API for payment processing. You can configure the endpoint via the <code className="text-purple-400">apiEndpoint</code> prop:
                  </p>
                  <CodeBlock
                    language="typescript"
                    code={`<FloatingChat
  agentId="1"
  apiEndpoint="https://api.yourdomain.com"
  // ... other props
/>`}
                  />
                  <div className="mt-4">
                    <Alert type="warning" title="Backend Requirements">
                      Your API must implement the X402 payment protocol. The endpoint should accept 402 Payment Required responses and process Solana transactions.
                    </Alert>
                  </div>
                </div>
              </section>

              {/* Payment Flow */}
              <section id="payment-flow" className="mb-20">
                <h2 className="text-4xl font-bold text-white mb-8">Payment Flow</h2>
                <p className="text-gray-300 mb-6">
                  The FloatingChat component implements the complete X402 payment protocol for Solana:
                </p>

                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 mb-6">
                  <ol className="space-y-4 text-gray-300">
                    <li className="flex gap-4">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">1</span>
                      <div>
                        <strong className="text-white">Initial API Request</strong>
                        <p className="text-sm mt-1">User sends a message, triggering an API request that returns <code className="text-purple-400">402 Payment Required</code></p>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">2</span>
                      <div>
                        <strong className="text-white">Transaction Building</strong>
                        <p className="text-sm mt-1">Component builds a Solana SPL token transfer transaction (0.01 USDC) with compute budget instructions</p>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">3</span>
                      <div>
                        <strong className="text-white">User Signs Transaction</strong>
                        <p className="text-sm mt-1">User approves and signs the transaction using their connected wallet (Phantom, Backpack, etc.)</p>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">4</span>
                      <div>
                        <strong className="text-white">Payment Submission</strong>
                        <p className="text-sm mt-1">Signed transaction is sent back to API with <code className="text-purple-400">X-PAYMENT</code> header</p>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">5</span>
                      <div>
                        <strong className="text-white">Transaction Processing</strong>
                        <p className="text-sm mt-1">Server validates and broadcasts the transaction to Solana network</p>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">6</span>
                      <div>
                        <strong className="text-white">Success Response</strong>
                        <p className="text-sm mt-1">Server returns <code className="text-purple-400">200 OK</code> with <code className="text-purple-400">X-PAYMENT-RESPONSE</code> header containing the transaction signature</p>
                      </div>
                    </li>
                  </ol>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Payment Configuration</h3>
                  <div className="bg-black/40 rounded-xl p-6 space-y-2 text-sm font-mono">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Network:</span>
                      <span className="text-white">Solana Devnet</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Token:</span>
                      <span className="text-white">USDC</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Mint Address:</span>
                      <span className="text-purple-400 text-xs">4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Amount per Request:</span>
                      <span className="text-white">0.01 USDC</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Fee Payer (Gas Abstraction):</span>
                      <span className="text-purple-400 text-xs">CKPKJWNdJEqa81x7CkZ14GAgXhaHii3GnPAEERYPJgZJDncDU</span>
                    </div>
                  </div>
                </div>

                <Alert type="info" title="Testnet USDC">
                  Get free testnet USDC from the Circle Faucet: <a href="https://faucet.circle.com/" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">https://faucet.circle.com/</a>
                </Alert>
              </section>

              {/* Styling & Customization */}
              <section id="styling" className="mb-20">
                <h2 className="text-4xl font-bold text-white mb-8">Styling & Customization</h2>

                <div id="position" className="mb-12">
                  <h3 className="text-2xl font-semibold text-white mb-4">Position Options</h3>
                  <p className="text-gray-300 mb-6">
                    The FloatingChat can be positioned in the bottom-right or bottom-left corner:
                  </p>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4">
                      <div className="text-white font-semibold mb-2">Bottom Right (Default)</div>
                      <CodeBlock
                        language="typescript"
                        code={`<FloatingChat
  position="bottom-right"
  // ... other props
/>`}
                        showLineNumbers={false}
                      />
                    </div>
                    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4">
                      <div className="text-white font-semibold mb-2">Bottom Left</div>
                      <CodeBlock
                        language="typescript"
                        code={`<FloatingChat
  position="bottom-left"
  // ... other props
/>`}
                        showLineNumbers={false}
                      />
                    </div>
                  </div>
                </div>

                <div id="branding" className="mb-12">
                  <h3 className="text-2xl font-semibold text-white mb-4">Custom Branding</h3>
                  <p className="text-gray-300 mb-6">
                    Customize the chat interface with your own branding:
                  </p>
                  <CodeBlock
                    language="typescript"
                    code={`<FloatingChat
  agentId="1"
  agentName="My Custom Agent"
  agentAvatar="/my-avatar.png"
  agentDescription="Welcome! How can I assist you today?"
  logoUrl="/my-logo.svg"
  // ... other props
/>`}
                  />
                  <div className="mt-4">
                    <Alert type="info">
                      The chat dialog size is fixed at 400x600px, and the floating button is 64x64px.
                    </Alert>
                  </div>
                </div>
              </section>

              {/* Integration Examples */}
              <section id="integration" className="mb-20">
                <h2 className="text-4xl font-bold text-white mb-8">Integration Examples</h2>
                <p className="text-gray-300 mb-6">
                  Here are some common integration patterns:
                </p>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-white mb-4">Multiple Agents</h3>
                  <CodeBlock
                    language="typescript"
                    code={`export default function MultiAgentPage() {
  const [selectedAgent, setSelectedAgent] = useState('1');

  return (
    <div>
      {/* Agent selector UI */}
      <AgentSelector onSelect={setSelectedAgent} />

      {/* FloatingChat with dynamic agent */}
      <FloatingChat
        agentId={selectedAgent}
        agentName={getAgentName(selectedAgent)}
        agentAvatar={getAgentAvatar(selectedAgent)}
      />
    </div>
  );
}`}
                  />
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-white mb-4">Conditional Rendering</h3>
                  <CodeBlock
                    language="typescript"
                    code={`export default function ConditionalPage() {
  const { user } = useAuth();

  return (
    <div>
      {/* Only show chat to authenticated users */}
      {user && (
        <FloatingChat
          agentId="1"
          agentName="Support Agent"
        />
      )}
    </div>
  );
}`}
                  />
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-white mb-4">Custom API Endpoint</h3>
                  <CodeBlock
                    language="typescript"
                    code={`export default function CustomAPIPage() {
  const apiEndpoint = process.env.NODE_ENV === 'production'
    ? 'https://api.production.com'
    : 'http://localhost:3000';

  return (
    <FloatingChat
      agentId="1"
      apiEndpoint={apiEndpoint}
    />
  );
}`}
                  />
                </div>
              </section>

              {/* Troubleshooting */}
              <section id="troubleshooting" className="mb-20">
                <h2 className="text-4xl font-bold text-white mb-8">Troubleshooting</h2>

                <div className="space-y-6">
                  <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-3">Wallet Not Connected</h3>
                    <p className="text-gray-300 text-sm mb-3">
                      <strong className="text-red-400">Error:</strong> "Please connect your wallet first"
                    </p>
                    <p className="text-gray-300 text-sm mb-3">
                      <strong>Solution:</strong> Make sure:
                    </p>
                    <ul className="list-disc list-inside text-gray-300 text-sm space-y-1 ml-4">
                      <li>You have a Solana wallet installed (Phantom, Backpack, etc.)</li>
                      <li>The WalletProvider is wrapping your app</li>
                      <li>You've clicked "Connect Wallet" before trying to send a message</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-3">Insufficient Balance</h3>
                    <p className="text-gray-300 text-sm mb-3">
                      <strong className="text-red-400">Error:</strong> "Insufficient USDC balance"
                    </p>
                    <p className="text-gray-300 text-sm mb-3">
                      <strong>Solution:</strong> Get testnet USDC from Circle Faucet:
                    </p>
                    <a
                      href="https://faucet.circle.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:underline text-sm"
                    >
                      https://faucet.circle.com/
                    </a>
                  </div>

                  <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-3">API Connection Failed</h3>
                    <p className="text-gray-300 text-sm mb-3">
                      <strong className="text-red-400">Error:</strong> "Failed to connect to API"
                    </p>
                    <p className="text-gray-300 text-sm mb-3">
                      <strong>Solution:</strong>
                    </p>
                    <ul className="list-disc list-inside text-gray-300 text-sm space-y-1 ml-4">
                      <li>Verify your API endpoint is correct and running</li>
                      <li>Check CORS configuration on your backend</li>
                      <li>Ensure the API implements the X402 payment protocol</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-3">Transaction Failed</h3>
                    <p className="text-gray-300 text-sm mb-3">
                      <strong className="text-red-400">Error:</strong> "Transaction failed"
                    </p>
                    <p className="text-gray-300 text-sm mb-3">
                      <strong>Solution:</strong>
                    </p>
                    <ul className="list-disc list-inside text-gray-300 text-sm space-y-1 ml-4">
                      <li>Check your wallet has enough SOL for transaction fees</li>
                      <li>Verify you're on Solana Devnet</li>
                      <li>Try again - sometimes Devnet is congested</li>
                      <li>Check the browser console for transaction signature and Solana Explorer link</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Best Practices */}
              <section id="best-practices" className="mb-20">
                <h2 className="text-4xl font-bold text-white mb-8">Best Practices</h2>

                <div className="space-y-6">
                  <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <span>✅</span> Use Environment Variables
                    </h3>
                    <p className="text-gray-300 text-sm">
                      Always store sensitive configuration like API endpoints in environment variables, not hardcoded in your components.
                    </p>
                  </div>

                  <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <span>✅</span> Handle Errors Gracefully
                    </h3>
                    <p className="text-gray-300 text-sm">
                      The FloatingChat component includes built-in error handling, but make sure your backend also provides clear error messages.
                    </p>
                  </div>

                  <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <span>✅</span> Test on Devnet First
                    </h3>
                    <p className="text-gray-300 text-sm">
                      Always test your integration thoroughly on Solana Devnet before moving to Mainnet. Use the Circle faucet to get testnet USDC.
                    </p>
                  </div>

                  <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <span>✅</span> Monitor Transaction Logs
                    </h3>
                    <p className="text-gray-300 text-sm">
                      The component logs transaction signatures to the console. Use these to track payments and debug issues via Solana Explorer.
                    </p>
                  </div>

                  <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <span>⚠️</span> Security Considerations
                    </h3>
                    <p className="text-gray-300 text-sm mb-2">
                      While the FloatingChat handles payment flow securely, remember:
                    </p>
                    <ul className="list-disc list-inside text-gray-300 text-sm space-y-1 ml-4">
                      <li>Always validate transactions on your backend</li>
                      <li>Never trust client-side payment confirmations alone</li>
                      <li>Implement rate limiting to prevent abuse</li>
                      <li>Use HTTPS in production</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* FAQ */}
              <section id="faq" className="mb-20">
                <h2 className="text-4xl font-bold text-white mb-8">FAQ</h2>

                <div className="space-y-4">
                  <details className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 cursor-pointer group">
                    <summary className="text-white font-semibold text-lg list-none flex justify-between items-center">
                      <span>What is the X402 payment protocol?</span>
                      <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <p className="text-gray-300 text-sm mt-4 leading-relaxed">
                      X402 is a payment protocol that uses HTTP status code 402 (Payment Required) to request payment before providing a service. The FloatingChat component implements this protocol for Solana blockchain payments.
                    </p>
                  </details>

                  <details className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 cursor-pointer group">
                    <summary className="text-white font-semibold text-lg list-none flex justify-between items-center">
                      <span>Can I use this on Solana Mainnet?</span>
                      <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <p className="text-gray-300 text-sm mt-4 leading-relaxed">
                      Yes! The component is configured for Devnet by default, but you can easily switch to Mainnet by updating your WalletProvider configuration and RPC endpoint. Make sure to update the USDC mint address for Mainnet.
                    </p>
                  </details>

                  <details className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 cursor-pointer group">
                    <summary className="text-white font-semibold text-lg list-none flex justify-between items-center">
                      <span>How much does each request cost?</span>
                      <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <p className="text-gray-300 text-sm mt-4 leading-relaxed">
                      By default, each AI agent request costs 0.01 USDC (plus minimal SOL for transaction fees). This amount is configurable in your backend API.
                    </p>
                  </details>

                  <details className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 cursor-pointer group">
                    <summary className="text-white font-semibold text-lg list-none flex justify-between items-center">
                      <span>Which wallets are supported?</span>
                      <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <p className="text-gray-300 text-sm mt-4 leading-relaxed">
                      The component works with any Solana wallet that supports the Wallet Adapter standard, including Phantom, Backpack, Solflare, and many others.
                    </p>
                  </details>

                  <details className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 cursor-pointer group">
                    <summary className="text-white font-semibold text-lg list-none flex justify-between items-center">
                      <span>What is gas abstraction?</span>
                      <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <p className="text-gray-300 text-sm mt-4 leading-relaxed">
                      Gas abstraction means the transaction fees (in SOL) are paid by a facilitator, not the user. Users only need USDC to make payments, making the experience smoother.
                    </p>
                  </details>

                  <details className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 cursor-pointer group">
                    <summary className="text-white font-semibold text-lg list-none flex justify-between items-center">
                      <span>Can I customize the chat UI?</span>
                      <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <p className="text-gray-300 text-sm mt-4 leading-relaxed">
                      Currently, the chat UI uses a fixed glassmorphism design. The size (400x600px) and core styling are not customizable, but you can configure the agent name, avatar, description, and logo.
                    </p>
                  </details>

                  <details className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 cursor-pointer group">
                    <summary className="text-white font-semibold text-lg list-none flex justify-between items-center">
                      <span>How do I track payment history?</span>
                      <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <p className="text-gray-300 text-sm mt-4 leading-relaxed">
                      Transaction signatures are logged to the browser console and can be viewed on Solana Explorer. For complete payment history, implement tracking on your backend by storing transaction signatures from the X-PAYMENT-RESPONSE header.
                    </p>
                  </details>
                </div>
              </section>

              {/* Footer */}
              <div className="border-t border-white/10 pt-8 mt-20">
                <p className="text-gray-400 text-sm text-center">
                  Need help? Check out the{' '}
                  <a href="/floating-chat-demo" className="text-purple-400 hover:underline">
                    live demo
                  </a>{' '}
                  or visit the{' '}
                  <a href="https://github.com" className="text-purple-400 hover:underline">
                    GitHub repository
                  </a>
                  .
                </p>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
