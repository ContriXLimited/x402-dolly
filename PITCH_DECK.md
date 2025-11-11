# X402 Hackathon Pitch Deck - AskDolly

## Slide 0: Title Slide
### AskDolly X402 SDK
**Turn Your Data into Earning Agents**

**Tagline:**
> Pay-per-Message AI Agents Powered by X402

**Visual Elements:**
- Large logo: AskDolly
- Subtitle: "X402 Hackathon 2025"
- Background: Gradient with Solana purple and USDC blue
- Bottom: Team name and date

**Key Stats (optional):**
```
┌─────────────────────────────────────┐
│  💬 1.5M+ Users                     │
│  🚀 Pay-as-you-go AI Agents         │
│  ⚡ Zero Gas Micro-Payments         │
└─────────────────────────────────────┘
```

**Speaker Notes:**
- "Hi everyone, I'm [Your Name] from AskDolly"
- "Today we're presenting AskDolly X402 SDK - a platform that turns your data into earning AI Agents"
- "We're solving the knowledge monetization problem using X402's pay-per-message model"

---

## Slide 1: The Problem
### Expert Knowledge Can't Be Monetized + Current Payment Models Are Broken

**Three Pain Points:**

1. **Creator Side**: KOLs/experts build AI Agents, but users won't pay $20/month just to "try it out"
2. **User Side**: Subscription barriers are too high, micro-consultation scenarios can't be monetized
3. **Technical Side**: Traditional blockchain payments have gas fees, making micro-payments impractical

**Visual Design:**
```
Comparison Example:
┌─────────────────────────────────────────┐
│ Traditional Subscription: $20/month     │
│ User Psychology: Not worth subscribing  │
│                  for just 1 question    │
│                                         │
│ Actual Value: Single consult = $0.5    │
│ Result: Creator earns $0, User pays $0 │
└─────────────────────────────────────────┘
```

**Speaker Notes:**
- "Imagine you're a Crypto KOL who wants to turn your investment expertise into an AI Agent"
- "But users only want to ask one question, they don't want to subscribe for $20/month"
- "The result: you provide free service, or nobody uses it. This is the current dilemma"

---

## Slide 2: Solution - Pay-per-Message AI Agents
### X402 Makes "Pay-as-you-go" Actually Work

**Core Mechanism:**
- 🔹 Users pay automatically per message (e.g., $0.01 USDC)
- 🔹 X402 Gas Abstraction: Users only need USDC in wallet, no SOL required
- 🔹 Creators receive payments in real-time, transparent on-chain


**Visual Design:**
```
User Experience Flow:
User sends message → X402 auto-payment → Creator receives instantly
        ↓                   ↓                      ↓
   "Debug this"        $0.01 USDC          Revenue accumulates
```

**Speaker Notes:**
- "X402 enables true pay-as-you-go"
- "Users don't subscribe, they pay per question"
- "Creators go from zero earnings to earning on every conversation"
- "This change seems small, but it's a breakthrough for both sides"


## Slide 2.5: Example
**Use Case Examples:**

| Agent Type | Price per Message | Use Case |
|-----------|---------|----------|
| 💻 Debug Agent | $0.01 | Developers quickly solve code issues |
| 🏥 Health Agent | $0.05 | Get personalized diet/exercise advice |
| 💰 KOL Agent | $0.10 | Consult on crypto investment strategies |

---

## Slide 3: Why X402 Changes the Game
### Technical Breakthrough: Making Micro-Payments Actually Usable

**Comparison Table:**

| Dimension | Traditional Subscription | X402 Micro-Payment |
|-----|------------|---------------|
| 💰 Payment Method | $20/month subscription | Pay-per-use $0.01 |
| ⛽ Gas Barrier | Need ETH for gas | Only USDC (zero gas) |
| 📅 Payment Timing | Pay upfront monthly | Pay as you go |
| 💸 Creator Revenue | Platform settlement (monthly) | Real-time on-chain |
| 🎯 User Psychology | "Too expensive, skip it" | "Just 1 cent, let's try" |

**Core Value:**
- ✅ **User Side**: Lower decision threshold, from $20 → $0.01
- ✅ **Creator Side**: Open revenue channel, from $0 → continuous income
- ✅ **Technical Side**: X402 + Gas Abstraction makes it feel like Web2

**Speaker Notes:**
- "This table shows the fundamental change X402 brings"
- "Most importantly, the shift in user psychology: from 'too expensive, forget it' to 'just 1 cent, let's try'"
- "And technically, users don't even feel they're using blockchain payments"
- "Behind the scenes is X402's Gas Abstraction, where facilitators pay the gas for users"

---

## Slide 4: Product - 3 Core Components
### Complete Knowledge Monetization Solution

