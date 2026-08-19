import { createHash } from 'crypto';

const GRAPH_API_VERSION = 'v21.0';

function sha256(value: string): string {
  return createHash('sha256').update(value.trim().toLowerCase()).digest('hex');
}

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  return digits.length === 10 ? `1${digits}` : digits;
}

interface LeadEventData {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  city?: string;
  state?: string;
  zip?: string;
  clientIpAddress?: string;
  clientUserAgent?: string;
  fbc?: string;
  fbp?: string;
  /** Shared with the browser pixel's fbq eventID so Meta deduplicates the pair. */
  eventId?: string;
  /** Monetary value of the lead (scaled by loan amount). */
  value?: number;
  currency?: string;
}

export async function sendLeadEvent(data: LeadEventData): Promise<boolean> {
  const pixelId = process.env.META_PIXEL_ID;
  const token = process.env.META_CONVERSIONS_API_TOKEN;

  if (!pixelId || !token) {
    console.warn('[Meta CAPI] Missing META_PIXEL_ID or META_CONVERSIONS_API_TOKEN');
    return false;
  }

  const userData: Record<string, string> = {};
  if (data.email) userData.em = sha256(data.email);
  if (data.phone) userData.ph = sha256(normalizePhone(data.phone));
  if (data.firstName) userData.fn = sha256(data.firstName);
  if (data.lastName) userData.ln = sha256(data.lastName);
  if (data.city) userData.ct = sha256(data.city);
  if (data.state) userData.st = sha256(data.state);
  if (data.zip) userData.zp = sha256(data.zip);
  userData.country = sha256('us');

  if (data.clientIpAddress) userData.client_ip_address = data.clientIpAddress;
  if (data.clientUserAgent) userData.client_user_agent = data.clientUserAgent;
  if (data.fbc) userData.fbc = data.fbc;
  if (data.fbp) userData.fbp = data.fbp;

  const event: Record<string, unknown> = {
    event_name: 'Lead',
    event_time: Math.floor(Date.now() / 1000),
    action_source: 'website',
    event_source_url: 'https://loans.brightpath-fin.com',
    user_data: userData,
  };
  // Shared id lets Meta dedupe this server event against the browser pixel's Lead.
  if (data.eventId) event.event_id = data.eventId;
  // value/currency mirror the browser pixel's Lead so Meta reports one valued conversion.
  if (typeof data.value === 'number' && data.value > 0) {
    event.custom_data = { value: data.value, currency: data.currency || 'USD' };
  }

  try {
    // test_event_code makes events appear in Events Manager → Test Events.
    // Set META_TEST_EVENT_CODE while verifying, then remove it for production.
    const testCode = process.env.META_TEST_EVENT_CODE;
    const requestBody: Record<string, unknown> = { data: [event] };
    if (testCode) requestBody.test_event_code = testCode;

    const response = await fetch(
      `https://graph.facebook.com/${GRAPH_API_VERSION}/${pixelId}/events?access_token=${token}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      console.error(`[Meta CAPI] API error ${response.status}:`, body);
      return false;
    }

    const result = await response.json();
    console.log(`[Meta CAPI] Lead event sent (value: ${typeof data.value === 'number' ? data.value : 'none'} ${data.currency || 'USD'}, event_id: ${data.eventId || 'none'}):`, result);
    return true;
  } catch (err) {
    console.error('[Meta CAPI] Failed to send event:', err);
    return false;
  }
}
