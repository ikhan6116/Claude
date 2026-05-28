/**
 * Meta Marketing API v20 client for BrightPath HELOC campaigns.
 * Special Ad Category: CREDIT — targeting restrictions apply (age + geo only).
 * Docs: https://developers.facebook.com/docs/marketing-apis
 */

const META_API_BASE = 'https://graph.facebook.com/v20.0'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CampaignConfig {
  name: string
  startTime?: string         // ISO 8601 — defaults to now
  endTime?: string           // ISO 8601 — optional
}

export interface AdSetConfig {
  campaignId: string
  name: string
  dailyBudgetCents: number
  // Age and location exclusions are not permitted under FINANCIAL_PRODUCTS_SERVICES
}

export interface AdCreativeConfig {
  name: string
  pageId: string
  headline: string
  body: string
  description: string
  callToAction: string       // e.g. 'APPLY_NOW', 'LEARN_MORE', 'GET_QUOTE'
  linkUrl: string
  imageUrl?: string
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
    this.pageId      = process.env.META_PAGE_ID       || '102255392793329'

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
      const detail = err
        ? `[code ${err.code ?? '?'} / subcode ${err.error_subcode ?? '?'}] ${err.message} — ${err.error_user_msg ?? ''}`
        : `Meta API error ${res.status}`
      throw new MetaAdsError(detail, res.status, json)
    }

    return json as T
  }

  /**
   * Step 1 — Create campaign with CREDIT special ad category.
   * Budget lives on the ad set (no CBO) to keep setup simple.
   */
  async createCampaign(config: CampaignConfig): Promise<string> {
    const data = await this.call<{ id: string }>('POST', `/${this.adAccountId}/campaigns`, {
      name: config.name,
      objective: 'OUTCOME_TRAFFIC',
      special_ad_categories: ['FINANCIAL_PRODUCTS_SERVICES'],
      status: 'PAUSED',
      is_adset_budget_sharing_enabled: false,
      ...(config.startTime ? { start_time: config.startTime } : {}),
      ...(config.endTime   ? { end_time:   config.endTime   } : {}),
    })
    return data.id
  }

  /**
   * Step 2 — Create ad set targeting US minus ineligible states.
   * CREDIT category restricts targeting to age + geo only.
   * Budget is set here (ad set level) rather than campaign level.
   */
  async createAdSet(config: AdSetConfig): Promise<string> {
    const data = await this.call<{ id: string }>('POST', `/${this.adAccountId}/adsets`, {
      name: config.name,
      campaign_id: config.campaignId,
      daily_budget: config.dailyBudgetCents,
      billing_event: 'IMPRESSIONS',
      optimization_goal: 'LINK_CLICKS',
      bid_strategy: 'LOWEST_COST_WITHOUT_CAP',
      destination_type: 'WEBSITE',
      status: 'PAUSED',
      // FINANCIAL_PRODUCTS_SERVICES mandates age 18-65+ and no location exclusions
      targeting: {
        geo_locations: {
          countries: ['US'],
        },
      },
    })
    return data.id
  }

  /**
   * Step 3 — Create ad creative (link ad format).
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
   * Upload an image from a public URL into the ad account image library.
   * Returns the image hash used when building creatives.
   */
  async uploadImageFromUrl(imageUrl: string, name: string): Promise<string> {
    const data = await this.call<{ images: Record<string, { hash: string }> }>(
      'POST',
      `/${this.adAccountId}/adimages`,
      { url: imageUrl, name }
    )
    const first = Object.values(data.images)[0]
    if (!first?.hash) throw new MetaAdsError('No image hash returned', 200, data)
    return first.hash
  }

  /**
   * Create an ad creative using a pre-uploaded image hash.
   */
  async createAdCreativeWithHash(config: AdCreativeConfig & { imageHash: string }): Promise<string> {
    const data = await this.call<{ id: string }>('POST', `/${this.adAccountId}/adcreatives`, {
      name: config.name,
      object_story_spec: {
        page_id: config.pageId,
        link_data: {
          message: config.body,
          link: config.linkUrl,
          name: config.headline,
          description: config.description,
          image_hash: config.imageHash,
          call_to_action: {
            type: config.callToAction,
            value: { link: config.linkUrl },
          },
        },
      },
    })
    return data.id
  }

  /**
   * Add a new ad to an existing ad set using an image hosted at a public URL.
   */
  async addCreativeToAdSet(
    adSetId: string,
    imageUrl: string,
    adName: string,
    creative: Omit<AdCreativeConfig, 'pageId' | 'imageUrl'>
  ): Promise<{ adCreativeId: string; adId: string }> {
    const imageHash  = await this.uploadImageFromUrl(imageUrl, adName)
    const adCreativeId = await this.createAdCreativeWithHash({
      ...creative,
      pageId: this.pageId,
      imageHash,
    })
    const adId = await this.createAd(adSetId, adCreativeId, adName)
    return { adCreativeId, adId }
  }
  async activateCampaign(campaignId: string): Promise<void> {
    await this.call('POST', `/${campaignId}`, { status: 'ACTIVE' })
  }

  /**
   * Full launch: campaign → ad set → creative → ad, all PAUSED for review.
   */
  async launchHELOCCampaign(
    campaign: CampaignConfig,
    adSet: Omit<AdSetConfig, 'campaignId'>,
    creative: Omit<AdCreativeConfig, 'pageId'>
  ): Promise<LaunchResult> {

    const campaignId   = await this.createCampaign(campaign)
    const adSetId      = await this.createAdSet({ ...adSet, campaignId })
    const adCreativeId = await this.createAdCreative({ ...creative, pageId: this.pageId })
    const adId         = await this.createAd(adSetId, adCreativeId, `${campaign.name} — Ad`)

    return { campaignId, adSetId, adCreativeId, adId }
  }
}
