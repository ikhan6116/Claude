import type { NextApiRequest, NextApiResponse } from 'next'
import { FigureApiClient } from '@/lib/figure-api'
import type { InquiryStatusResponse } from '@/lib/figure-api'

interface OfferErrorResponse {
  success: false
  message: string
}

type OfferApiResponse = InquiryStatusResponse | { status: 'pending' } | OfferErrorResponse

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<OfferApiResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  const { inquiryId } = req.query

  if (!inquiryId || typeof inquiryId !== 'string' || !inquiryId.trim()) {
    return res.status(400).json({ success: false, message: 'inquiryId query parameter is required' })
  }

  // Check Figure API is configured
  const figureApiKey = process.env.FIGURE_API_KEY
  if (!figureApiKey || figureApiKey === 'your_figure_api_key_here') {
    return res.status(503).json({ success: false, message: 'Figure API is not configured' })
  }

  try {
    const figureClient = new FigureApiClient()
    const status = await figureClient.getInquiryStatus(inquiryId)

    if (status.status === 'pending' || status.status === 'processing') {
      return res.status(200).json({ status: 'pending' })
    }

    return res.status(200).json(status)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch offer status'
    console.error('[heloc-offer] getInquiryStatus error:', message)
    return res.status(500).json({ success: false, message })
  }
}
