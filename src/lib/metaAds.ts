/**
 * Meta Ads API client (Marketing API v20.0)
 *
 * Docs: https://developers.facebook.com/docs/marketing-apis
 *
 * Required env vars:
 *   META_ACCESS_TOKEN    — System user long-lived token (from Business Manager)
 *   META_AD_ACCOUNT_ID  — ad_account_id (format: act_XXXXXXX)
 *   META_PIXEL_ID       — Facebook Pixel ID for conversion tracking
 *   META_PAGE_ID        — Facebook Page ID for the ad identity
 */

const META_API_VERSION = 'v20.0';
const META_API_BASE = `https://graph.facebook.com/${META_API_VERSION}`;

function metaHeaders(): HeadersInit {
  return { 'Content-Type': 'application/json' };
}

function accessToken(): string {
  const token = process.env.META_ACCESS_TOKEN;
  if (!token) throw new Error('META_ACCESS_TOKEN is not set');
  return token;
}

async function metaPost(path: string, body: Record<string, unknown>): Promise<unknown> {
  const response = await fetch(`${META_API_BASE}${path}`, {
    method: 'POST',
    headers: metaHeaders(),
    body: JSON.stringify({ ...body, access_token: accessToken() }),
  });

  const data = await response.json();

  if (!response.ok || (data as { error?: unknown }).error) {
    throw new Error(
      `Meta API error on ${path}: ${JSON.stringify((data as { error?: unknown }).error ?? data)}`
    );
  }

  return data;
}

// ---------------------------------------------------------------------------
// Campaign
// ---------------------------------------------------------------------------
export interface CreateCampaignOptions {
  name: string;
  objective?: string;  // e.g. 'OUTCOME_LEADS', 'OUTCOME_TRAFFIC'
  status?: 'ACTIVE' | 'PAUSED';
  dailyBudgetCents?: number;
  specialAdCategory?: string[];  // Required for financial products: ['CREDIT']
}

export async function createCampaign(opts: CreateCampaignOptions): Promise<string> {
  const adAccountId = process.env.META_AD_ACCOUNT_ID;
  if (!adAccountId) throw new Error('META_AD_ACCOUNT_ID is not set');

  const result = await metaPost(`/${adAccountId}/campaigns`, {
    name: opts.name,
    objective: opts.objective ?? 'OUTCOME_LEADS',
    status: opts.status ?? 'PAUSED',
    special_ad_categories: opts.specialAdCategory ?? ['CREDIT'],
    bid_strategy: 'LOWEST_COST_WITHOUT_CAP',
  }) as { id: string };

  return result.id;
}

// ---------------------------------------------------------------------------
// Ad Set
// ---------------------------------------------------------------------------
export interface AudienceGeoLocation {
  countries?: string[];
  regions?: { key: string }[];
  zips?: { key: string }[];
}

export interface CreateAdSetOptions {
  campaignId: string;
  name: string;
  dailyBudgetCents: number;
  geoLocations: AudienceGeoLocation;
  ageMin?: number;
  ageMax?: number;
  pixelId?: string;
  status?: 'ACTIVE' | 'PAUSED';
}

export async function createAdSet(opts: CreateAdSetOptions): Promise<string> {
  const adAccountId = process.env.META_AD_ACCOUNT_ID;
  if (!adAccountId) throw new Error('META_AD_ACCOUNT_ID is not set');
  const pixelId = opts.pixelId ?? process.env.META_PIXEL_ID;

  const result = await metaPost(`/${adAccountId}/adsets`, {
    name: opts.name,
    campaign_id: opts.campaignId,
    daily_budget: opts.dailyBudgetCents,
    billing_event: 'IMPRESSIONS',
    optimization_goal: 'LEAD_GENERATION',
    targeting: {
      geo_locations: opts.geoLocations,
      age_min: opts.ageMin ?? 28,
      age_max: opts.ageMax ?? 65,
      // Broad targeting — Meta will optimize delivery
      // Note: Special Ad Category (CREDIT) restricts detailed targeting
    },
    promoted_object: pixelId
      ? {
          pixel_id: pixelId,
          custom_event_type: 'LEAD',
        }
      : undefined,
    status: opts.status ?? 'PAUSED',
  }) as { id: string };

  return result.id;
}

// ---------------------------------------------------------------------------
// Ad Creative
// ---------------------------------------------------------------------------
export interface AdCreativeOptions {
  name: string;
  pageId: string;
  headline: string;
  primaryText: string;
  description: string;
  callToAction: string;    // e.g. 'LEARN_MORE', 'APPLY_NOW', 'GET_QUOTE'
  destinationUrl: string;
  imageUrl?: string;
  imageHash?: string;       // if you've already uploaded an image asset
}

export async function createAdCreative(opts: AdCreativeOptions): Promise<string> {
  const adAccountId = process.env.META_AD_ACCOUNT_ID;
  if (!adAccountId) throw new Error('META_AD_ACCOUNT_ID is not set');

  const result = await metaPost(`/${adAccountId}/adcreatives`, {
    name: opts.name,
    object_story_spec: {
      page_id: opts.pageId,
      link_data: {
        message: opts.primaryText,
        link: opts.destinationUrl,
        name: opts.headline,
        description: opts.description,
        call_to_action: {
          type: opts.callToAction,
          value: { link: opts.destinationUrl },
        },
        ...(opts.imageHash ? { image_hash: opts.imageHash } : {}),
        ...(opts.imageUrl ? { picture: opts.imageUrl } : {}),
      },
    },
  }) as { id: string };

  return result.id;
}

