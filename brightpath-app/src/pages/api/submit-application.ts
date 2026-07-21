import type { NextApiRequest, NextApiResponse } from 'next'
import { promises as fs } from 'fs'
import path from 'path'
import {
  sendApplicationNotification,
  ApplicationEmailData,
  ApplicantData,
  BusinessData,
} from '@/lib/email'

interface RawApplicant {
  name?: string
  dob?: string
  ssn?: string
  street?: string
  city?: string
  state?: string
  zip?: string
  email?: string
  phone?: string
  employer?: string
  title?: string
  empYears?: string
  empMonths?: string
  income?: string
  fico?: string
  sigData?: string
}

interface SubmitApplicationBody {
  refId?: string
  appDate?: string
  loanType?: string
  hasCoApp?: boolean
  applicant?: RawApplicant
  coApplicant?: RawApplicant
  business?: BusinessData
}

interface SubmitApplicationResponse {
  success: boolean
  message?: string
}

const LOAN_LABELS: Record<string, string> = {
  personal: 'Personal Loan',
  'biz-capital': 'Business Working Capital',
  'biz-equip': 'Business Equipment Financing',
  revenue: 'Revenue Based Financing',
}

// Only the last 4 of the SSN ever leave this handler (email/backup).
function toApplicant(raw: RawApplicant): ApplicantData {
  const ssnDigits = (raw.ssn || '').replace(/\D/g, '')
  return {
    name: raw.name || '',
    dob: raw.dob || '',
    ssnLast4: ssnDigits.slice(-4),
    street: raw.street || '',
    city: raw.city || '',
    state: raw.state || '',
    zip: raw.zip || '',
    email: raw.email || '',
    phone: raw.phone || '',
    employer: raw.employer || '',
    title: raw.title || '',
    empYears: raw.empYears || '',
    empMonths: raw.empMonths || '',
    income: raw.income || '',
    fico: raw.fico || '',
    sigData: raw.sigData,
  }
}

async function saveApplicationBackup(app: Record<string, unknown>): Promise<void> {
  const backupPath = path.join('/tmp', 'brightpath-applications.json')
  let existing: unknown[] = []
  try {
    const raw = await fs.readFile(backupPath, 'utf-8')
    existing = JSON.parse(raw) as unknown[]
  } catch {
    // File doesn't exist yet — start fresh
  }
  existing.push({ ...app, submittedAt: new Date().toISOString() })
  await fs.writeFile(backupPath, JSON.stringify(existing, null, 2), 'utf-8')
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SubmitApplicationResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  const body = req.body as SubmitApplicationBody

  if (!body.applicant?.name || !body.applicant?.email || !body.applicant?.phone || !body.loanType) {
    return res.status(400).json({ success: false, message: 'Missing required fields' })
  }

  const emailData: ApplicationEmailData = {
    refId: body.refId || '',
    appDate: body.appDate || new Date().toISOString().slice(0, 10),
    loanType: LOAN_LABELS[body.loanType] || body.loanType,
    applicant: toApplicant(body.applicant),
    coApplicant: body.hasCoApp && body.coApplicant ? toApplicant(body.coApplicant) : undefined,
    business: body.business?.name ? body.business : undefined,
  }

  try {
    const { applicant, coApplicant, business, ...rest } = emailData
    await saveApplicationBackup({
      ...rest,
      applicant: { ...applicant, sigData: undefined },
      coApplicant: coApplicant ? { ...coApplicant, sigData: undefined } : undefined,
      business,
    })
  } catch (err) {
    console.error('[submit-application] Failed to save backup:', err)
    // Non-fatal
  }

  try {
    await sendApplicationNotification(emailData)
  } catch (err) {
    console.error(
      '[submit-application] Email notification failed (non-fatal):',
      err instanceof Error ? err.message : err
    )
  }

  return res.status(200).json({ success: true })
}
