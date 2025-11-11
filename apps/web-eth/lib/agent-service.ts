/**
 * Agent Service - Handles X402 payment flow for chat requests
 * Ethereum/Base Sepolia version
 */

import type { Address } from 'viem';
import {
  buildPaymentTransaction,
  signAndSendTransaction,
  encodeXPayment,
  parsePaymentResponse,
  checkUSDCBalance,
  waitForTransaction,
  PaymentError,
} from "./x402-payment";

// Use relative path - Next.js rewrites will proxy to backend
const API_ENDPOINT = "";

export interface ChatRequest {
  agentId: string;
  message: string;
}

export interface PaymentInfo {
  recipientWallet: string;
  transactionHash: string;
  amount: string;
  network: string;
  message: string;
}

export interface ChatResponse {
  content?: string;
  transactionHash?: string;
  payment?: PaymentInfo;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

/**
 * Send chat request with x402 payment flow
 *
 * Flow:
 * 1. Make initial request to API
 * 2. If 402 response, build and sign payment transaction
 * 3. Wait for transaction confirmation
 * 4. Retry with X-PAYMENT header containing transaction hash
 * 5. Return response data on success
 */
export async function sendChatRequest(
  projectId: string,
  message: string,
  address: Address | undefined
): Promise<ChatResponse> {
  // Validate wallet connection
  if (!address) {
    throw createPaymentError(
      "signing_error",
      "Wallet not connected. Please connect your wallet."
    );
  }

  // Check USDC balance
  console.log("💰 Checking USDC balance...");
  const balanceCheck = await checkUSDCBalance(address);

  if (!balanceCheck.sufficient) {
    throw createPaymentError(
      "insufficient_balance",
      `Insufficient USDC balance. Required: ${balanceCheck.required} USDC, Available: ${balanceCheck.balance} USDC. Get testnet USDC from Base Sepolia faucet.`
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

  try {
    // Step 1: Make initial request (expecting 402)
    console.log("🚀 Making initial request to API...");
    const initialResponse = await fetch(`${API_ENDPOINT}/api/chat`, {
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
    const transactionRequest = await buildPaymentTransaction(address);

    // Step 4: Sign and send transaction
    console.log("✍️  Requesting wallet signature...");
    let transactionHash: `0x${string}`;
    try {
      transactionHash = await signAndSendTransaction(address, transactionRequest);
      console.log("  ✅ Transaction sent:", transactionHash);
    } catch (error) {
      throw createPaymentError(
        "signing_error",
        `Transaction signing/sending failed: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }

    // Step 5: Wait for transaction confirmation
    try {
      await waitForTransaction(transactionHash);
    } catch (error) {
      throw createPaymentError(
        "unknown",
        `Transaction confirmation failed: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }

    // Step 6: Encode X-PAYMENT header with transaction hash
    const xPayment = encodeXPayment(transactionHash);

    // Step 7: Retry request with X-PAYMENT header
    console.log("🔄 Retrying request with X-PAYMENT header...");
    const paymentResponse = await fetch(`${API_ENDPOINT}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-PAYMENT": xPayment,
      },
      body: JSON.stringify(requestBody),
    });

    // Step 8: Check response status
    if (paymentResponse.status === 402) {
      // Payment still failed
      const errorData = await paymentResponse.json();
      throw createPaymentError(
        "unknown",
        `Payment validation failed: ${typeof errorData.error === "object" ? JSON.stringify(errorData.error) : errorData.error || "Unknown error"}`
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

    // Step 9: Parse successful response (200 = success)
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
    const paymentResponseHeader =
      paymentResponse.headers.get("x-payment-response");
    if (paymentResponseHeader) {
      const paymentInfo = parsePaymentResponse(paymentResponseHeader);
      console.log("✅ Payment successful!");
      console.log(`  Transaction: ${paymentInfo.transactionHash || transactionHash}`);

      // Add transaction hash to response
      responseData.transactionHash = paymentInfo.transactionHash || transactionHash;

      console.log(
        `  Explorer: https://sepolia.basescan.org/tx/${responseData.transactionHash}`
      );
    } else {
      // Even if no X-PAYMENT-RESPONSE header, include our transaction hash
      responseData.transactionHash = transactionHash;
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
        "Network error: Unable to connect to the API server. Make sure it is running."
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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isPaymentError(error: any): error is PaymentError & Error {
  return (
    error && typeof error.type === "string" && typeof error.message === "string"
  );
}
