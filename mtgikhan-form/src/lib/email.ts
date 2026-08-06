/**
 * Resend email client for the form.mtgikhan.com application intake.
 *
 * Notifications are sent to the BrightPath team addresses. Set RESEND_API_KEY
 * (and optionally RESEND_FROM) in this project's Vercel env vars. The "from"
 * domain must be verified in the Resend account.
 */

const RESEND_API = 'https://api.resend.com/emails'

const NOTIFY_ADDRESSES = [
  'team@brightpath-fin.com',
  'contact@brightpathfinance.com',
]

const DEFAULT_FROM = 'BrightPath Applications <leads@brightpath-fin.com>'

export interface QAItem {
  label: string
  value: string
}

export interface QuestionnaireSection {
  heading: string
  items: QAItem[]
}

export interface EmailAttachment {
  filename: string
  /** Raw base64 (no data: prefix) */
  content: string
}

export interface ApplicationEmailData {
  refId: string
  appDate: string
  /** Human-readable funnel name, e.g. "Mortgage — Purchase" */
  funnelLabel: string
  contactName: string
  contactEmail: string
  contactPhone: string
  sections: QuestionnaireSection[]
  attachments?: EmailAttachment[]
}

function esc(v: string): string {
  return String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function sectionHtml(section: QuestionnaireSection): string {
  const rows = section.items
    .map(
      ({ label, value }) => `
      <tr>
        <td style="padding:9px 14px;background:#f6f8fc;font-weight:600;color:#33466f;white-space:normal;border-bottom:1px solid #e5eaf3;vertical-align:top;width:46%;">${esc(
        label
      )}</td>
        <td style="padding:9px 14px;color:#111827;border-bottom:1px solid #e5eaf3;vertical-align:top;">${esc(
        value
      ) || '—'}</td>
      </tr>`
    )
    .join('')

  return `
  <h3 style="margin:22px 0 10px;font-size:13px;text-transform:uppercase;letter-spacing:.08em;color:#2b6fb3;">${esc(
    section.heading
  )}</h3>
  <table style="width:100%;border-collapse:collapse;border-radius:8px;overflow:hidden;border:1px solid #e5eaf3;">
    ${rows}
  </table>`
}

function buildHtml(app: ApplicationEmailData): string {
  const stamp = new Date().toLocaleString('en-US', {
    timeZone: 'America/Denver',
    dateStyle: 'full',
    timeStyle: 'short',
  })

  const body = app.sections.map(sectionHtml).join('')

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#eef2f8;margin:0;padding:24px;">
  <div style="max-width:640px;margin:0 auto;background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.1);">
    <div style="background:#0b1b45;padding:26px 30px;">
      <h1 style="margin:0;color:#fff;font-size:20px;font-weight:700;">New Application Inquiry</h1>
      <p style="margin:6px 0 0;color:#8fd0f5;font-size:13px;">${esc(app.funnelLabel)} · ${stamp} MT</p>
    </div>
    <div style="padding:24px 30px;">
      <h2 style="margin:0 0 4px;font-size:17px;color:#0b1b45;">${esc(app.contactName) || 'New lead'}</h2>
      <p style="margin:0 0 6px;font-size:14px;color:#33466f;">
        <a href="mailto:${esc(app.contactEmail)}" style="color:#2b6fb3;text-decoration:none;">${esc(
    app.contactEmail
  ) || '—'}</a>
        &nbsp;·&nbsp;
        <a href="tel:${esc(app.contactPhone)}" style="color:#2b6fb3;text-decoration:none;">${esc(
    app.contactPhone
  ) || '—'}</a>
      </p>
      <p style="margin:0 0 4px;font-size:12px;color:#6f81a8;">Reference ${esc(app.refId)} · ${esc(
    app.appDate
  )}</p>
      ${body}
    </div>
    <div style="padding:16px 30px;background:#f6f8fc;border-top:1px solid #e5eaf3;">
      <p style="margin:0;font-size:12px;color:#6f81a8;">Submitted via form.mtgikhan.com · This is an inquiry, not a credit decision.</p>
    </div>
  </div>
</body>
</html>`
}

function buildText(app: ApplicationEmailData): string {
  const lines: string[] = []
  lines.push(`New Application Inquiry — ${app.funnelLabel}`)
  lines.push(`Reference: ${app.refId}`)
  lines.push(`Date: ${app.appDate}`)
  lines.push('')
  lines.push(`Name:  ${app.contactName || '—'}`)
  lines.push(`Email: ${app.contactEmail || '—'}`)
  lines.push(`Phone: ${app.contactPhone || '—'}`)
  for (const section of app.sections) {
    lines.push('')
    lines.push(`== ${section.heading.toUpperCase()} ==`)
    for (const { label, value } of section.items) {
      lines.push(`${label}: ${value || '—'}`)
    }
  }
  lines.push('')
  lines.push('Submitted via form.mtgikhan.com')
  return lines.join('\n')
}

export async function sendApplicationNotification(app: ApplicationEmailData): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey || apiKey.trim() === '') {
    console.warn('[Email] RESEND_API_KEY not set — skipping application email notification')
    return
  }

  const from = process.env.RESEND_FROM || DEFAULT_FROM
  const subject = `New ${app.funnelLabel} Inquiry — ${app.contactName || 'Lead'} (${app.refId})`
  const html = buildHtml(app)
  const text = buildText(app)
  const attachments = app.attachments && app.attachments.length ? app.attachments : undefined

  // Send a single email with both recipients on the "to" line so the team
  // sees each other. A hard timeout guarantees a slow/blocked Resend call can
  // never hang the serverless function past the platform limit.
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 8000)
  try {
    const res = await fetch(RESEND_API, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: NOTIFY_ADDRESSES,
        subject,
        html,
        text,
        ...(attachments ? { attachments } : {}),
      }),
      signal: controller.signal,
    })
    const json = (await res.json().catch(() => ({}))) as Record<string, unknown>
    if (!res.ok) {
      console.error('[Email] Failed to send application notification:', res.status, json)
    } else {
      console.log(`[Email] Application notification sent (id=${json.id})`)
    }
  } catch (err) {
    console.error('[Email] Error sending application notification:', err instanceof Error ? err.message : err)
  } finally {
    clearTimeout(timeout)
  }
}
