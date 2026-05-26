import type { NextApiRequest, NextApiResponse } from 'next'
import { promises as fs } from 'fs'
import path from 'path'
import { FollowUpBossClient } from '@/lib/follow-up-boss'
import { FigureApiClient } from '@/lib/figure-api'
import { TwilioSmsClient } from '@/lib/twilio-sms'

// ─── Types ────────────────────────────────────────────────────────────────────

interface SubmitLeadBody {
  firstName: string
  lastName: string
  dateOfBirth?: string
  email: string
  phone: string
  street: string
  city: string
  state: string
  zip: string
  estimatedHomeValue: number
  currentMortgageBalance: number
  ownershipType?: string
  occupancyType?: string
  propertyForSale?: boolean
  requestedCreditLine: number
  loanPurpose: string
  creditScoreRange: string
  employmentStatus: string
  annualIncome: number
  otherIncome?: number
  consentToTerms: boolean
  // Optional UTM fields
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
}

interface SubmitLeadResponse {
  success: boolean
  leadId?: number
  inquiryId?: string
  message?: string
}

// ─── Validation ───────────────────────────────────────────────────────────────

function validateBody(body: Partial<SubmitLeadBody>): string[] {
  const required: (keyof SubmitLeadBody)[] = [
    'firstName',
    'lastName',
    'email',
    'phone',
    'street',
    'city',
    'state',
    'zip',
    'estimatedHomeValue',
    'currentMortgageBalance',
    'requestedCreditLine',
    'loanPurpose',
    'creditScoreRange',
    'employmentStatus',
    'annualIncome',
    'consentToTerms',
  ]

  const missing = required.filter((field) => {
    const val = body[field]
    if (val === undefined || val === null) return true
    if (typeof val === 'string' && val.trim() === '') return true
    if (field === 'consentToTerms' && val !== true) return true
    return false
  })

  const errors: string[] = []

  if (missing.length > 0) {
    errors.push(`Missing or invalid required fields: ${missing.join(', ')}`)
  }

  if (body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    errors.push('Invalid email address format')
  }

  if (body.estimatedHomeValue !== undefined && body.estimatedHomeValue < 50000) {
    errors.push('estimatedHomeValue must be at least 50000')
  }

  if (body.requestedCreditLine !== undefined) {
    if (body.requestedCreditLine < 10000 || body.requestedCreditLine > 750000) {
      errors.push('requestedCreditLine must be between 10000 and 750000')
    }
  }

  return errors
}

// ─── Lead Backup ──────────────────────────────────────────────────────────────

