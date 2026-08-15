import type { NextApiRequest, NextApiResponse } from 'next';
import { softPullClient } from '@/lib/soft-pull';
import { hubspotClient } from '@/lib/hubspot';
import { smsClient, isBusinessHours } from '@/lib/sms';
import { sendLeadNotificationEmail } from '@/lib/email';
import { sendLeadEvent } from '@/lib/meta-capi';
import { sendLeadToRelintex } from '@/lib/relintex';
import { sendLeadToMeera } from '@/lib/meera';

interface LoanSubmission {
  firstName: string;
  lastName: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  unsecuredDebtBalance: string;
  monthlyDebtPayment: string;
  loanRequestAmount: string;
  estimatedFico: string;
  loanPurpose: string;
  email: string;
  phone: string;
  creditInquiryConsent: boolean;
  tcpaConsent: boolean;
  phoneVerified: boolean;
  source: string;
  submittedAt: string;
  consentTimestamp: string;
}

function scoreToRouting(score: number | null, estimatedFico: string): 'qualified' | 'review' | 'alternative' {
  const effectiveScore = score ?? estimateFicoFromRange(estimatedFico);
  if (effectiveScore === null) return 'review';
  if (effectiveScore >= 620) return 'qualified';
  if (effectiveScore >= 550) return 'review';
  return 'alternative';
}

