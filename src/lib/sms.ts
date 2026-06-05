const TWILIO_API_BASE = 'https://api.twilio.com/2010-04-01';

export class SMSClient {
  private readonly accountSid: string;
  private readonly authToken: string;
  private readonly fromNumber: string;

  constructor() {
    this.accountSid = process.env.TWILIO_ACCOUNT_SID || '';
    this.authToken = process.env.TWILIO_AUTH_TOKEN || '';
    this.fromNumber = process.env.TWILIO_FROM_NUMBER || '';
  }

  async sendSMS(to: string, body: string): Promise<{ success: boolean; sid?: string }> {
    if (!this.accountSid || !this.authToken || !this.fromNumber) {
      console.warn('[SMS] Twilio credentials not configured');
      return { success: false };
    }

    const normalized = to.replace(/\D/g, '');
    const e164 = normalized.startsWith('1') ? `+${normalized}` : `+1${normalized}`;

    try {
      const params = new URLSearchParams();
      params.set('To', e164);
      params.set('From', this.fromNumber);
      params.set('Body', body);

      const response = await fetch(
        `${TWILIO_API_BASE}/Accounts/${this.accountSid}/Messages.json`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64')}`,
          },
          body: params,
        }
      );

      if (!response.ok) {
        const errorBody = await response.text();
        console.error('[SMS] Twilio error:', response.status, errorBody);
        return { success: false };
      }

      const result = await response.json();
      return { success: true, sid: result.sid };
    } catch (error) {
      console.error('[SMS] Send failed:', error);
      return { success: false };
    }
  }

  async sendVerificationCode(phone: string): Promise<{ success: boolean; code?: string }> {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const result = await this.sendSMS(
      phone,
      `Your BrightPath Finance verification code is: ${code}. This code expires in 10 minutes.`
    );
    return { success: result.success, code: result.success ? code : undefined };
  }

  sendLeadConfirmationSMS(phone: string, firstName: string, isBusinessHours: boolean): Promise<{ success: boolean; sid?: string }> {
    const message = isBusinessHours
      ? `Hi ${firstName}, thank you for your loan inquiry with BrightPath Finance! We've received your request and an agent will be reaching out shortly to finalize any offers. For an immediate answer, call us directly at 877-867-2002.`
      : `Hi ${firstName}, thank you for your loan inquiry with BrightPath Finance! We've received your request and one of our agents will be calling you during business hours (Mon-Fri, 9AM-6PM EST) to finalize any offers. We look forward to helping you!`;

    return this.sendSMS(phone, message);
  }
}

export function isBusinessHours(): boolean {
  const now = new Date();
  const estOffset = -5;
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const est = new Date(utc + 3600000 * estOffset);
  const hour = est.getHours();
  const day = est.getDay();
  return day >= 1 && day <= 5 && hour >= 9 && hour < 18;
}

export const smsClient = new SMSClient();
