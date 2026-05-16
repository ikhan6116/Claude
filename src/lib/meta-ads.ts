/**
 * Meta (Facebook / Instagram) Marketing API client — v19.0
 * Docs: https://developers.facebook.com/docs/marketing-apis
 */

const META_API_VERSION = 'v19.0';
const META_API_BASE = `https://graph.facebook.com/${META_API_VERSION}`;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MetaApiError {
  error: {
    message: string;
    type: string;
    code: number;
    fbtrace_id: string;
  };
}

export interface Targeting {
  age_min: number;
  age_max: number;
  genders?: number[]; // 1 = male, 2 = female
  geo_locations: {
    countries: string[];
  };
  interests?: Array<{ id: string; name: string }>;
  behaviors?: Array<{ id: string; name: string }>;
  home_ownership?: Array<{ id: string; name: string }>;
  life_events?: Array<{ id: string; name: string }>;
}

export interface AdInsights {
  adId: string;
  impressions: number;
  clicks: number;
  spend: number;
  ctr: number;
  cpc: number;
  cpp: number;
  reach: number;
  conversions: number;
  dateStart: string;
  dateStop: string;
}

export interface HELOCAdCreative {
  message: string;
  headline: string;
  description: string;
  cta: string;
}

// ─── Pre-Written HELOC Ad Creatives ──────────────────────────────────────────

export const HELOCAdCreatives: HELOCAdCreative[] = [
  {
    message:
      "Your home's equity is working capital waiting to be unlocked. With a Figure HELOC, qualified homeowners can access up to $400,000 at competitive rates — with no closing costs and funding in as few as 5 days. Whether you're renovating your kitchen, paying off high-interest debt, or building a financial cushion, your equity can make it happen.",
    headline: 'Tap Into Your Home Equity — Rates From 8.50% APR',
    description:
      'No closing costs. No branch visit required. Apply online in minutes and get a same-day decision.',
    cta: 'Check My Rate',
  },
  {
    message:
      "Credit card debt averaging 24% APR? There's a smarter way to pay it off. Homeowners are using Figure HELOCs to consolidate high-interest debt into one manageable monthly payment at a fraction of the rate. Keep more of your paycheck — stop handing it to the credit card companies.",
    headline: 'Pay Off High-Interest Debt With Your Home Equity',
    description:
      'Consolidate up to $400K in debt at rates far below credit card APRs. See your personalized rate in 3 minutes.',
    cta: 'Get My Rate',
  },
  {
    message:
      'Dream kitchen. Master suite addition. Solar panels. Whatever your home improvement project looks like, a Figure HELOC gives you the flexible funding to make it happen — and potentially increase your property value at the same time. Draw only what you need, when you need it.',
    headline: "Fund Your Dream Renovation With Your Home's Equity",
    description:
      'A revolving credit line up to $400,000. Only pay interest on what you draw. Apply in minutes.',
    cta: 'Start My Application',
  },
];

// ─── HELOC Targeting Preset ───────────────────────────────────────────────────

export const HELOC_TARGETING: Targeting = {
  age_min: 35,
  age_max: 65,
  geo_locations: {
    countries: ['US'],
  },
  home_ownership: [{ id: '6006371500783', name: 'Homeowners' }],
  interests: [
    { id: '6003107902433', name: 'Home improvement' },
    { id: '6003348604981', name: 'Real estate' },
    { id: '6003145721886', name: 'Personal finance' },
    { id: '6002925966230', name: 'Refinancing' },
  ],
  life_events: [{ id: '6002714398172', name: 'Recently moved' }],
};

// ─── Client Class ─────────────────────────────────────────────────────────────

interface MetaAdsClientConfig {
  accessToken?: string;
  adAccountId?: string;
  appId?: string;
}

export class MetaAdsClient {
  private readonly accessToken: string;
  private readonly adAccountId: string; // includes "act_" prefix
  private readonly appId: string;

  constructor(config: MetaAdsClientConfig = {}) {
    this.accessToken =
      config.accessToken || process.env.META_ACCESS_TOKEN || '';
    this.adAccountId =
      config.adAccountId || process.env.META_AD_ACCOUNT_ID || '';
    this.appId = config.appId || process.env.META_APP_ID || '';

    if (!this.accessToken) {
      console.warn('[MetaAdsClient] META_ACCESS_TOKEN is not set.');
    }
    if (!this.adAccountId) {
      console.warn('[MetaAdsClient] META_AD_ACCOUNT_ID is not set.');
    }
  }

  // ─── Private Helpers ─────────────────────────────────────────────────────

  private url(path: string): string {
    return `${META_API_BASE}/${path}`;
  }

  private async request<T>(
    method: 'GET' | 'POST' | 'DELETE',
    path: string,
    params?: Record<string, unknown>
  ): Promise<T> {
    let url = this.url(path);
    const init: RequestInit = { method };

    if (method === 'GET') {
      const qs = new URLSearchParams({
        access_token: this.accessToken,
        ...(params
          ? Object.fromEntries(
              Object.entries(params).map(([k, v]) => [
                k,
                typeof v === 'object' ? JSON.stringify(v) : String(v),
              ])
            )
          : {}),
      });
      url = `${url}?${qs.toString()}`;
    } else {
      const body = new URLSearchParams();
      body.set('access_token', this.accessToken);
      if (params) {
        for (const [k, v] of Object.entries(params)) {
          body.set(k, typeof v === 'object' ? JSON.stringify(v) : String(v));
        }
      }
      init.body = body;
      init.headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    }

    console.log(`[MetaAds] ${method} ${path}`);

    const response = await fetch(url, init);
    const data = (await response.json()) as T | MetaApiError;

    if (!response.ok || (data as MetaApiError).error) {
      const err = (data as MetaApiError).error;
      throw new Error(
        `[MetaAds] API error ${err?.code ?? response.status}: ${err?.message ?? 'Unknown error'}`
      );
    }

    return data as T;
  }

