# Heroku Deployment Guide

## Setup Environment Variables

You need to set the following environment variables on Heroku to ensure the app works correctly:

```bash
# Set the Supabase environment variables
heroku config:set NEXT_PUBLIC_SUPABASE_URL="https://hrgrqmeaajdmajtbdhla.supabase.co"
heroku config:set SUPABASE_SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhyZ3JxbWVhYWpkbWFqdGJkaGxhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjY4MTE3MywiZXhwIjoyMDYyMjU3MTczfQ.fFzFVkG9XRzoJukCRc7gaG7EGOdJzWsRiyA4E_2oSfs"
heroku config:set NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhyZ3JxbWVhYWpkbWFqdGJkaGxhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2ODExNzMsImV4cCI6MjA2MjI1NzE3M30.ErJwCN9trDC0z2o4GaHpiIEiK0ZJIm9ODaX0xep32I4"

# Set the ConvertKit environment variables
heroku config:set CONVERTKIT_API_KEY="kit_67222418319376df0250f010cdd975b7"
heroku config:set CONVERTKIT_FORM_ID="8047084"
```

## Deploy from GitHub

1. Login to your Heroku dashboard
2. Create a new app
3. Go to the "Deploy" tab
4. Choose "GitHub" as the deployment method
5. Connect to your GitHub repository
6. Choose the branch to deploy (usually `main`)
7. Click "Deploy Branch"

## Set up Supabase Database

Before your app will work correctly, you need to set up the database tables in Supabase:

1. Log in to your Supabase dashboard (https://app.supabase.com)
2. Select your project
3. Go to the "SQL Editor" in the left menu
4. Copy and paste the contents of the `setup-supabase.sql` file from this repository
5. Click "Run" to execute the queries

This will create:
- The `waitlist` table for the waitlist functionality
- The `subscribers` table for the ConvertKit integration
- Proper permissions for both tables

## Troubleshooting

If you get build errors like `Error: supabaseKey is required`:

1. Make sure all environment variables are set correctly on Heroku
2. Verify that you've used the correct environment variable name `SUPABASE_SERVICE_KEY` (not `SUPABASE_SERVICE_ROLE_KEY`)
3. Check the Supabase database setup to ensure the tables exist 