/**
 * X402 Ethereum Payment Utility for Client-side Payment Flow
 * Uses EIP-712 signature for USDC TransferWithAuthorization
 * Supports Base Sepolia testnet
 */

import { createPublicClient, http, formatUnits } from "viem";
import { baseSepolia } from "viem/chains";
import type { Address } from "viem";
import type { X402PaymentConfig } from "./x402";

// USDC contract ABI (only balanceOf for checking balance)
const USDC_ABI = [
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "decimals",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint8" }],
  },
] as const;

// Payment configuration for Base Sepolia
export const PAYMENT_CONFIG: X402PaymentConfig = {
  network: "base-sepolia",
  scheme: "exact",

  // Amount: 0.01 USDC = 10000 (6 decimals)
  maxAmountRequired: "10000",

  // Receiver address for payments (must match middleware address)
  payTo:
    (process.env.NEXT_PUBLIC_RECEIVER_ADDRESS as Address) ||
    ("0xF4192Be0b579be42A3479974EC25592DeFfe7141" as Address),

  // USDC contract on Base Sepolia
  asset: "0x036CbD53842c5426634e7929541eC2318f3dCF7e" as Address,

  // Maximum timeout: 60 seconds
  maxTimeoutSeconds: 60,

  // USDC contract metadata for EIP-712
  extra: {
    name: "USDC",
    version: "2",
  },
};

export interface PaymentError {
  type:
    | "insufficient_balance"
    | "connection_error"
    | "signing_error"
    | "unknown";
  message: string;
}

export interface PaymentResponse {
  transactionHash?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

/**
 * Get public client for reading blockchain data
 */
export function getPublicClient() {
  return createPublicClient({
    chain: baseSepolia,
    transport: http(
      process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL ||
        baseSepolia.rpcUrls.default.http[0]
    ),
  });
}

/**
 * Parse X-PAYMENT-RESPONSE header
 */
export function parsePaymentResponse(headerValue: string): PaymentResponse {
  try {
    let decoded: string;

    // Browser environment
    if (typeof window !== "undefined") {
      decoded = atob(headerValue);
    } else {
      // Server environment (fallback)
      decoded = Buffer.from(headerValue, "base64").toString("utf8");
    }

    return JSON.parse(decoded);
  } catch (error) {
    console.error("Failed to parse X-PAYMENT-RESPONSE:", error);
    return {};
  }
}

/**
 * Check if user has sufficient USDC balance
 */
export async function checkUSDCBalance(
  address: Address
): Promise<{ sufficient: boolean; balance: string; required: string }> {
  try {
    const publicClient = getPublicClient();

    const balance = await publicClient.readContract({
      address: PAYMENT_CONFIG.asset,
      abi: USDC_ABI,
      functionName: "balanceOf",
      args: [address],
    });

    const usdcBalance = formatUnits(balance, 6); // USDC has 6 decimals
    const requiredAmount = formatUnits(
      BigInt(PAYMENT_CONFIG.maxAmountRequired),
      6
    );

    return {
      sufficient: parseFloat(usdcBalance) >= parseFloat(requiredAmount),
      balance: usdcBalance,
      required: requiredAmount,
    };
  } catch (error) {
    console.error("Error checking USDC balance:", error);
    return {
      sufficient: false,
      balance: "0",
      required: formatUnits(BigInt(PAYMENT_CONFIG.maxAmountRequired), 6),
    };
  }
}
