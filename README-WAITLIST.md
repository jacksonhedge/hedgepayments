# SideBet Waitlist Integration

This document explains how the SideBet waitlist is integrated with ConvertKit and Viral Loops for email collection and referral tracking.

## Overview

The waitlist integration uses:
- **ConvertKit**: For email collection and subscriber management
- **Viral Loops**: For referral program management and tracking

## Setup Instructions

### 1. Configure Environment Variables

Make sure the following variables are set in your `.env.local` file:

```
# ConvertKit API
CONVERTKIT_API_KEY=kit_67222418319376df0250f010cdd975b7  # Your API key (already set)
CONVERTKIT_FORM_ID=1234567  # Replace with your actual Form ID from ConvertKit

# Viral Loops API
VIRAL_LOOPS_API_KEY=YOUR_VIRAL_LOOPS_API_KEY  # Get this from Viral Loops
VIRAL_LOOPS_CAMPAIGN_ID=YOUR_CAMPAIGN_ID  # Get this from Viral Loops
```

### 2. ConvertKit Setup

1. Log in to your ConvertKit account
2. Create a form (Form > Create New Form)
3. Choose any form style (it doesn't matter since we're using our own custom form)
4. Get the Form ID from the URL (e.g., app.kit.com/forms/1234567)
5. Add custom fields to your ConvertKit account:
   - Go to Settings > Custom Fields
   - Add fields for `last_name` and `referral_code`

### 3. Viral Loops Setup

1. Create a waitlist campaign in Viral Loops
2. Choose the "Waitlist / Pre-launch" campaign type
3. Configure rewards for referrals (e.g., "$10 in betting credits for each friend who joins")
4. Get your API key and Campaign ID from the Viral Loops dashboard

## How It Works

### Signup Flow

1. User submits the form on the SideBet waitlist page
2. Our API submits the information to ConvertKit using your form
3. The user is also added to Viral Loops for referral tracking
4. A unique referral code is generated for the user
5. User sees success screen with their referral link
6. When friends use that link, both get credit for the referral

### Referral Tracking

When someone signs up via a referral link:
- The `ref` parameter in the URL is captured
- This is sent to both ConvertKit (as a custom field) and Viral Loops
- Both the referrer and new signup get credit

### Retrieving Waitlist Data

- **ConvertKit**: Use your ConvertKit dashboard to see subscribers
- **Viral Loops**: Use the Viral Loops dashboard to see referral statistics

## Testing the Integration

1. Use test emails to join the waitlist
2. Check your ConvertKit dashboard to verify subscriber was added
3. Check Viral Loops dashboard to verify participant was added
4. Test referral links by using them in private/incognito browser windows

## Troubleshooting

If subscribers aren't being added:
1. Check browser console for errors
2. Verify API keys and Form ID are correct
3. Look at server logs for API response details 