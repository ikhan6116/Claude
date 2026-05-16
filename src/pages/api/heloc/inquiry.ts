import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { FigureApiClient, FigureApiError, type HELOCInquiryPayload } from '../../../lib/figure-api';

interface SuccessResponse {
  success: true;
  inquiryId: string;
  status: string;
  estimatedApr?: number;
  prequalifiedAmount?: number;
}

interface ErrorResponse {
  success: false;
  error: string;
  fields?: string[];
}

function validate(body: Record<string, unknown>): string[] {
  const required: Array<[string, string]> = [
    ['firstName', 'string'],
    ['lastName', 'string'],
    ['email', 'string'],
    ['phone', 'string'],
    ['estimatedHomeValue', 'number'],
    ['currentMortgageBalance', 'number'],
    ['requestedCreditLine', 'number'],
    ['creditScoreRange', 'string'],
    ['employmentStatus', 'string'],
    ['annualIncome', 'number'],
    ['loanPurpose', 'string'],
    ['consentToTerms', 'boolean'],
  ];

  const missing: string[] = [];

  for (const [field, type] of required) {
    const val = body[field];
    if (val === undefined || val === null || val === '') {
      missing.push(field);
    } else if (type === 'number' && (typeof val !== 'number' || isNaN(val as number))) {
      missing.push(field);
    } else if (type === 'boolean' && typeof val !== 'boolean') {
      missing.push(field);
    }
  }

  const addr = body.propertyAddress as Record<string, unknown> | undefined;
  if (!addr || typeof addr !== 'object') {
    missing.push('propertyAddress');
  } else {
    for (const sub of ['street', 'city', 'state', 'zip']) {
      if (!addr[sub]) missing.push(`propertyAddress.${sub}`);
    }
  }

  if (body.consentToTerms === false) missing.push('consentToTerms');

  return missing;
}

function saveLead(data: HELOCInquiryPayload, inquiryId: string) {
  try {
    const leadsPath = path.join('/tmp', 'heloc-leads.json');
    let leads: unknown[] = [];
    if (fs.existsSync(leadsPath)) {
      leads = JSON.parse(fs.readFileSync(leadsPath, 'utf-8'));
    }
    leads.push({ ...data, inquiryId, savedAt: new Date().toISOString() });
    fs.writeFileSync(leadsPath, JSON.stringify(leads, null, 2));
  } catch {
    console.error('[inquiry] Failed to write lead backup');
  }
}

const figureClient = new FigureApiClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse | ErrorResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const body = req.body as Record<string, unknown>;
  const invalidFields = validate(body);

  if (invalidFields.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Missing or invalid required fields',
      fields: invalidFields,
    });
  }

  const payload: HELOCInquiryPayload = {
    firstName: String(body.firstName),
    lastName: String(body.lastName),
    email: String(body.email),
    phone: String(body.phone),
    propertyAddress: body.propertyAddress as HELOCInquiryPayload['propertyAddress'],
    estimatedHomeValue: Number(body.estimatedHomeValue),
    currentMortgageBalance: Number(body.currentMortgageBalance),
    requestedCreditLine: Number(body.requestedCreditLine),
    creditScoreRange: String(body.creditScoreRange),
    employmentStatus: String(body.employmentStatus),
    annualIncome: Number(body.annualIncome),
    loanPurpose: String(body.loanPurpose),
    consentToTerms: Boolean(body.consentToTerms),
    partnerId: process.env.FIGURE_PARTNER_ID || '',
    leadSource: String(body.leadSource || 'organic-web'),
  };

  try {
    const result = await figureClient.createInquiry(payload);
    saveLead(payload, result.inquiryId);

    return res.status(200).json({
      success: true,
      inquiryId: result.inquiryId,
      status: result.status,
      estimatedApr: result.estimatedApr,
      prequalifiedAmount: result.prequalifiedAmount,
    });
  } catch (err) {
    if (err instanceof FigureApiError) {
      const status = err.statusCode >= 400 && err.statusCode < 500 ? 422 : 502;
      return res.status(status).json({ success: false, error: err.message });
    }
    console.error('[inquiry] Unexpected error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