async function saveLeadBackup(lead: Record<string, unknown>): Promise<void> {
  const backupPath = path.join('/tmp', 'brightpath-heloc-leads.json')
  let existing: unknown[] = []

  try {
    const raw = await fs.readFile(backupPath, 'utf-8')
    existing = JSON.parse(raw) as unknown[]
  } catch {
    // File doesn't exist yet — start fresh
  }

  existing.push({
    ...lead,
    submittedAt: new Date().toISOString(),
  })

  await fs.writeFile(backupPath, JSON.stringify(existing, null, 2), 'utf-8')
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SubmitLeadResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  const body = req.body as Partial<SubmitLeadBody>

  // Validate
  const validationErrors = validateBody(body)
  if (validationErrors.length > 0) {
    return res.status(400).json({
      success: false,
      message: validationErrors.join('; '),
    })
  }

  const lead = body as SubmitLeadBody

  let fubPersonId: number | undefined
  let figureInquiryId: string | undefined
  let fubError: string | undefined

  // ── 1. Follow Up Boss (always runs) ────────────────────────────────────────
  try {
    const fubClient = new FollowUpBossClient()
    const fubPerson = await fubClient.createLead({
      firstName: lead.firstName,
      lastName: lead.lastName,
      email: lead.email,
      phone: lead.phone,
      source: 'BrightPath HELOC Campaign',
      propertyAddress: `${lead.street}, ${lead.city}, ${lead.state} ${lead.zip}`,
      estimatedHomeValue: lead.estimatedHomeValue,
      currentMortgageBalance: lead.currentMortgageBalance,
      requestedCreditLine: lead.requestedCreditLine,
      loanPurpose: lead.loanPurpose,
      creditScoreRange: lead.creditScoreRange,
      employmentStatus: lead.employmentStatus,
      annualIncome: lead.annualIncome,
      utmSource: lead.utmSource,
      utmMedium: lead.utmMedium,
      utmCampaign: lead.utmCampaign,
    })
    fubPersonId = fubPerson.id
    console.log(`[submit-lead] FUB person created: id=${fubPerson.id}`)
  } catch (err) {
    fubError = err instanceof Error ? err.message : 'Unknown FUB error'
    console.error('[submit-lead] FUB createLead failed:', fubError)
  }

  // ── 2. SMS via Twilio (fires immediately after FUB, non-fatal) ────────────
  try {
    const sms = new TwilioSmsClient()
    if (sms.configured) {
      const message = sms.buildLeadMessage(lead.firstName)
      const { sid } = await sms.sendSms(lead.phone, message)
      console.log(`[submit-lead] SMS sent: sid=${sid}`)
    } else {
      console.log('[submit-lead] Twilio not configured — skipping SMS')
    }
  } catch (err) {
    console.error('[submit-lead] SMS failed (non-fatal):', err instanceof Error ? err.message : err)
  }

  // ── 3. Figure API (only if key is configured) ───────────────────────────────
  const figureApiKey = process.env.FIGURE_API_KEY
  const figureConfigured =
    figureApiKey &&
    figureApiKey !== 'your_figure_api_key_here' &&
    figureApiKey.trim() !== ''

  if (figureConfigured) {
    try {
      const figureClient = new FigureApiClient()
      const inquiry = await figureClient.createInquiry({
        firstName: lead.firstName,
        lastName: lead.lastName,
        email: lead.email,
        phone: lead.phone,
        propertyAddress: {
          street: lead.street,
          city: lead.city,
          state: lead.state,
          zip: lead.zip,
        },
        estimatedHomeValue: lead.estimatedHomeValue,
        currentMortgageBalance: lead.currentMortgageBalance,
        requestedCreditLine: lead.requestedCreditLine,
        creditScoreRange: lead.creditScoreRange,
        employmentStatus: lead.employmentStatus,
        annualIncome: lead.annualIncome,
        loanPurpose: lead.loanPurpose,
        consentToTerms: lead.consentToTerms,
        partnerId: process.env.FIGURE_PARTNER_ID || '',
        leadSource: 'BrightPath HELOC Campaign',
      })
      figureInquiryId = inquiry.inquiryId
      console.log(`[submit-lead] Figure inquiry created: id=${inquiry.inquiryId}`)
    } catch (err) {
      const figureError = err instanceof Error ? err.message : 'Unknown Figure error'
      console.error('[submit-lead] Figure createInquiry failed (non-fatal):', figureError)
      // Non-fatal — continue without Figure inquiry ID
    }
  } else {
    console.log('[submit-lead] Figure API key not configured — skipping Figure inquiry')
  }

  // ── 4. Save backup ─────────────────────────────────────────────────────────
  try {
    await saveLeadBackup({
      firstName: lead.firstName,
      lastName: lead.lastName,
      dateOfBirth: lead.dateOfBirth,
      email: lead.email,
      phone: lead.phone,
      propertyAddress: `${lead.street}, ${lead.city}, ${lead.state} ${lead.zip}`,
      ownershipType: lead.ownershipType,
      occupancyType: lead.occupancyType,
      propertyForSale: lead.propertyForSale,
      estimatedHomeValue: lead.estimatedHomeValue,
      currentMortgageBalance: lead.currentMortgageBalance,
      requestedCreditLine: lead.requestedCreditLine,
      loanPurpose: lead.loanPurpose,
      creditScoreRange: lead.creditScoreRange,
      employmentStatus: lead.employmentStatus,
      annualIncome: lead.annualIncome,
      otherIncome: lead.otherIncome,
      fubPersonId,
      figureInquiryId,
      fubError,
    })
  } catch (err) {
    console.error('[submit-lead] Failed to save backup lead:', err)
    // Non-fatal
  }

  // ── 5. Respond ─────────────────────────────────────────────────────────────
  // FUB failure is non-fatal — lead is preserved in backup file
  if (fubError) {
    console.warn('[submit-lead] FUB failed but lead saved to backup:', fubError)
  }

  return res.status(200).json({
    success: true,
    leadId: fubPersonId,
    inquiryId: figureInquiryId,
  })
}
