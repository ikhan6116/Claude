/**
 * Relintex CRM lead integration (Add Lead API).
 *
 * Posts each completed lead to the Relintex lead-intake endpoint. Fully
 * gated on environment variables — if they are not set, sendLeadToRelintex
 * is a no-op, so nothing breaks until you finish configuration.
 *
 * Required env:
 *   RELINTEX_LEAD_POST_URL   Full Add-Lead endpoint URL Relintex gave you
 *
 * Auth — set ONE of:
 *   RELINTEX_API_USERNAME + RELINTEX_API_PASSWORD   (HTTP Basic auth)
 *   RELINTEX_API_TOKEN                              (Bearer token)
 *
 * Optional:
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

function authHeader(): string | null {
  const token = process.env.RELINTEX_API_TOKEN;
  if (token) return `Bearer ${token}`;

  const user = process.env.RELINTEX_API_USERNAME;
  const pass = process.env.RELINTEX_API_PASSWORD;
  if (user && pass) {
    return `Basic ${Buffer.from(`${user}:${pass}`).toString('base64')}`;
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

export async function sendLeadToRelintex(lead: RelintexLead): Promise<boolean> {
  const url = process.env.RELINTEX_LEAD_POST_URL;
  if (!url) {
    // Not configured yet — silently skip.
    return false;
  }

  const auth = authHeader();
  if (!auth) {
    console.warn('[Relintex] RELINTEX_LEAD_POST_URL is set but no credentials found (set RELINTEX_API_USERNAME/PASSWORD or RELINTEX_API_TOKEN).');
    return false;
  }

  const payload = buildPayload(lead);
  const asForm = (process.env.RELINTEX_POST_FORMAT || 'json').toLowerCase() === 'form';

  const headers: Record<string, string> = { Authorization: auth };
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

    if (!response.ok) {
      const errBody = await response.text().catch(() => '');
      console.error(`[Relintex] Lead post failed ${response.status}:`, errBody);
      return false;
    }

    console.log('[Relintex] Lead posted successfully (ref_id:', payload.ref_id, ')');
    return true;
  } catch (err) {
    console.error('[Relintex] Lead post error:', err);
    return false;
  }
}
