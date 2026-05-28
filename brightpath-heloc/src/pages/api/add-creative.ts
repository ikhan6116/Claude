import type { NextApiRequest, NextApiResponse } from 'next'
import { promises as fs } from 'fs'
import path from 'path'
import { MetaAdsClient } from '@/lib/meta-ads'

interface AddCreativeBody {
  adminSecret: string
  adSetId: string
  filename: string
  adName: string
}

interface AddCreativeResponse {
  success: boolean
  adCreativeId?: string
  adId?: string
  message?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AddCreativeResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  const { adminSecret, adSetId, filename, adName } = req.body as AddCreativeBody

  if (!process.env.ADMIN_SECRET || adminSecret !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ success: false, message: 'Unauthorized' })
  }

  if (!adSetId || !filename || !adName) {
    return res.status(400).json({ success: false, message: 'adSetId, filename, and adName are required' })
  }

  // Prevent path traversal
  const safeName = path.basename(filename)
  const imagePath = path.join(process.cwd(), 'public', 'ads', safeName)

  let imageBase64: string
  try {
    const imageBuffer = await fs.readFile(imagePath)
    imageBase64 = imageBuffer.toString('base64')
  } catch {
    return res.status(404).json({ success: false, message: `Image not found: ${safeName}` })
  }

  try {
    const client = new MetaAdsClient()

    const { adCreativeId, adId } = await client.addCreativeToAdSet(
      adSetId,
      imageBase64,
      adName,
      {
        name: `Creative — ${adName}`,
        headline: 'Fund Your Business with Home Equity',
        body: 'Access up to $750K for your business at rates from 6.75% APR. No appraisal. No title fees. Funds in as few as 5 days. Check your rate with no credit impact.',
        description: 'Business HELOC powered by Figure. NMLS #2670114.',
        callToAction: 'LEARN_MORE',
        linkUrl: 'https://heloc.brightpath-fin.com/apply',
      }
    )

    console.log(`[add-creative] Ad created: adCreativeId=${adCreativeId} adId=${adId}`)
    return res.status(200).json({ success: true, adCreativeId, adId })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[add-creative] Failed:', message)
    return res.status(500).json({ success: false, message })
  }
}
