import type { NextApiRequest, NextApiResponse } from 'next';

type LineType = 'mobile' | 'landline' | 'voip' | 'unknown' | null;

const INVALID_US_PREFIXES = /^(\+1)?(0|1)\d{9}$/; // area codes starting with 0 or 1 are invalid

export async function lookupPhoneLineType(phone: string): Promise<{ valid: boolean; lineType: LineType; error?: string }> {
  const digits = phone.replace(/\D/g, '');
  // Strip leading country code 1 if present
  const tenDigit = digits.length === 11 && digits.startsWith('1') ? digits.slice(1) : digits;

  // Hard validation: must be exactly 10 digits, area code can't start with 0 or 1
  if (tenDigit.length !== 10 || /^[01]/.test(tenDigit)) {
    return { valid: false, lineType: null, error: 'invalid' };
  }

  // Common fake/test numbers
  const repeating = /^(\d)\1{9}$/.test(tenDigit); // e.g. 1111111111, 0000000000
  const sequential = tenDigit === '1234567890' || tenDigit === '0987654321';
  if (repeating || sequential) {
    return { valid: false, lineType: null, error: 'invalid' };
  }

  const normalized = `+1${tenDigit}`;

  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;

  if (!sid || !token) {
    console.warn('[Lookup] Twilio credentials not configured — basic validation only');
    return { valid: true, lineType: null };
  }

  const url = `https://lookups.twilio.com/v2/PhoneNumbers/${encodeURIComponent(normalized)}?Fields=line_type_intelligence`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString('base64')}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) return { valid: false, lineType: null, error: 'invalid' };
      // Twilio error — fail open but log it
      console.error('[Lookup] Twilio returned', response.status, await response.text().catch(() => ''));
      return { valid: true, lineType: null };
    }

    const data = await response.json();
    console.log('[Lookup] Twilio response:', JSON.stringify(data));

    if (!data.valid) return { valid: false, lineType: null, error: 'invalid' };

    const lineType: LineType = data.line_type_intelligence?.type ?? null;

    if (lineType === 'landline') {
      return { valid: false, lineType, error: 'landline' };
    }

    return { valid: true, lineType };
  } catch (err) {
    console.error('[Lookup] Fetch error:', err);
    return { valid: true, lineType: null }; // fail open on network error
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: 'Phone number required' });

  const result = await lookupPhoneLineType(phone);
  return res.status(200).json(result);
}
