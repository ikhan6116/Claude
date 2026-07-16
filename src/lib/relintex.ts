/**
 * Relintex CRM lead integration.
 *
 * Posts each completed lead to the Relintex lead-intake endpoint. Fully
 * gated on environment variables — if they are not set, sendLeadToRelintex
 * is a no-op, so nothing breaks until you finish configuration.
 *
 * Required env:
 *   RELINTEX_LEAD_POST_URL   Full endpoint URL Relintex gave you for lead intake
 *                            (e.g. https://connect.relintex.net/api/v2/lead/create)
 *
 * Auth — set ONE of:
 *   RELINTEX_API_USERNAME + RELINTEX_API_PASSWORD   (HTTP Basic auth)
 *   RELINTEX_API_TOKEN                              (Bearer token)
 *
 * Optional:
 *   RELINTEX_CAMPAIGN_ID     Campaign / vendor / lead-type id to attach the lead to
 *
 * NOTE: The field names in buildPayload() below are a sensible default for a
 * loan lead-post API. Confirm them against your Relintex field spec and adjust
 * the keys if Relintex expects different names.
 */

export interface RelintexLead {
  firstName: string;
  lastName: string;
  email: string;
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
  creditScore?: number | null;
  totalDebtBalance?: number | null;
  leadSource?: string;
  tcpaConsent?: boolean;
  phoneVerified?: boolean;
  submittedAt?: string;
  ipAddress?: string;
  userAgent?: string;
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

function buildPayload(lead: RelintexLead): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    first_name: lead.firstName,
    last_name: lead.lastName,
    email: lead.email,
    phone: lead.phone,
    address: lead.address || '',
    city: lead.city || '',
    state: lead.state || '',
    zip_code: lead.zip || '',
    loan_type: 'debt_consolidation',
    loan_purpose: lead.loanPurpose || '',
    unsecured_debt_amount: lead.unsecuredDebtBalance || '',
    monthly_minimum_payment: lead.monthlyDebtPayment || '',
    requested_loan_amount: lead.loanRequestAmount || '',
    estimated_fico: lead.estimatedFico || '',
    credit_score: lead.creditScore ?? '',
    total_debt_balance: lead.totalDebtBalance ?? '',
    lead_source: lead.leadSource || 'BrightPath Finance',
    tcpa_consent: lead.tcpaConsent ? '1' : '0',
    phone_verified: lead.phoneVerified ? '1' : '0',
    submitted_at: lead.submittedAt || new Date().toISOString(),
    ip_address: lead.ipAddress || '',
    user_agent: lead.userAgent || '',
  };

  const campaignId = process.env.RELINTEX_CAMPAIGN_ID;
  if (campaignId) payload.campaign_id = campaignId;

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

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: auth,
      },
      body: JSON.stringify(buildPayload(lead)),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      console.error(`[Relintex] Lead post failed ${response.status}:`, body);
      return false;
    }

    console.log('[Relintex] Lead posted successfully.');
    return true;
  } catch (err) {
    console.error('[Relintex] Lead post error:', err);
    return false;
  }
}
