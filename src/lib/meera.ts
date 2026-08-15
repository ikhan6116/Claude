/**
 * Meera CRM lead integration.
 *
 * Posts each completed lead to Meera (chatbot.meera.ai) so Meera can start an
 * SMS conversation with the new lead immediately. Fully gated on environment
 * variables — if they aren't set, sendLeadToMeera is a no-op, so nothing breaks
 * until configuration is finished.
 *
 * Required env:
 *   MEERA_LEAD_POST_URL   Full Meera "add lead / contact" endpoint URL from the
 *                         Meera API v4 docs (https://chatbot.meera.ai/api-docs-v4)
 *   MEERA_API_KEY         Your Meera API key / token
 *
 * Optional:
 *   MEERA_AUTH_HEADER     Header the key is sent under (default 'Authorization';
 *                         when it's Authorization the key is sent as `Bearer <key>`).
 *                         Set to e.g. 'x-api-key' or 'api_key' if Meera documents that.
 *   MEERA_CAMPAIGN_ID     Meera campaign/agent id that should engage the lead
 *   MEERA_LIST_ID         Meera list/audience id to add the lead to
 *
 * NOTE: The payload keys below are a best-guess mapping. Confirm the exact
 * field names Meera's v4 API expects and adjust buildPayload accordingly — the
 * full Meera response is logged on every send to make that easy to verify.
 */

export interface MeeraLead {
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  loanPurpose?: string;
  unsecuredDebtBalance?: string;
  monthlyDebtPayment?: string;
  loanRequestAmount?: string;
  estimatedFico?: string;
  leadSource?: string;
}

export interface MeeraResult {
  ok: boolean;
  status?: number;
  detail?: string;
}

/** Normalize a US phone to E.164 (+1XXXXXXXXXX) — Meera sends SMS, so it needs a clean number. */
function normalizePhone(phone: string): string {
  const d = phone.replace(/\D/g, '');
  if (d.length === 10) return `+1${d}`;
  if (d.length === 11 && d.startsWith('1')) return `+${d}`;
  return phone.startsWith('+') ? phone : `+${d}`;
}

function authHeader(): { name: string; value: string } | null {
  const key = process.env.MEERA_API_KEY;
  if (!key) return null;
  const name = process.env.MEERA_AUTH_HEADER || 'Authorization';
  const value = name.toLowerCase() === 'authorization' ? `Bearer ${key}` : key;
  return { name, value };
}

function buildPayload(lead: MeeraLead): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    first_name: lead.firstName,
    last_name: lead.lastName,
    email: lead.email || '',
    phone: normalizePhone(lead.phone),
    address: lead.address || '',
    city: lead.city || '',
    state: lead.state || '',
    zip: lead.zip || '',
    lead_source: lead.leadSource || 'BrightPath Finance',
    // Loan detail as custom fields — rename to match Meera's expected keys.
    loan_purpose: lead.loanPurpose || '',
    unsecured_debt: lead.unsecuredDebtBalance || '',
    monthly_payment: lead.monthlyDebtPayment || '',
    loan_amount: lead.loanRequestAmount || '',
    estimated_fico: lead.estimatedFico || '',
  };

  const campaignId = process.env.MEERA_CAMPAIGN_ID;
  if (campaignId) payload.campaign_id = campaignId;
  const listId = process.env.MEERA_LIST_ID;
  if (listId) payload.list_id = listId;

  return payload;
}

export async function sendLeadToMeera(lead: MeeraLead): Promise<MeeraResult> {
  const url = process.env.MEERA_LEAD_POST_URL;
  if (!url) {
    // Not configured yet — silently skip.
    return { ok: false, detail: 'MEERA_LEAD_POST_URL not set' };
  }

  const auth = authHeader();
  if (!auth) {
    console.warn('[Meera] MEERA_LEAD_POST_URL is set but MEERA_API_KEY is missing.');
    return { ok: false, detail: 'MEERA_API_KEY not set' };
  }

  const headers: Record<string, string> = {
    [auth.name]: auth.value,
    'Content-Type': 'application/json',
  };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(buildPayload(lead)),
      signal: controller.signal,
    }).finally(() => clearTimeout(timeout));

    const respText = await response.text().catch(() => '');

    if (!response.ok) {
      console.error(`[Meera] Lead post failed HTTP ${response.status}:`, respText);
      return { ok: false, status: response.status, detail: respText };
    }

    // Some APIs return HTTP 200 with an error/success flag in the body.
    let parsed: { success?: boolean; error?: unknown; status?: string } | null = null;
    try { parsed = JSON.parse(respText); } catch { /* non-JSON — treat 2xx as success */ }

    if (parsed && (parsed.success === false || parsed.error)) {
      console.warn('[Meera] Lead rejected:', respText);
      return { ok: false, status: response.status, detail: respText };
    }

    console.log('[Meera] Lead posted successfully:', respText);
    return { ok: true, status: response.status, detail: respText };
  } catch (err) {
    console.error('[Meera] Lead post error:', err);
    return { ok: false, detail: String(err) };
  }
}
