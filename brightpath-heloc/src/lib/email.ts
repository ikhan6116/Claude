/**
 * Resend email client for BrightPath lead notifications.
 * Sign up at resend.com, add RESEND_API_KEY to Vercel env vars.
 * Free tier: 3,000 emails/month.
 */

const RESEND_API = 'https://api.resend.com/emails'

const NOTIFY_ADDRESSES = [
  'team@brightpath-fin.com',
  'contact@brightpathfinance.com',
]

interface LeadEmailData {
  firstName: string
  lastName: string
  email: string
  phone: string
  propertyAddress: string
  estimatedHomeValue: number
  currentMortgageBalance: number
  requestedCreditLine: number
  loanPurpose: string
  creditScoreRange: string
  employmentStatus: string
  annualIncome: number
  otherIncome?: number
  ownershipType?: string
  occupancyType?: string
  fubPersonId?: number
  figureInquiryId?: string
}

function fmt(n: number) {
  return `$${n.toLocaleString('en-US')}`
}

function buildHtml(lead: LeadEmailData): string {
  const equity = lead.estimatedHomeValue - lead.currentMortgageBalance
  const rows: [string, string][] = [
    ['Name', `${lead.firstName} ${lead.lastName}`],
    ['Email', lead.email],
    ['Phone', lead.phone],
    ['Property Address', lead.propertyAddress],
    ['Estimated Home Value', fmt(lead.estimatedHomeValue)],
    ['Mortgage Balance', fmt(lead.currentMortgageBalance)],
    ['Available Equity', fmt(equity)],
    ['Requested Credit Line', fmt(lead.requestedCreditLine)],
    ['Loan Purpose', lead.loanPurpose],
    ['Credit Score Range', lead.creditScoreRange],
    ['Employment Status', lead.employmentStatus],
    ['Annual Income', fmt(lead.annualIncome)],
    ...(lead.otherIncome ? [['Other Income', fmt(lead.otherIncome)] as [string, string]] : []),
    ...(lead.ownershipType ? [['Ownership Type', lead.ownershipType] as [string, string]] : []),
    ...(lead.occupancyType ? [['Occupancy Type', lead.occupancyType] as [string, string]] : []),
    ...(lead.fubPersonId ? [['FUB Person ID', String(lead.fubPersonId)] as [string, string]] : []),
    ...(lead.figureInquiryId ? [['Figure Inquiry ID', lead.figureInquiryId] as [string, string]] : []),
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
    <div style="background:#1d4ed8;padding:24px 28px;">
      <h1 style="margin:0;color:#fff;font-size:20px;font-weight:700;">New HELOC Application</h1>
      <p style="margin:4px 0 0;color:#bfdbfe;font-size:14px;">BrightPath Finance — ${new Date().toLocaleString('en-US', { timeZone: 'America/Denver', dateStyle: 'full', timeStyle: 'short' })} MT</p>
    </div>
    <div style="padding:24px 28px;">
      <h2 style="margin:0 0 16px;font-size:16px;color:#1d4ed8;">${lead.firstName} ${lead.lastName}</h2>
      <table style="width:100%;border-collapse:collapse;border-radius:8px;overflow:hidden;border:1px solid #e5e7eb;">
        ${tableRows}
      </table>
      ${lead.fubPersonId ? `
      <div style="margin-top:20px;">
        <a href="https://app.followupboss.com/2/people/${lead.fubPersonId}"
           style="display:inline-block;background:#1d4ed8;color:#fff;text-decoration:none;padding:10px 20px;border-radius:8px;font-size:14px;font-weight:600;">
          View in Follow Up Boss →
        </a>
      </div>` : ''}
    </div>
    <div style="padding:16px 28px;background:#f8f9fa;border-top:1px solid #e5e7eb;">
      <p style="margin:0;font-size:12px;color:#6b7280;">BrightPath Finance · NMLS #2670114 · 898 S State St Ste 310 #714 Orem UT 84058</p>
    </div>
  </div>
</body>
</html>`
}

export async function sendLeadNotification(lead: LeadEmailData): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey || apiKey.trim() === '') {
    console.warn('[Email] RESEND_API_KEY not set — skipping lead email notification')
    return
  }

  const subject = `New HELOC Application — ${lead.firstName} ${lead.lastName} (${lead.phone})`
  const html = buildHtml(lead)

  for (const to of NOTIFY_ADDRESSES) {
    try {
      const res = await fetch(RESEND_API, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'BrightPath Leads <leads@brightpath-fin.com>',
          to,
          subject,
          html,
        }),
      })

      const json = await res.json() as Record<string, unknown>
      if (!res.ok) {
        console.error(`[Email] Failed to send to ${to}:`, json)
      } else {
        console.log(`[Email] Lead notification sent to ${to} (id=${json.id})`)
      }
    } catch (err) {
      console.error(`[Email] Error sending to ${to}:`, err instanceof Error ? err.message : err)
    }
  }
}