// ---------------------------------------------------------------------------
// Ad
// ---------------------------------------------------------------------------
export interface CreateAdOptions {
  adSetId: string;
  creativeId: string;
  name: string;
  status?: 'ACTIVE' | 'PAUSED';
}

export async function createAd(opts: CreateAdOptions): Promise<string> {
  const adAccountId = process.env.META_AD_ACCOUNT_ID;
  if (!adAccountId) throw new Error('META_AD_ACCOUNT_ID is not set');

  const result = await metaPost(`/${adAccountId}/ads`, {
    name: opts.name,
    adset_id: opts.adSetId,
    creative: { creative_id: opts.creativeId },
    status: opts.status ?? 'PAUSED',
  }) as { id: string };

  return result.id;
}

// ---------------------------------------------------------------------------
// HELOC campaign builder (one-shot convenience function)
// ---------------------------------------------------------------------------
export interface HELOCCampaignOptions {
  siteUrl: string;
  dailyBudgetUsd: number;
  targetStates?: string[];   // US state abbreviations, e.g. ['CA', 'TX']
  launchActive?: boolean;    // true = ACTIVE, false = PAUSED (default)
}

export interface HELOCCampaignResult {
  campaignId: string;
  adSetIds: string[];
  creativeIds: string[];
  adIds: string[];
}

const HELOC_AD_VARIANTS = [
  {
    headline: 'Access Your Home Equity Today',
    primaryText:
      'Homeowners are tapping into their equity with a Figure HELOC — rates from 8.50% APR. Check your offer in 5 minutes. No credit score impact.',
    description: 'Soft credit pull only. Close in as few as 5 days.',
    callToAction: 'GET_QUOTE',
  },
  {
    headline: 'Pay Off Debt With Your Home Equity',
    primaryText:
      'Stop paying 25% credit card interest. A home equity line of credit (HELOC) can consolidate your debt at a fraction of the rate. See how much you qualify for.',
    description: 'Borrow up to 90% LTV. Fast approval. No appraisal needed.',
    callToAction: 'LEARN_MORE',
  },
  {
    headline: 'Home Renovations, Funded by Your Equity',
    primaryText:
      'Finance your dream kitchen, bathroom, or addition with a HELOC — flexible, revolving credit at home equity rates. Free quote, no obligation.',
    description: 'Lines from $20K–$500K. Close in as few as 5 days.',
    callToAction: 'APPLY_NOW',
  },
];

// US state region keys for Meta targeting (representative subset)
const STATE_REGION_KEYS: Record<string, string> = {
  CA: '3847', TX: '3924', FL: '3845', NY: '3851', IL: '3861', PA: '3890',
  OH: '3886', GA: '3856', NC: '3882', MI: '3873', NJ: '3850', VA: '3888',
  WA: '3842', AZ: '3893', MA: '3848', TN: '3922', IN: '3862', MO: '3876',
  MD: '3869', WI: '3849', CO: '3853', MN: '3875', SC: '3895', AL: '3837',
  OR: '3891', KY: '3866', CT: '3843', UT: '3927', IA: '3863', NV: '3907',
};

export async function launchHELOCCampaign(
  opts: HELOCCampaignOptions
): Promise<HELOCCampaignResult> {
  const pageId = process.env.META_PAGE_ID;
  if (!pageId) throw new Error('META_PAGE_ID is not set');

  const dailyBudgetCents = Math.round(opts.dailyBudgetUsd * 100);
  const status = opts.launchActive ? 'ACTIVE' : 'PAUSED';
  const helocUrl = `${opts.siteUrl}/heloc?utm_source=meta&utm_medium=paid_social&utm_campaign=heloc`;

  // Geo targeting
  const geoLocations: AudienceGeoLocation =
    opts.targetStates && opts.targetStates.length > 0
      ? {
          regions: opts.targetStates
            .filter((s) => STATE_REGION_KEYS[s])
            .map((s) => ({ key: STATE_REGION_KEYS[s] })),
        }
      : { countries: ['US'] };

  // 1. Campaign
  const campaignId = await createCampaign({
    name: `HELOC Lead Gen — ${new Date().toISOString().split('T')[0]}`,
    objective: 'OUTCOME_LEADS',
    status,
    specialAdCategory: ['CREDIT'],
  });

  const adSetIds: string[] = [];
  const creativeIds: string[] = [];
  const adIds: string[] = [];

  // 2. One ad set per creative variant (budget split evenly)
  const perSetBudget = Math.round(dailyBudgetCents / HELOC_AD_VARIANTS.length);

  for (let i = 0; i < HELOC_AD_VARIANTS.length; i++) {
    const variant = HELOC_AD_VARIANTS[i];

    const adSetId = await createAdSet({
      campaignId,
      name: `HELOC AdSet ${i + 1} — ${variant.callToAction}`,
      dailyBudgetCents: perSetBudget,
      geoLocations,
      status,
    });
    adSetIds.push(adSetId);

    const creativeId = await createAdCreative({
      name: `HELOC Creative ${i + 1} — ${variant.headline}`,
      pageId,
      headline: variant.headline,
      primaryText: variant.primaryText,
      description: variant.description,
      callToAction: variant.callToAction,
      destinationUrl: helocUrl,
    });
    creativeIds.push(creativeId);

    const adId = await createAd({
      adSetId,
      creativeId,
      name: `HELOC Ad ${i + 1}`,
      status,
    });
    adIds.push(adId);
  }

  return { campaignId, adSetIds, creativeIds, adIds };
}
