import type { NextApiRequest, NextApiResponse } from 'next';
import { smsClient } from '@/lib/sms';
import { lookupPhoneLineType } from './lookup-phone';

// Legacy fallback store — only used when Twilio Verify is NOT configured.
// NOTE: this Map does not survive serverless cold starts; Twilio Verify is preferred.
const verificationCodes = new Map<string, { code: string; expiresAt: number }>();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { phone, code } = req.body;

  if (!phone) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  const normalized = phone.replace(/\D/g, '');

  // ── Verify step (user entered code) ──
  if (code) {
    if (smsClient.verifyEnabled) {
      const result = await smsClient.checkVerification(phone, code);
      if (result.approved) {
        return res.status(200).json({ verified: true });
      }
      if (result.error === 'expired') {
        return res.status(400).json({ error: 'Verification code has expired. Please request a new one.' });
      }
      return res.status(400).json({ error: 'Invalid verification code.' });
    }

    // Legacy fallback
    const stored = verificationCodes.get(normalized);
    if (!stored) {
      return res.status(400).json({ error: 'No verification code found. Please request a new one.' });
    }
    if (Date.now() > stored.expiresAt) {
      verificationCodes.delete(normalized);
      return res.status(400).json({ error: 'Verification code has expired. Please request a new one.' });
    }
    if (stored.code !== code) {
      return res.status(400).json({ error: 'Invalid verification code.' });
    }
    verificationCodes.delete(normalized);
    return res.status(200).json({ verified: true });
  }

  // ── Send step — run Twilio Lookup v2 first ──
  const lookup = await lookupPhoneLineType(phone);

  if (!lookup.valid) {
    if (lookup.error === 'landline') {
      return res.status(422).json({
        error: 'Landline numbers cannot receive SMS. Please enter a mobile phone number.',
        lineType: 'landline',
      });
    }
    return res.status(422).json({
      error: 'That doesn\'t appear to be a valid US phone number. Please check and try again.',
      lineType: 'invalid',
    });
  }

  // ── Send the OTP ──
  if (smsClient.verifyEnabled) {
    const result = await smsClient.startVerification(phone);
    if (!result.success) {
      return res.status(502).json({ error: 'Unable to send verification code. Please try again.' });
    }
    return res.status(200).json({ sent: true });
  }

  // Legacy fallback — generate & store our own code
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
  verificationCodes.set(normalized, {
    code: verificationCode,
    expiresAt: Date.now() + 10 * 60 * 1000,
  });

  const smsResult = await smsClient.sendSMS(
    phone,
    `Your BrightPath Finance verification code is: ${verificationCode}. This code expires in 10 minutes.`
  );

  if (!smsResult.success) {
    return res.status(200).json({
      sent: true,
      code: verificationCode,
      note: 'SMS delivery not confirmed — code returned for development',
    });
  }

  return res.status(200).json({ sent: true });
}
