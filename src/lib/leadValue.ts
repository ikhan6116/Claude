// Meta Lead event value = requested loan amount × 0.0108
// (6% average revenue rate × 18% close rate). USD.
export const LEAD_VALUE_RATE = 0.0108;
export const DEFAULT_LEAD_VALUE = 50; // fallback when loan amount is missing/invalid
export const LEAD_CURRENCY = 'USD';

/** Parse the lower-bound dollar figure from a range/label ("$25,000 - $50,000", "$25K+"). */
export function parseLoanAmount(input?: string | number): number {
  if (typeof input === 'number') return input;
  if (!input) return 0;
  const m = String(input).match(/\$?\s*([\d,]+(?:\.\d+)?)\s*([kKmM])?/);
  if (!m) return 0;
  let n = parseFloat(m[1].replace(/,/g, ''));
  if (isNaN(n)) return 0;
  const suffix = (m[2] || '').toLowerCase();
  if (suffix === 'k') n *= 1_000;
  if (suffix === 'm') n *= 1_000_000;
  return n;
}

/** Meta event value, scaled by loan amount, rounded to 2dp. Never returns 0 or negative. */
export function computeLeadValue(loanAmount?: string | number): number {
  const amount = parseLoanAmount(loanAmount);
  if (!amount || amount <= 0) return DEFAULT_LEAD_VALUE;
  const value = Math.round(amount * LEAD_VALUE_RATE * 100) / 100;
  return value > 0 ? value : DEFAULT_LEAD_VALUE;
}
