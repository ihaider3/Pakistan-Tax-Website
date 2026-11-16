interface RateLimitEntry {
  timestamps: number[];
}

const rateLimitMap = new Map<string, RateLimitEntry>();
const duplicateCheckMap = new Map<string, { messageHash: string; timestamp: number }>();

const ONE_HOUR_MS = 60 * 60 * 1000;
const DUPLICATE_WINDOW_MS = 60 * 1000;
const MAX_PER_HOUR = 5;

// Periodically clean up entries older than 2 hours to prevent memory leaks
function cleanupOldEntries() {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap.entries()) {
    entry.timestamps = entry.timestamps.filter((t) => now - t < ONE_HOUR_MS);
    if (entry.timestamps.length === 0) {
      rateLimitMap.delete(ip);
    }
  }

  for (const [ip, entry] of duplicateCheckMap.entries()) {
    if (now - entry.timestamp > DUPLICATE_WINDOW_MS * 2) {
      duplicateCheckMap.delete(ip);
    }
  }
}

export function checkSpamAndRateLimit(
  ip: string,
  honeypotValue: string | null | undefined,
  message: string
): { allowed: boolean; isHoneypot: boolean; error?: string } {
  // 1. Honeypot check
  if (honeypotValue && honeypotValue.trim().length > 0) {
    return { allowed: false, isHoneypot: true };
  }

  cleanupOldEntries();

  const now = Date.now();

  // 2. Duplicate submission check (within 60 seconds with same trimmed content)
  const normalizedMessage = message.trim().toLowerCase();
  const recent = duplicateCheckMap.get(ip);
  if (recent && recent.messageHash === normalizedMessage && now - recent.timestamp < DUPLICATE_WINDOW_MS) {
    return {
      allowed: false,
      isHoneypot: false,
      error: "Duplicate submission. Please wait a minute before submitting again.",
    };
  }

  // 3. Rate limit check (max 5 submissions per hour)
  const entry = rateLimitMap.get(ip) || { timestamps: [] };
  entry.timestamps = entry.timestamps.filter((t) => now - t < ONE_HOUR_MS);

  if (entry.timestamps.length >= MAX_PER_HOUR) {
    return {
      allowed: false,
      isHoneypot: false,
      error: "Too many submissions. Please try again in an hour.",
    };
  }

  // Record this attempt
  entry.timestamps.push(now);
  rateLimitMap.set(ip, entry);
  duplicateCheckMap.set(ip, { messageHash: normalizedMessage, timestamp: now });

  return { allowed: true, isHoneypot: false };
}

