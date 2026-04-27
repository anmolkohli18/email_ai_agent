# Deployment Guide

This guide covers deploying your personal blog to Vercel with automatic deployments from Git.

## Prerequisites

- Git repository (GitHub, GitLab, or Bitbucket)
- Vercel account (free tier available)

## Step 1: Prepare Your Repository

### Initialize Git (if not already done)

```bash
git init
git add .
git commit -m "Initial commit: Personal blog setup"
```

### Create GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Follow the instructions to push your local repository:

```bash
git remote add origin https://github.com/your-username/your-repo-name.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in with your GitHub account

2. Click **"Add New"** → **"Project"**

3. Import your repository:
   - Select your blog repository
   - Click **"Import"**

4. Configure project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (leave as is)
   - **Build Command**: `npm run build` (auto-filled)
   - **Output Directory**: `.next` (auto-filled)
   - **Install Command**: `npm install` (auto-filled)

5. Click **"Deploy"**

6. Wait 2-3 minutes for the build to complete

7. Your blog is now live at `https://your-project.vercel.app`

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your username
# - Link to existing project? No
# - Project name? personal-blog
# - Directory? ./
# - Override settings? No

# Deploy to production
vercel --prod
```

## Step 3: Configure Custom Domain (Optional)

### Add Domain in Vercel

1. Go to your project in Vercel dashboard
2. Click **"Settings"** → **"Domains"**
3. Click **"Add"**
4. Enter your domain (e.g., `blog.yourdomain.com` or `yourdomain.com`)
5. Click **"Add"**

### Configure DNS

Vercel will provide DNS records. Add them to your domain provider:

**For root domain (yourdomain.com):**
- Type: `A`
- Name: `@`
- Value: `76.76.21.21`

**For subdomain (blog.yourdomain.com):**
- Type: `CNAME`
- Name: `blog`
- Value: `cname.vercel-dns.com`

DNS propagation can take 24-48 hours.

## Step 4: Set Up Automatic Deployments

Automatic deployments are enabled by default! Every push to your repository triggers a new deployment.

### Production Deployments

- Pushes to `main` branch → Production deployment
- URL: `your-project.vercel.app` or your custom domain

### Preview Deployments

- Pushes to other branches → Preview deployment
- URL: `your-project-git-branch-name.vercel.app`
- Pull requests automatically get preview URLs

### Deployment Workflow

```bash
# Make changes to your blog
echo "new content" >> content/posts/new-post.md

# Commit changes
git add .
git commit -m "Add new blog post"

# Push to GitHub
git push origin main

# Vercel automatically:
# 1. Detects the push
# 2. Installs dependencies
# 3. Builds the project
# 4. Deploys to production
# 5. Invalidates CDN cache
```

## Step 5: Update Configuration

### Update URLs in Code

Replace placeholder URLs with your actual domain:

1. **`app/sitemap.ts`**: Update `baseUrl`
```typescript
const baseUrl = 'https://yourdomain.com';
```

2. **`app/robots.ts`**: Update sitemap URL
```typescript
sitemap: 'https://yourdomain.com/sitemap.xml',
```

3. **`app/layout.tsx`**: Update Open Graph URL
```typescript
url: "https://yourdomain.com",
```

Commit and push these changes:
```bash
git add .
git commit -m "Update domain URLs"
git push origin main
```

## Environment Variables (if needed)

If you need environment variables:

1. Go to Vercel dashboard → Your project
2. Click **"Settings"** → **"Environment Variables"**
3. Add variables (e.g., API keys)
4. Redeploy for changes to take effect

## Monitoring and Analytics

### Vercel Analytics (Optional)

1. Go to your project → **"Analytics"** tab
2. Click **"Enable Analytics"**
3. Add the Analytics component to your layout:

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Build Logs

View build logs in Vercel dashboard:
- Go to your project → **"Deployments"**
- Click on any deployment
- View build logs and runtime logs

## Troubleshooting

### Build Fails

1. Check build logs in Vercel dashboard
2. Common issues:
   - Missing dependencies: Run `npm install` locally
   - TypeScript errors: Run `npm run build` locally to check
   - Environment variables: Ensure they're set in Vercel

### Preview Deployment Works, Production Doesn't

- Clear Vercel cache: Settings → General → Clear Cache
- Redeploy: Deployments → Latest → ... → Redeploy

### Slow Build Times

- Vercel caches `node_modules` between builds
- Typical build time: 1-3 minutes
- If consistently slow, check for large dependencies

## Performance Optimization

### Edge Functions (Free on Vercel)

Your Next.js app automatically uses Edge Runtime for optimal performance:
- Pages are served from CDN
- API routes run on Edge network
- Instant cache invalidation

### Image Optimization

Next.js `Image` component automatically optimizes images on Vercel:
- Lazy loading
- WebP format
- Responsive sizes
- CDN delivery

## Rollback

If a deployment breaks your site:

1. Go to **"Deployments"** in Vercel dashboard
2. Find a working deployment
3. Click **"..."** → **"Promote to Production"**

## CI/CD Integration

### GitHub Actions (Optional)

For additional checks before deployment:

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - run: npm ci
      - run: npm run build
      - run: npm run lint
```

## Cost

Vercel Free Tier includes:
- Unlimited deployments
- 100 GB bandwidth per month
- Automatic HTTPS
- Preview deployments
- Analytics (limited)

Perfect for personal blogs!

## Next Steps

1. Write your first blog post
2. Commit and push to trigger deployment
3. Share your blog URL
4. Set up custom domain (optional)
5. Monitor analytics

Your blog is now live and automatically deploys on every push!
