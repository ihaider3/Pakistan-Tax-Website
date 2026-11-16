import crypto from "crypto";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export const ADMIN_COOKIE_NAME = "pfc_admin_session";
const TOKEN_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export function verifyAdminPassword(inputPassword: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword || typeof inputPassword !== "string") {
    return false;
  }

  // Hash both with sha256 to guarantee equal length buffers for constant-time comparison
  const inputBuffer = crypto.createHash("sha256").update(inputPassword).digest();
  const targetBuffer = crypto.createHash("sha256").update(adminPassword).digest();

  return crypto.timingSafeEqual(inputBuffer, targetBuffer);
}

export function generateSessionToken(): string {
  const secret = process.env.ADMIN_PASSWORD || "pfc-admin-fallback-secret-key";
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
  const timestamp = parseInt(timestampStr, 10);
  if (isNaN(timestamp)) {
    return false;
  }

  const age = Date.now() - timestamp;
  if (age < 0 || age > TOKEN_MAX_AGE_MS) {
    return false;
  }

  const secret = process.env.ADMIN_PASSWORD || "pfc-admin-fallback-secret-key";
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

