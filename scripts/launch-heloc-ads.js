#!/usr/bin/env node
/**
 * Launch HELOC Meta Ads Campaign
 *
 * Usage:
 *   node scripts/launch-heloc-ads.js [options]
 *
 * Options:
 *   --budget <number>      Daily budget in USD (default: 50)
 *   --states <CA,TX,...>   Comma-separated state codes to target (default: all US)
 *   --active               Set campaign to ACTIVE immediately (default: PAUSED)
 *   --dry-run              Print what would be sent without calling Meta API
 *
 * Required env vars (can be in .env.local):
 *   META_ACCESS_TOKEN
 *   META_AD_ACCOUNT_ID   (format: act_XXXXXXX)
 *   META_PAGE_ID
 *   META_PIXEL_ID        (optional but recommended)
 *   NEXT_PUBLIC_SITE_URL
 *
 * Example:
 *   node scripts/launch-heloc-ads.js --budget 100 --states CA,TX,FL --active
 */

require('dotenv').config({ path: '.env.local' });

const args = process.argv.slice(2);

function getArg(flag, defaultValue) {
  const idx = args.indexOf(flag);
  if (idx === -1) return defaultValue;
  return args[idx + 1] ?? defaultValue;
}

const dailyBudgetUsd = parseFloat(getArg('--budget', '50'));
const statesArg = getArg('--states', '');
const targetStates = statesArg ? statesArg.split(',').map((s) => s.trim().toUpperCase()) : undefined;
const launchActive = args.includes('--active');
const dryRun = args.includes('--dry-run');

const siteUrl =
  (process.env.NEXT_PUBLIC_SITE_URL || 'https://freedomdebtsolutions.com').replace(/\/$/, '');

// ── Validate required env vars ────────────────────────────────────────────────
if (!dryRun) {
  const required = ['META_ACCESS_TOKEN', 'META_AD_ACCOUNT_ID', 'META_PAGE_ID'];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length) {
    console.error(`\n❌  Missing required environment variables: ${missing.join(', ')}`);
    console.error('    Copy .env.example to .env.local and fill in the Meta credentials.\n');
    process.exit(1);
  }
}

// ── Summary ───────────────────────────────────────────────────────────────────
console.log('\n🚀  HELOC Meta Ads Campaign Launcher');
console.log('━'.repeat(50));
console.log(`   Daily Budget : $${dailyBudgetUsd}`);
console.log(`   Target States: ${targetStates ? targetStates.join(', ') : 'All US'}`);
console.log(`   Status       : ${launchActive ? 'ACTIVE (live immediately)' : 'PAUSED (review first)'}`);
console.log(`   Landing URL  : ${siteUrl}/heloc`);
console.log(`   Dry Run      : ${dryRun ? 'YES' : 'NO'}`);
console.log('━'.repeat(50));

if (dryRun) {
  console.log('\n✅  Dry run complete. No API calls were made.\n');
  console.log('   Campaign payload that would be sent:');
  console.log(JSON.stringify({ dailyBudgetUsd, targetStates, launchActive, siteUrl }, null, 2));
  process.exit(0);
}

// ── Call the local API route (or import metaAds directly if running outside Next) ─
async function run() {
  // Dynamic import to get the compiled TypeScript via ts-node/register if available,
  // or fall back to calling the Next.js API endpoint if the server is running.
  try {
    // Prefer direct import (requires ts-node or built output)
    const { launchHELOCCampaign } = require('../src/lib/metaAds');

    console.log('\n⏳  Creating campaign via Meta Marketing API...\n');
    const result = await launchHELOCCampaign({
      siteUrl,
      dailyBudgetUsd,
      targetStates,
      launchActive,
    });

    console.log('✅  Campaign created successfully!\n');
    console.log(`   Campaign ID : ${result.campaignId}`);
    console.log(`   Ad Sets     : ${result.adSetIds.join(', ')}`);
    console.log(`   Creatives   : ${result.creativeIds.join(', ')}`);
    console.log(`   Ads         : ${result.adIds.join(', ')}`);
    console.log('\n   🔗  View in Meta Ads Manager:');
    const accountId = process.env.META_AD_ACCOUNT_ID.replace('act_', '');
    console.log(`       https://www.facebook.com/adsmanager/manage/campaigns?act=${accountId}\n`);

    if (!launchActive) {
      console.log(
        '   ⚠️   Campaign is PAUSED. Review creatives in Ads Manager, then activate when ready.\n'
      );
    }
  } catch (err) {
    console.error('\n❌  Failed to launch campaign:\n');
    console.error('   ', err.message ?? err);
    console.error(
      '\n   Tips:\n' +
      '   • Verify META_ACCESS_TOKEN has ads_management permission\n' +
      '   • Ensure META_AD_ACCOUNT_ID format is act_XXXXXXX\n' +
      '   • Financial ad accounts must be approved for Special Ad Category: CREDIT\n'
    );
    process.exit(1);
  }
}

run();
