import type { NextApiRequest, NextApiResponse } from 'next';
import { launchHELOCCampaign } from '@/lib/metaAds';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Simple API key guard — set META_ADS_API_SECRET in your env
  const secret = process.env.META_ADS_API_SECRET;
  if (secret && req.headers['x-api-key'] !== secret) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const {
    dailyBudgetUsd = 50,
    targetStates,
    launchActive = false,
  } = req.body as {
    dailyBudgetUsd?: number;
    targetStates?: string[];
    launchActive?: boolean;
  };

  if (typeof dailyBudgetUsd !== 'number' || dailyBudgetUsd < 1) {
    return res.status(400).json({ error: 'dailyBudgetUsd must be a positive number' });
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://freedomdebtsolutions.com';

  try {
    const result = await launchHELOCCampaign({
      siteUrl,
      dailyBudgetUsd,
      targetStates,
      launchActive,
    });

    return res.status(200).json({
      success: true,
      message: launchActive
        ? 'HELOC campaign launched and set to ACTIVE.'
        : 'HELOC campaign created in PAUSED state. Review in Meta Ads Manager before activating.',
      ...result,
    });
  } catch (err: unknown) {
    console.error('Meta Ads API error:', err);
    return res.status(500).json({
      error: 'Failed to create Meta campaign',
      details: err instanceof Error ? err.message : String(err),
    });
  }
}
