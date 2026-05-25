/**
 * Meta Marketing API v20 client for BrightPath HELOC campaigns.
 * Special Ad Category: CREDIT — targeting restrictions apply.
 * Docs: https://developers.facebook.com/docs/marketing-apis
 */

const META_API_BASE = 'https://graph.facebook.com/v20.0'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CampaignConfig {
  name: string
  dailyBudgetCents: number   // e.g. 5000 = $50.00/day
  startTime?: string         // ISO 8601 — defaults to now
  endTime?: string           // ISO 8601 — optional
}

export interface AdSetConfig {
  campaignId: string
  name: string
  ageMin?: number            // default 25
  ageMax?: number            // default 65
  geoLocations?: string[]    // country codes, default ['US']
}

export interface AdCreativeConfig {
  name: string
  pageId: string
  headline: string
  body: string
  description: string
  callToAction: string       // e.g. 'APPLY_NOW', 'LEARN_MORE', 'GET_QUOTE'
  linkUrl: string
  imageUrl?: string          // optional image; if omitted uses link preview
}

export interface LaunchResult {
  campaignId: string
  adSetId: string
  adCreativeId: string
  adId: string
}

// ─── Error ────────────────────────────────────────────────────────────────────

export class MetaAdsError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly responseBody: unknown
  ) {
    super(message)
    this.name = 'MetaAdsError'
  }
}

// ─── Client ──────────────────────────────────────────────────────────────────

export class MetaAdsClient {
  private readonly accessToken: string
  private readonly adAccountId: string
  private readonly pageId: string

  constructor() {
    this.accessToken = process.env.META_ACCESS_TOKEN || ''
    this.adAccountId = process.env.META_AD_ACCOUNT_ID || 'act_1983182402558788'
    this.pageId = process.env.META_PAGE_ID || '102255392793329'

    if (!this.accessToken) {
      throw new Error('META_ACCESS_TOKEN is not set')
    }
  }

  private async call<T>(
    method: 'GET' | 'POST' | 'DELETE',
    path: string,
    params: Record<string, unknown> = {}
  ): Promise<T> {
    const url = new URL(`${META_API_BASE}${path}`)
    url.searchParams.set('access_token', this.accessToken)

    const options: RequestInit = { method }

    if (method === 'POST') {
      options.headers = { 'Content-Type': 'application/json' }
      options.body = JSON.stringify(params)
    } else if (method === 'GET') {
      for (const [k, v] of Object.entries(params)) {
        url.searchParams.set(k, String(v))
      }
    }

    const res = await fetch(url.toString(), options)
    const json = await res.json() as Record<string, unknown>

    if (!res.ok || json.error) {
      const err = json.error as Record<string, unknown> | undefined
      throw new MetaAdsError(
        String(err?.message ?? `Meta API error ${res.status}`),
        res.status,
        json
      )
    }

    return json as T
  }

  /**
   * Step 1 — Create campaign with CREDIT special ad category.
   */
  async createCampaign(config: CampaignConfig): Promise<string> {
    const data = await this.call<{ id: string }>('POST', `/${this.adAccountId}/campaigns`, {
      name: config.name,
      objective: 'OUTCOME_LEADS',
      special_ad_categories: ['CREDIT'],
      status: 'PAUSED',          // start paused; activate manually or via activateCampaign()
      daily_budget: config.dailyBudgetCents,
      ...(config.startTime ? { start_time: config.startTime } : {}),
      ...(config.endTime ? { end_time: config.endTime } : {}),
    })
    return data.id
  }

  /**
   * Step 2 — Create ad set. CREDIT category restricts age/gender/zip targeting.
   */
  async createAdSet(config: AdSetConfig): Promise<string> {
    const data = await this.call<{ id: string }>('POST', `/${this.adAccountId}/adsets`, {
      name: config.name,
      campaign_id: config.campaignId,
      billing_event: 'IMPRESSIONS',
      optimization_goal: 'LEAD_GENERATION',
      bid_strategy: 'LOWEST_COST_WITHOUT_CAP',
      status: 'PAUSED',
      targeting: {
        age_min: config.ageMin ?? 25,
        age_max: config.ageMax ?? 65,
        geo_locations: {
          countries: config.geoLocations ?? ['US'],
        },
        // CREDIT category prohibits interest/behavioral targeting
      },
    })
    return data.id
  }

  /**
   * Step 3 — Create ad creative.
   */
  async createAdCreative(config: AdCreativeConfig): Promise<string> {
    const data = await this.call<{ id: string }>('POST', `/${this.adAccountId}/adcreatives`, {
      name: config.name,
      object_story_spec: {
        page_id: config.pageId,
        link_data: {
          message: config.body,
          link: config.linkUrl,
          name: config.headline,
          description: config.description,
          call_to_action: {
            type: config.callToAction,
            value: { link: config.linkUrl },
          },
          ...(config.imageUrl ? { picture: config.imageUrl } : {}),
        },
      },
    })
    return data.id
  }

  /**
   * Step 4 — Create ad linking ad set + creative.
   */
  async createAd(adSetId: string, creativeId: string, name: string): Promise<string> {
    const data = await this.call<{ id: string }>('POST', `/${this.adAccountId}/ads`, {
      name,
      adset_id: adSetId,
      creative: { creative_id: creativeId },
      status: 'PAUSED',
    })
    return data.id
  }

  /**
   * Activate a campaign (set status to ACTIVE).
   */
  async activateCampaign(campaignId: string): Promise<void> {
    await this.call('POST', `/${campaignId}`, { status: 'ACTIVE' })
  }

  /**
   * Full launch: campaign → ad set → creative → ad, all in PAUSED state.
   * Activate separately once reviewed.
   */
  async launchHELOCCampaign(
    campaign: CampaignConfig,
    adSet: Omit<AdSetConfig, 'campaignId'>,
    creative: Omit<AdCreativeConfig, 'pageId'>
  ): Promise<LaunchResult> {
    const campaignId = await this.createCampaign(campaign)
    const adSetId = await this.createAdSet({ ...adSet, campaignId })
    const adCreativeId = await this.createAdCreative({ ...creative, pageId: this.pageId })
    const adId = await this.createAd(adSetId, adCreativeId, `${campaign.name} — Ad`)

    return { campaignId, adSetId, adCreativeId, adId }
  }
}
