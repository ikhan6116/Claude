import type { NextApiRequest, NextApiResponse } from 'next';
import { sendLeadNotificationEmail } from '@/lib/email';
import { isBusinessHours, smsClient } from '@/lib/sms';
import { hubspotClient } from '@/lib/hubspot';
import { sendLeadEvent } from '@/lib/meta-capi';

function parseAmount(rangeStr: string): number | null {
  if (!rangeStr) return null;
  const match = rangeStr.match(/\$([\d,]+)/);
  if (!match) return null;
  return parseInt(match[1].replace(/,/g, ''), 10);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { firstName, lastName, email, phone, streetAddress, city, state, zipCode, debtAmount, loanAmount, creditScore, loanPurpose } = req.body;

  if (!firstName || !email) return res.status(400).json({ error: 'Missing required fields' });

  console.log('[ChatSubmit] Processing lead:', { firstName, lastName, email, phone, source: 'chatbot' });

  const emailPromise = sendLeadNotificationEmail({
    firstName:           firstName || '',
    lastName:            lastName || '',
    email:               email || '',
    phone:               phone || '',
    streetAddress:       streetAddress || '',
    city:                city || '',
    state:               state || '',
    zipCode:             zipCode || '',
    unsecuredDebtBalance: debtAmount || 'Not provided',
    loanRequestAmount:   loanAmount || 'Not provided',
    estimatedFico:       creditScore || 'Not provided',
    loanPurpose:         loanPurpose || 'Not provided',
    source:              'chatbot',
    creditScore:         null,
    totalDebtBalance:    null,
    routing:             'review',
    submittedAt:         new Date().toISOString(),
    phoneVerified:       false,
  }).catch(err => { console.error('[ChatSubmit] Email failed:', err); return false; });

  const hubspotPromise = hubspotClient.createOrUpdateContact({
    firstName:            firstName || '',
    lastName:             lastName || '',
    email:                email || '',
    phone:                phone || '',
    address:              streetAddress || '',
    city:                 city || '',
    state:                state || '',
    zip:                  zipCode || '',
    leadSource:           'Chatbot',
    loanRequestAmount:    parseAmount(loanAmount),
    unsecuredDebtBalance: parseAmount(debtAmount),
    estimatedFico:        creditScore || '',
    loanPurpose:          loanPurpose || '',
  }).catch(err => {
    console.error('[ChatSubmit] HubSpot sync failed:', err);
    return { contactId: '' };
  });

  const smsPromise = phone
    ? smsClient.sendLeadConfirmationSMS(phone, firstName, isBusinessHours()).catch(err => {
        console.error('[ChatSubmit] SMS failed:', err);
        return null;
      })
    : Promise.resolve(null);

  const capiPromise = sendLeadEvent({
    email,
    phone,
    firstName,
    lastName,
    city,
    state,
    zip: zipCode,
    clientIpAddress: (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress,
    clientUserAgent: req.headers['user-agent'],
    fbc: req.cookies._fbc,
    fbp: req.cookies._fbp,
  }).catch(err => { console.error('[ChatSubmit] Meta CAPI failed:', err); return false; });

  const [emailResult, hubspotResult, smsResult] = await Promise.all([emailPromise, hubspotPromise, smsPromise, capiPromise]);

  console.log('[ChatSubmit] Email sent:', emailResult);
  console.log('[ChatSubmit] HubSpot result:', hubspotResult);
  console.log('[ChatSubmit] SMS result:', smsResult);

  // CRM webhook
  if (process.env.CRM_WEBHOOK_URL) {
    try {
      const crmRes = await fetch(process.env.CRM_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contact: { first_name: firstName, last_name: lastName, email, phone, address: streetAddress, city, state, zip: zipCode },
          loan: {
            type: 'debt_consolidation',
            unsecured_debt_balance: debtAmount,
            loan_request_amount: loanAmount,
            estimated_fico: creditScore,
            purpose: loanPurpose,
          },
          metadata: { source: 'chatbot', submitted_at: new Date().toISOString(), is_business_hours: isBusinessHours() },
        }),
      });
      console.log('[ChatSubmit] CRM webhook response:', crmRes.status);
    } catch (err) {
      console.error('[ChatSubmit] CRM webhook failed:', err);
    }
  }

  return res.status(200).json({ success: true, emailSent: emailResult, hubspotContactId: hubspotResult.contactId });
}
