import type { NextApiRequest, NextApiResponse } from 'next';
import { FigureApiClient, FigureApiError, type OfferResponse } from '../../../lib/figure-api';

interface PendingResponse {
  status: 'pending';
  inquiryId: string;
}

interface ErrorResponse {
  success: false;
  error: string;
}

const figureClient = new FigureApiClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<OfferResponse | PendingResponse | ErrorResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { inquiryId } = req.query;

  if (!inquiryId || typeof inquiryId !== 'string') {
    return res.status(400).json({ success: false, error: 'inquiryId query parameter is required' });
  }

  try {
    const statusResult = await figureClient.getInquiryStatus(inquiryId);

    if (statusResult.status === 'pending' || statusResult.status === 'processing') {
      return res.status(202).json({ status: 'pending', inquiryId });
    }

    if (statusResult.offer) {
      return res.status(200).json(statusResult.offer);
    }

    const offer = await figureClient.getOffer(inquiryId);
    return res.status(200).json(offer);
  } catch (err) {
    if (err instanceof FigureApiError) {
      if (err.statusCode === 404) {
        return res.status(404).json({ success: false, error: 'Inquiry not found' });
      }
      if (err.statusCode === 422) {
        return res.status(202).json({ status: 'pending', inquiryId });
      }
      return res.status(502).json({ success: false, error: err.message });
    }
    console.error('[offer] Unexpected error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
