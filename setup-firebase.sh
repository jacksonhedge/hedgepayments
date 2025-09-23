#!/bin/bash

# Firebase Setup Script for Hedge Payments
echo "🚀 Setting up Firebase for Hedge Payments..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env.local exists
if [ -f .env.local ]; then
    echo -e "${YELLOW}⚠️  .env.local already exists. Creating backup...${NC}"
    cp .env.local .env.local.backup
fi

# Copy example env file
if [ -f .env.firebase.example ]; then
    cp .env.firebase.example .env.local
    echo -e "${GREEN}✅ Created .env.local from template${NC}"
else
    echo -e "${RED}❌ .env.firebase.example not found${NC}"
    exit 1
fi

echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Go to your Firebase Console:"
echo "   ${GREEN}https://console.firebase.google.com/project/hedge-payments/settings/general${NC}"
echo ""
echo "2. Scroll down to 'Your apps' and click the Web icon </>"
echo ""
echo "3. Register your app with nickname: 'Hedge Payments Web'"
echo ""
echo "4. Copy the firebaseConfig object values"
echo ""
echo "5. Edit .env.local and add your Firebase configuration"
echo ""
echo "6. Enable Authentication:"
echo "   ${GREEN}https://console.firebase.google.com/project/hedge-payments/authentication/providers${NC}"
echo "   - Enable Email/Password"
echo "   - Enable Google"
echo ""
echo "7. Create Firestore Database:"
echo "   ${GREEN}https://console.firebase.google.com/project/hedge-payments/firestore${NC}"
echo "   - Start in production mode"
echo "   - Choose location: us-central1"
echo ""
echo "8. Get Service Account Key:"
echo "   ${GREEN}https://console.firebase.google.com/project/hedge-payments/settings/serviceaccounts/adminsdk${NC}"
echo "   - Generate new private key"
echo "   - Add values to .env.local"
echo ""
echo "9. Get Gemini API Key:"
echo "   ${GREEN}https://makersuite.google.com/app/apikey${NC}"
echo "   - Create API key"
echo "   - Add to .env.local as GEMINI_API_KEY"
echo ""
echo "10. Initialize Firebase CLI (optional):"
echo "    npm install -g firebase-tools"
echo "    firebase login"
echo "    firebase init"
echo ""

# Open Firebase console in browser
echo -e "${YELLOW}Opening Firebase Console in your browser...${NC}"
open "https://console.firebase.google.com/project/hedge-payments/overview"

echo ""
echo -e "${GREEN}✨ Setup script complete! Follow the steps above to finish configuration.${NC}"