import type { NextApiRequest, NextApiResponse } from 'next';
import { MetaAdsClient, HELOCAdCreatives, HELOC_TARGETING } from '../../../lib/meta-ads';

interface LaunchResult {
  campaignId: string;
  adSetIds: string[];
  adIds: string[];
  creativeIds: string[];
}

interface ErrorResponse {
  error: string;
}

const metaClient = new MetaAdsClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LaunchResult | ErrorResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const adminToken = req.headers['x-admin-token'];
  if (!process.env.ADMIN_SECRET || adminToken !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const pageId = process.env.META_PAGE_ID;
  const linkUrl = process.env.HELOC_FORM_URL || `${process.env.NEXT_PUBLIC_SITE_URL}/heloc/apply`;

  if (!pageId) {
    return res.status(500).json({ error: 'META_PAGE_ID environment variable is not set' });
  }

  try {
    const campaign = await metaClient.createCampaign(
      `HELOC Leads — ${new Date().toISOString().slice(0, 10)}`,
      'OUTCOME_LEADS',
      10000 // $100/day — adjust as needed
    );

    const adSetIds: string[] = [];
    const creativeIds: string[] = [];
    const adIds: string[] = [];

    for (let i = 0; i < HELOCAdCreatives.length; i++) {
      const creative = HELOCAdCreatives[i];
      const label = `Creative ${i + 1}`;

      const adSet = await metaClient.createAdSet(
        campaign.id,
        `HELOC Ad Set — ${label}`,
        HELOC_TARGETING,
        3400, // ~$34/day per ad set
        2000  // $20 bid
      );
      adSetIds.push(adSet.id);

      const adCreative = await metaClient.createAdCreative(
        pageId,
        `HELOC Creative — ${label}`,
        creative.message,
        creative.headline,
        creative.description,
        linkUrl,
        `${process.env.NEXT_PUBLIC_SITE_URL}/images/heloc-ad-${i + 1}.jpg`
      );
      creativeIds.push(adCreative.id);

      const ad = await metaClient.createAd(
        adSet.id,
        adCreative.id,
        `HELOC Ad — ${label}`
      );
      adIds.push(ad.id);
    }

    return res.status(200).json({
      campaignId: campaign.id,
      adSetIds,
      creativeIds,
      adIds,
    });
  } catch (err) {
    console.error('[launch-campaign] Error:', err);
    return res.status(500).json({
      error: err instanceof Error ? err.message : 'Unknown error launching campaign',
    });
  }
}
