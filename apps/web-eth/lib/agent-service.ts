/**
 * Agent Service - Handles X402 payment flow for chat requests
 * Uses EIP-712 signature for USDC TransferWithAuthorization
 */

import type { Address } from "viem";
import { baseSepolia } from "viem/chains";
import {
  generateNonce,
  buildPaymentHeader,
  getEIP712Domain,
  EIP712_TYPES,
  type TransferAuthorization,
} from "./x402";
import {
  checkUSDCBalance,
  parsePaymentResponse,
  PAYMENT_CONFIG,
  PaymentError,
} from "./x402-payment";
import { debugX402Signature } from "./debug-x402";

// Use relative path - Next.js rewrites will proxy to backend
const API_ENDPOINT = "";

export interface ChatRequest {
  agentId: string;
  message: string;
}

export interface PaymentInfo {
  recipientWallet: string;
  transactionHash?: string;
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
 * Type for the signTypedData function from wagmi
 */
export type SignTypedDataFunction = (args: {
  domain: {
    name: string;
    version: string;
    chainId: number;
    verifyingContract: Address;
  };
  types: typeof EIP712_TYPES;
  primaryType: "TransferWithAuthorization";
  message: TransferAuthorization;
}) => Promise<`0x${string}`>;

/**
 * Send chat request with x402 payment flow
 *
 * Flow:
 * 1. Make initial request to API
 * 2. If 402 response, build TransferWithAuthorization message
 * 3. Request EIP-712 signature from user (no transaction sent)
 * 4. Build X-PAYMENT header with signature
 * 5. Retry request with X-PAYMENT header
 * 6. Return response data on success
 */
export async function sendChatRequest(
  projectId: string,
  message: string,
  address: Address | undefined,
  signTypedDataAsync: SignTypedDataFunction
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

    console.log("💳 Payment required (402). Building authorization message...");

    // Step 3: Build TransferWithAuthorization message
    console.log("📝 Building authorization data...");
    const validBefore =
      Math.floor(Date.now() / 1000) + PAYMENT_CONFIG.maxTimeoutSeconds;
    const nonce = generateNonce();

    const authorization: TransferAuthorization = {
      from: address,
      to: PAYMENT_CONFIG.payTo,
      value: BigInt(PAYMENT_CONFIG.maxAmountRequired),
      validAfter: BigInt(0),
      validBefore: BigInt(validBefore),
      nonce,
    };
    console.log("✅ Authorization data:", authorization);

    // Step 4: Build EIP-712 domain for signing
    console.log("📝 Building EIP-712 domain...");
    const domain = getEIP712Domain(
      baseSepolia.id,
      PAYMENT_CONFIG.asset,
      PAYMENT_CONFIG.extra.name,
      PAYMENT_CONFIG.extra.version
    );
    console.log("✅ Domain:", domain);

    // Step 5: Request EIP-712 signature from user wallet
    console.log("✍️  Requesting signature from wallet...");
    let signature: `0x${string}`;
    try {
      signature = await signTypedDataAsync({
        domain,
        types: EIP712_TYPES,
        primaryType: "TransferWithAuthorization",
        message: authorization,
      });
      console.log("✅ Signature received:", signature);
    } catch (error) {
      throw createPaymentError(
        "signing_error",
        `Signature rejected: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }

    // Step 6: Build X-PAYMENT header with signature
    console.log("📝 Building X-PAYMENT header...");
    const paymentHeader = buildPaymentHeader(
      signature,
      authorization,
      PAYMENT_CONFIG
    );
    console.log("✅ Payment header built");

    // Debug: Log signature details
    debugX402Signature(signature, authorization, domain, paymentHeader);

    // Step 7: Retry request with X-PAYMENT header
    console.log("🔄 Retrying request with X-PAYMENT header...");
    const paymentResponse = await fetch(`${API_ENDPOINT}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-PAYMENT": paymentHeader,
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

      if (paymentInfo.transactionHash) {
        console.log(`  Transaction: ${paymentInfo.transactionHash}`);
        responseData.transactionHash = paymentInfo.transactionHash;
        console.log(
          `  Explorer: https://sepolia.basescan.org/tx/${paymentInfo.transactionHash}`
        );
      } else {
        console.log("  Payment processed by facilitator");
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
