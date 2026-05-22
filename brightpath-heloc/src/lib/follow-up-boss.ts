/**
 * Follow Up Boss CRM API Client
 * Auth: HTTP Basic — username = API key, password = empty string
 * Base URL: https://api.followupboss.com/v1
 */

// ─── Type Definitions ────────────────────────────────────────────────────────

export interface FUBLeadPayload {
  firstName: string
  lastName: string
  email: string
  phone: string
  source: string
  propertyAddress?: string
  estimatedHomeValue?: number
  currentMortgageBalance?: number
  requestedCreditLine?: number
  loanPurpose?: string
  creditScoreRange?: string
  employmentStatus?: string
  annualIncome?: number
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
}

export interface FUBPerson {
  id: number
  name: string
  email: string
  phone: string
  source: string
}

interface FUBApiResponse {
  id: number
  firstName?: string
  lastName?: string
  name?: string
  emails?: Array<{ value: string; type: string }>
  phones?: Array<{ value: string; type: string }>
  source?: string
}

// ─── Error Class ─────────────────────────────────────────────────────────────

export class FUBApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly responseBody: unknown
  ) {
    super(message)
    this.name = 'FUBApiError'
  }
}

// ─── Client ──────────────────────────────────────────────────────────────────

export class FollowUpBossClient {
  private readonly baseUrl = 'https://api.followupboss.com/v1'
  private readonly apiKey: string

  constructor() {
    this.apiKey = process.env.FUB_API_KEY || ''
    if (!this.apiKey) {
      console.warn('[FollowUpBoss] FUB_API_KEY is not set. Requests will fail authentication.')
    }
  }

  private buildHeaders(): Record<string, string> {
    // FUB uses HTTP Basic Auth: username = API key, password = empty string
    const credentials = Buffer.from(`${this.apiKey}:`).toString('base64')
    return {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Basic ${credentials}`,
      'X-System': 'BrightPath-HELOC',
      'X-System-Key': this.apiKey,
    }
  }

  private buildNote(payload: FUBLeadPayload): string {
    const lines: string[] = ['HELOC Application — BrightPath Finance']
    if (payload.propertyAddress) lines.push(`Property Address: ${payload.propertyAddress}`)
    if (payload.estimatedHomeValue != null)
      lines.push(`Estimated Home Value: $${payload.estimatedHomeValue.toLocaleString()}`)
    if (payload.currentMortgageBalance != null)
      lines.push(`Current Mortgage Balance: $${payload.currentMortgageBalance.toLocaleString()}`)
    if (payload.requestedCreditLine != null)
      lines.push(`Requested Credit Line: $${payload.requestedCreditLine.toLocaleString()}`)
    if (payload.loanPurpose) lines.push(`Loan Purpose: ${payload.loanPurpose}`)
    if (payload.creditScoreRange) lines.push(`Credit Score Range: ${payload.creditScoreRange}`)
    if (payload.employmentStatus) lines.push(`Employment Status: ${payload.employmentStatus}`)
    if (payload.annualIncome != null)
      lines.push(`Annual Income: $${payload.annualIncome.toLocaleString()}`)
    if (payload.utmSource) lines.push(`UTM Source: ${payload.utmSource}`)
    if (payload.utmMedium) lines.push(`UTM Medium: ${payload.utmMedium}`)
    if (payload.utmCampaign) lines.push(`UTM Campaign: ${payload.utmCampaign}`)
    return lines.join('\n')
  }

  private log(direction: 'REQ' | 'RES', method: string, path: string, data?: unknown) {
    const timestamp = new Date().toISOString()
    const snippet = data ? JSON.stringify(data).slice(0, 200) : ''
    console.log(
      `[FollowUpBoss] [${timestamp}] [${direction}] ${method} ${path}${snippet ? ` | ${snippet}` : ''}`
    )
  }

  /**
   * Create a new lead/person in Follow Up Boss.
   * POST /people
   */
  async createLead(payload: FUBLeadPayload): Promise<FUBPerson> {
    const url = `${this.baseUrl}/people`
    const body = {
      firstName: payload.firstName,
      lastName: payload.lastName,
      emails: [{ value: payload.email, type: 'home' }],
      phones: [{ value: payload.phone, type: 'mobile' }],
      source: 'BrightPath HELOC Campaign',
      tags: ['HELOC', 'BrightPath'],
      note: this.buildNote(payload),
    }

    this.log('REQ', 'POST', '/people', {
      firstName: payload.firstName,
      lastName: payload.lastName,
      source: body.source,
    })

    const response = await fetch(url, {
      method: 'POST',
      headers: this.buildHeaders(),
      body: JSON.stringify(body),
    })

    let responseBody: unknown
    const contentType = response.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      responseBody = await response.json()
    } else {
      responseBody = await response.text()
    }

    this.log('RES', 'POST', '/people', { status: response.status })

    if (!response.ok) {
      console.error('[FollowUpBoss] createLead failed:', response.status, responseBody)
      throw new FUBApiError(
        `Follow Up Boss API error: ${response.status} ${response.statusText}`,
        response.status,
        responseBody
      )
    }

    const data = responseBody as FUBApiResponse
    return {
      id: data.id,
      name: data.name || `${payload.firstName} ${payload.lastName}`,
      email: payload.email,
      phone: payload.phone,
      source: 'BrightPath HELOC Campaign',
    }
  }
}

// Singleton export
export const followUpBossClient = new FollowUpBossClient()
