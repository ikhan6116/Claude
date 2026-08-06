import type { NextApiRequest, NextApiResponse } from 'next'
import { promises as fs } from 'fs'
import path from 'path'
import {
  sendApplicationNotification,
  ApplicationEmailData,
  QuestionnaireSection,
  QAItem,
  EmailAttachment,
} from '@/lib/email'

interface RawAttachment {
  filename?: string
  // data: URI or raw base64
  content?: string
}

interface SubmitBody {
  refId?: string
  appDate?: string
  funnel?: string
  funnelLabel?: string
  contactName?: string
  contactEmail?: string
  contactPhone?: string
  sections?: QuestionnaireSection[]
  items?: QAItem[]
  attachment?: RawAttachment
}

interface SubmitResponse {
  success: boolean
  refId?: string
  message?: string
}

// Cap attachment payloads so a huge upload can't blow past the serverless
// request limit. ~6MB of base64 ≈ ~4.5MB binary.
const MAX_ATTACHMENT_BASE64 = 6 * 1024 * 1024

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '8mb',
    },
  },
}

function toBase64(content: string): string {
  const idx = content.indexOf('base64,')
  return idx >= 0 ? content.slice(idx + 'base64,'.length) : content
}

function normalizeSections(body: SubmitBody): QuestionnaireSection[] {
  if (Array.isArray(body.sections) && body.sections.length) {
    return body.sections
      .filter((s) => s && Array.isArray(s.items))
      .map((s) => ({
        heading: String(s.heading || 'Application Details'),
        items: s.items
          .filter((it) => it && (it.label || it.value))
          .map((it) => ({ label: String(it.label || ''), value: String(it.value ?? '') })),
      }))
      .filter((s) => s.items.length)
  }
  if (Array.isArray(body.items) && body.items.length) {
    return [
      {
        heading: 'Application Details',
        items: body.items.map((it) => ({
          label: String(it.label || ''),
          value: String(it.value ?? ''),
        })),
      },
    ]
  }
  return []
}

async function saveBackup(record: Record<string, unknown>): Promise<void> {
  const backupPath = path.join('/tmp', 'mtgikhan-applications.json')
  let existing: unknown[] = []
  try {
    const raw = await fs.readFile(backupPath, 'utf-8')
    existing = JSON.parse(raw) as unknown[]
  } catch {
    // File doesn't exist yet — start fresh
  }
  existing.push({ ...record, submittedAt: new Date().toISOString() })
  await fs.writeFile(backupPath, JSON.stringify(existing, null, 2), 'utf-8')
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<SubmitResponse>) {
  // Allow the form to be embedded/hosted on another origin (e.g. the main site)
  // and still POST here. Same-origin requests are unaffected.
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(204).end()
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  try {
    return await handleSubmit(req, res)
  } catch (err) {
    // Never let an unexpected error produce a raw 500 HTML page — the client
    // only understands JSON. A captured lead should still count as success.
    console.error('[submit] Unexpected error:', err instanceof Error ? err.stack : err)
    return res.status(200).json({ success: true })
  }
}

async function handleSubmit(req: NextApiRequest, res: NextApiResponse<SubmitResponse>) {
  let raw: unknown = req.body || {}
  if (typeof raw === 'string') {
    try {
      raw = JSON.parse(raw)
    } catch {
      raw = {}
    }
  }
  const body = raw as SubmitBody

  const contactEmail = (body.contactEmail || '').trim()
  const contactPhone = (body.contactPhone || '').trim()
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

  const sections = normalizeSections(body)

  if (!body.funnel || sections.length === 0) {
    return res.status(400).json({ success: false, message: 'Missing application details' })
  }
  if (!emailRe.test(contactEmail) || contactPhone.replace(/\D/g, '').length < 10) {
    return res.status(400).json({ success: false, message: 'Valid email and phone are required' })
  }

  const refId =
    body.refId ||
    'MTG-' +
      new Date().toISOString().slice(2, 10).replace(/-/g, '') +
      '-' +
      String(Math.floor(1000 + Math.random() * 9000))

  const attachments: EmailAttachment[] = []
  if (body.attachment && body.attachment.content && body.attachment.filename) {
    const base64 = toBase64(body.attachment.content)
    if (base64.length <= MAX_ATTACHMENT_BASE64) {
      attachments.push({ filename: body.attachment.filename, content: base64 })
    } else {
      console.warn('[submit] Attachment exceeds size cap — sending without it')
    }
  }

  const emailData: ApplicationEmailData = {
    refId,
    appDate: body.appDate || new Date().toISOString().slice(0, 10),
    funnelLabel: body.funnelLabel || body.funnel,
    contactName: (body.contactName || '').trim(),
    contactEmail,
    contactPhone,
    sections,
    attachments: attachments.length ? attachments : undefined,
  }

  try {
    await saveBackup({
      refId,
      funnel: body.funnel,
      funnelLabel: emailData.funnelLabel,
      contactName: emailData.contactName,
      contactEmail: emailData.contactEmail,
      contactPhone: emailData.contactPhone,
      sections,
      hasAttachment: attachments.length > 0,
    })
  } catch (err) {
    console.error('[submit] Failed to save backup (non-fatal):', err)
  }

  try {
    await sendApplicationNotification(emailData)
  } catch (err) {
    console.error(
      '[submit] Email notification failed (non-fatal):',
      err instanceof Error ? err.message : err
    )
  }

  return res.status(200).json({ success: true, refId })
}
