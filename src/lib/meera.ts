/**
 * Meera CRM lead integration — POST /api/v4/campaign-leads/import.
 *
 * Posts each completed lead to Meera (chatbot.meera.ai) so Meera can start an
 * SMS conversation with the new lead immediately. Fully gated on environment
 * variables — inert until both the API key and campaign id are set.
 *
 * Required env:
 *   MEERA_API_KEY       Your Meera API token (sent raw in the Authorization
 *                       header — NO "Bearer " prefix, per the v4 docs)
 *   MEERA_CAMPAIGN_ID   Integer campaign id that should engage the lead (e.g. 4)
 *
 * Optional:
 *   MEERA_LEAD_POST_URL  Override the import endpoint (defaults to the v4 URL below)
 *   MEERA_AUTH_SCHEME    Prefix for the Authorization value. Default none (raw
 *                        token). Set to 'Bearer' only if you use an OAuth2 access
 *                        token instead of a static API key.
 *   MEERA_AUTH_HEADER    Header name for the token (default 'Authorization')
 *   MEERA_COUNTRY_CODE   Two-letter country code sent as country_code (default 'US')
 *
 * Docs: https://chatbot.meera.ai/api-docs-v4
 */

const DEFAULT_URL = 'https://chatbot.meera.ai/api/v4/campaign-leads/import';

export interface MeeraLead {
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  state?: string;
  loanPurpose?: string;
  leadSource?: string;
  externalId?: string;
  submittedAt?: string;
}

export interface MeeraResult {
  ok: boolean;
  status?: number;
  detail?: string;
}

/** Normalize a US phone to E.164 (+1XXXXXXXXXX) — Meera requires a country code for SMS. */
function normalizePhone(phone: string): string {
  const d = phone.replace(/\D/g, '');
  if (d.length === 10) return `+1${d}`;
  if (d.length === 11 && d.startsWith('1')) return `+${d}`;
  return phone.startsWith('+') ? phone : `+${d}`;
}

/** Format a date as MM/DD/YYYY (Meera's required registration_date format). */
function formatRegistrationDate(iso?: string): string {
  const d = iso ? new Date(iso) : new Date();
  const dt = isNaN(d.getTime()) ? new Date() : d;
  const mm = String(dt.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(dt.getUTCDate()).padStart(2, '0');
  return `${mm}/${dd}/${dt.getUTCFullYear()}`;
}

function authHeader(): { name: string; value: string } | null {
  const key = process.env.MEERA_API_KEY;
  if (!key) return null;
  const name = process.env.MEERA_AUTH_HEADER || 'Authorization';
  const scheme = process.env.MEERA_AUTH_SCHEME; // default: none (raw token)
  const value = scheme ? `${scheme} ${key}` : key;
  return { name, value };
}

function buildPayload(lead: MeeraLead, campaignId: number): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    campaign_id: campaignId,
    first_name: lead.firstName || '',
    last_name: lead.lastName || '',
    mobile_number: normalizePhone(lead.phone),
    external_system_id: lead.externalId || `BP-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    registration_date: formatRegistrationDate(lead.submittedAt),
    country_code: process.env.MEERA_COUNTRY_CODE || 'US',
    state_code: lead.state || '',
  };
  if (lead.email) payload.email = lead.email;
  if (lead.leadSource) payload.source = lead.leadSource;
  if (lead.loanPurpose) payload.program_name = lead.loanPurpose;
  return payload;
}

export async function sendLeadToMeera(lead: MeeraLead): Promise<MeeraResult> {
  const auth = authHeader();
  if (!auth) {
    // Not configured yet — silently skip.
    return { ok: false, detail: 'MEERA_API_KEY not set' };
  }

  const campaignId = parseInt(process.env.MEERA_CAMPAIGN_ID || '', 10);
  if (!campaignId) {
    console.warn('[Meera] MEERA_API_KEY is set but MEERA_CAMPAIGN_ID is missing or not an integer.');
    return { ok: false, detail: 'MEERA_CAMPAIGN_ID not set' };
  }

  const url = process.env.MEERA_LEAD_POST_URL || DEFAULT_URL;
  const headers: Record<string, string> = {
    [auth.name]: auth.value,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(buildPayload(lead, campaignId)),
      signal: controller.signal,
    }).finally(() => clearTimeout(timeout));

    const respText = await response.text().catch(() => '');

    if (!response.ok) {
      console.error(`[Meera] Lead import failed HTTP ${response.status}:`, respText);
      return { ok: false, status: response.status, detail: respText };
    }

    // Success response is {"status": true, "message": "Lead imported successfully."}
    let parsed: { status?: boolean; message?: string } | null = null;
    try { parsed = JSON.parse(respText); } catch { /* non-JSON — treat 2xx as success */ }

    if (parsed && parsed.status === false) {
      console.warn('[Meera] Lead rejected:', respText);
      return { ok: false, status: response.status, detail: respText };
    }

    console.log('[Meera] Lead imported successfully:', respText);
    return { ok: true, status: response.status, detail: respText };
  } catch (err) {
    console.error('[Meera] Lead import error:', err);
    return { ok: false, detail: String(err) };
  }
}
