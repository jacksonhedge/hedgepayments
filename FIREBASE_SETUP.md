# Firebase Setup Guide for Hedge Payments

## Overview
Your Hedge Payments website is now configured to use Firebase as the complete backend solution with Gemini AI integration for intelligent features.

## What's Been Set Up

### 1. **Firebase Services Configured**
- ✅ **Authentication** - Email/password and Google Sign-in
- ✅ **Firestore Database** - NoSQL database for all data
- ✅ **Cloud Storage** - File storage (if needed)
- ✅ **Cloud Functions** - Serverless backend
- ✅ **Gemini AI Integration** - Smart features and insights

### 2. **Key Features Implemented**

#### Authentication System
- Business account registration with detailed profiles
- Secure login with Firebase Auth
- Google Sign-in option
- API key generation for businesses
- Password reset functionality

#### Round-ups System
- AI-powered transaction categorization
- Smart round-up calculations
- Multiple round-up rules (nearest dollar, five, ten, custom)
- Destination options (savings, investment, betting)
- Real-time processing with Firestore

#### Gemini AI Features
- **Transaction Categorization** - Automatic AI categorization
- **Spending Analysis** - Pattern recognition and insights
- **Smart Recommendations** - Personalized betting/saving suggestions
- **Natural Language Queries** - Ask questions about finances
- **Financial Insights** - Monthly reports and goal tracking

### 3. **Project Structure**
```
/lib/firebase/
├── config.ts          # Firebase configuration
├── client.ts          # Client-side initialization
├── auth.ts            # Authentication services
├── roundups.ts        # Round-ups and transactions
├── gemini.ts          # AI integration
└── hooks.ts           # React hooks for real-time data
```

## Setup Instructions

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create Project"
3. Name it "hedge-payments" (or your preference)
4. Enable Google Analytics (optional)

### Step 2: Enable Services

In Firebase Console:

1. **Authentication**
   - Go to Authentication → Sign-in method
   - Enable "Email/Password"
   - Enable "Google" provider
   - Add your domain to authorized domains

2. **Firestore Database**
   - Go to Firestore Database
   - Create database in production mode
   - Choose your region (us-central1 recommended)

3. **Storage** (if needed)
   - Go to Storage
   - Click "Get Started"
   - Choose production mode

### Step 3: Get Firebase Configuration

1. Go to Project Settings (gear icon)
2. Scroll to "Your apps" section
3. Click "Web" icon (</>)
4. Register app with nickname "Hedge Payments Web"
5. Copy the configuration object

### Step 4: Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Select your Google Cloud project
4. Copy the API key

### Step 5: Set Up Environment Variables

1. Copy `.env.firebase.example` to `.env.local`
2. Fill in your Firebase config:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Gemini AI
GEMINI_API_KEY=your-gemini-api-key
```

### Step 6: Get Service Account (for server-side)

1. In Firebase Console → Project Settings → Service Accounts
2. Click "Generate new private key"
3. Save the JSON file securely
4. Add to `.env.local`:

```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### Step 7: Set Up Firestore Security Rules

In Firestore Console → Rules, add:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Business profiles
    match /businesses/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Round-up settings
    match /roundupSettings/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Transactions
    match /transactions/{transactionId} {
      allow read: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.userId;
    }
    
    // Roundups
    match /roundups/{roundupId} {
      allow read: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    // User stats
    match /userStats/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if false; // Only server can write
    }
  }
}
```

### Step 8: Initialize Firestore Collections

Run this in Firebase Console → Firestore to create initial structure:

1. Create these collections (empty is fine):
   - `businesses`
   - `roundupSettings`
   - `transactions`
   - `roundups`
   - `userStats`
   - `transfers`
   - `notifications`

### Step 9: Deploy and Test

1. Start development server:
```bash
npm run dev
```

2. Test the signup flow at `/business-signup`
3. Test the login flow at `/business-login`

## API Integration Points

### For Payment Providers (Meld/Dwolla)
The roundups system is ready to integrate with:
- **Meld** - Bank account connections (`/lib/firebase/providers/meld.ts`)
- **Dwolla** - ACH transfers (`/lib/firebase/providers/dwolla.ts`)

### For Sportsbooks (SideBet)
Ready to integrate with:
- DraftKings API
- FanDuel API
- BetMGM API
- Caesars API

## Next Steps

1. **Complete Firebase Setup** - Follow steps above
2. **Test Authentication** - Create a test business account
3. **Configure Payment Providers** - Add Meld/Dwolla credentials
4. **Set Up Webhooks** - For transaction processing
5. **Deploy to Production** - Use Vercel or Firebase Hosting

## Monitoring & Analytics

Firebase provides built-in:
- **Authentication metrics** - User signups, logins
- **Firestore metrics** - Database usage
- **Performance monitoring** - App performance
- **Crashlytics** - Error tracking
- **Analytics** - User behavior

## Support

For Firebase issues:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Guide](https://firebase.google.com/docs/firestore)
- [Gemini AI Docs](https://ai.google.dev/docs)

## Important Notes

⚠️ **Security**: Never commit `.env.local` or service account keys to git
⚠️ **Costs**: Monitor Firebase usage to avoid unexpected charges
⚠️ **Testing**: Use Firebase Emulator Suite for local development
✅ **Ready**: Your app is configured and ready for Firebase!