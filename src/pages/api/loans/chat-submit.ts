import type { NextApiRequest, NextApiResponse } from 'next';
import { sendLeadNotificationEmail } from '@/lib/email';
import { isBusinessHours, smsClient } from '@/lib/sms';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { firstName, lastName, email, phone, streetAddress, city, state, zipCode, debtAmount, loanAmount, creditScore, loanPurpose } = req.body;

  if (!firstName || !email) return res.status(400).json({ error: 'Missing required fields' });

  console.log('[ChatSubmit] Processing lead:', { firstName, lastName, email, phone, source: 'chatbot' });

  const emailResult = await sendLeadNotificationEmail({
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
  });

  console.log('[ChatSubmit] Email sent:', emailResult);

  const smsResult = phone
    ? await smsClient.sendLeadConfirmationSMS(phone, firstName, isBusinessHours()).catch(err => {
        console.error('[ChatSubmit] SMS failed:', err);
        return null;
      })
    : null;

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

  return res.status(200).json({ success: true, emailSent: emailResult });
}
