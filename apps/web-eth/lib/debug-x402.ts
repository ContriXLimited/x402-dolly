/**
 * Debug utility for X402 payment signature
 * Use this to inspect the exact data being signed and sent
 */

import type { TransferAuthorization } from './x402';

export function debugX402Signature(
  signature: `0x${string}`,
  authorization: TransferAuthorization,
  domain: {
    name: string;
    version: string;
    chainId: number;
    verifyingContract: `0x${string}`;
  },
  paymentHeader: string
) {
  console.group('🔍 X402 Payment Debug Info');

  console.log('📝 Domain:', {
    name: domain.name,
    version: domain.version,
    chainId: domain.chainId,
    verifyingContract: domain.verifyingContract,
  });

  console.log('📝 Authorization:', {
    from: authorization.from,
    to: authorization.to,
    value: authorization.value.toString(),
    validAfter: authorization.validAfter.toString(),
    validBefore: authorization.validBefore.toString(),
    nonce: authorization.nonce,
  });

  console.log('✍️  Signature:', signature);
  console.log('📦 X-PAYMENT Header (first 100 chars):', paymentHeader.substring(0, 100) + '...');

  // Decode and show the payment payload
  try {
    const decoded = JSON.parse(atob(paymentHeader));
    console.log('📦 Decoded Payment Payload:', JSON.stringify(decoded, null, 2));
  } catch (e) {
    console.error('Failed to decode payment header:', e);
  }

  console.groupEnd();
}
