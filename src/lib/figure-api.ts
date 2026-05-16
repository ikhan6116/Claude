/**
 * Figure Technologies HELOC API Client
 * Docs reference: https://api.figure.com
 */

// ─── Type Definitions ────────────────────────────────────────────────────────

export interface HELOCInquiryPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  propertyAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  estimatedHomeValue: number;
  currentMortgageBalance: number;
  requestedCreditLine: number;
  creditScoreRange: string; // e.g. "700-749"
  employmentStatus: string;
  annualIncome: number;
  loanPurpose: string;
  consentToTerms: boolean;
  partnerId: string;
  leadSource: string;
}

export interface InquiryResponse {
  inquiryId: string;
  status: string;
  createdAt: string;
  estimatedApr?: number;
  prequalifiedAmount?: number;
}

export interface OfferResponse {
  offerId: string;
  inquiryId: string;
  apr: number;
  creditLimit: number;
  drawPeriodMonths: number;
  repaymentPeriodMonths: number;
  monthlyPaymentEstimate: number;
  expiresAt: string;
}

export interface InquiryStatusResponse {
  inquiryId: string;
  status: string;
  updatedAt: string;
  offer?: OfferResponse;
}

// ─── Error Classes ────────────────────────────────────────────────────────────

export class FigureApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly responseBody: unknown
  ) {
    super(message);
    this.name = 'FigureApiError';
  }
}

// ─── Client ──────────────────────────────────────────────────────────────────

interface FigureApiClientConfig {
  baseUrl?: string;
  apiKey?: string;
  partnerId?: string;
}

export class FigureApiClient {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly partnerId: string;
  private readonly maxRetries = 3;
  private readonly retryBaseDelayMs = 500;

  constructor(config: FigureApiClientConfig = {}) {
    this.baseUrl =
      config.baseUrl ||
      process.env.FIGURE_API_BASE_URL ||
      'https://api.figure.com';
    this.apiKey = config.apiKey || process.env.FIGURE_API_KEY || '';
    this.partnerId =
      config.partnerId || process.env.FIGURE_PARTNER_ID || '';

    if (!this.apiKey) {
      console.warn(
        '[FigureApiClient] FIGURE_API_KEY is not set. Requests will fail authentication.'
      );
    }
  }

  // ─── Private Helpers ───────────────────────────────────────────────────────

  private buildHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${this.apiKey}`,
      'X-Partner-Id': this.partnerId,
      'X-Request-Id': crypto.randomUUID(),
    };
  }

  private log(direction: 'REQ' | 'RES', method: string, url: string, data?: unknown) {
    const timestamp = new Date().toISOString();
    const safeData = data ? JSON.stringify(data, this.redactSensitive.bind(this)) : '';
    console.log(`[FigureAPI] [${timestamp}] [${direction}] ${method} ${url}${safeData ? ` | ${safeData}` : ''}`);
  }

  private redactSensitive(_key: string, value: unknown): unknown {
    const sensitiveKeys = ['email', 'phone', 'firstName', 'lastName', 'street', 'apiKey'];
    if (sensitiveKeys.includes(_key) && typeof value === 'string') {
      return value.slice(0, 2) + '***';
    }
    return value;
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private isRetryableStatusCode(status: number): boolean {
    return status === 429 || status === 502 || status === 503 || status === 504;
  }

  private async request<T>(
    method: 'GET' | 'POST' | 'PATCH',
    path: string,
    body?: unknown
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const headers = this.buildHeaders();

    this.log('REQ', method, url, body);

    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const response = await fetch(url, {
          method,
          headers,
          body: body ? JSON.stringify(body) : undefined,
        });

        let responseBody: unknown;
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          responseBody = await response.json();
        } else {
          responseBody = await response.text();
        }

        this.log('RES', method, url, { status: response.status, body: responseBody });

        if (!response.ok) {
          if (this.isRetryableStatusCode(response.status) && attempt < this.maxRetries) {
            const delay = this.retryBaseDelayMs * Math.pow(2, attempt - 1);
            console.warn(
              `[FigureAPI] Attempt ${attempt}/${this.maxRetries} failed with ${response.status}. Retrying in ${delay}ms...`
            );
            await this.sleep(delay);
            continue;
          }

          throw new FigureApiError(
            `Figure API error: ${response.status} ${response.statusText}`,
            response.status,
            responseBody
          );
        }

        return responseBody as T;
      } catch (err) {
        if (err instanceof FigureApiError) {
          throw err; // Don't retry on explicit API errors (non-retryable)
        }

        lastError = err instanceof Error ? err : new Error(String(err));

        if (attempt < this.maxRetries) {
          const delay = this.retryBaseDelayMs * Math.pow(2, attempt - 1);
          console.warn(
            `[FigureAPI] Network error on attempt ${attempt}/${this.maxRetries}. Retrying in ${delay}ms...`,
            lastError.message
          );
          await this.sleep(delay);
        }
      }
    }

    throw lastError || new Error(`[FigureAPI] Request failed after ${this.maxRetries} attempts`);
  }

  // ─── Public Methods ────────────────────────────────────────────────────────

  /**
   * Submit a new HELOC inquiry to Figure.
   * POST /v1/inquiries
   */
  async createInquiry(data: HELOCInquiryPayload): Promise<InquiryResponse> {
    return this.request<InquiryResponse>('POST', '/v1/inquiries', data);
  }

  /**
   * Retrieve an offer for a completed inquiry.
   * GET /v1/inquiries/{id}/offer
   */
  async getOffer(inquiryId: string): Promise<OfferResponse> {
    return this.request<OfferResponse>('GET', `/v1/inquiries/${inquiryId}/offer`);
  }

  /**
   * Get the current status of an inquiry, optionally including offer details.
   * GET /v1/inquiries/{id}
   */
  async getInquiryStatus(inquiryId: string): Promise<InquiryStatusResponse> {
    return this.request<InquiryStatusResponse>('GET', `/v1/inquiries/${inquiryId}`);
  }
}

// Singleton export for use across the app
export const figureApiClient = new FigureApiClient();
