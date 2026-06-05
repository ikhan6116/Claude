const ARRAY_API_BASE = process.env.ARRAY_API_BASE_URL || 'https://api.array.com/v2';

export interface SoftPullRequest {
  firstName: string;
  lastName: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  dateOfBirth?: string;
  ssn?: string;
}

export interface SoftPullResponse {
  success: boolean;
  requestId: string;
  ficoScore: number | null;
  vantageScore: number | null;
  totalDebtBalance: number | null;
  tradelines: Array<{
    creditorName: string;
    accountType: string;
    balance: number;
    monthlyPayment: number;
    status: string;
  }>;
  error?: string;
}

export class SoftPullClient {
  private readonly apiKey: string;
  private readonly clientId: string;

  constructor() {
    this.apiKey = process.env.ARRAY_API_KEY || '';
    this.clientId = process.env.ARRAY_CLIENT_ID || '';

    if (!this.apiKey) {
      console.warn('[SoftPullClient] ARRAY_API_KEY is not set.');
    }
  }

  async executeSoftPull(data: SoftPullRequest): Promise<SoftPullResponse> {
    if (!this.apiKey || !this.clientId) {
      console.warn('[SoftPullClient] API credentials not configured, returning mock response');
      return this.getMockResponse(data);
    }

    try {
      const response = await fetch(`${ARRAY_API_BASE}/credit/soft-pull`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'X-Client-Id': this.clientId,
        },
        body: JSON.stringify({
          consumer: {
            firstName: data.firstName,
            lastName: data.lastName,
            address: {
              line1: data.address.street,
              city: data.address.city,
              state: data.address.state,
              postalCode: data.address.zipCode,
            },
            dateOfBirth: data.dateOfBirth,
            ssn: data.ssn,
          },
          products: ['credit_score', 'tradelines', 'debt_summary'],
          permissiblePurpose: 'PRESCREENED_CONSUMER_REPORT',
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error('[SoftPull] API error:', response.status, errorBody);
        throw new Error(`Soft pull API returned ${response.status}`);
      }

      const result = await response.json();

      return {
        success: true,
        requestId: result.requestId || result.id,
        ficoScore: result.creditScore?.fico ?? result.scores?.fico ?? null,
        vantageScore: result.creditScore?.vantage ?? result.scores?.vantage ?? null,
        totalDebtBalance: result.debtSummary?.totalBalance ?? null,
        tradelines: (result.tradelines || []).map((t: Record<string, unknown>) => ({
          creditorName: t.creditorName || t.subscriberName || '',
          accountType: t.accountType || '',
          balance: Number(t.currentBalance || t.balance || 0),
          monthlyPayment: Number(t.monthlyPayment || 0),
          status: t.accountStatus || t.status || '',
        })),
      };
    } catch (error) {
      console.error('[SoftPull] Request failed:', error);
      return {
        success: false,
        requestId: '',
        ficoScore: null,
        vantageScore: null,
        totalDebtBalance: null,
        tradelines: [],
        error: error instanceof Error ? error.message : 'Soft pull failed',
      };
    }
  }

  private getMockResponse(data: SoftPullRequest): SoftPullResponse {
    return {
      success: true,
      requestId: `mock-${Date.now()}`,
      ficoScore: null,
      vantageScore: null,
      totalDebtBalance: null,
      tradelines: [],
      error: 'API credentials not configured — mock response returned',
    };
  }
}

export const softPullClient = new SoftPullClient();
