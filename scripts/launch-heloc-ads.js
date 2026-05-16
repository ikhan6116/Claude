/**
 * launch-heloc-ads.js
 *
 * Launches a Meta (Facebook/Instagram) ad campaign for the Figure HELOC application.
 *
 * Usage:
 *   ADMIN_SECRET=<secret> NEXT_PUBLIC_SITE_URL=https://yourdomain.com node scripts/launch-heloc-ads.js
 *
 * Prerequisites:
 *   1. Set all required env vars in your .env or export them before running.
 *   2. Ensure your Next.js app is running (dev or prod) at NEXT_PUBLIC_SITE_URL.
 *   3. META_PAGE_ID must be set in your server environment.
 *
 * Required env vars:
 *   ADMIN_SECRET          — matches the server-side ADMIN_SECRET
 *   NEXT_PUBLIC_SITE_URL  — base URL of your running app (no trailing slash)
 */

'use strict';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const ADMIN_SECRET = process.env.ADMIN_SECRET;

if (!ADMIN_SECRET) {
  console.error('❌  ADMIN_SECRET environment variable is required.');
  process.exit(1);
}

async function launchCampaign() {
  console.log('🚀  Launching HELOC Meta Ad Campaign...');
  console.log(`    Target URL: ${SITE_URL}/api/ads/launch-campaign\n`);

  const res = await fetch(`${SITE_URL}/api/ads/launch-campaign`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-token': ADMIN_SECRET,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    console.error('❌  Campaign launch failed:', data.error || res.statusText);
    process.exit(1);
  }

  console.log('✅  Campaign created successfully!\n');
  console.log('Campaign ID:', data.campaignId);
  console.log('Ad Set IDs:', data.adSetIds);
  console.log('Creative IDs:', data.creativeIds);
  console.log('Ad IDs:', data.adIds);
  console.log('\n⚠️   All ads are created in PAUSED status.');
  console.log('    Review in Meta Ads Manager before activating.');
  console.log('    https://www.facebook.com/adsmanager\n');
}

function printAdCreativeIdeas() {
  const ideas = [
    {
      targeting: 'Home Improvement',
      headline: 'Your Dream Home Is One Renovation Away',
      copy: 'Stop putting off the kitchen remodel, master suite addition, or backyard oasis you\'ve been dreaming about. As a homeowner, you already have the funding — it\'s sitting in your equity. A Figure HELOC lets you draw exactly what you need at a fraction of credit card rates. Funds available in as few as 5 days.',
      cta: 'Start My Renovation Fund',
    },
    {
      targeting: 'Debt Consolidation',
      headline: 'One Smart Move to Crush High-Interest Debt',
      copy: 'Juggling multiple credit card balances at 20-29% APR? Homeowners are consolidating thousands in debt into a single, manageable HELOC payment at rates far below what the credit card companies charge. Take back control of your finances — your home\'s equity is your leverage.',
      cta: 'Calculate My Savings',
    },
    {
      targeting: 'Emergency Funds',
      headline: 'Build Your Financial Safety Net — Before You Need It',
      copy: 'Life is unpredictable. A Figure HELOC gives you access to a standby credit line you only pay interest on when you actually draw from it. Set it up now, use it only if you need it. Smart homeowners keep this in their back pocket for medical bills, job loss, or unexpected repairs.',
      cta: 'Set Up My Safety Net',
    },
    {
      targeting: 'Education',
      headline: 'Fund Education Without Drowning in Student Loans',
      copy: 'College tuition, graduate school, certification programs — education is an investment, but the financing options can be brutal. Home equity lines offer rates well below private student loan APRs, with flexible repayment that fits your timeline, not the lender\'s.',
      cta: 'Explore Education Funding',
    },
    {
      targeting: 'General Home Equity',
      headline: 'Your Home Is Worth More Than You Think — Tap Into It',
      copy: 'Home values have surged. The average homeowner is sitting on record equity — and most aren\'t using it. A Figure HELOC converts that equity into a flexible credit line you can draw from anytime. No branch visits. No complicated paperwork. Get a decision online in minutes.',
      cta: 'Check My Home Equity',
    },
  ];

  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  📝  Additional HELOC Ad Creative Ideas (5 Pain-Point Angles)');
  console.log('═══════════════════════════════════════════════════════════════\n');

  ideas.forEach((idea, i) => {
    console.log(`[${i + 1}] Targeting: ${idea.targeting}`);
    console.log(`    Headline: "${idea.headline}"`);
    console.log(`    CTA:      "${idea.cta}"`);
    console.log(`    Copy:\n`);
    console.log(`    ${idea.copy}\n`);
    console.log('───────────────────────────────────────────────────────────────\n');
  });
}

(async () => {
  try {
    await launchCampaign();
  } catch (err) {
    console.error('❌  Unexpected error:', err.message);
    process.exit(1);
  }

  printAdCreativeIdeas();
})();
