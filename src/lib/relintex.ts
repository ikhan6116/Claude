/**
 * Relintex CRM lead integration (Add Lead API).
 *
 * Posts each completed lead to the Relintex lead-intake endpoint. Fully
 * gated on environment variables — if they are not set, sendLeadToRelintex
 * is a no-op, so nothing breaks until you finish configuration.
 *
 * Required env:
 *   RELINTEX_LEAD_POST_URL   Full Add-Lead endpoint URL, e.g.
 *                            https://countrywide.relintex.net/ws/api/v1/lead/create
 *   RELINTEX_API_KEY         The Auth Key Relintex gave you
 *
 * Optional:
 *   RELINTEX_AUTH_HEADER     Header name the key is sent under (default 'authkey').
 *                            Set to 'Authorization' or whatever Relintex documents
 *                            if the default is rejected.
 *   RELINTEX_UTM_CAMPAIGN    Value sent as utm_campaign on every lead
 *   RELINTEX_POST_FORMAT     'json' (default) or 'form' (x-www-form-urlencoded)
 *
 * Field names below match the Relintex "Add Lead" API spec exactly.
 * Notable mapping: the monthly minimum payment is sent as `co_pays`
 * (Relintex's "Deductibles/Co-Pays" field).
 */

export interface RelintexLead {
  refId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  loanPurpose?: string;
  unsecuredDebtBalance?: string;
  monthlyDebtPayment?: string;
  loanRequestAmount?: string;
  estimatedFico?: string;
  creditScore?: number | null;
  totalDebtBalance?: number | null;
  leadSource?: string;
  tcpaConsent?: boolean;
  phoneVerified?: boolean;
  submittedAt?: string;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Parse a dollar amount out of a range/label string into a number.
 * Handles: "$25,000 - $50,000" -> 25000, "$25K–$50K" -> 25000,
 * "Less than $250" -> 250, "$2,500+" -> 2500, "$100K+" -> 100000.
 * Uses the lower bound of a range. Returns 0 when nothing parseable.
 */
function parseMoney(s?: string): number {
  if (!s) return 0;
  const m = s.match(/\$?\s*([\d,]+(?:\.\d+)?)\s*([kKmM])?/);
  if (!m) return 0;
  let n = parseFloat(m[1].replace(/,/g, ''));
  if (Number.isNaN(n)) return 0;
  const suffix = (m[2] || '').toLowerCase();
  if (suffix === 'k') n *= 1000;
  if (suffix === 'm') n *= 1000000;
  return n;
}

function makeRefId(): string {
  return `BP-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Returns the auth header {name, value} for the request, or null if no
 * credentials are configured. Defaults to sending RELINTEX_API_KEY under an
 * `authkey` header; the header name is overridable via RELINTEX_AUTH_HEADER.
 */
function authHeader(): { name: string; value: string } | null {
  const key = process.env.RELINTEX_API_KEY;
  if (key) {
    const name = process.env.RELINTEX_AUTH_HEADER || 'authkey';
    // If they explicitly point at Authorization, send it as a bearer token.
    const value = name.toLowerCase() === 'authorization' ? `Bearer ${key}` : key;
    return { name, value };
  }
  return null;
}

function buildPayload(lead: RelintexLead): Record<string, string | number> {
  const payload: Record<string, string | number> = {
    ref_id: lead.refId || makeRefId(),
    first_name: lead.firstName,
    last_name: lead.lastName,
    phone: lead.phone,
    email: lead.email || '',
    address: lead.address || '',
    city: lead.city || '',
    state: lead.state || '',
    zip: lead.zip || '',
    tcpa: lead.tcpaConsent ? 'agree' : 'none',
    utm_src: lead.leadSource || 'BrightPath Finance',
    debt_amount: parseMoney(lead.unsecuredDebtBalance),
    co_pays: parseMoney(lead.monthlyDebtPayment),
    loan_amount: parseMoney(lead.loanRequestAmount),
  };

  if (lead.dob) payload.dob = lead.dob;

  const utmCampaign = process.env.RELINTEX_UTM_CAMPAIGN;
  if (utmCampaign) payload.utm_campaign = utmCampaign;

  return payload;
}

export interface RelintexResult {
  ok: boolean;
  status?: number;
  detail?: string;
  refId?: string;
}

/**
 * Diagnostic — tries the common Yii REST auth placements against the live
 * endpoint with one shared test identity (so at most one lead is created)
 * and reports the HTTP status + response for each. A non-401 status means
 * that auth method got past authentication. Used by /api/loans/probe-relintex.
 */
export async function probeRelintexAuth(): Promise<
  Array<{ method: string; status: number | null; detail: string }>
> {
  const url = process.env.RELINTEX_LEAD_POST_URL;
  const key = process.env.RELINTEX_API_KEY;
  if (!url || !key) return [];

  const payload = buildPayload({
    firstName: 'Diagnostic',
    lastName: 'Test',
    email: 'diagnostic-probe@brightpath-fin.com',
    phone: '8778672002',
    address: '898 South State St',
    city: 'Orem',
    state: 'UT',
    zip: '84058',
    unsecuredDebtBalance: '$25,000 - $50,000',
    monthlyDebtPayment: '$500 - $1,000',
    loanRequestAmount: '$25,000 - $50,000',
    leadSource: 'Auth Probe',
    tcpaConsent: true,
  });
  // Fixed ref_id so repeated probes dedup instead of piling up test leads.
  payload.ref_id = 'BP-AUTH-PROBE';
  const bodyJson = JSON.stringify(payload);
  const json = 'application/json';
  const b64 = Buffer.from(`${key}:`).toString('base64');

  const candidates: Array<{ method: string; url: string; headers: Record<string, string> }> = [
    { method: 'header: Authorization Bearer', url, headers: { Authorization: `Bearer ${key}`, 'Content-Type': json } },
    { method: 'header: Authorization (raw key)', url, headers: { Authorization: key, 'Content-Type': json } },
    { method: 'query: access-token', url: `${url}?access-token=${encodeURIComponent(key)}`, headers: { 'Content-Type': json } },
    { method: 'query: authkey', url: `${url}?authkey=${encodeURIComponent(key)}`, headers: { 'Content-Type': json } },
    { method: 'header: X-Api-Key', url, headers: { 'X-Api-Key': key, 'Content-Type': json } },
    { method: 'header: api-key', url, headers: { 'api-key': key, 'Content-Type': json } },
    { method: 'basic auth (key as username)', url, headers: { Authorization: `Basic ${b64}`, 'Content-Type': json } },
  ];

  const results: Array<{ method: string; status: number | null; detail: string }> = [];
  for (const c of candidates) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      const resp = await fetch(c.url, {
        method: 'POST',
        headers: c.headers,
        body: bodyJson,
        signal: controller.signal,
      }).finally(() => clearTimeout(timeout));
      const text = await resp.text().catch(() => '');
      results.push({ method: c.method, status: resp.status, detail: text.slice(0, 500) });
    } catch (err) {
      results.push({ method: c.method, status: null, detail: String(err) });
    }
  }
  return results;
}

export async function sendLeadToRelintex(lead: RelintexLead): Promise<RelintexResult> {
  const url = process.env.RELINTEX_LEAD_POST_URL;
  if (!url) {
    // Not configured yet — silently skip.
    return { ok: false, detail: 'RELINTEX_LEAD_POST_URL not set' };
  }

  const auth = authHeader();
  if (!auth) {
    console.warn('[Relintex] RELINTEX_LEAD_POST_URL is set but RELINTEX_API_KEY is missing.');
    return { ok: false, detail: 'RELINTEX_API_KEY not set' };
  }

  const payload = buildPayload(lead);
  const asForm = (process.env.RELINTEX_POST_FORMAT || 'json').toLowerCase() === 'form';

  const headers: Record<string, string> = { [auth.name]: auth.value };
  let body: string;
  if (asForm) {
    headers['Content-Type'] = 'application/x-www-form-urlencoded';
    body = new URLSearchParams(
      Object.entries(payload).reduce((acc, [k, v]) => {
        acc[k] = String(v);
        return acc;
      }, {} as Record<string, string>)
    ).toString();
  } else {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(payload);
  }

  try {
    // Relintex asks for at least a 5-second timeout window.
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body,
      signal: controller.signal,
    }).finally(() => clearTimeout(timeout));

    const respText = await response.text().catch(() => '');

    if (!response.ok) {
      console.error(`[Relintex] Lead post failed ${response.status}:`, respText);
      return { ok: false, status: response.status, detail: respText, refId: String(payload.ref_id) };
    }

    console.log('[Relintex] Lead posted successfully (ref_id:', payload.ref_id, ')');
    return { ok: true, status: response.status, detail: respText, refId: String(payload.ref_id) };
  } catch (err) {
    console.error('[Relintex] Lead post error:', err);
    return { ok: false, detail: String(err) };
  }
}