**Architecture Diagram:**
```
┌─────────────────────────────────────────────────────┐
│                 AskDolly Product Suite               │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌───────────────────┐  ┌──────────────────────┐  │
│  │ 1. Knowledge      │  │ 2. Agent             │  │
│  │    Dashboard      │─▶│    Marketplace       │  │
│  │                   │  │                      │  │
│  │ Data → Agent      │  │ Discover/Use Agents  │  │
│  │ • Documents       │  │ • Chat2Earn          │  │
│  │ • Chat History    │  │ • Pay-per-use        │  │
│  │ • Website Data    │  │ • Real-time Revenue  │  │
│  └───────────────────┘  └──────────────────────┘  │
│           │                       │                │
│           └───────┬───────────────┘                │
│                   ▼                                │
│        ┌──────────────────────┐                   │
│        │ 3. X402 Dolly SDK     │                   │
│        │    (React Plugin)     │                   │
│        │                       │                   │
│        │ Embed in any website  │                   │
│        │ with one line of code │                   │
│        └──────────────────────┘                   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**1. Knowledge Dashboard**
- 📁 Upload: Documents, chat history, websites, API data
- 🤖 Auto-transform: Data → Custom Agent
- ⚙️ Flexible config: Pricing, capabilities, response style

**2. Agent Marketplace**
- 🔍 Discover professional Agents (KOL, Debug, Health, Legal...)
- 💬 Chat2Earn: Users pay-per-use, Creators earn in real-time
- 📊 Transparent data: On-chain revenue records, fully traceable

**3. X402 Dolly SDK (Embeddable Plugin)**
- 🚀 Integrate into any website with one line of code
- 💰 Built-in X402 payment flow
- 🎨 Customizable UI (floating chat / inline widget)

**Usage Example:**
```jsx
import { FloatingChat } from '@askdolly/x402-embed-sdk';

<FloatingChat
  agentId="kol-crypto-expert"
  agentName="Crypto KOL"
  position="bottom-right"
  pricePerMessage={0.01}
/>
```

**Speaker Notes:**
- "We provide a complete solution, not just a payment feature"
- "Creators can upload data in the Dashboard and generate an Agent in minutes"
- "Then publish to the Marketplace, or embed using the SDK on their own website"
- "Users discover Agents in the Marketplace, or use them directly on other websites"
- "The entire flow is pay-per-use, with X402 handling payments automatically in the background"

---

## Slide 5: Team & Traction 💪
### AskDolly: Pioneers in AI + Community + Web3

**Team Background:**
- 🏢 **AskDolly** - AI-powered platform for community engagement & attention monetization
- 🎯 Focused on content assetization and data agentization

**Proven Track Record:**

```
┌─────────────────────────────────────────────┐
│        Dolly Mod Product Metrics             │
├─────────────────────────────────────────────┤
│                                             │
│  👥 1,500,000+ Users                        │
│  💬 Deployed on Discord & Telegram          │
│  🌐 Serving multiple Web3 communities       │
│  📊 Massive conversation data accumulated   │
│                                             │
└─────────────────────────────────────────────┘
```

**Core Competitive Advantages:**

✅ **We Have Users**
- 1.5M existing users can become first-batch Agent Creators
- Community operations experience enables Marketplace cold start

✅ **We Have Experience**
- Proven data agentization capabilities
- Know how to transform raw data into valuable AI services

✅ **We Have Technology**
- Complete X402 payment standard implementation
- Solana integration + Gas Abstraction
- Production-grade React SDK

**Why We Can Make This Happen:**
> "From community data to professional Agents, we've done it 1.5 million times"

**Speaker Notes:**
- "This isn't our first AI + Community product"
- "Dolly Mod already has 1.5 million users on Discord and Telegram"
- "We know what users need, and we know how to turn data into Agents"
- "This time, X402 solves the biggest problem: payment"
- "Now we can help Creators actually earn money"

---

## Slide 6: How It Works + Demo
### Complete Flow from Data to Revenue

**User Journey:**

```
Creator Side:
┌─────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│ Upload   │ → │ Configure │ → │ Publish/  │ → │ Real-time │
│ Data     │    │ Agent     │    │ Integrate │    │ Revenue   │
│          │    │           │    │           │    │           │
│ Docs/API │    │ Price/Cap │    │ Market/SDK│    │ USDC in   │
└─────────┘    └──────────┘    └──────────┘    └──────────┘

User Side:
┌─────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│ Discover │ → │ Connect   │ → │ Send      │ → │ Get       │
│ Agent    │    │ Wallet    │    │ Message   │    │ Answer    │
│          │    │           │    │           │    │           │
│ Browse   │    │ USDC only │    │ X402 pay  │    │ Pro serv  │
└─────────┘    └──────────┘    └──────────┘    └──────────┘
```

**Technical Flow (X402 Payment):**

```
1. User sends message
   ↓
2. Frontend builds Solana SPL Token Transfer
   • Transfer 0.01 USDC to Creator
   • Compute Budget Instructions (fee management)
   • Fee payer = Facilitator address
   ↓
