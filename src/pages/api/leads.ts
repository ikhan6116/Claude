import type { NextApiRequest, NextApiResponse } from 'next';

interface LeadData {
  firstName: string;
  lastName?: string;
  email: string;
  phone: string;
  debtAmount: string;
  debtType?: string;
  state?: string;
  message?: string;
  source: string;
  submittedAt: string;
}

function isBusinessHours(): boolean {
  const now = new Date();
  const estOffset = -5;
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const est = new Date(utc + 3600000 * estOffset);
  const hour = est.getHours();
  const day = est.getDay();
  return day >= 1 && day <= 5 && hour >= 9 && hour < 18;
}

async function sendToCRM(lead: LeadData): Promise<boolean> {
  const crmWebhookUrl = process.env.CRM_WEBHOOK_URL;
  if (!crmWebhookUrl) {
    console.warn('CRM_WEBHOOK_URL not configured');
    return false;
  }

  try {
    const response = await fetch(crmWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contact: {
          first_name: lead.firstName,
          last_name: lead.lastName || '',
          email: lead.email,
          phone: lead.phone,
          state: lead.state || '',
        },
        deal: {
          name: `Debt Relief Lead - ${lead.firstName} ${lead.lastName || ''}`,
          debt_amount: lead.debtAmount,
          debt_type: lead.debtType || '',
          source: lead.source,
        },
        metadata: {
          submitted_at: lead.submittedAt,
          is_business_hours: isBusinessHours(),
          message: lead.message || '',
        },
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('CRM webhook failed:', error);
    return false;
  }
}

async function triggerLiveTransfer(lead: LeadData): Promise<boolean> {
  const liveTransferUrl = process.env.LIVE_TRANSFER_WEBHOOK_URL;
  if (!liveTransferUrl) return false;

  try {
    const response = await fetch(liveTransferUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'live_transfer',
        lead: {
          first_name: lead.firstName,
          last_name: lead.lastName || '',
          email: lead.email,
          phone: lead.phone,
          debt_amount: lead.debtAmount,
          debt_type: lead.debtType || '',
          state: lead.state || '',
          source: lead.source,
        },
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Live transfer webhook failed:', error);
    return false;
  }
}

async function addToMailerLite(lead: LeadData, groupIds: string[]): Promise<boolean> {
  const apiKey = process.env.MAILERLITE_API_KEY;
  if (!apiKey) {
    console.warn('MAILERLITE_API_KEY not configured');
    return false;
  }

  try {
    const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        email: lead.email,
        fields: {
          name: lead.firstName,
          last_name: lead.lastName || '',
          phone: lead.phone,
          state: lead.state || '',
          debt_amount: lead.debtAmount,
          debt_type: lead.debtType || '',
          lead_source: lead.source,
        },
        groups: groupIds,
        status: 'active',
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('MailerLite API failed:', error);
    return false;
  }
}

async function triggerNurtureCampaign(lead: LeadData): Promise<boolean> {
  // Add to MailerLite "After Hours Leads" group — triggers nurture automation
  const afterHoursGroupId = process.env.MAILERLITE_GROUP_AFTER_HOURS;
  const allLeadsGroupId = process.env.MAILERLITE_GROUP_ALL_LEADS;
  const groups = [allLeadsGroupId, afterHoursGroupId].filter(Boolean) as string[];

  if (groups.length > 0) {
    return addToMailerLite(lead, groups);
  }

  // Fallback to webhook if MailerLite not configured
  const nurtureUrl = process.env.NURTURE_WEBHOOK_URL;
  if (!nurtureUrl) return false;

  try {
    const response = await fetch(nurtureUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'start_nurture',
        lead: {
          first_name: lead.firstName,
          last_name: lead.lastName || '',
          email: lead.email,
          phone: lead.phone,
          debt_amount: lead.debtAmount,
          source: lead.source,
        },
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Nurture webhook failed:', error);
    return false;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const lead: LeadData = req.body;

  // Basic validation
  if (!lead.firstName || !lead.email || !lead.phone || !lead.debtAmount) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(lead.email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  try {
    // 1. Always send to Make.com webhook (routes to CRM)
    const crmSuccess = await sendToCRM(lead);

    // 2. Always add to MailerLite "All Leads" group
    const allLeadsGroupId = process.env.MAILERLITE_GROUP_ALL_LEADS;
    if (allLeadsGroupId) {
      await addToMailerLite(lead, [allLeadsGroupId]);
    }

    // 3. Route based on business hours
    if (isBusinessHours()) {
      // During business hours: trigger live transfer to sales agent
      await triggerLiveTransfer(lead);
    } else {
      // After hours: add to nurture group to trigger email automation
      await triggerNurtureCampaign(lead);
    }

    return res.status(200).json({
      success: true,
      message: 'Lead submitted successfully',
      crm_synced: crmSuccess,
    });
  } catch (error) {
    console.error('Lead processing error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
