#!/bin/bash

echo "🚀 Hedge Payments Round-ups API Setup"
echo "======================================"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local from .env.example..."
    cp .env.example .env.local
    echo "✅ Created .env.local - Please update with your actual credentials"
else
    echo "✅ .env.local already exists"
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Install API-specific dependencies
echo ""
echo "📦 Installing API dependencies..."
cd packages/api
npm install express cors helmet compression morgan jsonwebtoken bcrypt
npm install --save-dev @types/express @types/cors @types/compression @types/morgan @types/jsonwebtoken @types/bcrypt
npm install axios ioredis bull bullmq
npm install --save-dev @types/ioredis @types/bull
cd ../..

# Create required directories
echo ""
echo "📁 Creating required directories..."
mkdir -p packages/api/src/routes
mkdir -p packages/api/src/middleware
mkdir -p packages/api/src/services
mkdir -p packages/api/src/controllers
mkdir -p packages/api/src/utils
mkdir -p packages/api/dist

# Setup database
echo ""
echo "🗄️  Setting up Supabase database..."
echo "Please run the following migration in your Supabase dashboard:"
echo "  SQL Editor > New Query > Paste contents of supabase/migrations/001_create_roundups_schema.sql"
echo ""

# Docker setup for local Redis
echo ""
echo "🐳 Setting up Redis with Docker..."
if command -v docker &> /dev/null; then
    echo "Starting Redis container..."
    docker run -d --name hedge-redis -p 6379:6379 redis:alpine 2>/dev/null || echo "Redis container might already be running"
else
    echo "⚠️  Docker not found. Please install Docker or run Redis manually"
fi

echo ""
echo "✨ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update .env.local with your actual credentials:"
echo "   - Supabase URL and keys"
echo "   - Meld OAuth credentials"
echo "   - Dwolla API credentials"
echo "   - Generate a JWT secret: openssl rand -hex 32"
echo ""
echo "2. Run the Supabase migration:"
echo "   - Go to your Supabase dashboard"
echo "   - SQL Editor > New Query"
echo "   - Paste contents of supabase/migrations/001_create_roundups_schema.sql"
echo "   - Run query"
echo ""
echo "3. Start the API server:"
echo "   npm run dev:api"
echo ""
echo "4. Test the API:"
echo "   curl http://localhost:3001/health"
echo ""
echo "📚 Documentation available at:"
echo "   http://localhost:3333 (when running npm run dev:docs)"
echo ""