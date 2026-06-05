import type { NextApiRequest, NextApiResponse } from 'next';
import { MetaAdsClient } from '@/lib/meta-ads';
import type { Targeting } from '@/lib/meta-ads';

const DEBT_CONSOLIDATION_TARGETING: Targeting = {
  age_min: 25,
  age_max: 65,
  geo_locations: {
    countries: ['US'],
  },
  interests: [
    { id: '6003145721886', name: 'Personal finance' },
    { id: '6003349442386', name: 'Debt consolidation' },
    { id: '6003107405583', name: 'Credit card' },
    { id: '6003020834693', name: 'Loan' },
    { id: '6002925966230', name: 'Refinancing' },
  ],
  behaviors: [
    { id: '6002714895372', name: 'Engaged shoppers' },
  ],
};

const LOAN_AD_CREATIVES = [
  {
    name: 'Debt Consolidation - Rate Focus',
    message:
      "Tired of paying 20%+ interest on credit cards? BrightPath Finance offers debt consolidation loans starting at just 5.99% APR. Combine all your payments into one simple monthly bill and save hundreds each month. Check your rate in minutes — no impact to your credit score.",
    headline: 'Consolidate Debt — Rates From 5.99% APR',
    description:
      'One payment. Lower rates. No credit impact to check your rate. See how much you could save today.',
  },
  {
    name: 'Debt Consolidation - Payment Relief',
    message:
      "Juggling 5, 6, or 7 different monthly payments? You're not alone — and there's a better way. BrightPath Finance helps you consolidate your debts into ONE affordable monthly payment. Our customers save an average of $312/month. See what you could save in under 5 minutes.",
    headline: 'One Payment. Lower Rate. Less Stress.',
    description:
      'Stop juggling multiple bills. Consolidate your debt into one simple payment and save $312/month on average.',
  },
  {
    name: 'Debt Consolidation - Freedom Focus',
    message:
      "What would it feel like to be completely debt-free? With a BrightPath Finance consolidation loan, you get a clear payoff date, a lower rate, and one predictable monthly payment. No surprises, no hidden fees. The first step takes less than 5 minutes — and won't affect your credit.",
    headline: 'Your Path to Becoming Debt-Free Starts Here',
    description:
      'Clear payoff date. Lower rate. One payment. Check your personalized rate with no credit impact.',
  },
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const adminSecret = req.headers['x-admin-token'];
  if (adminSecret !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const {
    dailyBudgetCents = 5000,
    campaignName = 'BrightPath Debt Consolidation Loans',
  } = req.body;

  const pageId = process.env.META_PAGE_ID;
  const formUrl = process.env.LOAN_FORM_URL || `${process.env.NEXT_PUBLIC_SITE_URL}/loans`;

  if (!pageId) {
    return res.status(400).json({ error: 'META_PAGE_ID not configured' });
  }

  try {
    const client = new MetaAdsClient();

    const campaign = await client.createCampaign(
      campaignName,
      'OUTCOME_LEADS',
      dailyBudgetCents * 3
    );

    const adSetResults = [];
    const creativeResults = [];
    const adResults = [];

    for (let i = 0; i < LOAN_AD_CREATIVES.length; i++) {
      const creative = LOAN_AD_CREATIVES[i];

      const adSet = await client.createAdSet(
        campaign.id,
        `${creative.name} - Ad Set`,
        DEBT_CONSOLIDATION_TARGETING,
        dailyBudgetCents,
        200
      );
      adSetResults.push(adSet);

      const adCreative = await client.createAdCreative(
        pageId,
        creative.name,
        creative.message,
        creative.headline,
        creative.description,
        formUrl,
        `${process.env.NEXT_PUBLIC_SITE_URL}/images/debt-consolidation-ad-${i + 1}.jpg`
      );
      creativeResults.push(adCreative);

      const ad = await client.createAd(
        adSet.id,
        adCreative.id,
        `${creative.name} - Ad`
      );
      adResults.push(ad);
    }

    return res.status(200).json({
      success: true,
      campaign: {
        id: campaign.id,
        name: campaignName,
        status: 'PAUSED',
      },
      adSets: adSetResults.map((a, i) => ({
        id: a.id,
        name: LOAN_AD_CREATIVES[i].name,
      })),
      creatives: creativeResults.map((c, i) => ({
        id: c.id,
        name: LOAN_AD_CREATIVES[i].name,
      })),
      ads: adResults.map((a, i) => ({
        id: a.id,
        name: LOAN_AD_CREATIVES[i].name,
      })),
      note: 'Campaign created in PAUSED status. Review ads for compliance before activating. Ads must comply with Meta Special Ad Category: CREDIT requirements.',
    });
  } catch (error) {
    console.error('[LaunchLoanCampaign] Error:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to create campaign',
    });
  }
}
