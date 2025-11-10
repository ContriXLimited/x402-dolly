/**
 * LXDAO Information API Endpoint
 *
 * Simple local API route that responds to LXDAO-related queries
 * with hardcoded information. Matches the chat API format but
 * runs locally without payment requirements.
 */

import { NextRequest, NextResponse } from "next/server";

interface ChatRequest {
  sessionId: string;
  walletAddress: string;
  projectId: string;
  content: string;
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

    // Validate required fields
    if (!body.content) {
      return NextResponse.json(
        { error: "Missing required field: content" },
        { status: 400 }
      );
    }

    // Check if content contains "LXDAO" keyword (case-insensitive)
    const containsLXDAO = body.content.toLowerCase().includes("lxdao");

    // Build response
    const response: ChatResponse = {
      content: containsLXDAO ? LXDAO_INFO : FALLBACK_MESSAGE,
    };

    // Log request for debugging
    console.log("📝 LXDAO API Request:", {
      sessionId: body.sessionId,
      walletAddress: body.walletAddress,
      projectId: body.projectId,
      contentLength: body.content.length,
      containsLXDAO,
    });

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("❌ LXDAO API Error:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
