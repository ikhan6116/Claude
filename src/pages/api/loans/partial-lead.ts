import type { NextApiRequest, NextApiResponse } from 'next';
import { sendPartialLeadEmail } from '@/lib/email';
import { hubspotClient } from '@/lib/hubspot';
import { sendLeadToMeera } from '@/lib/meera';

function parseAmount(rangeStr?: string): number | null {
  if (!rangeStr) return null;
  const match = rangeStr.match(/\$([\d,]+)/);
  if (!match) return null;
  return parseInt(match[1].replace(/,/g, ''), 10);
}

/**
 * Captures an abandoned / partial lead — someone who entered contact info in
 * the form or chatbot but did not complete. Sends an "Incomplete Application"
 * alert and upserts an Incomplete contact into HubSpot for follow-up.
 *
 * Deliberately does NOT post to Relintex — partial leads should not flow to the
 * lead-buyer CRM. When the visitor later completes, the normal submit/chat-submit
 * path posts the full lead and upgrades the same HubSpot contact.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const {
    firstName, lastName, email, phone,
    streetAddress, city, state, zipCode,
    unsecuredDebtBalance, monthlyDebtPayment, loanRequestAmount, estimatedFico, loanPurpose,
    source, lastStep,
  } = req.body || {};

  // Need at least one way to reach them.
  if (!email && !phone) {
    return res.status(400).json({ error: 'email or phone required' });
  }

  const src = source || 'unknown';

  const emailPromise = sendPartialLeadEmail({
    firstName, lastName, email, phone,
    streetAddress, city, state, zipCode,
    unsecuredDebtBalance, monthlyDebtPayment, loanRequestAmount, estimatedFico, loanPurpose,
    source: src, lastStep,
  }).catch(err => { console.error('[PartialLead] Email failed:', err); return false; });

  // Only sync to HubSpot when we have an email (HubSpot dedups by email).
  const hubspotPromise = email
    ? hubspotClient.createOrUpdateContact({
        firstName: firstName || '',
        lastName: lastName || '',
        email,
        phone: phone || '',
        address: streetAddress || '',
        city: city || '',
        state: state || '',
        zip: zipCode || '',
        leadSource: `${src} (Incomplete${lastStep ? ` — stopped at ${lastStep}` : ''})`,
        loanRequestAmount: parseAmount(loanRequestAmount),
        unsecuredDebtBalance: parseAmount(unsecuredDebtBalance),
        monthlyDebtPayment: monthlyDebtPayment || '',
        estimatedFico: estimatedFico || '',
        loanPurpose: loanPurpose || '',
      }).catch(err => { console.error('[PartialLead] HubSpot failed:', err); return { contactId: '' }; })
    : Promise.resolve({ contactId: '' });

  // Send abandoners to Meera for SMS re-engagement (needs a phone to text).
  // Uses MEERA_PARTIAL_CAMPAIGN_ID if set, else falls back to MEERA_CAMPAIGN_ID.
  const partialCampaign = parseInt(process.env.MEERA_PARTIAL_CAMPAIGN_ID || '', 10) || undefined;
  const meeraPromise = phone
    ? sendLeadToMeera({
        firstName: firstName || '',
        lastName: lastName || '',
        email: email || '',
        phone,
        state: state || '',
        zip: zipCode || '',
        loanPurpose: loanPurpose || '',
        leadSource: `${src} (Incomplete${lastStep ? ` — ${lastStep}` : ''})`,
        campaignId: partialCampaign,
      }).catch(err => { console.error('[PartialLead] Meera failed:', err); return { ok: false }; })
    : Promise.resolve({ ok: false });

  const [emailOk, hubspotResult, meeraResult] = await Promise.all([emailPromise, hubspotPromise, meeraPromise]);
  console.log('[PartialLead] captured — email:', emailOk, 'hubspot:', hubspotResult.contactId || 'skipped', 'meera:', meeraResult.ok, 'source:', src, 'step:', lastStep);

  return res.status(200).json({ ok: true });
}