function estimateFicoFromRange(range: string): number | null {
  if (range.includes('750')) return 775;
  if (range.includes('700')) return 725;
  if (range.includes('650')) return 675;
  if (range.includes('600')) return 625;
  if (range.includes('550')) return 575;
  if (range.includes('Below 550')) return 525;
  return null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const data: LoanSubmission = req.body;

  if (!data.firstName || !data.lastName || !data.email || !data.phone) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (!data.creditInquiryConsent) {
    return res.status(400).json({ error: 'Credit inquiry consent is required' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  try {
    const softPullResult = await softPullClient.executeSoftPull({
      firstName: data.firstName,
      lastName: data.lastName,
      address: {
        street: data.streetAddress,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
      },
    });

    const routing = scoreToRouting(softPullResult.ficoScore, data.estimatedFico);

    const hubspotPromise = hubspotClient.createOrUpdateContact({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      address: data.streetAddress,
      city: data.city,
      state: data.state,
      zip: data.zipCode,
      leadSource: `Meta Ads - ${data.source}`,
      softPullScore: softPullResult.ficoScore,
      totalDebtBalance: softPullResult.totalDebtBalance,
      loanRequestAmount: parseAmount(data.loanRequestAmount),
      estimatedFico: data.estimatedFico,
      loanPurpose: data.loanPurpose,
      unsecuredDebtBalance: parseAmount(data.unsecuredDebtBalance),
      monthlyDebtPayment: data.monthlyDebtPayment,
      consentGranted: data.creditInquiryConsent,
      consentTimestamp: data.consentTimestamp,
    }).catch((err) => {
      console.error('[Loans] HubSpot sync failed:', err);
      return { contactId: '' };
    });

    const crmPromise = sendToCRM(data, softPullResult.ficoScore, softPullResult.totalDebtBalance);

    const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress || '';

    const relintexPromise = sendLeadToRelintex({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      address: data.streetAddress,
      city: data.city,
      state: data.state,
      zip: data.zipCode,
      loanPurpose: data.loanPurpose,
      unsecuredDebtBalance: data.unsecuredDebtBalance,
      monthlyDebtPayment: data.monthlyDebtPayment,
      loanRequestAmount: data.loanRequestAmount,
      estimatedFico: data.estimatedFico,
      creditScore: softPullResult.ficoScore,
      totalDebtBalance: softPullResult.totalDebtBalance,
      leadSource: `BrightPath - ${data.source}`,
      tcpaConsent: data.tcpaConsent,
      phoneVerified: data.phoneVerified,
      submittedAt: data.submittedAt,
      ipAddress: clientIp,
      userAgent: req.headers['user-agent'],
    }).catch(err => { console.error('[Loans] Relintex failed:', err); return { ok: false }; });

    const meeraPromise = sendLeadToMeera({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      state: data.state,
      zip: data.zipCode,
      loanPurpose: data.loanPurpose,
      leadSource: `BrightPath - ${data.source}`,
      submittedAt: data.submittedAt,
    }).catch(err => { console.error('[Loans] Meera failed:', err); return { ok: false }; });

    const smsPromise = data.tcpaConsent
      ? smsClient.sendLeadConfirmationSMS(data.phone, data.firstName, isBusinessHours())
      : Promise.resolve({ success: false });

    const capiPromise = sendLeadEvent({
      email: data.email,
      phone: data.phone,
      firstName: data.firstName,
      lastName: data.lastName,
      city: data.city,
      state: data.state,
      zip: data.zipCode,
      clientIpAddress: clientIp,
      clientUserAgent: req.headers['user-agent'],
      fbc: req.cookies._fbc,
      fbp: req.cookies._fbp,
      eventId: (req.body?.metaEventId as string) || undefined,
    }).catch(err => { console.error('[Loans] Meta CAPI failed:', err); return false; });

    const emailPromise = sendLeadNotificationEmail({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      streetAddress: data.streetAddress,
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
      unsecuredDebtBalance: data.unsecuredDebtBalance,
      monthlyDebtPayment: data.monthlyDebtPayment,
      loanRequestAmount: data.loanRequestAmount,
      estimatedFico: data.estimatedFico,
      loanPurpose: data.loanPurpose,
      source: data.source,
      creditScore: softPullResult.ficoScore,
      totalDebtBalance: softPullResult.totalDebtBalance,
      routing,
      submittedAt: data.submittedAt,
      phoneVerified: data.phoneVerified,
    }).catch(err => { console.error('[Loans] Email notification failed:', err); return false; });

    const [hubspotResult] = await Promise.all([hubspotPromise, crmPromise, smsPromise, emailPromise, capiPromise, relintexPromise, meeraPromise]);

    let responseMessage: string;
    let approved: boolean;

    switch (routing) {
      case 'qualified':
        approved = true;
        responseMessage = 'You pre-qualify for a debt consolidation loan! A loan specialist will contact you shortly to finalize your personalized offer.';
        break;
      case 'review':
        approved = true;
        responseMessage = 'Your application is under review. We have several options that may work for your situation. A specialist will reach out to discuss your personalized options.';
        break;
      case 'alternative':
        approved = false;
        responseMessage = 'Based on your profile, we\'d like to explore alternative solutions that may better fit your needs. A specialist will contact you to discuss all available options.';
        break;
    }

    return res.status(200).json({
      success: true,
      approved,
      message: responseMessage,
      creditScore: softPullResult.ficoScore,
      totalDebtBalance: softPullResult.totalDebtBalance,
      offerId: softPullResult.requestId || `BP-${Date.now()}`,
      hubspotContactId: hubspotResult.contactId,
      routing,
    });
  } catch (error) {
    console.error('[Loans] Submission error:', error);
    return res.status(500).json({ error: 'An error occurred processing your application. Please try again.' });
  }
}

function parseAmount(rangeStr: string): number | null {
  if (!rangeStr) return null;
  const match = rangeStr.match(/\$([\d,]+)/);
  if (!match) return null;
  return parseInt(match[1].replace(/,/g, ''), 10);
}

async function sendToCRM(
  data: LoanSubmission,
  creditScore: number | null,
  totalDebt: number | null
): Promise<boolean> {
  const webhookUrl = process.env.CRM_WEBHOOK_URL;
  if (!webhookUrl) return false;

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contact: {
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          phone: data.phone,
          address: data.streetAddress,
          city: data.city,
          state: data.state,
          zip: data.zipCode,
        },
        loan: {
          type: 'debt_consolidation',
          unsecured_debt_balance: data.unsecuredDebtBalance,
          monthly_minimum_payment: data.monthlyDebtPayment,
          loan_request_amount: data.loanRequestAmount,
          estimated_fico: data.estimatedFico,
          purpose: data.loanPurpose,
          credit_score: creditScore,
          total_debt_balance: totalDebt,
        },
        metadata: {
          source: data.source,
          submitted_at: data.submittedAt,
          consent_timestamp: data.consentTimestamp,
          phone_verified: data.phoneVerified,
          is_business_hours: isBusinessHours(),
        },
      }),
    });
    return response.ok;
  } catch (error) {
    console.error('[Loans] CRM webhook failed:', error);
    return false;
  }
}
