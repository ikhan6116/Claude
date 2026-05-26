/**
 * Twilio SMS client — sends text messages via Twilio REST API.
 * Required env vars: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER
 */

export class TwilioSmsClient {
  private readonly accountSid: string
  private readonly authToken: string
  private readonly fromNumber: string

  constructor() {
    this.accountSid = process.env.TWILIO_ACCOUNT_SID || ''
    this.authToken  = process.env.TWILIO_AUTH_TOKEN  || ''
    this.fromNumber = process.env.TWILIO_FROM_NUMBER || ''
  }

  get configured(): boolean {
    return !!(this.accountSid && this.authToken && this.fromNumber)
  }

  private normalizePhone(phone: string): string {
    const digits = phone.replace(/\D/g, '')
    // Prepend +1 if it's a 10-digit US number
    if (digits.length === 10) return `+1${digits}`
    if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`
    return `+${digits}`
  }

  async sendSms(to: string, body: string): Promise<{ sid: string }> {
    if (!this.configured) {
      throw new Error('Twilio credentials not configured (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER)')
    }

    const url = `https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Messages.json`
    const credentials = Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64')

    const formData = new URLSearchParams({
      To:   this.normalizePhone(to),
      From: this.fromNumber,
      Body: body,
    })

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    })

    const json = await res.json() as Record<string, unknown>

    if (!res.ok) {
      const msg = String(json.message || `Twilio error ${res.status}`)
      console.error('[Twilio] SMS failed:', res.status, json)
      throw new Error(msg)
    }

    return { sid: json.sid as string }
  }

  buildLeadMessage(firstName: string): string {
    return `Hi ${firstName}, this is BrightPath Finance. We received your HELOC request and one of our agents will begin working on your file shortly. Questions? Call us at (877) 867-2002.`
  }
}
