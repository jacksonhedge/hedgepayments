import sgMail from '@sendgrid/mail';
import sgClient from '@sendgrid/client';

// Initialize SendGrid with API key
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || '';
sgMail.setApiKey(SENDGRID_API_KEY);
sgClient.setApiKey(SENDGRID_API_KEY);

// Email configuration
const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || 'noreply@hedgepayments.com';
const FROM_NAME = process.env.SENDGRID_FROM_NAME || 'SideBet';

// SMS configuration (Twilio via SendGrid)
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || '';
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || '';
const TWILIO_FROM_NUMBER = process.env.TWILIO_FROM_NUMBER || '';

export interface EmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  templateId?: string;
  dynamicTemplateData?: Record<string, any>;
  fromName?: string;
}

export interface SMSOptions {
  to: string;
  body: string;
}

/**
 * Send an email using SendGrid
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const msg: any = {
      to: options.to,
      from: {
        email: FROM_EMAIL,
        name: options.fromName || FROM_NAME
      },
      subject: options.subject,
      ...(options.text && { text: options.text }),
      ...(options.html && { html: options.html }),
      ...(options.templateId && {
        templateId: options.templateId,
        dynamicTemplateData: options.dynamicTemplateData || {}
      })
    };

    await sgMail.send(msg);
    console.log('Email sent successfully to:', options.to);
    return true;
  } catch (error: any) {
    console.error('Error sending email:', error);
    if (error?.response) {
      console.error(error.response.body);
    }
    return false;
  }
}

/**
 * Send multiple emails in batch
 */
export async function sendBulkEmail(recipients: string[], options: Omit<EmailOptions, 'to'>): Promise<boolean> {
  try {
    const messages = recipients.map(email => ({
      to: email,
      from: {
        email: FROM_EMAIL,
        name: FROM_NAME
      },
      subject: options.subject,
      ...(options.text && { text: options.text }),
      ...(options.html && { html: options.html }),
      ...(options.templateId && { 
        templateId: options.templateId,
        dynamicTemplateData: options.dynamicTemplateData || {}
      })
    }));

    await sgMail.send(messages as any);
    console.log(`Bulk email sent successfully to ${recipients.length} recipients`);
    return true;
  } catch (error: any) {
    console.error('Error sending bulk email:', error);
    if (error.response) {
      console.error(error.response.body);
    }
    return false;
  }
}

/**
 * Send SMS using Twilio (through SendGrid's parent company)
 * Note: This requires a Twilio account and phone number
 */
export async function sendSMS(options: SMSOptions): Promise<boolean> {
  const r = await sendSMSDetailed(options);
  return r.ok;
}

// Like sendSMS but returns Twilio's error code/message so callers can log a real reason.
export async function sendSMSDetailed(options: SMSOptions): Promise<{ ok: boolean; sid?: string; error?: string }> {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_FROM_NUMBER) {
    const missing = [!TWILIO_ACCOUNT_SID && 'TWILIO_ACCOUNT_SID', !TWILIO_AUTH_TOKEN && 'TWILIO_AUTH_TOKEN', !TWILIO_FROM_NUMBER && 'TWILIO_FROM_NUMBER'].filter(Boolean).join(', ');
    return { ok: false, error: `missing env: ${missing}` };
  }
  try {
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID.trim()}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + Buffer.from(`${TWILIO_ACCOUNT_SID.trim()}:${TWILIO_AUTH_TOKEN.trim()}`).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({ To: options.to, From: TWILIO_FROM_NUMBER.trim(), Body: options.body })
      }
    );
    const data: any = await response.json().catch(() => ({}));
    if (response.ok) {
      console.log('SMS sent successfully to:', options.to, data.sid);
      return { ok: true, sid: data.sid };
    }
    const error = `twilio ${response.status}${data.code ? ` code ${data.code}` : ''}: ${data.message || 'unknown error'}${data.more_info ? ` (${data.more_info})` : ''}`;
    console.error('Error sending SMS:', error);
    return { ok: false, error };
  } catch (error: any) {
    console.error('Error sending SMS:', error);
    return { ok: false, error: `network: ${error?.message || error}` };
  }
}

/**
 * Add email to SendGrid contact list
 */
export async function addToContactList(email: string, listId: string, customFields?: Record<string, any>): Promise<boolean> {
  try {
    const data = {
      list_ids: [listId],
      contacts: [{
        email,
        ...customFields
      }]
    };

    const request = {
      url: '/v3/marketing/contacts',
      method: 'PUT' as const,
      body: data
    };

    await sgClient.request(request);
    console.log('Contact added to list successfully:', email);
    return true;
  } catch (error: any) {
    console.error('Error adding contact to list:', error);
    return false;
  }
}

/**
 * Create or update a SendGrid contact
 */
export async function upsertContact(email: string, fields: Record<string, any> = {}): Promise<boolean> {
  try {
    const data = {
      contacts: [{
        email,
        ...fields
      }]
    };

    const request = {
      url: '/v3/marketing/contacts',
      method: 'PUT' as const,
      body: data
    };

    await sgClient.request(request);
    console.log('Contact upserted successfully:', email);
    return true;
  } catch (error: any) {
    console.error('Error upserting contact:', error);
    return false;
  }
}