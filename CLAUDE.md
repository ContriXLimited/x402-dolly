# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Turborepo monorepo** demonstrating the X402 payment protocol integration with Solana blockchain. The project showcases a Web3 AI agent marketplace where users pay for agent services using USDC on Solana Devnet via the X402 payment standard.

### Package Manager
- Uses **pnpm** (v9.0.0) with workspace configuration
- Node.js >= 18 required

## Architecture

### Monorepo Structure
```
apps/
  web/          - Main Next.js application (port 3000) with X402 payment flow
  docs/         - Documentation Next.js app (port 3001)
packages/
  ui/           - Shared React component library (@repo/ui)
  eslint-config/   - Shared ESLint configurations
  typescript-config/ - Shared TypeScript configs
```

### X402 Payment Flow (apps/web)

The web app implements a complete client-side X402 payment flow for AI agent chat services:

**Key Components:**
1. **Payment Flow** (`lib/agent-service.ts`):
   - Initial API request returns 402 Payment Required
   - Builds Solana SPL token transfer transaction
   - User signs with wallet adapter
   - Retries request with `X-PAYMENT` header
   - Server validates and broadcasts transaction
   - Returns 200 with `X-PAYMENT-RESPONSE` header on success

2. **Transaction Building** (`lib/x402-payment.ts`):
   - Creates USDC transfer to service provider
   - Includes Compute Budget instructions for fee management
   - Fee payer provided by facilitator (gas abstraction)
   - Encodes signed transaction in X402 Exact Scheme format

3. **Wallet Integration** (`components/WalletProvider.tsx`):
   - Uses Solana wallet adapter for multi-wallet support
   - Provides wallet context throughout the app
   - Handles transaction signing

**Payment Configuration:**
- Network: Solana Devnet
- Token: USDC (mint: `4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU`)
- Amount: 0.01 USDC per request (10000 atomic units)
- Receiver: `CmGgLQL36Y9ubtTsy2zmE46TAxwCBm66onZmPPhUWNqv`
- Fee Payer: `CKPKJWNdJEqa81x7CkZ14GAgXhaHii3GnPAEERYPJgZJDncDU` (gas abstraction)

### Turborepo Task Pipeline

Defined in `turbo.json`:
- **build**: Depends on dependencies' build (^build), outputs to `.next/**`
- **lint**: Depends on dependencies' lint (^lint)
- **check-types**: Type checking with Next.js typegen + tsc
- **dev**: No cache, persistent mode for watch mode

## Common Commands

### Development
```bash
# Install dependencies
pnpm install

# Run all apps in dev mode (web on :3000, docs on :3001)
pnpm dev

# Run specific app
turbo dev --filter=web
turbo dev --filter=docs

# Generate new React component in @repo/ui
cd packages/ui && pnpm run generate:component
```

### Building
```bash
# Build all packages and apps
pnpm build

# Build specific app (includes dependencies)
turbo build --filter=web
```

### Linting & Type Checking
```bash
# Lint all packages
pnpm lint

# Type check all packages
pnpm check-types

# Format code
pnpm format
```

### Turborepo Filters
Use `--filter` to target specific workspaces:
- `turbo build --filter=web` - Build web app and its dependencies
- `turbo dev --filter=docs` - Run only docs app
- `turbo lint --filter=@repo/ui` - Lint only UI package

### Testing X402 Payment Flow

1. **Get Testnet USDC**: https://faucet.circle.com/
2. **Connect Wallet**: Use Phantom, Backpack, or other Solana wallet on Devnet
3. **Ensure Backend Running**: The API must be available at the endpoint specified in `NEXT_PUBLIC_API_ENDPOINT`
4. **Test Flow**:
   - Navigate to agent in web app
   - Send message (triggers payment flow)
   - Sign transaction in wallet
   - Check console for transaction signature and explorer link

## Key Files to Understand

- `apps/web/lib/agent-service.ts` - X402 payment orchestration logic
- `apps/web/lib/x402-payment.ts` - Solana transaction building and encoding
- `apps/web/app/chat/[agentId]/page.tsx` - Chat interface with payment integration
- `turbo.json` - Task dependency graph and caching configuration
- `pnpm-workspace.yaml` - Workspace package definitions

## Environment Variables

Create `.env.local` in `apps/web/`:
```
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_API_ENDPOINT=http://localhost:3000
```

## Shared Packages

### @repo/ui
- Component library shared across apps
- Direct file exports: `import { Button } from '@repo/ui/button'`
- Components in `packages/ui/src/*.tsx`

#### FloatingChat Component

The `@repo/ui` package includes a reusable **FloatingChat** component that encapsulates the complete X402 payment flow in a floating chat widget.

**Location:** `packages/ui/src/floating-chat.tsx`

**Features:**
- Floating button in bottom-right or bottom-left corner
- Expandable chat dialog (400x600px)
- Complete X402 payment integration with Solana
- Wallet connection check and USDC balance validation
- Glassmorphism UI design with smooth animations
- Error handling with user-friendly messages
- Transaction signature logging and explorer links

**Usage:**
```tsx
import { FloatingChat } from '@repo/ui/floating-chat';

export default function MyPage() {
  return (
    <>
      {/* Your page content */}

      <FloatingChat
        agentId="1"
        agentName="Agent Alpha"
        agentDescription="Specialized in DeFi trading"
        position="bottom-right"
        logoUrl="/logo.svg"
        apiEndpoint="http://localhost:3000"
      />
    </>
  );
}
```

**Props:**
- `agentId` (required): Agent identifier for API requests
- `agentName` (optional): Display name for the agent
- `agentAvatar` (optional): Agent avatar image URL
- `agentDescription` (optional): Welcome message description
- `position` (optional): `'bottom-right'` or `'bottom-left'` (default: `'bottom-right'`)
- `logoUrl` (optional): Logo to display in floating button (default: `'/logo.svg'`)
- `apiEndpoint` (optional): Backend API endpoint (default: `'http://localhost:3000'`)

**Requirements:**
- Must be wrapped in Solana `WalletProvider` (see `apps/web/components/WalletProvider.tsx`)
- Requires environment variable: `NEXT_PUBLIC_SOLANA_RPC_URL` (optional, defaults to Solana devnet)
- API endpoint can be configured via `apiEndpoint` prop
- Users need testnet USDC from https://faucet.circle.com/

**Demo Page:**
Visit `http://localhost:3000/floating-chat-demo` to see a working example

**Internal Dependencies:**
- `packages/ui/src/lib/agent-service.ts` - X402 payment orchestration
- `packages/ui/src/lib/x402-payment.ts` - Solana transaction building

### @repo/eslint-config
- Shared ESLint configurations
- Includes Next.js and Prettier configs

### @repo/typescript-config
- Base tsconfig.json files
- Extended by individual packages