  // ─── Public Methods ───────────────────────────────────────────────────────

  /**
   * Create a new ad campaign.
   * @param name Campaign name
   * @param objective e.g. "OUTCOME_LEADS", "OUTCOME_TRAFFIC", "OUTCOME_AWARENESS"
   * @param dailyBudgetCents Daily budget in cents (e.g. 5000 = $50.00)
   */
  async createCampaign(
    name: string,
    objective: string,
    dailyBudgetCents: number
  ): Promise<{ id: string }> {
    return this.request<{ id: string }>('POST', `${this.adAccountId}/campaigns`, {
      name,
      objective,
      daily_budget: dailyBudgetCents,
      status: 'PAUSED', // Start paused — activate manually after review
      special_ad_categories: ['CREDIT'], // HELOC is a credit product
    });
  }

  /**
   * Create an ad set within a campaign.
   * @param campaignId Parent campaign ID
   * @param name Ad set name
   * @param targeting Targeting spec object
   * @param dailyBudgetCents Daily budget in cents
   * @param bidAmountCents Bid amount in cents (ignored for some bid strategies)
   */
  async createAdSet(
    campaignId: string,
    name: string,
    targeting: Targeting,
    dailyBudgetCents: number,
    bidAmountCents: number
  ): Promise<{ id: string }> {
    return this.request<{ id: string }>('POST', `${this.adAccountId}/adsets`, {
      name,
      campaign_id: campaignId,
      daily_budget: dailyBudgetCents,
      bid_amount: bidAmountCents,
      billing_event: 'IMPRESSIONS',
      optimization_goal: 'LEAD_GENERATION',
      targeting: JSON.stringify(targeting),
      status: 'PAUSED',
      // 30-day attribution window
      attribution_spec: JSON.stringify([
        { event_type: 'CLICK_THROUGH', window_days: 1 },
        { event_type: 'VIEW_THROUGH', window_days: 1 },
      ]),
    });
  }

  /**
   * Create an ad creative (the visual/copy asset).
   * @param pageId Facebook Page ID to associate the ad with
   * @param name Creative name (internal label)
   * @param message Primary ad copy
   * @param headline Bold headline text
   * @param description Secondary description
   * @param linkUrl Destination URL
   * @param imageUrl Publicly accessible image URL
   */
  async createAdCreative(
    pageId: string,
    name: string,
    message: string,
    headline: string,
    description: string,
    linkUrl: string,
    imageUrl: string
  ): Promise<{ id: string }> {
    return this.request<{ id: string }>('POST', `${this.adAccountId}/adcreatives`, {
      name,
      object_story_spec: JSON.stringify({
        page_id: pageId,
        link_data: {
          link: linkUrl,
          message,
          name: headline,
          description,
          image_url: imageUrl,
          call_to_action: {
            type: 'APPLY_NOW',
            value: { link: linkUrl },
          },
        },
      }),
    });
  }

  /**
   * Create an individual ad (ties an ad set to a creative).
   * @param adSetId Parent ad set ID
   * @param creativeId Creative ID from createAdCreative
   * @param name Internal ad name
   */
  async createAd(
    adSetId: string,
    creativeId: string,
    name: string
  ): Promise<{ id: string }> {
    return this.request<{ id: string }>('POST', `${this.adAccountId}/ads`, {
      name,
      adset_id: adSetId,
      creative: JSON.stringify({ creative_id: creativeId }),
      status: 'PAUSED',
    });
  }

  /**
   * Fetch performance insights for a specific ad.
   * @param adId Meta ad ID
   * @param datePreset e.g. "last_7d", "last_30d", "last_90d", "today"
   */
  async getAdInsights(adId: string, datePreset: string): Promise<AdInsights> {
    interface RawInsights {
      data: Array<{
        impressions: string;
        clicks: string;
        spend: string;
        ctr: string;
        cpc: string;
        cpp: string;
        reach: string;
        actions?: Array<{ action_type: string; value: string }>;
        date_start: string;
        date_stop: string;
      }>;
    }

    const raw = await this.request<RawInsights>('GET', `${adId}/insights`, {
      date_preset: datePreset,
      fields: 'impressions,clicks,spend,ctr,cpc,cpp,reach,actions,date_start,date_stop',
    });

    const row = raw.data?.[0];
    if (!row) {
      return {
        adId,
        impressions: 0,
        clicks: 0,
        spend: 0,
        ctr: 0,
        cpc: 0,
        cpp: 0,
        reach: 0,
        conversions: 0,
        dateStart: '',
        dateStop: '',
      };
    }

    const conversions =
      row.actions
        ?.filter((a) => a.action_type === 'lead')
        .reduce((sum, a) => sum + parseFloat(a.value), 0) ?? 0;

    return {
      adId,
      impressions: parseInt(row.impressions, 10),
      clicks: parseInt(row.clicks, 10),
      spend: parseFloat(row.spend),
      ctr: parseFloat(row.ctr),
      cpc: parseFloat(row.cpc),
      cpp: parseFloat(row.cpp),
      reach: parseInt(row.reach, 10),
      conversions,
      dateStart: row.date_start,
      dateStop: row.date_stop,
    };
  }
}

// Singleton export
export const metaAdsClient = new MetaAdsClient();
