import type { NextApiRequest, NextApiResponse } from 'next';
import { sendLeadNotificationEmail } from '@/lib/email';
import { isBusinessHours, smsClient } from '@/lib/sms';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { firstName, lastName, email, phone, debtAmount, loanAmount, creditScore, loanPurpose } = req.body;

  if (!firstName || !email) return res.status(400).json({ error: 'Missing required fields' });

  const emailPromise = sendLeadNotificationEmail({
    firstName:           firstName || '',
    lastName:            lastName || '',
    email:               email || '',
    phone:               phone || '',
    streetAddress:       '',
    city:                '',
    state:               '',
    zipCode:             '',
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
  }).catch(() => false);

  const smsPromise = phone
    ? smsClient.sendLeadConfirmationSMS(phone, firstName, isBusinessHours()).catch(() => null)
    : Promise.resolve(null);

  // CRM webhook
  const crmPromise = process.env.CRM_WEBHOOK_URL
    ? fetch(process.env.CRM_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contact: { first_name: firstName, last_name: lastName, email, phone },
          loan: {
            type: 'debt_consolidation',
            unsecured_debt_balance: debtAmount,
            loan_request_amount: loanAmount,
            estimated_fico: creditScore,
            purpose: loanPurpose,
          },
          metadata: { source: 'chatbot', submitted_at: new Date().toISOString(), is_business_hours: isBusinessHours() },
        }),
      }).catch(() => null)
    : Promise.resolve(null);

  await Promise.all([emailPromise, smsPromise, crmPromise]);

  return res.status(200).json({ success: true });
}
