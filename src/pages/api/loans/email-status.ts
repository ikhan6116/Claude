import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * Diagnostic — reports the verification status of sending domains in Resend.
 * Calls Resend's GET /domains. Returns domain names + status only (no secrets,
 * no PII, sends no email). Useful to confirm brightpath-fin.com is verified.
 */
export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    return res.status(200).json({ configured: false, error: 'RESEND_API_KEY not set' });
  }

  try {
    const response = await fetch('https://api.resend.com/domains', {
      headers: { Authorization: `Bearer ${key}` },
    });

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      return res.status(200).json({ configured: true, error: `Resend ${response.status}`, detail: body });
    }

    const json = await response.json();
    const domains = (json.data || []).map((d: { name: string; status: string; region?: string }) => ({
      name: d.name,
      status: d.status,
      region: d.region,
    }));

    return res.status(200).json({ configured: true, domains });
  } catch (err) {
    return res.status(200).json({ configured: true, error: 'fetch_failed', detail: String(err) });
  }
}
