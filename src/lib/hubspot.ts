const HUBSPOT_API_BASE = 'https://api.hubapi.com';

export interface HubSpotContactData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  leadSource?: string;
  softPullScore?: number | null;
  totalDebtBalance?: number | null;
  loanRequestAmount?: number | null;
  estimatedFico?: string;
  loanPurpose?: string;
  unsecuredDebtBalance?: number | null;
  consentGranted?: boolean;
  consentTimestamp?: string;
}

interface HubSpotApiResponse {
  id: string;
  properties: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export class HubSpotClient {
  private readonly apiKey: string;

  constructor() {
    this.apiKey = process.env.HUBSPOT_API_KEY || '';
    if (!this.apiKey) {
      console.warn('[HubSpot] HUBSPOT_API_KEY is not set.');
    }
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown
  ): Promise<T> {
    const response = await fetch(`${HUBSPOT_API_BASE}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`[HubSpot] API error ${response.status}:`, errorBody);
      throw new Error(`HubSpot API returned ${response.status}: ${errorBody}`);
    }

    return response.json() as Promise<T>;
  }

  async createOrUpdateContact(data: HubSpotContactData): Promise<{ contactId: string }> {
    if (!this.apiKey) {
      console.warn('[HubSpot] Skipping — API key not configured');
      return { contactId: '' };
    }

    const properties: Record<string, string | number> = {
      firstname: data.firstName,
      lastname: data.lastName,
      email: data.email,
      phone: data.phone,
    };

    if (data.address) properties.address = data.address;
    if (data.city) properties.city = data.city;
    if (data.state) properties.state = data.state;
    if (data.zip) properties.zip = data.zip;
    if (data.leadSource) properties.hs_lead_status = data.leadSource;

    if (data.softPullScore != null) properties.soft_pull_score = data.softPullScore;
    if (data.totalDebtBalance != null) properties.total_debt_balance = data.totalDebtBalance;
    if (data.loanRequestAmount != null) properties.loan_request_amount = data.loanRequestAmount;
    if (data.estimatedFico) properties.estimated_fico_range = data.estimatedFico;
    if (data.loanPurpose) properties.loan_purpose = data.loanPurpose;
    if (data.unsecuredDebtBalance != null) properties.unsecured_debt_balance = data.unsecuredDebtBalance;
    if (data.consentGranted != null) properties.credit_inquiry_consent = data.consentGranted ? 'true' : 'false';
    if (data.consentTimestamp) properties.consent_timestamp = data.consentTimestamp;

    try {
      const existing = await this.searchContactByEmail(data.email);

      if (existing) {
        await this.request<HubSpotApiResponse>(
          'PATCH',
          `/crm/v3/objects/contacts/${existing}`,
          { properties }
        );
        return { contactId: existing };
      }

      const created = await this.request<HubSpotApiResponse>(
        'POST',
        '/crm/v3/objects/contacts',
        { properties }
      );
      return { contactId: created.id };
    } catch (error) {
      console.error('[HubSpot] createOrUpdateContact failed:', error);
      throw error;
    }
  }

  private async searchContactByEmail(email: string): Promise<string | null> {
    try {
      const result = await this.request<{ total: number; results: HubSpotApiResponse[] }>(
        'POST',
        '/crm/v3/objects/contacts/search',
        {
          filterGroups: [{
            filters: [{
              propertyName: 'email',
              operator: 'EQ',
              value: email,
            }],
          }],
          limit: 1,
        }
      );

      return result.total > 0 ? result.results[0].id : null;
    } catch {
      return null;
    }
  }

  async triggerWorkflow(contactId: string, workflowId: string): Promise<boolean> {
    if (!this.apiKey || !contactId) return false;

    try {
      await this.request(
        'POST',
        `/automation/v4/actions/${workflowId}/executions`,
        { objectId: contactId, objectType: 'CONTACT' }
      );
      return true;
    } catch (error) {
      console.error('[HubSpot] Workflow trigger failed:', error);
      return false;
    }
  }
}

export const hubspotClient = new HubSpotClient();
