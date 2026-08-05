# mtgikhan-form — form.mtgikhan.com

Multi-funnel application intake for the `form.mtgikhan.com` subdomain. Visitors
pick one of four journeys and answer a short, branching questionnaire. On submit,
the team is notified by email (Resend) and the applicant can copy their
questions & answers to paste into an email.

## Funnels

- **Mortgage** — splits into two journeys:
  - **Purchase** — first-time buyer, co-borrower, agent, current home plans,
    state, property type, occupancy, purchase-price slider, down-payment slider
    (shows amount **and** % of purchase price), credit, monthly debts, income,
    employment, and contact.
  - **Refinance** — property address, property type, occupancy, cash-out
    (with amount), home value, loan balance, interest rate, credit, monthly
    debts, income, employment, and contact.
- **Debt Settlement** — unsecured debt, minimum payments, credit, behind on
  payments, current debt-relief enrollment (with payment), state, contact.
- **Solar** — property address, average electric bill (optional statement
  upload), EV ownership, mortgage on home (with balance), FICO, contact.
- **Business Funding** — purpose, equipment use (with amount), time in business,
  monthly revenue, entity type, industry, funding needed, business name,
  ownership %, total income, credit, state, contact.

## Architecture

- **`public/form.html`** — the entire questionnaire as one self-contained,
  dependency-free page (served at `/` via a `next.config.js` rewrite).
- **`src/pages/api/submit.ts`** — serverless endpoint that validates the payload,
  saves a `/tmp` backup, and sends the notification email.
- **`src/lib/email.ts`** — Resend client. Sends one email to
  `team@brightpath-fin.com` and `contact@brightpathfinance.com` with the full
  Q&A (and the Solar statement as an attachment, when provided).

## Local development

```bash
cd mtgikhan-form
npm install
npm run dev   # http://localhost:3003
```

Without `RESEND_API_KEY` set, submissions still succeed — the email step is
skipped and logged. Copy `.env.example` to `.env.local` and set the key to
send real emails.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `RESEND_API_KEY` | Resend API key (required to send emails). |
| `RESEND_FROM` | Verified sender, e.g. `BrightPath Applications <leads@brightpath-fin.com>`. Optional; defaults to that value. |
| `NEXT_PUBLIC_SITE_URL` | `https://form.mtgikhan.com` |

## Deploying to Vercel

1. Create a new Vercel project pointing at this repository.
2. Set **Root Directory** to `mtgikhan-form`.
3. Framework preset: Next.js (auto-detected; `vercel.json` is included).
4. Add the `RESEND_API_KEY` (and optionally `RESEND_FROM`) env var.
5. Deploy.

## Pointing form.mtgikhan.com at it

1. In the Vercel project → Settings → Domains, add `form.mtgikhan.com`.
2. In your DNS provider for `mtgikhan.com`, add a CNAME record:
   - Name: `form`
   - Value: `cname.vercel-dns.com`
3. Wait for DNS propagation; Vercel provisions the TLS certificate automatically.

## Notes

- The "from" domain used with Resend must be verified in your Resend account.
  `brightpath-fin.com` is already verified in the shared account; using
  `leads@brightpath-fin.com` as the sender is the default.
- Submitting the form is an inquiry only — it is not a credit application or
  decision, and the copy on the page reflects that.
