import { NextRequest, NextResponse } from "next/server";

// Rate limiting sliding window cache
interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Clean up stale rate limit entries periodically
function cleanupRateLimitStore(windowMs: number) {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    record.timestamps = record.timestamps.filter((t) => now - t < windowMs);
    if (record.timestamps.length === 0) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * In-memory sliding window rate limiter per client IP / key.
 */
export function checkApiRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number = 60 * 1000
): { allowed: boolean; remaining: number; retryAfterSeconds?: number } {
  cleanupRateLimitStore(windowMs);
  const now = Date.now();
  const record = rateLimitStore.get(key) || { timestamps: [] };

  record.timestamps = record.timestamps.filter((t) => now - t < windowMs);

  if (record.timestamps.length >= maxRequests) {
    const oldest = record.timestamps[0];
    const retryAfterSeconds = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds,
    };
  }

  record.timestamps.push(now);
  rateLimitStore.set(key, record);

  return {
    allowed: true,
    remaining: maxRequests - record.timestamps.length,
  };
}

/**
 * Reset rate limit cache (useful for automated testing)
 */
export function resetApiRateLimits(): void {
  rateLimitStore.clear();
}

/**
 * Extract sanitized client IP from request headers.
 */
export function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "127.0.0.1"
  );
}

const ALLOWED_HOSTS = new Set([
  "calculationhubs.com",
  "www.calculationhubs.com",
  "calculationhub-official.vercel.app",
  "calculationhub-pk.vercel.app",
  "calculationhub-app.vercel.app",
  "pak-tax-cal.vercel.app",
  "localhost:3000",
  "127.0.0.1:3000",
]);

/**
 * Validate that incoming state-modifying requests (POST, PATCH, DELETE)
 * originate from the same origin or trusted domains (CORS / CSRF protection).
 */
export function validateOrigin(request: NextRequest): { allowed: boolean; error?: string } {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");

  // If no origin header is sent (e.g. same-origin GET/fetch, curl or internal call), verify referer or host
  if (!origin) {
    const referer = request.headers.get("referer");
    if (referer) {
      try {
        const refUrl = new URL(referer);
        if (host && refUrl.host !== host && !ALLOWED_HOSTS.has(refUrl.host)) {
          return { allowed: false, error: "Cross-origin request forbidden" };
        }
      } catch {
        return { allowed: false, error: "Invalid referer header" };
      }
    }
    return { allowed: true };
  }

  try {
    const originUrl = new URL(origin);
    const originHost = originUrl.host;

    // Check if origin matches request host or trusted hosts
    if (host && originHost === host) {
      return { allowed: true };
    }

    if (ALLOWED_HOSTS.has(originHost) || originHost.endsWith(".vercel.app")) {
      return { allowed: true };
    }

    return { allowed: false, error: "Cross-origin requests are not permitted" };
  } catch {
    return { allowed: false, error: "Malformed origin header" };
  }
}

/**
 * Server-side magic byte inspection for image uploads.
 * Rejects files where magic numbers do not match JPEG, PNG, or WebP signatures.
 */
export function validateImageMagicBytes(buffer: Buffer): {
  valid: boolean;
  mime?: string;
  error?: string;
} {
  if (!buffer || buffer.length < 12) {
    return { valid: false, error: "Invalid or empty file buffer" };
  }

  // 1. JPEG signature: starts with FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { valid: true, mime: "image/jpeg" };
  }

  // 2. PNG signature: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return { valid: true, mime: "image/png" };
  }

  // 3. WebP signature: 'RIFF' (0-3) and 'WEBP' (8-11)
  const riff = buffer.subarray(0, 4).toString("ascii");
  const webp = buffer.subarray(8, 12).toString("ascii");
  if (riff === "RIFF" && webp === "WEBP") {
    return { valid: true, mime: "image/webp" };
  }

  return {
    valid: false,
    error: "File content does not match valid JPEG, PNG, or WebP image signature.",
  };
}

/**
 * Sanitize error messages so that database names, column names,
 * query details, or stack traces are never leaked to client responses.
 */
export function sanitizeApiError(
  err: unknown,
  fallbackMessage = "Something went wrong — please try again."
): string {
  // Log full error safely on server side
  console.error("[API Error Interceptor]:", err);

  // Return generic error to client
  return fallbackMessage;
}

