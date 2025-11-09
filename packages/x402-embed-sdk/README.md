# @dolly/x402-embed-sdk

Embeddable X402 payment widget for Solana - a beautiful floating chat interface with built-in USDC payment support.

## Features

- 🎨 Beautiful glassmorphism UI design
- 💰 Built-in X402 payment protocol support
- 🔐 Solana wallet integration via wallet-adapter
- 💳 USDC payment on Solana Devnet
- 🎯 Easy to integrate - just drop in one component
- 📱 Responsive and mobile-friendly
- ⚡ Smooth animations and transitions
- 🛡️ Type-safe with TypeScript

## Installation

```bash
npm install @dolly/x402-embed-sdk
# or
yarn add @dolly/x402-embed-sdk
# or
pnpm add @dolly/x402-embed-sdk
```

## Peer Dependencies

Make sure you have these installed in your project:

```bash
npm install react react-dom @solana/wallet-adapter-react
```

## Quick Start

### 1. Set up Wallet Provider

First, wrap your app with the Solana wallet provider:

```tsx
import { WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { useMemo } from 'react';

function App() {
  const network = WalletAdapterNetwork.Devnet;
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <WalletProvider wallets={wallets} autoConnect>
      {/* Your app content */}
    </WalletProvider>
  );
}
```

### 2. Add FloatingChat Component

```tsx
import { FloatingChat } from '@dolly/x402-embed-sdk';

export default function MyPage() {
  return (
    <>
      {/* Your page content */}

      <FloatingChat
        agentId="1"
        agentName="AI Assistant"
        agentDescription="How can I help you today?"
        position="bottom-right"
        apiEndpoint="https://api.yourdomain.com"
      />
    </>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `agentId` | `string` | **required** | Unique identifier for the agent |
| `agentName` | `string` | `'AI Agent'` | Display name for the agent |
| `agentAvatar` | `string` | `''` | URL to agent's avatar image |
| `agentDescription` | `string` | `'How can I help you today?'` | Welcome message |
| `position` | `'bottom-right' \| 'bottom-left'` | `'bottom-right'` | Position of the floating button |
| `logoUrl` | `string` | `'/logo.svg'` | Logo displayed in the floating button |
| `apiEndpoint` | `string` | `'http://localhost:3000'` | Your backend API endpoint |

## Environment Variables

Create a `.env.local` file in your Next.js project:

```env
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
```

## X402 Payment Flow

The widget implements a complete X402 payment flow:

1. User sends a message
2. Widget checks USDC balance
3. Initial API request returns 402 Payment Required
4. Widget builds a Solana SPL token transfer transaction
5. User signs the transaction with their wallet
6. Request is retried with `X-PAYMENT` header
7. Server validates and broadcasts the transaction
8. Server returns 200 with `X-PAYMENT-RESPONSE` header
9. Transaction signature is logged to console

## Payment Configuration

Default configuration (Solana Devnet):
- **Network**: Solana Devnet
- **Token**: USDC (`4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU`)
- **Amount**: 0.01 USDC per request
- **Fee Payer**: Provided by facilitator (gas abstraction)

## Getting Testnet USDC

To test payments, get testnet USDC from: https://faucet.circle.com/

## Backend Requirements

Your backend API must implement the X402 payment protocol:

1. Return `402 Payment Required` for initial requests
2. Accept `X-PAYMENT` header with signed transaction
3. Validate and broadcast the transaction
4. Return `200 OK` with `X-PAYMENT-RESPONSE` header on success

See the [X402 Protocol Spec](https://github.com/dolly-x402/spec) for details.

## TypeScript Support

This package is written in TypeScript and includes type definitions.

```tsx
import type { FloatingChatProps, ChatRequest, ChatResponse, PaymentError } from '@dolly/x402-embed-sdk';
```

## Styling

The component uses Tailwind CSS classes. Make sure Tailwind is configured in your project, or the component will fall back to inline styles.

## Example Projects

Check out the example implementations:
- [Next.js Example](../../apps/web)
- [Docs Example](../../apps/docs)

## License

MIT

## Contributing

Contributions are welcome! Please open an issue or PR on GitHub.

## Support

For issues and feature requests, please use [GitHub Issues](https://github.com/your-org/dolly-x402-sdk/issues).
