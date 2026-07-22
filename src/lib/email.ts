import { Resend } from 'resend';

let _resend: Resend | null = null;
function getResendClient(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (!_resend) _resend = new Resend(key);
  return _resend;
}

const VERIFIED_FROM = 'BrightPath Finance <team@brightpath-fin.com>';
const FALLBACK_FROM = 'BrightPath Finance <onboarding@resend.dev>';

function getRecipients(): string[] {
  const env = process.env.LEAD_NOTIFICATION_EMAILS || '';
  return env
    .split(',')
    .map(e => e.trim())
    .filter(Boolean)
    // Drop placeholder addresses (e.g. email1@example.com) — Resend 422s on
    // example.com, which fails the whole review send. Set real addresses in
    // LEAD_NOTIFICATION_EMAILS to receive the review copy.
    .filter(e => !/@example\.(com|org|net)$/i.test(e));
}

export interface LeadEmailPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  unsecuredDebtBalance: string;
  monthlyDebtPayment?: string;
  loanRequestAmount: string;
  estimatedFico: string;
  loanPurpose: string;
  source: string;
  creditScore: number | null;
  totalDebtBalance: number | null;
  routing: 'qualified' | 'review' | 'alternative';
  submittedAt: string;
  phoneVerified: boolean;
}

function routingBadge(routing: string) {
  if (routing === 'qualified') return { label: 'QUALIFIED', bg: '#e8f5e9', color: '#2e7d32', border: '#a5d6a7' };
  if (routing === 'review')    return { label: 'REVIEW',    bg: '#fff8e1', color: '#f57f17', border: '#ffe082' };
  return                              { label: 'ALTERNATIVE', bg: '#fce4ec', color: '#c62828', border: '#f48fb1' };
}

