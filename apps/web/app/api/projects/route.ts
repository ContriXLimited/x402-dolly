/**
 * Projects API Endpoint
 *
 * Returns a hardcoded list of all available AI agent projects.
 * Data compressed from original API with only essential fields.
 */

import { NextResponse } from "next/server";

interface Project {
  id: string;
  name: string;
  introduction: string;
}

const PROJECTS: Project[] = [
  {
    id: "7391678089614331904",
    name: "Solayer",
    introduction:
      "Institutional-grade execution layer built to power the next era of on-chain finance, delivering 100,000+ TPS with sub-second finality for perpetual DEXs and tokenized RWAs.",
  },
  {
    id: "7391678089614331905",
    name: "Solana",
    introduction:
      "High-performance blockchain supporting 65,000+ TPS with sub-second finality, designed for mass adoption with low fees and energy-efficient Proof of History consensus mechanism.",
  },
  {
    id: "7381892357001580544",
    name: "Zentra",
    introduction:
      "Decentralized World Computer with Upgradable CPU, Unlimited Gas powered by Minus Theory, native Python on Base.",
  },
  {
    id: "7360524447171743744",
    name: "LXDAO",
    introduction:
      "Decentralized autonomous organization dedicated to fostering valuable open source projects in the Web3 ecosystem with conscience and integrity as core values.",
  },
  {
    id: "7381869473579405312",
    name: "QuintesProtocol",
    introduction:
      "Next-generation DeFi protocol delivering stability, scalability, and sustainable yield through a dual-token model with proof of collateral mechanism.",
  },
  {
    id: "7379337716397248512",
    name: "PlayTingz",
    introduction:
      "Revolutionary AI-powered gaming platform that transforms simple prompts into fully playable games, making game creation accessible to everyone.",
  },
  {
    id: "7377181282800766976",
    name: "NodeX",
    introduction:
      "Web3 infrastructure innovation platform driven by the vision: Make Any Device On-Chain, Make Compute Social, integrating NaaS, DePIN, and AI compute economy.",
  },
  {
    id: "7376610830822936576",
    name: "Buzzing",
    introduction:
      "Personalized prediction markets platform that reduces creation costs to zero, enables unlimited supply, and uses algorithms to optimize the prediction market experience.",
  },
  {
    id: "7376189715390664704",
    name: "ZooFinance",
    introduction:
      "LNT - Liquid Node Token: Revolutionary asset issuance process unshackling liquidity from trillions of locked assets in Nodes, SAFT/E and RWAs.",
  },
  {
    id: "7374507572260245504",
    name: "Euclid Protocol",
    introduction:
      "Premier decentralized cross-chain liquidity infrastructure built on Nibiru, offering unified liquidity and execution across Cosmos, Ethereum, Solana, and other EVM chains.",
  },
  {
    id: "7370798301710389248",
    name: "Dolly",
    introduction:
      "AI-powered moderator and community intelligence layer designed for Web3 projects, combining Dolly Mod (24/7 AI Moderator) and Dolly Vibe (community data-to-asset engine).",
  },
  {
    id: "7364670320768192512",
    name: "AskDolly",
    introduction:
      "AI-powered moderator and community intelligence layer designed for Web3 projects, combining Dolly Mod (24/7 AI Moderator) and Dolly Vibe (community data-to-asset engine).",
  },
  {
    id: "7359503982093406208",
    name: "HackQuest",
    introduction:
      "Premier free, multichain Web3 developer platform offering immersive, certified learning paths across Ethereum, Solana, Arbitrum, Mantle, BNB, and more leading ecosystems.",
  },
  {
    id: "7357687058619437056",
    name: "Celo",
    introduction:
      "Emerging Ethereum Layer-2 designed to make blockchain technology accessible to all with focus on scalability, low fees, and ease of use.",
  },
  {
    id: "7357469538310426624",
    name: "KiteAI",
    introduction:
      "First purpose-built foundational blockchain for AI, designed to empower fair and transparent collaboration across data, models, and agents with Proof of Artificial Intelligence.",
  },
  {
    id: "7353007907799044096",
    name: "Uniswap",
    introduction:
      "Leading decentralized exchange protocol pioneering the Automated Market Maker model, enabling permissionless, peer-to-contract token swaps via smart contracts since 2018.",
  },
  {
    id: "7352981596347043840",
    name: "AITV",
    introduction:
      "Decentralized content creation platform merging Artificial Intelligence, Entertainment, and Web3 technologies with AI-powered tools and NFT-based monetization.",
  },
  {
    id: "7349874445671993348",
    name: "Oasis",
    introduction:
      "Layer 1 decentralized blockchain network designed to be uniquely scalable, privacy-first and versatile with consensus layer and ParaTime layer architecture.",
  },
  {
    id: "7348634225307815940",
    name: "0G",
    introduction:
      "Pioneering blockchain company focused on decentralized AI infrastructure, backed by $325M+ in funding, creator of the world's first decentralized AI operating system.",
  },
  {
    id: "1750952655732654080",
    name: "Mask Network",
    introduction:
      "Browser extension bringing Web3 capabilities directly into traditional social media platforms like X, Facebook, Instagram with decentralized identity and crypto features.",
  },
  {
    id: "1750952655733951744",
    name: "Bitfi",
    introduction:
      "Innovative BTC liquidity protocol offering native yield opportunities to BTC holders through a unique CeDeFi hybrid architecture.",
  },
  {
    id: "1750952655733776384",
    name: "Spark",
    introduction:
      "USDS centric money market protocol combining savings, borrowing, and liquidity provision with direct liquidity from Sky and DeFi protocol integration.",
  },
  {
    id: "1750952655733590528",
    name: "JuChain",
    introduction:
      "High-performance Layer 1 blockchain platform designed as an on-chain traffic hub and user growth engine with JPoSA consensus achieving sub-second confirmations.",
  },
  {
    id: "1750952655733539328",
    name: "Aimoverse",
    introduction:
      "Event-based Autonomous AI Agent Framework written in Rust, tailored for embedded AI devices and multi-agent systems with high scalability and flexibility.",
  },
];

export async function GET() {
  return NextResponse.json(PROJECTS, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
