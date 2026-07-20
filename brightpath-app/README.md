# BrightPath App — app.brightpath-fin.com

Next.js app for the `app.brightpath-fin.com` subdomain, structured the same way as
`brightpath-heloc/` (which serves heloc.brightpath-fin.com).

The home page (`src/pages/index.tsx`) is currently a placeholder. It will be
replaced with the content of the Claude artifact once imported.

## Local development

```bash
cd brightpath-app
npm install
npm run dev   # runs on http://localhost:3002
```

## Deploying to Vercel

1. Create a new Vercel project pointing at this repository.
2. Set **Root Directory** to `brightpath-app`.
3. Framework preset: Next.js (auto-detected; `vercel.json` is included).
4. Deploy.

## Pointing app.brightpath-fin.com at it

1. In the Vercel project → Settings → Domains, add `app.brightpath-fin.com`.
2. In your DNS provider for `brightpath-fin.com`, add a CNAME record:
   - Name: `app`
   - Value: `cname.vercel-dns.com`
   (Same pattern as the existing `heloc` subdomain.)
3. Wait for DNS propagation; Vercel provisions the TLS certificate automatically.
