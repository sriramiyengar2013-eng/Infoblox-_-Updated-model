# Infoblox Value Analysis Tool — Deployment Guide

A single-file HTML app (`index.html`) — no build step, no backend, no dependencies to install.

---

## Option 1: Netlify (Recommended — Free, Fastest)

### Drag & Drop (No account needed to test)
1. Go to **https://app.netlify.com/drop**
2. Drag and drop the **entire `infoblox-deploy` folder** onto the page
3. Done — you get a live URL like `https://magical-name-123.netlify.app`

### Via GitHub (Recommended for ongoing updates)
1. Push this folder to a GitHub repo
2. Go to **https://app.netlify.com** → "Add new site" → "Import from Git"
3. Select your repo
4. Build settings:
   - **Build command:** *(leave blank)*
   - **Publish directory:** `.`
5. Click **Deploy site**
6. Set a custom domain in Site Settings → Domain Management

### Via Netlify CLI
```bash
npm install -g netlify-cli
cd infoblox-deploy
netlify deploy --prod --dir .
```

---

## Option 2: Vercel (Free, Excellent Performance)

### Via Vercel CLI
```bash
npm install -g vercel
cd infoblox-deploy
vercel --prod
```

### Via GitHub
1. Push to GitHub
2. Go to **https://vercel.com/new**
3. Import your repository
4. Framework preset: **Other**
5. Root directory: *(leave as is)*
6. Click **Deploy**

---

## Option 3: GitHub Pages (Free, Great for Internal Sharing)

1. Create a new GitHub repository (public or private with Pages enabled)
2. Push the files:
```bash
git init
git add .
git commit -m "Infoblox value tool"
git remote add origin https://github.com/YOUR_USERNAME/infoblox-value-tool.git
git push -u origin main
```
3. Go to repo **Settings → Pages**
4. Source: **Deploy from branch** → `main` → `/ (root)`
5. Your URL: `https://YOUR_USERNAME.github.io/infoblox-value-tool`

---

## Option 4: Azure Static Web Apps

1. Push to GitHub
2. In Azure Portal → Create resource → **Static Web App**
3. Connect to your GitHub repo
4. Build details:
   - App location: `/`
   - Output location: *(leave blank)*
5. Deploy — Azure creates a GitHub Action automatically

---

## Option 5: AWS S3 + CloudFront

```bash
# Install AWS CLI first: https://aws.amazon.com/cli/
aws s3 mb s3://infoblox-value-tool
aws s3 website s3://infoblox-value-tool --index-document index.html
aws s3 cp index.html s3://infoblox-value-tool/ --acl public-read
```
Then create a CloudFront distribution pointing to the S3 bucket for HTTPS + CDN.

---

## Option 6: Simple Python/Node Local Server (For Testing)

```bash
# Python
python -m http.server 8080
# Then open http://localhost:8080

# Node.js
npx serve .
# Then open http://localhost:3000
```

---

## Sharing Internally (No Deployment Needed)

The tool is a **single HTML file** — you can:
- Email `index.html` directly — recipients open it in any browser
- Share via Teams / Slack / Google Drive
- Host on your company intranet (just drop on any web server)

---

## File Structure

```
infoblox-deploy/
├── index.html       ← The entire app (self-contained)
├── netlify.toml     ← Netlify config
├── vercel.json      ← Vercel config
└── README.md        ← This file
```

---

## Notes

- **No API key needed** to use the tool — the AI features call Anthropic's API directly
- The PPTX download runs entirely in the browser — no server needed
- Works in Chrome, Firefox, Safari, Edge (modern versions)
- Mobile-responsive layout included
