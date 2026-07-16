import type { NextApiRequest, NextApiResponse } from 'next';
import { sendLeadToRelintex } from '@/lib/relintex';

/**
 * Diagnostic — fires a clearly-marked TEST lead at Relintex and reports
 * whether it was accepted. Lets you confirm the endpoint + credentials +
 * field mapping work end-to-end before relying on live traffic.
 *
 * Reports which env vars are present (booleans only — never the values).
 * Remove this endpoint once the Relintex integration is confirmed.
 */
export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const config = {
    leadPostUrl: !!process.env.RELINTEX_LEAD_POST_URL,
    hasApiKey: !!process.env.RELINTEX_API_KEY,
    authHeader: process.env.RELINTEX_AUTH_HEADER || 'authkey',
    postFormat: process.env.RELINTEX_POST_FORMAT || 'json',
    utmCampaign: process.env.RELINTEX_UTM_CAMPAIGN || null,
  };

  if (!config.leadPostUrl) {
    return res.status(200).json({ ok: false, error: 'RELINTEX_LEAD_POST_URL not set', config });
  }
  if (!config.hasApiKey) {
    return res.status(200).json({ ok: false, error: 'RELINTEX_API_KEY not set', config });
  }

  const result = await sendLeadToRelintex({
    firstName: 'Diagnostic',
    lastName: 'Test',
    email: `diagnostic+${Date.now()}@brightpath-fin.com`,
    phone: '8778672002',
    address: '898 South State St',
    city: 'Orem',
    state: 'UT',
    zip: '84058',
    loanPurpose: 'Consolidate Credit Card Debt',
    unsecuredDebtBalance: '$25,000 - $50,000',
    monthlyDebtPayment: '$500 - $1,000',
    loanRequestAmount: '$25,000 - $50,000',
    estimatedFico: 'Good (700-749)',
    leadSource: 'Diagnostic Test',
    tcpaConsent: true,
    phoneVerified: true,
    submittedAt: new Date().toISOString(),
  });

  return res.status(200).json({
    ok: result.ok,
    httpStatus: result.status ?? null,
    relintexResponse: result.detail ?? null,
    refId: result.refId ?? null,
    note: result.ok
      ? 'Relintex accepted the test lead. Check your Countrywide instance for a "Diagnostic Test" lead, then delete it.'
      : 'Relintex rejected the lead. See relintexResponse below for the reason (often an auth-header or field issue).',
    config,
  });
}
