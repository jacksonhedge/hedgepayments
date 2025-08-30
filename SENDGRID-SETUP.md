# SendGrid Email & SMS Setup Guide

This guide will help you set up SendGrid for sending emails and Twilio (via SendGrid) for SMS in your Hedge Payments website.

## Prerequisites

1. **SendGrid Account**: Sign up at [sendgrid.com](https://sendgrid.com)
2. **Twilio Account** (optional, for SMS): Sign up at [twilio.com](https://twilio.com)

## SendGrid Setup

### 1. Get Your API Key

1. Log in to SendGrid
2. Go to Settings → API Keys
3. Click "Create API Key"
4. Choose "Full Access" or "Restricted Access" with at least:
   - Mail Send
   - Marketing → Contacts (if using contact lists)
5. Copy the API key immediately (you won't see it again!)

### 2. Verify Your Sender

1. Go to Settings → Sender Authentication
2. Choose either:
   - **Single Sender Verification** (easier for testing)
   - **Domain Authentication** (recommended for production)
3. Follow the verification steps

### 3. Create Dynamic Templates (Optional)

1. Go to Email API → Dynamic Templates
2. Create templates for:
   - Waitlist Welcome Email
   - Launch Announcement
   - Weekly Updates
3. Note the Template IDs

### 4. Create Contact Lists (Optional)

1. Go to Marketing → Contacts → Lists
2. Create a list for "Waitlist Subscribers"
3. Note the List ID

## Environment Configuration

Add these to your `.env.local` file:

```env
# SendGrid Configuration
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
SENDGRID_FROM_NAME=SideBet
SENDGRID_MARKETING_LIST_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

# SendGrid Template IDs (optional)
SENDGRID_TEMPLATE_WAITLIST_WELCOME=d-xxxxxxxxxxxxxxxxxxxxxxxxxx
SENDGRID_TEMPLATE_LAUNCH=d-xxxxxxxxxxxxxxxxxxxxxxxxxx
SENDGRID_TEMPLATE_REFERRAL=d-xxxxxxxxxxxxxxxxxxxxxxxxxx
SENDGRID_TEMPLATE_WEEKLY=d-xxxxxxxxxxxxxxxxxxxxxxxxxx

# Admin Secret for API Protection
ADMIN_SECRET=your-secure-admin-secret-key
```

## Twilio Setup (for SMS)

### 1. Get Twilio Credentials

1. Log in to Twilio Console
2. Find your Account SID and Auth Token
3. Purchase a phone number with SMS capabilities

### 2. Configure Twilio

Add to `.env.local`:

```env
# Twilio Configuration
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_FROM_NUMBER=+1234567890
```

## Usage Examples

### Sending Emails Programmatically

```typescript
import { sendEmail } from '@/app/utils/sendgrid';

// Simple email
await sendEmail({
  to: 'user@example.com',
  subject: 'Welcome to SideBet!',
  text: 'Thanks for joining our waitlist!',
  html: '<h1>Welcome!</h1><p>Thanks for joining our waitlist!</p>'
});

// Using a template
await sendEmail({
  to: 'user@example.com',
  subject: 'Welcome to SideBet!',
  templateId: 'd-xxxxxxxxxxxxxxxxxxxxxxxxxx',
  dynamicTemplateData: {
    name: 'John',
    referral_code: 'ABC123'
  }
});
```

### Sending Bulk Emails via Admin API

```bash
# Send to all waitlist users
curl -X POST http://localhost:3000/api/admin/send-email \
  -H "Authorization: Bearer your-admin-secret-key" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "email",
    "target": "all",
    "subject": "Big Announcement!",
    "message": "SideBet is launching soon!"
  }'

# Send test email
curl -X POST http://localhost:3000/api/admin/send-email \
  -H "Authorization: Bearer your-admin-secret-key" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "email",
    "target": "test",
    "templateId": "d-xxxxxxxxxxxxxxxxxxxxxxxxxx"
  }'

# Get email statistics
curl -X GET http://localhost:3000/api/admin/send-email \
  -H "Authorization: Bearer your-admin-secret-key"
```

### Sending SMS

```typescript
import { sendWaitlistSMS } from '@/app/utils/emailService';

await sendWaitlistSMS(
  '+1234567890',
  'Welcome to SideBet! We'll notify you when we launch.'
);
```

## Testing

1. **Test Mode**: SendGrid has a sandbox mode for testing without sending real emails
2. **Test Recipients**: Use `target: "test"` in the admin API to send to yourself
3. **Check Logs**: Monitor SendGrid Activity Feed for delivery status

## Best Practices

1. **Rate Limits**: SendGrid has sending limits based on your plan
2. **Unsubscribe Links**: Always include unsubscribe links in marketing emails
3. **SPF/DKIM**: Set up domain authentication for better deliverability
4. **Error Handling**: The integration includes error handling, but monitor logs
5. **Phone Numbers**: Store phone numbers with country codes (e.g., +1234567890)

## Troubleshooting

### Common Issues

1. **"Unauthorized" Error**: Check your API key and permissions
2. **"Sender not verified"**: Verify your sender email/domain
3. **Emails going to spam**: Set up domain authentication
4. **SMS not sending**: Verify Twilio credentials and phone number

### Debug Mode

Set these in `.env.local` for debugging:

```env
# Enable debug logging
SENDGRID_DEBUG=true
```

## Security Notes

1. Never commit `.env.local` to version control
2. Use different API keys for development and production
3. Rotate API keys regularly
4. Limit API key permissions to only what's needed
5. Use the `ADMIN_SECRET` to protect admin endpoints

## Support

- SendGrid Docs: https://docs.sendgrid.com
- Twilio Docs: https://www.twilio.com/docs
- SendGrid Status: https://status.sendgrid.com