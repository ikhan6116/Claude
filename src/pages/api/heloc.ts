import type { NextApiRequest, NextApiResponse } from 'next';
import { createHELOCInquiry, type FigureInquiryRequest } from '@/lib/figure';

interface HELOCSubmission {
  // property
  street: string;
  unit?: string;
  city: string;
  state: string;
  zip: string;
  propertyType: string;
  occupancyType: string;
  estimatedValue: string;
  existingMortgageBalance: string;
  // borrower
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  ssnLastFour: string;
  // financial
  annualIncome: string;
  employmentStatus: string;
  creditScoreRange: string;
  requestedLineAmount: string;
  // contact
  email: string;
  phone: string;
  // meta
  source: string;
  consentTimestamp: string;
}

function validateSubmission(body: Partial<HELOCSubmission>): string | null {
  const required: (keyof HELOCSubmission)[] = [
    'street', 'city', 'state', 'zip',
    'propertyType', 'occupancyType',
    'estimatedValue', 'existingMortgageBalance',
    'firstName', 'lastName', 'dateOfBirth', 'ssnLastFour',
    'annualIncome', 'employmentStatus', 'creditScoreRange', 'requestedLineAmount',
    'email', 'phone', 'consentTimestamp',
  ];

  for (const field of required) {
    if (!body[field]) return `Missing required field: ${field}`;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email!)) {
    return 'Invalid email format';
  }

  if (!/^\d{4}$/.test(body.ssnLastFour!)) {
    return 'ssnLastFour must be exactly 4 digits';
  }

  if (!/^\d{5}(-\d{4})?$/.test(body.zip!)) {
    return 'Invalid ZIP code';
  }

  return null;
}

async function notifyCRM(submission: HELOCSubmission) {
  const url = process.env.CRM_WEBHOOK_URL;
  if (!url) return;

  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contact: {
        first_name: submission.firstName,
        last_name: submission.lastName,
        email: submission.email,
        phone: submission.phone,
        state: submission.state,
      },
      deal: {
        name: `HELOC Lead - ${submission.firstName} ${submission.lastName}`,
        product: 'HELOC',
        requested_line_amount: submission.requestedLineAmount,
        estimated_home_value: submission.estimatedValue,
        existing_mortgage: submission.existingMortgageBalance,
        credit_score_range: submission.creditScoreRange,
        source: submission.source,
      },
      metadata: {
        submitted_at: submission.consentTimestamp,
        property_address: `${submission.street}, ${submission.city}, ${submission.state} ${submission.zip}`,
      },
    }),
  }).catch((err) => console.error('CRM webhook error:', err));
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body as Partial<HELOCSubmission>;

  const validationError = validateSubmission(body);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const submission = body as HELOCSubmission;

  // Always notify CRM regardless of Figure API outcome
  notifyCRM(submission).catch(() => {});

  // If Figure credentials are configured, call their API
  const figureEnabled = !!(process.env.FIGURE_CLIENT_ID && process.env.FIGURE_CLIENT_SECRET);

  if (figureEnabled) {
    try {
      const inquiry: FigureInquiryRequest = {
        borrower: {
          firstName: submission.firstName,
          lastName: submission.lastName,
          dateOfBirth: submission.dateOfBirth,
          ssnLastFour: submission.ssnLastFour,
          annualIncomeUsd: Math.round(parseFloat(submission.annualIncome)),
          employmentStatus: submission.employmentStatus as FigureInquiryRequest['borrower']['employmentStatus'],
          creditScoreRange: submission.creditScoreRange,
        },
        property: {
          address: {
            street: submission.street,
            unit: submission.unit,
            city: submission.city,
            state: submission.state,
            zip: submission.zip,
          },
          estimatedValueUsd: Math.round(parseFloat(submission.estimatedValue)),
          existingMortgageBalanceUsd: Math.round(parseFloat(submission.existingMortgageBalance)),
          propertyType: submission.propertyType as FigureInquiryRequest['property']['propertyType'],
          occupancyType: submission.occupancyType as FigureInquiryRequest['property']['occupancyType'],
        },
        requestedLineAmountUsd: Math.round(parseFloat(submission.requestedLineAmount)),
        contactEmail: submission.email,
        contactPhone: submission.phone,
        partnerReferenceId: `lead_${Date.now()}`,
        consentTimestamp: submission.consentTimestamp,
      };

      const figureResponse = await createHELOCInquiry(inquiry);

      return res.status(200).json({
        success: true,
        status: figureResponse.status,
        inquiryId: figureResponse.inquiryId,
        offers: figureResponse.offers,
        applicationUrl: figureResponse.applicationUrl,
        nextSteps: figureResponse.nextSteps,
      });
    } catch (err: unknown) {
      // Log the error but don't expose Figure internals to the client
      console.error('Figure API error:', err);
      // Fall through to "pending" response below
    }
  }

  // Fallback: lead captured in CRM, specialist will follow up
  return res.status(200).json({
    success: true,
    status: 'pending',
    offers: [],
    nextSteps: 'A HELOC specialist will contact you within 1 business day with personalized offer details.',
  });
}
