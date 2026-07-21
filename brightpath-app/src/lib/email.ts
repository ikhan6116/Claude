/**
 * Resend email client for BrightPath credit application notifications.
 * Uses the same Resend account as brightpath-heloc — set RESEND_API_KEY
 * in this project's Vercel env vars.
 */

const RESEND_API = 'https://api.resend.com/emails'

const NOTIFY_ADDRESSES = [
  'team@brightpath-fin.com',
  'contact@brightpathfinance.com',
]

export interface ApplicantData {
  name: string
  dob: string
  ssnLast4: string
  street: string
  city: string
  state: string
  zip: string
  email: string
  phone: string
  employer: string
  title: string
  empYears: string
  empMonths: string
  income: string
  fico: string
  sigData?: string
}

export interface BusinessData {
  name: string
  street: string
  city: string
  state: string
  zip: string
  entity: string
  revenue: string
  ein: string
  nature: string
  use: string
}

export interface ApplicationEmailData {
  refId: string
  appDate: string
  loanType: string
  applicant: ApplicantData
  coApplicant?: ApplicantData
  business?: BusinessData
}

function fmtMoney(v: string): string {
  const n = Number(v)
  return Number.isFinite(n) && v !== '' ? `$${n.toLocaleString('en-US')}` : '—'
}

function applicantRows(a: ApplicantData, prefix: string): [string, string][] {
  return [
    [`${prefix} Name`, a.name],
    [`${prefix} Date of Birth`, a.dob],
    [`${prefix} SSN`, a.ssnLast4 ? `XXX-XX-${a.ssnLast4}` : '—'],
    [`${prefix} Address`, [a.street, a.city, a.state, a.zip].filter(Boolean).join(', ')],
    [`${prefix} Email`, a.email],
    [`${prefix} Phone`, a.phone],
    [`${prefix} Employer`, a.employer],
    [`${prefix} Title`, a.title],
    [`${prefix} Employment`, `${a.empYears || 0} yrs ${a.empMonths || 0} mos`],
    [`${prefix} Annual Income`, fmtMoney(a.income)],
    [`${prefix} Est. FICO`, a.fico || '—'],
  ]
}

function buildHtml(app: ApplicationEmailData): string {
  const rows: [string, string][] = [
    ['Reference', app.refId],
    ['Application Date', app.appDate],
    ['Loan Type', app.loanType],
    ...applicantRows(app.applicant, 'Applicant'),
    ...(app.coApplicant ? applicantRows(app.coApplicant, 'Co-Applicant') : []),
    ...(app.business
      ? ([
          ['Business Name', app.business.name],
          ['Business Address', [app.business.street, app.business.city, app.business.state, app.business.zip].filter(Boolean).join(', ') || '—'],
          ['Entity Type', app.business.entity],
          ['EIN', app.business.ein],
          ['Avg Monthly Revenue', fmtMoney(app.business.revenue)],
          ['Nature of Business', app.business.nature],
          ['Use of Funds', app.business.use || '—'],
        ] as [string, string][])
      : []),
  ]

  const tableRows = rows
    .map(
      ([label, value]) => `
      <tr>
        <td style="padding:8px 12px;background:#f8f9fa;font-weight:600;color:#374151;white-space:nowrap;border-bottom:1px solid #e5e7eb;">${label}</td>
        <td style="padding:8px 12px;color:#111827;border-bottom:1px solid #e5e7eb;">${value}</td>
      </tr>`
    )
    .join('')

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f3f4f6;margin:0;padding:24px;">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.1);">
    <div style="background:#0b1b45;padding:24px 28px;">
      <h1 style="margin:0;color:#fff;font-size:20px;font-weight:700;">New Credit Application</h1>
      <p style="margin:4px 0 0;color:#8fd0f5;font-size:14px;">BrightPath Finance — ${new Date().toLocaleString('en-US', { timeZone: 'America/Denver', dateStyle: 'full', timeStyle: 'short' })} MT</p>
    </div>
    <div style="padding:24px 28px;">
      <h2 style="margin:0 0 16px;font-size:16px;color:#0b1b45;">${app.applicant.name} — ${app.loanType}</h2>
      <table style="width:100%;border-collapse:collapse;border-radius:8px;overflow:hidden;border:1px solid #e5e7eb;">
        ${tableRows}
      </table>
      <p style="margin:16px 0 0;font-size:12px;color:#6b7280;">Signed signature image(s) attached. SSNs are masked in email for security; full details are collected in the application.</p>
    </div>
    <div style="padding:16px 28px;background:#f8f9fa;border-top:1px solid #e5e7eb;">
      <p style="margin:0;font-size:12px;color:#6b7280;">BrightPath Finance · NMLS #2670114 · 898 S State St Ste 310 #714 Orem UT 84058</p>
    </div>
  </div>
</body>
</html>`
}

export async function sendApplicationNotification(app: ApplicationEmailData): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey || apiKey.trim() === '') {
    console.warn('[Email] RESEND_API_KEY not set — skipping application email notification')
    return
  }

  const subject = `New Credit Application — ${app.applicant.name} (${app.loanType}) ${app.refId}`
  const html = buildHtml(app)

  const attachments: { filename: string; content: string }[] = []
  const sigToAttachment = (sig: string | undefined, filename: string) => {
    if (sig && sig.startsWith('data:image/png;base64,')) {
      attachments.push({ filename, content: sig.replace('data:image/png;base64,', '') })
    }
  }
  sigToAttachment(app.applicant.sigData, 'applicant-signature.png')
  sigToAttachment(app.coApplicant?.sigData, 'co-applicant-signature.png')

  for (const to of NOTIFY_ADDRESSES) {
    try {
      const res = await fetch(RESEND_API, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'BrightPath Applications <leads@brightpath-fin.com>',
          to,
          subject,
          html,
          ...(attachments.length ? { attachments } : {}),
        }),
      })

      const json = (await res.json()) as Record<string, unknown>
      if (!res.ok) {
        console.error(`[Email] Failed to send to ${to}:`, json)
      } else {
        console.log(`[Email] Application notification sent to ${to} (id=${json.id})`)
      }
    } catch (err) {
      console.error(`[Email] Error sending to ${to}:`, err instanceof Error ? err.message : err)
    }
  }
}
