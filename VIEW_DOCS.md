# How to View Your HedgePayments Documentation

Since Mintlify CLI is having React version conflicts, here are **3 better alternatives** to view and work with your documentation:

## Option 1: Use Mintlify's Cloud Platform (Recommended) ✨

**Easiest & Best Option** - Deploy to Mintlify for free:

1. **Sign up at Mintlify:**
   ```bash
   # Visit https://mintlify.com
   # Sign up with GitHub
   ```

2. **Connect your repository:**
   - Link your GitHub repo
   - Point to the `/docs` directory
   - Mintlify auto-deploys on every push

3. **Your docs will be live at:**
   ```
   https://hedgepayments.mintlify.app
   ```

**Benefits:**
- ✅ No local setup needed
- ✅ Auto-deploys on git push
- ✅ Search built-in
- ✅ Analytics included
- ✅ Custom domain support
- ✅ Free tier available

---

## Option 2: Deploy to Vercel/Netlify 🚀

**Use a standard static site host:**

### With Vercel:

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy from docs directory:**
   ```bash
   cd /Users/jacksonfitzgerald/Documents/hedgepayments-website
   vercel --prod
   ```

3. **Or use GitHub integration:**
   - Connect repo to Vercel
   - Point build to `/docs`
   - Build command: `npm run build`
   - Output directory: `_site` or `out`

### With Netlify:

1. **Create `netlify.toml` in docs directory:**
   ```toml
   [build]
     base = "docs/"
     command = "npm run build"
     publish = "_site"
   ```

2. **Deploy:**
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod
   ```

---

## Option 3: View MDX Files Directly 📄

**Simple & Quick** - Just read the markdown:

### In VS Code:
1. Open the `docs` folder in VS Code
2. Install "MDX" extension
3. Right-click any `.mdx` file → "Open Preview"

### In GitHub:
1. Push to GitHub
2. Browse files at `github.com/yourusername/repo/tree/main/docs`
3. GitHub renders MDX beautifully

### Files to View:

```
docs/
├── quickstart.mdx                      # Start here!
├── authentication.mdx                  # Auth guide
├── api-reference/
│   ├── wallets/
│   │   └── create.mdx                  # Create wallet endpoint
│   └── transactions/
│       └── create.mdx                  # Process payment endpoint
├── guides/
│   ├── coinflow-setup.mdx              # CoinFlow quick setup
│   └── providers/
│       └── coinflow.mdx                # Full CoinFlow guide
└── concepts/
    └── coinflow-integration.mdx        # CoinFlow concepts
```

---

## Option 4: Create Simple Next.js Docs Site 📘

**If you want full control:**

1. **Create a new Next.js app:**
   ```bash
   cd /Users/jacksonfitzgerald/Documents/hedgepayments-website
   npx create-next-app@latest docs-viewer --typescript --tailwind --app
   cd docs-viewer
   ```

2. **Install MDX support:**
   ```bash
   npm install @next/mdx @mdx-js/loader @mdx-js/react
   npm install rehype-highlight remark-gfm
   ```

3. **Configure `next.config.js`:**
   ```javascript
   const withMDX = require('@next/mdx')({
     extension: /\.mdx?$/,
     options: {
       remarkPlugins: [],
       rehypePlugins: [],
     },
   });

   module.exports = withMDX({
     pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
   });
   ```

4. **Copy your MDX files to `app` directory**

5. **Run:**
   ```bash
   npm run dev
   ```

---

## Option 5: Use Docusaurus (Alternative to Mintlify) 📚

**If you want an open-source alternative:**

1. **Create Docusaurus site:**
   ```bash
   npx create-docusaurus@latest hedgepayments-docs classic
   cd hedgepayments-docs
   ```

2. **Copy your MDX files to `docs/` folder**

3. **Run:**
   ```bash
   npm start
   ```

4. **Visit:**
   ```
   http://localhost:3000
   ```

---

## My Recommendation 🎯

**For Production:** Use **Mintlify Cloud** (Option 1)
- Zero config
- Professional appearance
- Built-in search & analytics
- Free tier

**For Quick Preview:** Use **VS Code** (Option 3)
- Instant
- No setup
- Works offline

**For Full Control:** Use **Next.js** (Option 4)
- Complete customization
- Your own hosting
- Your own domain

---

## Quick Fix for React Conflict Issue

If you really want to use Mintlify CLI locally, try this:

1. **Move to docs directory only:**
   ```bash
   cd /Users/jacksonfitzgerald/Documents/hedgepayments-website/docs
   ```

2. **Clean install:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Use the local mintlify:**
   ```bash
   npx mintlify dev
   ```

4. **Or create isolated environment:**
   ```bash
   # Create new folder for docs only
   mkdir ~/hedgepayments-docs-preview
   cd ~/hedgepayments-docs-preview

   # Copy docs files
   cp -r /Users/jacksonfitzgerald/Documents/hedgepayments-website/docs/* .

   # Fresh install
   npm install
   npx mintlify dev
   ```

---

## What I've Created for You

You have **7 comprehensive documentation pages** ready to deploy:

1. ✅ **Quick Start Guide** - 10-minute integration
2. ✅ **Authentication Guide** - API keys & security
3. ✅ **Create Wallet API** - Wallet creation endpoint
4. ✅ **Process Payment API** - Payment processing
5. ✅ **CoinFlow Setup Guide** - Quick CoinFlow integration
6. ✅ **CoinFlow Integration Guide** - Complete CoinFlow docs
7. ✅ **CoinFlow Concepts** - Understanding CoinFlow

**All with:**
- 5 programming languages (JS, Python, cURL, Ruby, Go)
- Complete code examples
- Error handling
- Best practices
- Webhook examples

---

## Next Steps

1. **Choose an option above** (I recommend Mintlify Cloud)
2. **Deploy your docs**
3. **Share with your team**
4. **Start building!**

Need help with any of these options? Let me know!
