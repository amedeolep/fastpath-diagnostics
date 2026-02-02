# FastPath Diagnostics - Deployment Guide

This guide walks you through deploying the FastPath Diagnostics demand validation sites to Netlify with custom domains.

## Prerequisites

Before you begin, ensure you have:

- Node.js installed (v18+)
- A GitHub account
- A Netlify account (free tier works)
- A domain registrar account (Namecheap recommended)
- ~$10 for domain registration

---

## Step 1: Build & Test Locally

First, verify everything works on your local machine.

```bash
# Install dependencies (if not already done)
npm install

# Build the site
npm run build

# Preview the built site
npm run preview
```

Visit `http://localhost:4321` and test:
- [ ] Landing page loads with region selector
- [ ] USA site at `/fastpath-usa/` loads correctly
- [ ] EU/UK site at `/fastpath-eu-uk/` loads correctly
- [ ] All navigation links work
- [ ] Forms display correctly (won't submit locally)
- [ ] Mobile responsive design works

---

## Step 2: Push to GitHub

If not already in a Git repository:

```bash
# Initialize git repo
git init

# Add all files
git add .

# Commit
git commit -m "Initial FastPath Diagnostics site"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/fastpath-site.git
git branch -M main
git push -u origin main
```

---

## Step 3: Deploy to Netlify

### 3.1 Connect Repository

1. Log in to [Netlify](https://netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Select **GitHub** and authorize if needed
4. Find and select your repository

### 3.2 Configure Build Settings

Configure the build settings:

| Setting | Value |
|---------|-------|
| Build command | `npm run build` |
| Publish directory | `dist` |
| Node version | 18 (in Environment variables, add `NODE_VERSION` = `18`) |

### 3.3 Deploy

1. Click **"Deploy site"**
2. Wait for the build to complete (usually 1-2 minutes)
3. You'll get a random URL like `https://random-name-123.netlify.app`

### 3.4 Verify Deployment

Visit your Netlify URL and test:
- [ ] Landing page loads
- [ ] Both regional sites load
- [ ] Navigation works
- [ ] Forms appear (don't submit yet)

---

## Step 4: Custom Domains

### 4.1 Purchase Domains

Go to [Namecheap](https://namecheap.com) (or your preferred registrar):

1. Search for `fastpathdiag.com` (~$10/year)
2. Also purchase `fastpathdiag.org` (~$12/year) as backup
3. Complete checkout

### 4.2 Configure in Netlify

1. In Netlify, go to **Site settings** → **Domain management**
2. Click **"Add custom domain"**
3. Enter `fastpathdiag.com`
4. Click **"Verify"** then **"Add domain"**
5. Repeat for `www.fastpathdiag.com`

### 4.3 Update DNS at Namecheap

1. In Namecheap, go to **Domain List** → select `fastpathdiag.com` → **Advanced DNS**
2. Delete any existing records
3. Add these records:

| Type | Host | Value | TTL |
|------|------|-------|-----|
| A | @ | 75.2.60.5 | Automatic |
| CNAME | www | YOUR-SITE.netlify.app | Automatic |

(Get the exact IP from Netlify's domain settings page)

### 4.4 Wait for Propagation

- DNS changes take 15-60 minutes to propagate
- Netlify will automatically provision an SSL certificate
- Check status in Netlify under **Domain management**

### 4.5 Verify Custom Domain

Once propagated:
- [ ] `https://fastpathdiag.com` loads correctly
- [ ] `https://www.fastpathdiag.com` redirects properly
- [ ] SSL certificate is valid (green lock icon)

---

## Step 5: Email Forwarding

Set up email forwarding so `pilot@fastpathdiag.com` reaches your inbox.

### In Namecheap:

1. Go to **Domain List** → select `fastpathdiag.com`
2. Click **"Manage"** → **"Email Forwarding"**
3. Click **"Add Forwarder"**
4. Configure:
   - Alias: `pilot`
   - Forward to: `your-email@gmail.com`
5. Click **"Save"**

### Repeat for additional addresses:
- `info@fastpathdiag.com` → your email
- `support@fastpathdiag.com` → your email

Test by sending an email to `pilot@fastpathdiag.com`.

---

## Step 6: Google Analytics

### 6.1 Create GA4 Property

1. Go to [Google Analytics](https://analytics.google.com)
2. Click **Admin** → **Create Property**
3. Property name: `FastPath Diagnostics`
4. Select your country and currency
5. Choose **Web** platform
6. Enter your website URL: `https://fastpathdiag.com`
7. Copy your **Measurement ID** (format: `G-XXXXXXXXXX`)

### 6.2 Update Tracking Code

Find and replace the placeholder in all HTML files:

**Files to update:**
- `public/fastpath-usa/index.html`
- `public/fastpath-usa/technology.html`
- `public/fastpath-usa/testing-services.html`
- `public/fastpath-usa/pilot-program.html`
- `public/fastpath-usa/resources.html`
- `public/fastpath-eu-uk/index.html`
- `public/fastpath-eu-uk/technology.html`
- `public/fastpath-eu-uk/testing-services.html`
- `public/fastpath-eu-uk/pilot-program.html`
- `public/fastpath-eu-uk/resources.html`

**Replace:**
```
G-XXXXXXXXXX
```

**With your actual Measurement ID:**
```
G-ABC123XYZ
```

### 6.3 Redeploy

```bash
git add .
git commit -m "Add Google Analytics tracking"
git push
```

Netlify will automatically redeploy.

### 6.4 Verify Tracking

1. Visit your site
2. In GA4, go to **Reports** → **Realtime**
3. You should see your visit appear

---

## Step 7: Test Forms

### 7.1 Enable Form Detection

Netlify automatically detects forms with `data-netlify="true"`. After deployment:

1. Go to Netlify → **Forms**
2. You should see two forms listed:
   - `pilot-request-usa` (or `pilot-request-eu-uk`)
   - `whitepaper-download-usa` (or `whitepaper-download-eu-uk`)

### 7.2 Submit Test Entries

1. Go to your live site
2. Fill out the pilot request form with test data
3. Submit the form
4. Check Netlify → **Forms** → your form name
5. Verify the submission appears

### 7.3 Configure Email Notifications

1. In Netlify → **Forms** → select a form
2. Click **"Form notifications"**
3. Add **"Email notification"**
4. Enter `pilot@fastpathdiag.com` (which forwards to your email)
5. Repeat for all forms

---

## Step 8: Final Verification Checklist

### Site Functionality
- [ ] Landing page loads at `https://fastpathdiag.com`
- [ ] USA site loads at `https://fastpathdiag.com/fastpath-usa/`
- [ ] EU/UK site loads at `https://fastpathdiag.com/fastpath-eu-uk/`
- [ ] All internal navigation links work
- [ ] Mobile responsive on phone/tablet
- [ ] SSL certificate valid (https, green lock)

### Forms
- [ ] Pilot request form (USA) submits successfully
- [ ] Pilot request form (EU/UK) submits successfully
- [ ] Whitepaper download form (USA) works
- [ ] Whitepaper download form (EU/UK) works
- [ ] Email notifications received for form submissions

### Analytics
- [ ] Google Analytics tracking active
- [ ] Page views appearing in GA4 Realtime
- [ ] Custom events firing (pilot_form_submit, whitepaper_download)

### Email
- [ ] `pilot@fastpathdiag.com` forwards to your inbox
- [ ] Test email received successfully

---

## Ongoing Monitoring

### Netlify Dashboard
- Check **Forms** weekly for new submissions
- Monitor **Analytics** for traffic patterns
- Review **Deploy logs** if issues arise

### Google Analytics
- **Acquisition** → See where visitors come from
- **Engagement** → Track time on page, scroll depth
- **Conversions** → Monitor form submissions

### Email
- Respond to pilot requests within 2 business days
- Track which product category generates most interest
- Note common challenges mentioned in form submissions

---

## Cost Summary

| Item | Cost | Frequency |
|------|------|-----------|
| Domains (fastpathdiag.com + .org) | ~$22 | Annual |
| Netlify hosting | $0 | Free tier |
| SSL certificate | $0 | Included |
| Google Analytics | $0 | Free |
| Email forwarding | $0 | Included with domain |
| **Total** | **~$22/year** | |

---

## Troubleshooting

### Forms not appearing in Netlify
- Ensure `data-netlify="true"` attribute is present
- Check that hidden `form-name` input matches the form name
- Redeploy after making changes

### Custom domain not working
- Wait 24-48 hours for full DNS propagation
- Verify DNS records match Netlify's instructions
- Check for typos in DNS configuration

### Analytics not tracking
- Verify Measurement ID is correct
- Check browser console for errors
- Ensure ad blockers are disabled for testing

### SSL certificate issues
- Wait for Netlify to provision (can take up to 24 hours)
- Verify domain ownership is complete
- Contact Netlify support if persists

---

## Support

For technical issues with the site, check:
- [Netlify Docs](https://docs.netlify.com)
- [Astro Docs](https://docs.astro.build)
- [Google Analytics Help](https://support.google.com/analytics)

For domain issues:
- [Namecheap Knowledgebase](https://www.namecheap.com/support/knowledgebase/)
