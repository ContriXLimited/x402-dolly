/**
 * X402 Ethereum Payment Utility for Client-side Payment Flow
 * Supports Base Sepolia testnet with USDC payments
 */

import { createPublicClient, createWalletClient, custom, http, parseUnits, formatUnits, encodeFunctionData } from 'viem';
import { baseSepolia } from 'viem/chains';
import type { Account, Address } from 'viem';

// USDC contract ABI (only the functions we need)
const USDC_ABI = [
  {
    name: 'transfer',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'decimals',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint8' }],
  },
] as const;

// Payment configuration for Base Sepolia
export const PAYMENT_CONFIG = {
  network: 'base-sepolia',
  chainId: baseSepolia.id,

  // USDC contract on Base Sepolia
  usdcAddress: '0x036CbD53842c5426634e7929541eC2318f3dCF7e' as Address,

  // Receiver address for payments
  payTo: process.env.NEXT_PUBLIC_RECEIVER_ADDRESS as Address || '0x0000000000000000000000000000000000000000' as Address,

  // Amount in USDC (0.01 USDC)
  amountUSDC: '0.01',

  // USDC has 6 decimals
  decimals: 6,
};

export interface PaymentError {
  type: 'insufficient_balance' | 'connection_error' | 'signing_error' | 'unknown';
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
    transport: http(process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL || baseSepolia.rpcUrls.default.http[0]),
  });
}

/**
 * Get wallet client for signing transactions
 */
export function getWalletClient() {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('No Ethereum provider found');
  }

  return createWalletClient({
    chain: baseSepolia,
    transport: custom(window.ethereum),
  });
}

/**
 * Build USDC transfer transaction data
 */
export async function buildPaymentTransaction(
  fromAddress: Address,
): Promise<{ to: Address; data: `0x${string}`; value: bigint }> {
  console.log("📦 Building payment transaction...");

  const amount = parseUnits(PAYMENT_CONFIG.amountUSDC, PAYMENT_CONFIG.decimals);

  console.log(`  From: ${fromAddress}`);
  console.log(`  To: ${PAYMENT_CONFIG.payTo}`);
  console.log(`  Amount: ${PAYMENT_CONFIG.amountUSDC} USDC`);

  // Encode the transfer function call
  const data = encodeFunctionData({
    abi: USDC_ABI,
    functionName: 'transfer',
    args: [PAYMENT_CONFIG.payTo, amount],
  });

  console.log(`  ✅ Transaction data built`);

  return {
    to: PAYMENT_CONFIG.usdcAddress,
    data,
    value: BigInt(0), // No ETH value, just USDC transfer
  };
}

/**
 * Sign and send transaction
 */
export async function signAndSendTransaction(
  account: Account | Address,
  transactionRequest: { to: Address; data: `0x${string}`; value: bigint }
): Promise<`0x${string}`> {
  console.log("✍️  Signing and sending transaction...");

  const walletClient = getWalletClient();

  try {
    const hash = await walletClient.sendTransaction({
      account,
      to: transactionRequest.to,
      data: transactionRequest.data,
      value: transactionRequest.value,
      chain: baseSepolia,
    });

    console.log(`  ✅ Transaction sent: ${hash}`);
    return hash;
  } catch (error) {
    console.error("  ❌ Transaction failed:", error);
    throw error;
  }
}

/**
 * Encode transaction for X-PAYMENT header
 */
export function encodeXPayment(transactionHash: string): string {
  console.log("🔐 Encoding X-PAYMENT header...");

  const payment = {
    x402Version: 1,
    scheme: "exact",
    network: PAYMENT_CONFIG.network,
    payload: {
      transactionHash,
    },
  };

  const xPayment = Buffer.from(JSON.stringify(payment)).toString("base64");
  console.log(`  ✅ X-PAYMENT header generated (${xPayment.length} bytes)`);

  return xPayment;
}

/**
 * Parse X-PAYMENT-RESPONSE header
 */
export function parsePaymentResponse(headerValue: string): PaymentResponse {
  try {
    const decoded = JSON.parse(
      Buffer.from(headerValue, "base64").toString("utf8")
    );
    return decoded;
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
      address: PAYMENT_CONFIG.usdcAddress,
      abi: USDC_ABI,
      functionName: 'balanceOf',
      args: [address],
    });

    const usdcBalance = formatUnits(balance, PAYMENT_CONFIG.decimals);
    const requiredAmount = PAYMENT_CONFIG.amountUSDC;

    return {
      sufficient: parseFloat(usdcBalance) >= parseFloat(requiredAmount),
      balance: usdcBalance,
      required: requiredAmount,
    };
  } catch (error) {
    console.error("Error checking USDC balance:", error);
    return {
      sufficient: false,
      balance: '0',
      required: PAYMENT_CONFIG.amountUSDC,
    };
  }
}

/**
 * Wait for transaction confirmation
 */
export async function waitForTransaction(hash: `0x${string}`): Promise<void> {
  console.log("⏳ Waiting for transaction confirmation...");

  const publicClient = getPublicClient();

  await publicClient.waitForTransactionReceipt({
    hash,
    confirmations: 1,
  });

  console.log("  ✅ Transaction confirmed");
}
