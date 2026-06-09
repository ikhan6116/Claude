import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * Diagnostic endpoint — reports which integrations are configured.
 * Returns booleans only (never the secret values themselves) so it is
 * safe to call in production to confirm environment configuration.
 */
export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  const leadEmails = (process.env.LEAD_NOTIFICATION_EMAILS || '')
    .split(',')
    .map(e => e.trim())
    .filter(Boolean);

  return res.status(200).json({
    resendApiKey:        !!process.env.RESEND_API_KEY,
    leadNotificationEmails: leadEmails.length,
    hubspotApiKey:       !!process.env.HUBSPOT_API_KEY,
    twilioAccountSid:    !!process.env.TWILIO_ACCOUNT_SID,
    twilioAuthToken:     !!process.env.TWILIO_AUTH_TOKEN,
    twilioFromNumber:    !!process.env.TWILIO_FROM_NUMBER,
    twilioVerifyService: !!process.env.TWILIO_VERIFY_SERVICE_SID,
    crmWebhookUrl:       !!process.env.CRM_WEBHOOK_URL,
  });
}
