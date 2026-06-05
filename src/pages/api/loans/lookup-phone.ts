import type { NextApiRequest, NextApiResponse } from 'next';

type LineType = 'mobile' | 'landline' | 'voip' | 'unknown' | null;

export async function lookupPhoneLineType(phone: string): Promise<{ valid: boolean; lineType: LineType; error?: string }> {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;

  if (!sid || !token) {
    return { valid: true, lineType: null }; // skip check if not configured
  }

  const normalized = `+1${phone.replace(/\D/g, '').slice(-10)}`;

  const url = `https://lookups.twilio.com/v2/PhoneNumbers/${encodeURIComponent(normalized)}?Fields=line_type_intelligence`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString('base64')}`,
    },
  });

  if (!response.ok) {
    // 404 = number not found / invalid
    if (response.status === 404) return { valid: false, lineType: null, error: 'invalid' };
    // Other errors: fail open so we don't block legitimate users
    return { valid: true, lineType: null };
  }

  const data = await response.json();

  if (!data.valid) return { valid: false, lineType: null, error: 'invalid' };

  const lineType: LineType = data.line_type_intelligence?.type ?? null;

  if (lineType === 'landline') {
    return { valid: false, lineType, error: 'landline' };
  }

  return { valid: true, lineType };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: 'Phone number required' });

  const result = await lookupPhoneLineType(phone);
  return res.status(200).json(result);
}
