import type { NextApiRequest, NextApiResponse } from 'next'
import { MetaAdsClient, LaunchResult } from '@/lib/meta-ads'

interface LaunchCampaignResponse {
  success: boolean
  result?: LaunchResult
  message?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LaunchCampaignResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  const { adminSecret } = req.body as { adminSecret?: string }
  if (!process.env.ADMIN_SECRET || adminSecret !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ success: false, message: 'Unauthorized' })
  }

  try {
    const client = new MetaAdsClient()

    const result = await client.launchHELOCCampaign(
      {
        name: 'BrightPath — Business HELOC — Traffic',
      },
      {
        name: 'BrightPath HELOC — US',
        dailyBudgetCents: 2000,  // $20/day
      },
      {
        name: 'BrightPath HELOC — Check My Rate',
        headline: 'Fund Your Business with Home Equity',
        body: 'Access up to $750K for your business at rates from 6.75% APR. No appraisal. No title fees. Funds in as few as 5 days. Check your rate with no credit impact.',
        description: 'Business HELOC powered by Figure. NMLS #2670114.',
        callToAction: 'LEARN_MORE',
        linkUrl: 'https://heloc.brightpath-fin.com/apply',
      }
    )

    console.log('[launch-campaign] Campaign created (PAUSED):', result)

    return res.status(200).json({ success: true, result })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[launch-campaign] Failed:', message)
    return res.status(500).json({ success: false, message })
  }
}
