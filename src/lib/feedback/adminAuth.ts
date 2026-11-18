import crypto from "crypto";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export const ADMIN_COOKIE_NAME = "pfc_admin_session";
const TOKEN_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

// IP Rate Limiting for Admin Login:
// Max 5 failed password attempts per IP per 15 minutes, then a 15-minute lockout.
interface LoginAttemptRecord {
  failedTimestamps: number[];
  lockedUntil?: number;
}

const loginAttemptsByIp = new Map<string, LoginAttemptRecord>();
const FIFTEEN_MINUTES_MS = 15 * 60 * 1000;
const MAX_FAILED_ATTEMPTS = 5;

// Clean up stale entries periodically
function cleanupOldLoginAttempts() {
  const now = Date.now();
  for (const [ip, record] of loginAttemptsByIp.entries()) {
    record.failedTimestamps = record.failedTimestamps.filter(
      (t) => now - t < FIFTEEN_MINUTES_MS
    );
    if (record.failedTimestamps.length === 0 && (!record.lockedUntil || now >= record.lockedUntil)) {
      loginAttemptsByIp.delete(ip);
    }
  }
}

// Security Audit: Track failed login counts (timestamps only, privacy-first, zero IP logged)
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
let globalFailedLoginAuditTimestamps: number[] = [];

export function getFailedLoginCount7Days(): number {
  const now = Date.now();
  const cutoff = now - SEVEN_DAYS_MS;
  globalFailedLoginAuditTimestamps = globalFailedLoginAuditTimestamps.filter((t) => t >= cutoff);
  return globalFailedLoginAuditTimestamps.length;
}

export function checkLoginRateLimit(ip: string): { allowed: boolean; error?: string } {
  cleanupOldLoginAttempts();
  const now = Date.now();
  const record = loginAttemptsByIp.get(ip);
  if (!record) {
    return { allowed: true };
  }

  // Actively locked out
  if (record.lockedUntil && now < record.lockedUntil) {
    return {
      allowed: false,
      error: "Too many attempts, please try again later",
    };
  }

  // Filter attempts in sliding 15-min window
  record.failedTimestamps = record.failedTimestamps.filter(
    (t) => now - t < FIFTEEN_MINUTES_MS
  );

  if (record.failedTimestamps.length >= MAX_FAILED_ATTEMPTS) {
    record.lockedUntil = now + FIFTEEN_MINUTES_MS;
    return {
      allowed: false,
      error: "Too many attempts, please try again later",
    };
  }

  return { allowed: true };
}

export function recordFailedLogin(ip: string): void {
  cleanupOldLoginAttempts();
  const now = Date.now();
  const record = loginAttemptsByIp.get(ip) || { failedTimestamps: [] };

  record.failedTimestamps = record.failedTimestamps.filter(
    (t) => now - t < FIFTEEN_MINUTES_MS
  );
  record.failedTimestamps.push(now);

  if (record.failedTimestamps.length >= MAX_FAILED_ATTEMPTS) {
    record.lockedUntil = now + FIFTEEN_MINUTES_MS;
  }

  loginAttemptsByIp.set(ip, record);
  globalFailedLoginAuditTimestamps.push(now);
}

export function recordSuccessfulLogin(ip: string): void {
  loginAttemptsByIp.delete(ip);
}

// Reset rate limits (useful for testing)
export function resetLoginRateLimits(): void {
  loginAttemptsByIp.clear();
  globalFailedLoginAuditTimestamps = [];
}

/**
 * Verifies admin password strictly from ADMIN_PASSWORD environment variable.
 * If the environment variable is missing, all logins are refused.
 */
export function verifyAdminPassword(inputPassword: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword || typeof inputPassword !== "string" || !inputPassword) {
    return false;
  }

  // Hash both with sha256 to guarantee equal length buffers for constant-time comparison
  const inputBuffer = crypto.createHash("sha256").update(inputPassword).digest();
  const targetBuffer = crypto.createHash("sha256").update(adminPassword).digest();

  return crypto.timingSafeEqual(inputBuffer, targetBuffer);
}

export function generateSessionToken(): string {
  const secret = process.env.ADMIN_PASSWORD || "pfc_session_secret_fallback_key";
  const timestamp = Date.now().toString();
  const signature = crypto
    .createHmac("sha256", secret)
    .update(`admin-session:${timestamp}`)
    .digest("hex");

  return `${timestamp}.${signature}`;
}

export function verifySessionToken(token: string | null | undefined): boolean {
  if (!token || typeof token !== "string") {
    return false;
  }

  const parts = token.split(".");
  if (parts.length !== 2) {
    return false;
  }

  const [timestampStr, signature] = parts;
  if (!/^[0-9a-f]{64}$/i.test(signature)) {
    return false;
  }

  const timestamp = parseInt(timestampStr, 10);
  if (isNaN(timestamp)) {
    return false;
  }

  const age = Date.now() - timestamp;
  if (age < 0 || age > TOKEN_MAX_AGE_MS) {
    return false;
  }

  const secret = process.env.ADMIN_PASSWORD || "pfc_session_secret_fallback_key";
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(`admin-session:${timestampStr}`)
    .digest("hex");

  try {
    const sigBuffer = Buffer.from(signature, "hex");
    const expectedBuffer = Buffer.from(expectedSignature, "hex");
    if (sigBuffer.length !== expectedBuffer.length) {
      return false;
    }
    return crypto.timingSafeEqual(sigBuffer, expectedBuffer);
  } catch {
    return false;
  }
}

export async function isAuthenticatedAdmin(request?: NextRequest): Promise<boolean> {
  let token: string | undefined;

  if (request) {
    token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  } else {
    try {
      const cookieStore = await cookies();
      token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    } catch {
      return false;
    }
  }

  return verifySessionToken(token);
}
