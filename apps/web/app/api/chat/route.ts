/**
 * Chat API Endpoint
 *
 * Accepts simple format: { agentId, message }
 * Works with both SDK and Web App
 */

import { NextRequest, NextResponse } from "next/server";

interface ChatRequest {
  agentId: string;
  message: string;
}

interface ChatResponse {
  content: string;
}

// Hardcoded Solana/Solayer response
const SOLANA_SOLAYER_INFO = `Solayer is often called an "L2 on Solana," but it's not a traditional Ethereum-style rollup.
Instead:

Solana provides the base layer (security + data availability).

Solayer provides a separate execution layer where applications can run their own appchains.

This means:

Solayer scales Solana without breaking its single global state.

Apps can run on Solayer for higher throughput or customized rules.

Final settlement still happens on the Solana mainnet.

In short:

Solana = the main chain
Solayer = an execution layer built on top of Solana that helps scale it horizontally.`;

const FALLBACK_MESSAGE = "I can help you with questions about Solana and Solayer. Try asking about their relationship or how Solayer works!";

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: ChatRequest = await request.json();
    const { agentId, message } = body;

    // Validate required fields
    if (!message) {
      return NextResponse.json(
        { error: "Missing required field: message" },
        { status: 400 }
      );
    }

    // Check if message contains "solana" or "solayer" keywords (case-insensitive)
    const lowerMessage = message.toLowerCase();
    const containsSolanaKeyword = lowerMessage.includes("solana") || lowerMessage.includes("solayer");

    // Build response
    const response: ChatResponse = {
      content: containsSolanaKeyword ? SOLANA_SOLAYER_INFO : FALLBACK_MESSAGE,
    };

    // Log request for debugging
    console.log("📝 Chat API Request:", {
      agentId,
      messageLength: message.length,
      containsSolanaKeyword,
    });

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("❌ Chat API Error:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
