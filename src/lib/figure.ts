/**
 * Figure Technologies Partner API client
 *
 * Docs: https://developer.figure.com
 * Auth: OAuth 2.0 client_credentials
 * Scope: heloc:write heloc:read
 *
 * To become a Figure partner: https://www.figure.com/partners/
 */

export interface FigureAddress {
  street: string;
  unit?: string;
  city: string;
  state: string;
  zip: string;
}

export interface FigureBorrower {
  firstName: string;
  lastName: string;
  dateOfBirth: string;       // YYYY-MM-DD
  ssnLastFour: string;
  annualIncomeUsd: number;
  employmentStatus: 'employed' | 'self_employed' | 'retired' | 'other';
  creditScoreRange: string;  // e.g. "700-749"
}

export interface FigureProperty {
  address: FigureAddress;
  estimatedValueUsd: number;
  existingMortgageBalanceUsd: number;
  propertyType: 'single_family' | 'condo' | 'townhouse' | 'multi_family';
  occupancyType: 'primary' | 'secondary' | 'investment';
}

export interface FigureInquiryRequest {
  borrower: FigureBorrower;
  property: FigureProperty;
  requestedLineAmountUsd: number;
  contactEmail: string;
  contactPhone: string;
  partnerReferenceId?: string;   // your internal lead ID
  consentTimestamp: string;       // ISO-8601 when borrower consented
}

export interface FigureOffer {
  offerId: string;
  lineAmountUsd: number;
  aprPercent: number;
  drawPeriodMonths: number;
  repaymentPeriodMonths: number;
  monthlyPaymentEstimateUsd: number;
  offerExpiresAt: string;
}

export interface FigureInquiryResponse {
  inquiryId: string;
  status: 'pending' | 'approved' | 'conditional' | 'declined';
  offers: FigureOffer[];
  nextSteps?: string;
  applicationUrl?: string;  // deep-link for borrower to complete full app
  createdAt: string;
}

// ---------------------------------------------------------------------------
// OAuth token cache (in-memory — replace with Redis in production)
// ---------------------------------------------------------------------------
let cachedToken: { value: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  const now = Date.now();
  if (cachedToken && cachedToken.expiresAt > now + 30_000) {
    return cachedToken.value;
  }

  const clientId = process.env.FIGURE_CLIENT_ID;
  const clientSecret = process.env.FIGURE_CLIENT_SECRET;
  const tokenUrl = process.env.FIGURE_TOKEN_URL || 'https://api.figure.com/oauth/token';

  if (!clientId || !clientSecret) {
    throw new Error('FIGURE_CLIENT_ID and FIGURE_CLIENT_SECRET must be set');
  }

  const params = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: clientId,
    client_secret: clientSecret,
    scope: 'heloc:write heloc:read',
  });

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Figure OAuth failed: ${response.status} ${body}`);
  }

  const data = await response.json();
  cachedToken = {
    value: data.access_token,
    expiresAt: now + (data.expires_in ?? 3600) * 1000,
  };
  return cachedToken.value;
}

// ---------------------------------------------------------------------------
// Create HELOC inquiry
// ---------------------------------------------------------------------------
export async function createHELOCInquiry(
  inquiry: FigureInquiryRequest
): Promise<FigureInquiryResponse> {
  const baseUrl = process.env.FIGURE_API_BASE_URL || 'https://api.figure.com';
  const token = await getAccessToken();
  const partnerId = process.env.FIGURE_PARTNER_ID;

  const response = await fetch(`${baseUrl}/v2/heloc/inquiries`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'X-Partner-Id': partnerId || '',
      'X-Idempotency-Key': inquiry.partnerReferenceId || crypto.randomUUID(),
    },
    body: JSON.stringify({
      partnerReferenceId: inquiry.partnerReferenceId,
      borrower: {
        firstName: inquiry.borrower.firstName,
        lastName: inquiry.borrower.lastName,
        dateOfBirth: inquiry.borrower.dateOfBirth,
        ssnLastFour: inquiry.borrower.ssnLastFour,
        annualIncomeUsd: inquiry.borrower.annualIncomeUsd,
        employmentStatus: inquiry.borrower.employmentStatus,
        creditScoreRange: inquiry.borrower.creditScoreRange,
      },
      property: {
        address: inquiry.property.address,
        estimatedValueUsd: inquiry.property.estimatedValueUsd,
        existingMortgageBalanceUsd: inquiry.property.existingMortgageBalanceUsd,
        propertyType: inquiry.property.propertyType,
        occupancyType: inquiry.property.occupancyType,
      },
      requestedLineAmountUsd: inquiry.requestedLineAmountUsd,
      contact: {
        email: inquiry.contactEmail,
        phone: inquiry.contactPhone,
      },
      consent: {
        timestamp: inquiry.consentTimestamp,
        ipAddress: undefined, // populated in handler from request
      },
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Figure API error: ${response.status} ${body}`);
  }

  return response.json() as Promise<FigureInquiryResponse>;
}

// ---------------------------------------------------------------------------
// Retrieve inquiry status (polling or webhook)
// ---------------------------------------------------------------------------
export async function getInquiryStatus(
  inquiryId: string
): Promise<FigureInquiryResponse> {
  const baseUrl = process.env.FIGURE_API_BASE_URL || 'https://api.figure.com';
  const token = await getAccessToken();

  const response = await fetch(`${baseUrl}/v2/heloc/inquiries/${inquiryId}`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error(`Figure API error: ${response.status}`);
  }

  return response.json() as Promise<FigureInquiryResponse>;
}
