import type { NextApiRequest, NextApiResponse } from 'next';
import { AnthropicClient } from '../../../lib/meghan/anthropic';

/**
 * Lightweight health/config check for MEGHAN.
 *
 * Reports whether the Anthropic API key is detected in this environment WITHOUT
 * ever exposing the key itself — handy for confirming env-var setup on each
 * deployment (local, preview, production).
 *
 *   GET /api/meghan/health
 *   -> { ok, configured, mode, model, checkedAt }
 *
 * `configured: true`  -> a key is present; MEGHAN answers live.
 * `configured: false` -> no key; MEGHAN falls back to demo mode.
 */
interface HealthResponse {
  ok: true;
  configured: boolean;
  mode: 'live' | 'demo';
  model: string;
  checkedAt: string;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<HealthResponse | { error: string }>
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const client = new AnthropicClient();

  // Never cache — the answer depends on server env that can change per deploy.
  res.setHeader('Cache-Control', 'no-store');

  return res.status(200).json({
    ok: true,
    configured: client.isConfigured,
    mode: client.isConfigured ? 'live' : 'demo',
    model: client.modelName,
    checkedAt: new Date().toISOString(),
  });
}
