import type { NextApiRequest, NextApiResponse } from 'next';
import { probeRelintexAuth } from '@/lib/relintex';

/**
 * Diagnostic — tries every common Yii REST auth placement against the live
 * Relintex endpoint and reports which one authenticates (any non-401 status).
 * Uses one shared, fixed test identity so it won't pile up test leads.
 *
 * Read the results: the method whose `status` is NOT 401 is the correct auth
 * mechanism. Remove this endpoint once auth is confirmed.
 */
export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  if (!process.env.RELINTEX_LEAD_POST_URL || !process.env.RELINTEX_API_KEY) {
    return res.status(200).json({ error: 'Set RELINTEX_LEAD_POST_URL and RELINTEX_API_KEY first' });
  }

  const results = await probeRelintexAuth();
  const winner = results.find(r => r.status !== null && r.status !== 401);

  return res.status(200).json({
    winner: winner ? winner.method : null,
    hint: winner
      ? `Use "${winner.method}". Tell Claude this method and it will lock it in.`
      : 'Every method returned 401 — the key may be wrong, or auth uses a mechanism not tried here. Send Claude the full results.',
    results,
  });
}
