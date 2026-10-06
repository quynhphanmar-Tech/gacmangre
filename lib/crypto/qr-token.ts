import crypto from 'crypto';

// Secret key for signing opaque tokens (fallback to safe constant in development)
const QR_SECRET = process.env.QR_SECRET_KEY || 'gac-mang-re-pantry-secret-key-2026';

export interface TokenPayload {
  type: 'ORDER' | 'BATCH' | 'PRODUCER_LINK';
  id: string;                    // order_id or batch_id or producer_id
  code: string;                  // GM-2026-000073 or BATCH-003-2026-01
  exp: number;                   // Unix timestamp
  salt: string;
}

/**
 * Creates a secure opaque signed QR token.
 * Does NOT contain any PII (no customer name, phone, or address).
 */
export function generateQrToken(type: 'ORDER' | 'BATCH' | 'PRODUCER_LINK', id: string, code: string): string {
  const payload: TokenPayload = {
    type,
    id,
    code,
    exp: Date.now() + 1000 * 60 * 60 * 24 * 30, // 30 days valid
    salt: crypto.randomBytes(4).toString('hex'),
  };

  const payloadStr = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', QR_SECRET)
    .update(payloadStr)
    .digest('base64url')
    .substring(0, 16); // 16-char compact signature

  return `gmr_${payload.type.toLowerCase()}_${payloadStr}.${signature}`;
}

/**
 * Resolves and verifies an opaque QR token server-side.
 */
export function resolveQrToken(token: string): TokenPayload | null {
  if (!token || !token.startsWith('gmr_')) return null;

  try {
    const parts = token.replace(/^gmr_[a-z]+_/, '').split('.');
    if (parts.length !== 2) return null;

    const [payloadStr, signature] = parts;
    const expectedSig = crypto
      .createHmac('sha256', QR_SECRET)
      .update(payloadStr)
      .digest('base64url')
      .substring(0, 16);

    if (signature !== expectedSig) {
      return null; // Invalid signature / tampered
    }

    const payload: TokenPayload = JSON.parse(Buffer.from(payloadStr, 'base64url').toString('utf-8'));

    // Expiry check
    if (payload.exp && Date.now() > payload.exp) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Masks customer PII for mobile warehouse scan view according to Privacy specs.
 * Example: Nguyễn V*** · 09******44 · Hà Nội
 */
export function maskPii(name?: string, phone?: string): { maskedName: string; maskedPhone: string } {
  let maskedName = 'Khách hàng';
  if (name && name.trim()) {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
      maskedName = parts[0].substring(0, 2) + '***';
    } else {
      maskedName = `${parts[0]} ${parts[1]?.charAt(0) || ''}***`;
    }
  }

  let maskedPhone = '09********';
  if (phone && phone.length >= 8) {
    maskedPhone = `${phone.substring(0, 2)}******${phone.substring(phone.length - 2)}`;
  }

  return { maskedName, maskedPhone };
}
