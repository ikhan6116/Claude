import type { NextApiRequest, NextApiResponse } from 'next';
import { sendLeadNotificationEmail } from '@/lib/email';
import { isBusinessHours, smsClient } from '@/lib/sms';
import { hubspotClient } from '@/lib/hubspot';
import { sendLeadEvent } from '@/lib/meta-capi';
import { sendLeadToRelintex } from '@/lib/relintex';
import { sendLeadToMeera } from '@/lib/meera';

function parseAmount(rangeStr: string): number | null {
  if (!rangeStr) return null;
  const match = rangeStr.match(/\$([\d,]+)/);
  if (!match) return null;
  return parseInt(match[1].replace(/,/g, ''), 10);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { firstName, lastName, email, phone, streetAddress, city, state, zipCode, debtAmount, monthlyPayment, loanAmount, creditScore, loanPurpose } = req.body;

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
    monthlyDebtPayment:  monthlyPayment || 'Not provided',
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
    monthlyDebtPayment:   monthlyPayment || '',
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
    eventId: (req.body?.metaEventId as string) || undefined,
  }).catch(err => { console.error('[ChatSubmit] Meta CAPI failed:', err); return false; });

  const relintexPromise = sendLeadToRelintex({
    firstName: firstName || '',
    lastName: lastName || '',
    email: email || '',
    phone: phone || '',
    address: streetAddress || '',
    city: city || '',
    state: state || '',
    zip: zipCode || '',
    loanPurpose: loanPurpose || '',
    unsecuredDebtBalance: debtAmount || '',
    monthlyDebtPayment: monthlyPayment || '',
    loanRequestAmount: loanAmount || '',
    estimatedFico: creditScore || '',
    leadSource: 'BrightPath - Chatbot',
    phoneVerified: false,
    submittedAt: new Date().toISOString(),
    ipAddress: (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress || '',
    userAgent: req.headers['user-agent'],
  }).catch(err => { console.error('[ChatSubmit] Relintex failed:', err); return { ok: false }; });

  const meeraPromise = sendLeadToMeera({
    firstName: firstName || '',
    lastName: lastName || '',
    email: email || '',
    phone: phone || '',
    state: state || '',
    zip: zipCode || '',
    loanPurpose: loanPurpose || '',
    leadSource: 'BrightPath - Chatbot',
  }).catch(err => { console.error('[ChatSubmit] Meera failed:', err); return { ok: false }; });

  const [emailResult, hubspotResult, smsResult] = await Promise.all([emailPromise, hubspotPromise, smsPromise, capiPromise, relintexPromise, meeraPromise]);

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
            monthly_minimum_payment: monthlyPayment,
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
