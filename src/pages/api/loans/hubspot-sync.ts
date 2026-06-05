import type { NextApiRequest, NextApiResponse } from 'next';
import { hubspotClient } from '@/lib/hubspot';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const adminSecret = req.headers['x-admin-token'];
  if (adminSecret !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const {
    firstName,
    lastName,
    email,
    phone,
    address,
    city,
    state,
    zip,
    creditScore,
    totalDebtBalance,
    loanRequestAmount,
    estimatedFico,
    loanPurpose,
    leadSource,
  } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const result = await hubspotClient.createOrUpdateContact({
      firstName: firstName || '',
      lastName: lastName || '',
      email,
      phone: phone || '',
      address,
      city,
      state,
      zip,
      leadSource,
      softPullScore: creditScore,
      totalDebtBalance,
      loanRequestAmount,
      estimatedFico,
      loanPurpose,
    });

    return res.status(200).json({
      success: true,
      contactId: result.contactId,
    });
  } catch (error) {
    console.error('[HubSpot Sync] Error:', error);
    return res.status(500).json({ error: 'Failed to sync with HubSpot' });
  }
}
