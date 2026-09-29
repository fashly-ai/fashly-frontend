const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/** "125.000 ₫" for VND, "$29.99" for USD, etc. Returns "" when there is no price. */
export function formatPrice(amount: number | string | null | undefined, currency?: string | null): string {
  if (amount === null || amount === undefined || amount === '') return '';
  const value = Number(amount);
  if (!Number.isFinite(value)) return '';
  const code = (currency || 'USD').toUpperCase();
  try {
    return new Intl.NumberFormat(code === 'VND' ? 'vi-VN' : 'en-US', {
      style: 'currency',
      currency: code,
      maximumFractionDigits: code === 'VND' ? 0 : 2,
    }).format(value);
  } catch {
    return `${value} ${code}`;
  }
}

/**
 * Tracked Buy link on our API. It logs the click (and the try-on it came from) and redirects to the store.
 * `surface`: product | tryon_result | result_page | profile.
 */
export function buyHref(buyPath: string, opts: { surface: string; tryonId?: string | null }): string {
  const params = new URLSearchParams({ s: opts.surface });
  if (opts.tryonId) params.set('t', opts.tryonId);
  return `${API_BASE}${buyPath}?${params.toString()}`;
}

/** Store names come from feeds in lower case ("shopee"); show them nicely. */
export function merchantLabel(merchant?: string | null): string {
  if (!merchant) return '';
  const known: Record<string, string> = { shopee: 'Shopee', lazada: 'Lazada', tiki: 'Tiki', tiktok: 'TikTok Shop' };
  return known[merchant.toLowerCase()] ?? merchant.replace(/\.(vn|com)$/i, '').replace(/^\w/, (c) => c.toUpperCase());
}

export const AFFILIATE_DISCLOSURE =
  'Ad · Some items link to other stores. If you buy through these links, we may earn a commission at no extra cost to you.';
