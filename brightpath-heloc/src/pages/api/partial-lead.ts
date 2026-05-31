import type { NextApiRequest, NextApiResponse } from 'next'
import { sendAbandonedLeadNotification } from '@/lib/email'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false })
  }

  const body = req.body as Record<string, unknown>

  if (!body.email || typeof body.email !== 'string') {
    return res.status(400).json({ success: false, message: 'email required' })
  }

  try {
    await sendAbandonedLeadNotification({
      email: body.email as string,
      firstName: body.firstName as string | undefined,
      lastName: body.lastName as string | undefined,
      phone: body.phone as string | undefined,
      street: body.street as string | undefined,
      city: body.city as string | undefined,
      state: body.state as string | undefined,
      zip: body.zip as string | undefined,
      estimatedHomeValue: body.estimatedHomeValue as string | undefined,
      currentMortgageBalance: body.currentMortgageBalance as string | undefined,
      requestedCreditLine: body.requestedCreditLine as number | undefined,
      loanPurpose: body.loanPurpose as string | undefined,
      creditScoreRange: body.creditScoreRange as string | undefined,
      employmentStatus: body.employmentStatus as string | undefined,
      annualIncome: body.annualIncome as string | undefined,
      stepReached: body.stepReached as number | undefined,
    })
  } catch (err) {
    console.error('[partial-lead] Failed:', err instanceof Error ? err.message : err)
  }

  return res.status(200).json({ success: true })
}
