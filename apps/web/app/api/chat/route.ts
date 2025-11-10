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

// Hardcoded LXDAO response
const LXDAO_INFO = `Visit https://lxdao.io/, click "Join us" to complete registration, then attend the weekly community meeting every Saturday at 11:00 AM (UTC+8) to introduce yourself. Afterward, contact the operations team to claim your Member Badge.
Anyone who embraces Web3 principles and is willing to contribute to open-source projects is welcome to join.`;

const FALLBACK_MESSAGE = "I can help you with LXDAO-related questions. Try asking about 'LXDAO' or 'How to join LXDAO?'";

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

    // Check if message contains "LXDAO" keyword (case-insensitive)
    const containsLXDAO = message.toLowerCase().includes("lxdao");

    // Build response
    const response: ChatResponse = {
      content: containsLXDAO ? LXDAO_INFO : FALLBACK_MESSAGE,
    };

    // Log request for debugging
    console.log("📝 Chat API Request:", {
      agentId,
      messageLength: message.length,
      containsLXDAO,
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
