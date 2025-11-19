# Deploy HedgePayments Documentation to Vercel

Quick guide to deploy your docs to Vercel in under 5 minutes.

## Option 1: GitHub Integration (Recommended) ⭐

**Easiest method - Auto-deploys on every push**

### Steps:

1. **Push your docs to GitHub:**
   ```bash
   cd /Users/jacksonfitzgerald/Documents/hedgepayments-website
   git add .
   git commit -m "Add HedgePayments API documentation"
   git push origin main
   ```

2. **Go to Vercel:**
   - Visit [vercel.com](https://vercel.com)
   - Sign up with GitHub
   - Click "Add New Project"

3. **Import Repository:**
   - Select your `hedgepayments-website` repo
   - Click "Import"

4. **Configure Build Settings:**
   ```
   Framework Preset: Other
   Root Directory: docs
   Build Command: npm run build
   Output Directory: _site
   Install Command: npm install
   ```

5. **Deploy:**
   - Click "Deploy"
   - Wait ~30 seconds
   - Your docs are live! 🎉

6. **Your URL:**
   ```
   https://hedgepayments-website.vercel.app
   ```

7. **Add Custom Domain (Optional):**
   - Go to Project Settings → Domains
   - Add `docs.hedgepayments.com`
   - Update DNS records (Vercel provides instructions)

---

## Option 2: Vercel CLI (Quick Deploy)

**Fast one-command deployment**

### Steps:

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login:**
   ```bash
   vercel login
   ```

3. **Deploy from docs directory:**
   ```bash
   cd /Users/jacksonfitzgerald/Documents/hedgepayments-website/docs
   vercel --prod
   ```

4. **Follow prompts:**
   ```
   ? Set up and deploy "~/Documents/hedgepayments-website/docs"? [Y/n] y
   ? Which scope? Your Name
   ? Link to existing project? [y/N] n
   ? What's your project's name? hedgepayments-docs
   ? In which directory is your code located? ./
   ```

5. **Your docs are live!**
   ```
   https://hedgepayments-docs.vercel.app
   ```

---

## Option 3: Mintlify Cloud (Alternative)

**If you prefer Mintlify's platform:**

1. **Sign up:**
   - Visit [mintlify.com](https://mintlify.com)
   - Sign up with GitHub

2. **Connect repo:**
   - Import `hedgepayments-website` repository
   - Set root directory to `/docs`

3. **Deploy:**
   - Mintlify auto-deploys
   - Live at: `hedgepayments.mintlify.app`

**Pros:**
- Built specifically for docs
- Nice UI out of the box
- Search built-in
- Analytics included

**Cons:**
- Less control than Vercel
- Smaller ecosystem

---

## Vercel Configuration Files Created

I've created `vercel.json` in your `/docs` directory with optimal settings:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "_site",
  "installCommand": "npm install",
  "rewrites": [...],  // SPA routing
  "headers": [...]    // Security headers
}
```

---

## Environment Variables

If you need API keys or secrets in your docs:

### In Vercel Dashboard:
1. Go to Project → Settings → Environment Variables
2. Add variables:
   ```
   HEDGE_API_KEY=your_key_here
   COINFLOW_MERCHANT_ID=your_merchant_id
   ```

### Or via CLI:
```bash
vercel env add HEDGE_API_KEY production
vercel env add COINFLOW_MERCHANT_ID production
```

---

## Custom Domain Setup

### Add `docs.hedgepayments.com`:

1. **In Vercel Dashboard:**
   - Project Settings → Domains
   - Add domain: `docs.hedgepayments.com`

2. **Update DNS (at your registrar):**
   ```
   Type: CNAME
   Name: docs
   Value: cname.vercel-dns.com
   ```

3. **Wait for DNS propagation** (~5-60 minutes)

4. **Done!** Your docs are at `docs.hedgepayments.com`

---

## Automatic Deployments

With GitHub integration:

- **Every push to `main`** → Deploys to production
- **Pull requests** → Create preview deployments
- **Rollbacks** → One-click in Vercel dashboard

---

## Preview Deployments

Every git branch gets a preview URL:

```bash
git checkout -b add-new-endpoint
# Make changes
git push

# Vercel creates: hedgepayments-docs-git-add-new-endpoint.vercel.app
```

Perfect for reviewing changes before merging!

---

## Performance

Vercel provides:

- ✅ Global CDN (200+ locations)
- ✅ Automatic HTTPS
- ✅ Brotli compression
- ✅ HTTP/2
- ✅ Image optimization
- ✅ Smart caching

Your docs load in **< 1 second** globally.

---

## Monitoring

### View Analytics:

1. Vercel Dashboard → Analytics
2. See:
   - Page views
   - Load times
   - Geographic distribution
   - Popular pages

---

## Comparison: Vercel vs Mintlify Cloud

| Feature | Vercel | Mintlify Cloud |
|---------|--------|----------------|
| **Deployment Speed** | 30 sec | 60 sec |
| **Custom Domain** | ✅ Free | ✅ Free |
| **GitHub Integration** | ✅ Native | ✅ Native |
| **Search** | Need to add | ✅ Built-in |
| **Analytics** | ✅ Built-in | ✅ Built-in |
| **Control** | Full | Limited |
| **Cost (Free Tier)** | 100GB bandwidth | Unlimited |
| **Best For** | General docs | API docs |

---

## My Recommendation 🎯

### For HedgePayments:

**Use Vercel with GitHub Integration**

Why?
1. ✅ You already have the codebase in git
2. ✅ Auto-deploys on every push
3. ✅ Free custom domain (`docs.hedgepayments.com`)
4. ✅ Preview deployments for PRs
5. ✅ Full control over everything
6. ✅ Can migrate to Mintlify later if needed

---

## Quick Start Commands

```bash
# 1. Commit your changes
cd /Users/jacksonfitzgerald/Documents/hedgepayments-website
git add .
git commit -m "Add comprehensive API documentation"
git push origin main

# 2. Deploy to Vercel
npm install -g vercel
cd docs
vercel --prod

# 3. Your docs are live!
# Visit: https://hedgepayments-docs.vercel.app
```

---

## Troubleshooting

### Build fails?

Check `package.json` has build script:
```json
{
  "scripts": {
    "dev": "mintlify dev",
    "build": "mintlify build",
    "preview": "mintlify preview"
  }
}
```

### Wrong directory?

Make sure Vercel root is set to `/docs`:
```bash
vercel --cwd docs --prod
```

### Need help?

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Support**: support@vercel.com
- **Status**: status.vercel.com

---

## What Happens Next?

1. ✅ Your docs deploy to Vercel
2. ✅ Get a live URL
3. ✅ Add custom domain
4. ✅ Share with your team
5. ✅ Start getting developers to integrate!

---

## Files You Have Ready:

```
docs/
├── logo/
│   ├── dark.png ✅
│   ├── light.png ✅
│   └── favicon.svg ✅
├── api-reference/
│   ├── wallets/create.mdx ✅
│   └── transactions/create.mdx ✅
├── guides/
│   ├── coinflow-setup.mdx ✅
│   └── providers/coinflow.mdx ✅
├── concepts/
│   └── coinflow-integration.mdx ✅
├── quickstart.mdx ✅
├── authentication.mdx ✅
├── introduction.mdx ✅
├── mint.json ✅
├── vercel.json ✅ (just created)
└── package.json ✅
```

Everything is ready to deploy! 🚀

Ready to deploy? Just run:

```bash
cd /Users/jacksonfitzgerald/Documents/hedgepayments-website/docs
vercel --prod
```
