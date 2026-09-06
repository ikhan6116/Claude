import type { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';
import { hubspotClient } from '@/lib/hubspot';

/**
 * Diagnostic — actually exercises Resend + HubSpot with a clearly-marked TEST
 * lead and returns the raw API responses (message id / contact id / error) in
 * the HTTP body. Lets us see exactly why notifications do or don't go through.
 *
 * Creates a real test email + HubSpot contact (delete the "Diagnostic Test"
 * contact afterwards). Remove this endpoint once notifications are confirmed.
 */
export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const out: Record<string, unknown> = {};

  // ── Resend ──
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    out.resend = { ok: false, error: 'RESEND_API_KEY not set' };
  } else {
    try {
      const resend = new Resend(key);
      const to = ['team@brightpath-fin.com'];
      const { data, error } = await resend.emails.send({
        from: 'BrightPath Finance <team@brightpath-fin.com>',
        to,
        subject: 'New Loan Application — Diagnostic Test (please ignore)',
        html: '<p>This is an automated diagnostic test from the loans app. If you received this, Resend delivery is working.</p>',
      });
      out.resend = { ok: !error, to, messageId: data?.id ?? null, error: error ?? null };
    } catch (err) {
      out.resend = { ok: false, exception: String(err) };
    }
  }

  // ── HubSpot ──
  if (!process.env.HUBSPOT_API_KEY) {
    out.hubspot = { ok: false, error: 'HUBSPOT_API_KEY not set' };
  } else {
    try {
      const result = await hubspotClient.createOrUpdateContact({
        firstName: 'Diagnostic',
        lastName: 'Test',
        email: `diagnostic+${Date.now()}@brightpath-fin.com`,
        phone: '8778672002',
        address: '898 South State St',
        city: 'Orem',
        state: 'UT',
        zip: '84058',
        leadSource: 'Diagnostic',
        loanPurpose: 'Test',
        loanRequestAmount: 25000,
      });
      out.hubspot = { ok: !!result.contactId, contactId: result.contactId || null };
    } catch (err) {
      out.hubspot = { ok: false, exception: String(err) };
    }
  }

  return res.status(200).json(out);
}