3. User signs transaction with Wallet Adapter
   ↓
4. Send request to API with X-PAYMENT header
   • Header contains signed transaction
   • Encoded in X402 Exact Scheme format
   ↓
5. Backend validates and broadcasts transaction to Solana
   ↓
6. Return 200 + X-PAYMENT-RESPONSE header
   • Contains transaction signature
   • Creator receives USDC instantly
   ↓
7. User receives AI Agent response
```

**Demo Area:**

_[Place one of the following]_

**Option A: Product UI Screenshots**
- Knowledge Dashboard interface
- Agent Marketplace interface
- SDK integration effect (floating chat)

**Option B: Technical Architecture Diagram**
- Your custom system architecture diagram
- X402 payment flow diagram
- Solana transaction structure

**Option C: Real Transaction Proof**
- Solana Explorer screenshot
- Showing actual USDC transfer records
- Transaction signature

**Option D: Code Showcase**
```typescript
// X402 payment core code example
const transaction = await buildX402Payment({
  amount: 0.01, // USDC
  receiver: creatorWallet,
  feePayer: facilitatorWallet,
  user: userWallet
});

const signed = await wallet.signTransaction(transaction);
const response = await fetch('/api/agent/chat', {
  headers: {
    'X-PAYMENT': encodeTransaction(signed)
  }
});
```

**Speaker Notes:**
- "Let me show you the actual usage flow"
- "Creators just need to upload data, we auto-generate the Agent"
- "Users find the Agent they need in the Marketplace, connect wallet and start using"
- "Each time they send a message, X402 handles payment automatically in the background"
- "Users don't feel any complexity, it's as simple as using ChatGPT"
- "[Show Demo] Here you can see..."

---

## Appendix: Speaking Time Allocation

| Slide | Time | Focus |
|-------|------|------|
| Slide 0: Title | 20s | Quick intro, set the stage |
| Slide 1: Problem | 45s | Quickly establish pain points, build resonance |
| Slide 2: Solution | 60s | Explain core mechanism and scenarios |
| Slide 3: Why X402 | 45s | Let the comparison table speak, highlight advantages |
| Slide 4: Product | 60s | Show complete solution |
| Slide 5: Team | 45s | Flex time, build trust |
| Slide 6: Demo | 60s | Show actual product or technical details |

**Total: ~5.5-6.5 minutes**

---

## Design Recommendations

### Color Scheme
- Primary: Solana Purple (#9945FF) + USDC Blue (#2775CA)
- Accent: Green (revenue), Orange (payment)
- Background: Dark theme (more professional)

### Typography Hierarchy
- Titles: Large and bold, highlight key info
- Data: Extra large font size (1.5M users)
- Body: Clean and concise, avoid large blocks of text

### Visual Elements
- Flow diagrams: Use arrows and icons, not just text
- Comparison tables: Use colors to distinguish good/bad
- Logos: Include AskDolly + X402 + Solana logos

---

## Q&A Preparation

**Potential Questions:**

1. **"Who pays for the gas costs in X402?"**
   - Facilitators cover gas fees but can earn from transaction volume
   - This is part of the X402 standard to improve user experience

2. **"What if users spam messages maliciously?"**
   - Each message requires real payment, making spam expensive
   - Can implement rate limiting
   - Creators can configure pricing to increase attack costs

3. **"How is this different from ChatGPT Plugins?"**
   - ChatGPT Plugins are in OpenAI's controlled ecosystem
   - We're decentralized, Creators own their Agents and revenue
   - Payment is crypto-native, no credit card needed

4. **"Why Solana instead of Ethereum?"**
   - Fast transaction speed, better user experience
   - Even with facilitator-paid gas, Solana's gas costs are lower
   - USDC ecosystem on Solana is more suitable for micro-payments

5. **"How do you prevent low-quality Agent content?"**
   - Marketplace will have rating system
   - Users can vote and comment
   - Low-quality Agents naturally get filtered out (nobody pays to use them)

6. **"What's your tech stack?"**
   - Frontend: Next.js + React + Solana Wallet Adapter
   - Backend: [Your actual tech stack]
   - Blockchain: Solana Devnet (Mainnet in the future)
   - Payment: X402 standard + SPL Token Transfer

---

## Summary

**Core Message (3-sentence version):**

1. We use X402 to enable pay-per-use AI Agents, making knowledge monetization possible
2. User experience is as simple as Web2, backed by decentralized blockchain payments
3. We have a 1.5M user base and proven data agentization capabilities

**Closing Statement:**
> "Thank you! We believe X402 is not just a payment standard—it's the infrastructure to redefine content monetization. AskDolly is ready to bring this capability to our 1.5 million users and the entire Web3 community."

---

_Generated for X402 Hackathon - AskDolly Team_
