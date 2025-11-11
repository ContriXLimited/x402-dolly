// x402 Payment Protocol utilities for Ethereum/Base Sepolia

/**
 * Generate a random 32-byte nonce for TransferWithAuthorization
 */
export function generateNonce(): `0x${string}` {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return `0x${Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")}`;
}

/**
 * TransferWithAuthorization message structure
 */
export interface TransferAuthorization {
  from: `0x${string}`;
  to: `0x${string}`;
  value: bigint;
  validAfter: bigint;
  validBefore: bigint;
  nonce: `0x${string}`;
}

/**
 * TransferWithAuthorization JSON serialization format
 */
export interface TransferAuthorizationJSON {
  from: `0x${string}`;
  to: `0x${string}`;
  value: string;
  validAfter: string;
  validBefore: string;
  nonce: `0x${string}`;
}

/**
 * x402 Payment configuration
 */
export interface X402PaymentConfig {
  network: string;
  scheme: string;
  maxAmountRequired: string;
  payTo: `0x${string}`;
  asset: `0x${string}`;
  maxTimeoutSeconds: number;
  extra: {
    name: string;
    version: string;
  };
}

/**
 * x402 Payment payload structure
 */
export interface X402PaymentPayload {
  x402Version: number;
  scheme: string;
  network: string;
  payload: {
    signature: `0x${string}`;
    authorization: TransferAuthorizationJSON;
  };
}

/**
 * Build the X-PAYMENT header for x402 protocol
 */
export function buildPaymentHeader(
  signature: `0x${string}`,
  authorization: TransferAuthorization,
  config: X402PaymentConfig
): string {
  // Convert bigint values to strings for JSON serialization
  const authorizationJSON: TransferAuthorizationJSON = {
    from: authorization.from,
    to: authorization.to,
    value: authorization.value.toString(),
    validAfter: authorization.validAfter.toString(),
    validBefore: authorization.validBefore.toString(),
    nonce: authorization.nonce,
  };

  const paymentPayload: X402PaymentPayload = {
    x402Version: 1,
    scheme: config.scheme,
    network: config.network,
    payload: {
      signature,
      authorization: authorizationJSON,
    },
  };

  // Use btoa for base64 encoding (browser-compatible)
  if (typeof window !== 'undefined') {
    return btoa(JSON.stringify(paymentPayload));
  }

  // Fallback for server-side (shouldn't be needed in client components)
  return Buffer.from(JSON.stringify(paymentPayload)).toString('base64');
}

/**
 * Get EIP-712 Domain configuration
 */
export function getEIP712Domain(
  chainId: number,
  verifyingContract: `0x${string}`,
  name: string,
  version: string
) {
  return {
    name,
    version,
    chainId,
    verifyingContract,
  };
}

/**
 * EIP-712 type definitions for TransferWithAuthorization
 */
export const EIP712_TYPES = {
  TransferWithAuthorization: [
    { name: "from", type: "address" },
    { name: "to", type: "address" },
    { name: "value", type: "uint256" },
    { name: "validAfter", type: "uint256" },
    { name: "validBefore", type: "uint256" },
    { name: "nonce", type: "bytes32" },
  ],
} as const;
