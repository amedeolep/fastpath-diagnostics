# FastPath Diagnostics - Deployment Checklist

Quick reference checklist for deployment. See `DEPLOYMENT.md` for detailed instructions.

---

## Pre-Deployment

- [ ] Run `npm install`
- [ ] Run `npm run build` - builds successfully
- [ ] Run `npm run preview` - site works locally
- [ ] Test all pages load correctly
- [ ] Test mobile responsive design

---

## GitHub Setup

- [ ] Initialize git repository
- [ ] Commit all files
- [ ] Create GitHub repository
- [ ] Push to GitHub

---

## Netlify Deployment

- [ ] Create Netlify account (if needed)
- [ ] Connect GitHub repository
- [ ] Configure build settings:
  - Build command: `npm run build`
  - Publish directory: `dist`
- [ ] Deploy site
- [ ] Verify random Netlify URL works

---

## Domain Setup

### Purchase Domains
- [ ] Buy `fastpathdiag.com`
- [ ] Buy `fastpathdiag.org` (optional backup)

### Configure DNS
- [ ] Add custom domain in Netlify
- [ ] Update DNS records at registrar
- [ ] Wait for propagation (15-60 min)
- [ ] Verify SSL certificate issued

---

## Email Forwarding

- [ ] Set up `pilot@fastpathdiag.com` → your email
- [ ] Set up `info@fastpathdiag.com` → your email (optional)
- [ ] Test email forwarding works

---

## Google Analytics

- [ ] Create GA4 property
- [ ] Copy Measurement ID
- [ ] Replace `G-XXXXXXXXXX` in all HTML files:
  - [ ] `public/fastpath-usa/index.html`
  - [ ] `public/fastpath-usa/technology.html`
  - [ ] `public/fastpath-usa/testing-services.html`
  - [ ] `public/fastpath-usa/pilot-program.html`
  - [ ] `public/fastpath-usa/resources.html`
  - [ ] `public/fastpath-eu-uk/index.html`
  - [ ] `public/fastpath-eu-uk/technology.html`
  - [ ] `public/fastpath-eu-uk/testing-services.html`
  - [ ] `public/fastpath-eu-uk/pilot-program.html`
  - [ ] `public/fastpath-eu-uk/resources.html`
- [ ] Commit and push changes
- [ ] Verify tracking in GA4 Realtime

---

## Form Testing

- [ ] Check forms appear in Netlify dashboard
- [ ] Submit test pilot request (USA)
- [ ] Submit test pilot request (EU/UK)
- [ ] Submit test whitepaper download (USA)
- [ ] Submit test whitepaper download (EU/UK)
- [ ] Configure email notifications for each form
- [ ] Verify email notifications received

---

## Final Verification

### Functionality
- [ ] `https://fastpathdiag.com` loads
- [ ] `/fastpath-usa/` all pages work
- [ ] `/fastpath-eu-uk/` all pages work
- [ ] All navigation links functional
- [ ] Mobile responsive

### Security
- [ ] SSL certificate valid
- [ ] HTTPS redirect working
- [ ] No mixed content warnings

### Tracking
- [ ] Google Analytics receiving data
- [ ] Page views tracked
- [ ] Form submission events tracked

### Forms
- [ ] All forms submit successfully
- [ ] Email notifications working
- [ ] Honeypot spam prevention active

---

## Post-Launch

- [ ] Monitor form submissions daily (first week)
- [ ] Check analytics for traffic
- [ ] Respond to pilot requests within 2 business days
- [ ] Note feedback for iteration

---

## Monthly Maintenance

- [ ] Review analytics for insights
- [ ] Check form submission quality
- [ ] Update content as needed
- [ ] Renew domains before expiration
