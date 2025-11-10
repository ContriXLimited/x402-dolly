import { Address } from "viem";
import { paymentMiddleware, Resource, Network } from "x402-next";
import { NextRequest, NextResponse } from "next/server";

const address = "CmGgLQL36Y9ubtTsy2zmE46TAxwCBm66onZmPPhUWNqv" as Address;
const network = "solana-devnet" as Network;
const facilitatorUrl = "https://x402.org/facilitator" as Resource;

const x402PaymentMiddleware = paymentMiddleware(
  address,
  {
    "/api/chat": {
      price: "$0.01",
      config: {
        description: "AI Agent Chat Service",
      },
      network,
    },
  },
  {
    url: facilitatorUrl,
  },
  {
    appLogo: "/logo.svg",
    appName: "x402 Dolly SDK",
  }
);

// CORS configuration
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // You can restrict this to specific domains if needed
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Requested-With, X-Payment",
  "Access-Control-Expose-Headers": "X-Payment, Content-Type", // Allow clients to read these response headers
  "Access-Control-Max-Age": "86400", // 24 hours
};

export const middleware = async (req: NextRequest) => {
  console.log("🔵 Middleware called:", {
    url: req.url,
    method: req.method,
    pathname: req.nextUrl.pathname,
    timestamp: new Date().toISOString(),
  });

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return NextResponse.json({}, { headers: corsHeaders });
  }

  const delegate = x402PaymentMiddleware as unknown as (
    request: NextRequest
  ) => ReturnType<typeof x402PaymentMiddleware>;

  const response = await delegate(req);

  console.log("🟢 Middleware response:", {
    pathname: req.nextUrl.pathname,
    hasResponse: !!response,
  });

  // Add CORS headers to the response
  if (response) {
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
  }

  return response;
};

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (metadata files)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
    "/", // Include the root path explicitly
  ],
};
