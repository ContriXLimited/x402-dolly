/**
 * X402 Solana Payment Utility for Client-side Payment Flow
 */

import {
  Connection,
  PublicKey,
  Transaction,
  ComputeBudgetProgram,
} from "@solana/web3.js";
import {
  createTransferCheckedInstruction,
  getAssociatedTokenAddress,
} from "@solana/spl-token";

// Payment configuration (matching reference script)
export const PAYMENT_CONFIG = {
  network: "solana-devnet",
  rpcEndpoint: process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.devnet.solana.com",

  // Receiver address (from middleware configuration)
  payTo: "CmGgLQL36Y9ubtTsy2zmE46TAxwCBm66onZmPPhUWNqv",

  // USDC token mint on Solana Devnet
  usdcMint: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",

  // Amount in smallest unit (0.01 USDC = 10000 in atomic units, 6 decimals)
  amount: "10000",

  // Fee payer (provided by facilitator)
  feePayer: "CKPKJWNdJEqa81x7CkZ14BVPiY6y16Sxs7owznqtWYp5",
};

export interface PaymentError {
  type: 'insufficient_balance' | 'connection_error' | 'signing_error' | 'unknown';
  message: string;
}

export interface PaymentResponse {
  transaction?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

/**
 * Build Solana SPL Token transfer transaction
 */
export async function buildPaymentTransaction(
  connection: Connection,
  fromPublicKey: PublicKey,
): Promise<Transaction> {
  console.log("📦 Building payment transaction...");

  const toPubkey = new PublicKey(PAYMENT_CONFIG.payTo);
  const mintPubkey = new PublicKey(PAYMENT_CONFIG.usdcMint);
  const feePayerPubkey = new PublicKey(PAYMENT_CONFIG.feePayer);

  // Get associated token accounts
  const fromTokenAccount = await getAssociatedTokenAddress(
    mintPubkey,
    fromPublicKey
  );

  const toTokenAccount = await getAssociatedTokenAddress(mintPubkey, toPubkey);

  console.log(`  From: ${fromPublicKey.toBase58()}`);
  console.log(`  To: ${toPubkey.toBase58()}`);
  console.log(`  Amount: ${PAYMENT_CONFIG.amount} (atomic units)`);

  // Create transfer instruction
  const transferInstruction = createTransferCheckedInstruction(
    fromTokenAccount, // source
    mintPubkey, // mint
    toTokenAccount, // destination
    fromPublicKey, // owner
    BigInt(PAYMENT_CONFIG.amount), // amount
    6 // decimals (USDC = 6)
  );

  // Build transaction with Compute Budget instructions
  const transaction = new Transaction();

  // Add Compute Budget instructions (required by X402)
  // 1. Set compute unit limit (200,000 units is typical for token transfers)
  transaction.add(
    ComputeBudgetProgram.setComputeUnitLimit({
      units: 200_000,
    })
  );

  // 2. Set compute unit price (priority fee, 0 for devnet is fine)
  transaction.add(
    ComputeBudgetProgram.setComputeUnitPrice({
      microLamports: 0,
    })
  );

  // 3. Add the transfer instruction
  transaction.add(transferInstruction);

  // Set fee payer
  transaction.feePayer = feePayerPubkey;

  // Get latest blockhash
  const { blockhash } = await connection.getLatestBlockhash("confirmed");
  transaction.recentBlockhash = blockhash;

  console.log(`  ✅ Transaction built with blockhash: ${blockhash.substring(0, 8)}...`);

  return transaction;
}

/**
 * Encode signed transaction as X-PAYMENT header
 */
export function encodeXPayment(signedTransaction: Transaction): string {
  console.log("🔐 Encoding X-PAYMENT header...");

  // Serialize transaction
  const serialized = signedTransaction.serialize({
    requireAllSignatures: false,
    verifySignatures: false,
  });

  // Build payment object (X402 Exact Scheme for Solana)
  const payment = {
    x402Version: 1,
    scheme: "exact",
    network: PAYMENT_CONFIG.network,
    payload: {
      transaction: Buffer.from(serialized).toString("base64"),
    },
  };

  // Encode to Base64
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
  connection: Connection,
  publicKey: PublicKey
): Promise<{ sufficient: boolean; balance: number; required: number }> {
  try {
    const mintPubkey = new PublicKey(PAYMENT_CONFIG.usdcMint);
    const tokenAccount = await getAssociatedTokenAddress(mintPubkey, publicKey);

    const tokenBalance = await connection.getTokenAccountBalance(tokenAccount);
    const usdcBalance = tokenBalance.value.uiAmount || 0;

    const requiredAmount = parseInt(PAYMENT_CONFIG.amount) / 1e6; // Convert to UI amount

    return {
      sufficient: usdcBalance >= requiredAmount,
      balance: usdcBalance,
      required: requiredAmount,
    };
  } catch (error) {
    console.error("Error checking USDC balance:", error);
    // If token account doesn't exist, balance is 0
    return {
      sufficient: false,
      balance: 0,
      required: parseInt(PAYMENT_CONFIG.amount) / 1e6,
    };
  }
}
