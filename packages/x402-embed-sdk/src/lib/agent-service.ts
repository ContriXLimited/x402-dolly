/**
 * Agent Service - Handles X402 payment flow for chat requests
 */

import { Connection, Transaction } from "@solana/web3.js";
import { WalletContextState } from "@solana/wallet-adapter-react";
import {
  buildPaymentTransaction,
  encodeXPayment,
  parsePaymentResponse,
  checkUSDCBalance,
  PAYMENT_CONFIG,
  PaymentError,
} from "./x402-payment";

export interface ChatRequest {
  agentId: string;
  message: string;
}

export interface ChatResponse {
  content?: string;
  transactionSignature?: string;
  [key: string]: any;
}

/**
 * Send chat request with x402 payment flow
 *
 * Flow:
 * 1. Make initial request to API
 * 2. If 402 response, build and sign payment transaction
 * 3. Retry with X-PAYMENT header
 * 4. Return response data on success
 */
export async function sendChatRequest(
  projectId: string,
  message: string,
  wallet: WalletContextState
): Promise<ChatResponse> {
  const { publicKey, signTransaction } = wallet;

  // Validate wallet connection
  if (!publicKey) {
    throw createPaymentError(
      "signing_error",
      "Wallet not connected. Please connect your wallet."
    );
  }

  if (!signTransaction) {
    throw createPaymentError(
      "signing_error",
      "Wallet does not support signing transactions."
    );
  }

  // Connect to Solana
  const connection = new Connection(PAYMENT_CONFIG.rpcEndpoint, "confirmed");

  // Check USDC balance
  console.log("💰 Checking USDC balance...");
  const balanceCheck = await checkUSDCBalance(connection, publicKey);

  if (!balanceCheck.sufficient) {
    throw createPaymentError(
      "insufficient_balance",
      `Insufficient USDC balance. Required: ${balanceCheck.required} USDC, Available: ${balanceCheck.balance} USDC. Get testnet USDC at: https://faucet.circle.com/`
    );
  }

  console.log(`  ✅ Sufficient balance: ${balanceCheck.balance} USDC`);

  // Build request body
  const requestBody: ChatRequest = {
    agentId: projectId,
    message,
  };

  console.log("📝 Request:", {
    agentId: projectId,
    messageLength: message.length,
  });

  // Determine API endpoint based on environment
  const isLocalhost = typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  const apiBaseUrl = isLocalhost ? '' : 'https://x402-dolly-web.vercel.app';
  const apiUrl = `${apiBaseUrl}/api/chat`;

  console.log(`🌐 API URL: ${apiUrl} (isLocalhost: ${isLocalhost})`);

  try {
    // Step 1: Make initial request (expecting 402)
    console.log("🚀 Making initial request to API...");
    const initialResponse = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    // Step 2: Verify 402 Payment Required
    if (initialResponse.status !== 402) {
      const errorText = await initialResponse.text();
      throw createPaymentError(
        "unknown",
        `Expected 402 Payment Required, got ${initialResponse.status}: ${errorText}`
      );
    }

    console.log("💳 Payment required (402). Building payment transaction...");

    // Step 3: Build payment transaction
    const transaction = await buildPaymentTransaction(connection, publicKey);

    // Step 4: Request user signature
    console.log("✍️  Requesting wallet signature...");
    let signedTransaction: Transaction;
    try {
      signedTransaction = await signTransaction(transaction);
      console.log("  ✅ Transaction signed");
    } catch (error) {
      throw createPaymentError(
        "signing_error",
        `Transaction signing failed: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }

    // Step 5: Encode X-PAYMENT header
    const xPayment = encodeXPayment(signedTransaction);

    // Step 6: Retry request with X-PAYMENT header
    console.log("🔄 Retrying request with X-PAYMENT header...");
    const paymentResponse = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-PAYMENT": xPayment,
      },
      body: JSON.stringify(requestBody),
    });

    // Step 7: Check response status
    if (paymentResponse.status === 402) {
      // Payment still failed
      const errorData = await paymentResponse.json();
      throw createPaymentError(
        "unknown",
        `Payment validation failed: ${typeof errorData.error === 'object' ? JSON.stringify(errorData.error) : errorData.error || "Unknown error"}`
      );
    }

    if (!paymentResponse.ok) {
      // Some other error
      const errorText = await paymentResponse.text();
      throw createPaymentError(
        "unknown",
        `Request failed (${paymentResponse.status}): ${errorText}`
      );
    }

    // Step 8: Parse successful response (200 = success)
    let responseData: ChatResponse = {};

    try {
      // Try to parse JSON response, but don't fail if it's not JSON
      const text = await paymentResponse.text();
      if (text) {
        try {
          responseData = JSON.parse(text);
        } catch {
          // Not JSON, that's ok - we just care about 200 status
          responseData = { content: text };
        }
      }
    } catch {
      // No body, that's ok too
      responseData = {};
    }

    // Check for X-PAYMENT-RESPONSE header
    const paymentResponseHeader = paymentResponse.headers.get("x-payment-response");
    if (paymentResponseHeader) {
      const paymentInfo = parsePaymentResponse(paymentResponseHeader);
      console.log("✅ Payment successful!");
      console.log(`  Transaction: ${paymentInfo.transaction}`);

      // Add transaction signature to response
      responseData.transactionSignature = paymentInfo.transaction;

      if (paymentInfo.transaction) {
        console.log(
          `  Explorer: https://explorer.solana.com/tx/${paymentInfo.transaction}?cluster=devnet`
        );
      }
    }

    return responseData;
  } catch (error) {
    // Re-throw PaymentError as-is
    if (isPaymentError(error)) {
      throw error;
    }

    // Connection/network errors
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw createPaymentError(
        "connection_error",
        "Network error: Unable to connect to the API server. Make sure it is running on localhost:3000."
      );
    }

    // Unknown errors
    throw createPaymentError(
      "unknown",
      `Unexpected error: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Helper to create a PaymentError
 */
function createPaymentError(
  type: PaymentError["type"],
  message: string
): PaymentError & Error {
  const error = new Error(message) as PaymentError & Error;
  error.type = type;
  error.message = message;
  return error;
}

/**
 * Type guard to check if error is a PaymentError
 */
function isPaymentError(error: any): error is PaymentError & Error {
  return error && typeof error.type === "string" && typeof error.message === "string";
}