function formatCurrency(n: number | null): string {
  if (n === null) return 'N/A';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

function buildHtml(data: LeadEmailPayload): string {
  const badge = routingBadge(data.routing);
  const submittedDate = new Date(data.submittedAt).toLocaleString('en-US', {
    timeZone: 'America/New_York', dateStyle: 'medium', timeStyle: 'short',
  });

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0f4f8;font-family:'Helvetica Neue',Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4f8;padding:32px 16px">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%">

        <!-- Header -->
        <tr><td style="background:#0d1b2a;border-radius:12px 12px 0 0;padding:28px 32px;text-align:center">
          <p style="margin:0;color:#fff;font-size:22px;font-weight:700;letter-spacing:-0.3px">BrightPath Finance</p>
          <p style="margin:6px 0 0;color:rgba(255,255,255,0.6);font-size:13px">New Loan Application Received</p>
        </td></tr>

        <!-- Routing badge -->
        <tr><td style="background:#fff;padding:24px 32px 16px;text-align:center">
          <span style="display:inline-block;padding:6px 20px;border-radius:999px;font-size:13px;font-weight:700;
            background:${badge.bg};color:${badge.color};border:1px solid ${badge.border};letter-spacing:0.5px">
            ${badge.label}
          </span>
          <p style="margin:10px 0 0;color:#494949;font-size:13px">Submitted ${submittedDate} ET</p>
        </td></tr>

        <!-- Contact info -->
        <tr><td style="background:#fff;padding:8px 32px 24px">
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e9ecef;border-radius:10px;overflow:hidden">
            <tr style="background:#f8f9fa">
              <td colspan="2" style="padding:12px 16px;font-size:11px;font-weight:700;color:#0d1b2a;letter-spacing:1px;text-transform:uppercase">Contact Information</td>
            </tr>
            ${row('Name', `${data.firstName} ${data.lastName}`)}
            ${row('Email', `<a href="mailto:${data.email}" style="color:#2b7cff">${data.email}</a>`)}
            ${row('Phone', `<a href="tel:${data.phone}" style="color:#2b7cff">${data.phone}</a>${data.phoneVerified ? ' ✓ verified' : ''}`)}
            ${row('Address', `${data.streetAddress}, ${data.city}, ${data.state} ${data.zipCode}`)}
          </table>
        </td></tr>

        <!-- Loan details -->
        <tr><td style="background:#fff;padding:0 32px 24px">
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e9ecef;border-radius:10px;overflow:hidden">
            <tr style="background:#f8f9fa">
              <td colspan="2" style="padding:12px 16px;font-size:11px;font-weight:700;color:#0d1b2a;letter-spacing:1px;text-transform:uppercase">Loan Details</td>
            </tr>
            ${row('Loan Purpose', data.loanPurpose)}
            ${row('Unsecured Debt Balance', data.unsecuredDebtBalance)}
            ${data.monthlyDebtPayment ? row('Monthly Minimum Payments', data.monthlyDebtPayment) : ''}
            ${row('Loan Amount Requested', data.loanRequestAmount)}
            ${row('Estimated FICO (self-reported)', data.estimatedFico)}
            ${row('Soft Pull Credit Score', data.creditScore !== null ? `<strong>${data.creditScore}</strong>` : 'Not available')}
            ${row('Total Debt (soft pull)', formatCurrency(data.totalDebtBalance))}
            ${row('Lead Source', data.source)}
          </table>
        </td></tr>

        <!-- CTA -->
        <tr><td style="background:#fff;padding:0 32px 32px;text-align:center;border-radius:0 0 12px 12px">
          <a href="tel:877-867-2002" style="display:inline-block;background:linear-gradient(135deg,#2b7cff,#30a2ff);
            color:#fff;font-size:14px;font-weight:700;padding:14px 36px;border-radius:10px;text-decoration:none;
            box-shadow:0 4px 14px rgba(43,124,255,0.35)">
            Call Lead Now &rarr; 877-867-2002
          </a>
          <p style="margin:16px 0 0;font-size:12px;color:#aaa">BrightPath Finance &middot; NMLS #2670114 &middot; Orem, UT 84058</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function row(label: string, value: string): string {
  return `<tr style="border-top:1px solid #f0f0f0">
    <td style="padding:11px 16px;font-size:13px;color:#494949;width:42%;vertical-align:top">${label}</td>
    <td style="padding:11px 16px;font-size:13px;color:#0d1b2a;font-weight:500;vertical-align:top">${value}</td>
  </tr>`;
}

const INTERNAL_ALERT_RECIPIENTS = ['contact@brightpathfinance.com', 'team@brightpath-fin.com'];

function buildInternalAlertHtml(data: LeadEmailPayload): string {
  const submittedDate = new Date(data.submittedAt).toLocaleString('en-US', {
    timeZone: 'America/New_York', dateStyle: 'medium', timeStyle: 'short',
  });
  const address = [data.streetAddress, data.city, data.state, data.zipCode].filter(Boolean).join(', ');

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0f4f8;font-family:'Helvetica Neue',Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4f8;padding:32px 16px">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%">

        <tr><td style="background:#0d1b2a;border-radius:12px 12px 0 0;padding:28px 32px;text-align:center">
          <p style="margin:0;color:#fff;font-size:22px;font-weight:700;letter-spacing:-0.3px">BrightPath Finance</p>
          <p style="margin:6px 0 0;color:rgba(255,255,255,0.6);font-size:13px">New Loan Application Received</p>
        </td></tr>

        <tr><td style="background:#fff;padding:24px 32px;border-radius:0 0 12px 12px">
          <p style="margin:0 0 16px;color:#494949;font-size:13px">Submitted ${submittedDate} ET · Source: ${data.source}</p>

          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e9ecef;border-radius:10px;overflow:hidden">
            <tr style="background:#f8f9fa">
              <td colspan="2" style="padding:12px 16px;font-size:11px;font-weight:700;color:#0d1b2a;letter-spacing:1px;text-transform:uppercase">Applicant</td>
            </tr>
            ${row('Name', `${data.firstName} ${data.lastName}`)}
            ${row('Email', data.email)}
            ${row('Phone', data.phone)}
            ${address ? row('Address', address) : ''}
          </table>

          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e9ecef;border-radius:10px;overflow:hidden;margin-top:16px">
            <tr style="background:#f8f9fa">
              <td colspan="2" style="padding:12px 16px;font-size:11px;font-weight:700;color:#0d1b2a;letter-spacing:1px;text-transform:uppercase">Loan Details</td>
            </tr>
            ${row('Purpose', data.loanPurpose)}
            ${row('Unsecured Debt', data.unsecuredDebtBalance)}
            ${data.monthlyDebtPayment ? row('Monthly Min. Payments', data.monthlyDebtPayment) : ''}
            ${row('Loan Requested', data.loanRequestAmount)}
            ${row('Estimated FICO', data.estimatedFico)}
          </table>

          <div style="text-align:center;margin-top:24px">
            <a href="tel:${data.phone}" style="display:inline-block;background:linear-gradient(135deg,#2b7cff,#30a2ff);
              color:#fff;font-size:14px;font-weight:700;padding:14px 36px;border-radius:10px;text-decoration:none;
              box-shadow:0 4px 14px rgba(43,124,255,0.35)">
              Call ${data.firstName} Now &rarr; ${data.phone}
            </a>
          </div>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

async function sendWithFallback(
  client: InstanceType<typeof Resend>,
  to: string[],
  subject: string,
  html: string,
  label: string,
): Promise<boolean> {
  try {
    console.log(`[Email:${label}] Sending to ${to.join(', ')}...`);
    const { data: result, error } = await client.emails.send({
      from: VERIFIED_FROM, to, subject, html,
    });

    if (error) {
      console.warn(`[Email:${label}] Verified domain failed:`, JSON.stringify(error));
      const { data: fbResult, error: fbError } = await client.emails.send({
        from: FALLBACK_FROM, to, subject, html,
      });
      if (fbError) {
        console.error(`[Email:${label}] Fallback also failed:`, JSON.stringify(fbError));
        return false;
      }
      console.log(`[Email:${label}] Sent via fallback:`, fbResult);
      return true;
    }

    console.log(`[Email:${label}] Sent:`, result);
    return true;
  } catch (err) {
    console.error(`[Email:${label}] Exception:`, err);
    return false;
  }
}

export async function sendLeadNotificationEmail(data: LeadEmailPayload): Promise<boolean> {
  console.log('[Email] sendLeadNotificationEmail called');
  console.log('[Email] RESEND_API_KEY present:', !!process.env.RESEND_API_KEY);

  const client = getResendClient();
  if (!client) {
    console.warn('[Email] RESEND_API_KEY not configured — skipping all emails');
    return false;
  }

  // 1) Internal lead alert → contact@brightpathfinance.com + team@brightpath-fin.com
  const internalSubject = `New Loan Application — ${data.firstName} ${data.lastName} (${data.phone})`;
  const internalPromise = sendWithFallback(
    client, INTERNAL_ALERT_RECIPIENTS, internalSubject,
    buildInternalAlertHtml(data), 'internal',
  );

  // 2) Lead review alert → LEAD_NOTIFICATION_EMAILS env var recipients
  const reviewRecipients = getRecipients();
  const reviewSubject = `🔔 New Lead [${data.routing.toUpperCase()}] — ${data.firstName} ${data.lastName} | ${data.loanRequestAmount}`;
  const reviewPromise = reviewRecipients.length
    ? sendWithFallback(client, reviewRecipients, reviewSubject, buildHtml(data), 'review')
    : Promise.resolve(false);

  const [internalOk, reviewOk] = await Promise.all([internalPromise, reviewPromise]);
  console.log('[Email] Results — internal:', internalOk, 'review:', reviewOk);
  return internalOk || reviewOk;
}

// ─── Abandoned / partial lead ────────────────────────────────────────────────

export interface PartialLeadPayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  unsecuredDebtBalance?: string;
  monthlyDebtPayment?: string;
  loanRequestAmount?: string;
  estimatedFico?: string;
  loanPurpose?: string;
  source: string;
  lastStep?: string;
}

function buildPartialLeadHtml(data: PartialLeadPayload): string {
  const name = [data.firstName, data.lastName].filter(Boolean).join(' ') || '(name not provided)';
  const address = [data.streetAddress, data.city, data.state, data.zipCode].filter(Boolean).join(', ');
  const when = new Date().toLocaleString('en-US', { timeZone: 'America/New_York', dateStyle: 'medium', timeStyle: 'short' });

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0f4f8;font-family:'Helvetica Neue',Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4f8;padding:32px 16px">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%">

        <tr><td style="background:#b26a00;border-radius:12px 12px 0 0;padding:24px 32px;text-align:center">
          <p style="margin:0;color:#fff;font-size:20px;font-weight:700">⚠️ Incomplete Application</p>
          <p style="margin:6px 0 0;color:rgba(255,255,255,0.85);font-size:13px">A visitor entered their contact info but did not finish — follow up fast.</p>
        </td></tr>

        <tr><td style="background:#fff;padding:24px 32px;border-radius:0 0 12px 12px">
          <p style="margin:0 0 16px;color:#494949;font-size:13px">Captured ${when} ET · Source: ${data.source}${data.lastStep ? ` · Stopped at: ${data.lastStep}` : ''}</p>

          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e9ecef;border-radius:10px;overflow:hidden">
            <tr style="background:#f8f9fa">
              <td colspan="2" style="padding:12px 16px;font-size:11px;font-weight:700;color:#0d1b2a;letter-spacing:1px;text-transform:uppercase">Contact</td>
            </tr>
            ${row('Name', name)}
            ${data.email ? row('Email', data.email) : ''}
            ${data.phone ? row('Phone', data.phone) : ''}
            ${address ? row('Address', address) : ''}
          </table>

          ${(data.loanPurpose || data.unsecuredDebtBalance || data.monthlyDebtPayment || data.loanRequestAmount || data.estimatedFico) ? `
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e9ecef;border-radius:10px;overflow:hidden;margin-top:16px">
            <tr style="background:#f8f9fa">
              <td colspan="2" style="padding:12px 16px;font-size:11px;font-weight:700;color:#0d1b2a;letter-spacing:1px;text-transform:uppercase">Loan Details (so far)</td>
            </tr>
            ${data.loanPurpose ? row('Purpose', data.loanPurpose) : ''}
            ${data.unsecuredDebtBalance ? row('Unsecured Debt', data.unsecuredDebtBalance) : ''}
            ${data.monthlyDebtPayment ? row('Monthly Min. Payments', data.monthlyDebtPayment) : ''}
            ${data.loanRequestAmount ? row('Loan Requested', data.loanRequestAmount) : ''}
            ${data.estimatedFico ? row('Estimated FICO', data.estimatedFico) : ''}
          </table>` : ''}

          ${data.phone ? `
          <div style="text-align:center;margin-top:24px">
            <a href="tel:${data.phone}" style="display:inline-block;background:linear-gradient(135deg,#2b7cff,#30a2ff);
              color:#fff;font-size:14px;font-weight:700;padding:14px 36px;border-radius:10px;text-decoration:none;
              box-shadow:0 4px 14px rgba(43,124,255,0.35)">
              Call ${data.firstName || 'Lead'} Now &rarr; ${data.phone}
            </a>
          </div>` : ''}
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function sendPartialLeadEmail(data: PartialLeadPayload): Promise<boolean> {
  const client = getResendClient();
  if (!client) {
    console.warn('[Email:partial] RESEND_API_KEY not configured — skipping');
    return false;
  }

  const recipients = Array.from(new Set([...INTERNAL_ALERT_RECIPIENTS, ...getRecipients()]));
  const who = [data.firstName, data.lastName].filter(Boolean).join(' ') || data.phone || data.email || 'Unknown';
  const subject = `⚠️ Incomplete Application — ${who}`;

  return sendWithFallback(client, recipients, subject, buildPartialLeadHtml(data), 'partial');
}
