# Showpad Value Analysis Tool — Netlify Deployment

## File Structure

```
showpad-netlify/
├── index.html                  ← The full app
├── netlify.toml                ← Netlify config (routes /api/ask to function)
├── .gitignore
├── README.md
└── netlify/
    └── functions/
        └── ask.js              ← Serverless AI proxy (keeps API key secret)
```

---

## How it works

```
Browser  ──POST /api/ask──▶  netlify.toml redirect  ──▶  ask.js (Lambda)  ──▶  Anthropic API
                                                          (API key secure in env vars)
```

No Node server needed — Netlify Functions handle the AI proxy serverlessly.

---

## Step 1 — Get your Anthropic API Key

1. Go to **https://console.anthropic.com**
2. Sign in (or create a free account)
3. Click **"API Keys"** → **"Create Key"**
4. Name it `showpad-value-tool`, copy the key (`sk-ant-...`)

---

## Step 2 — Deploy on Netlify

### Option A: Drag & Drop (fastest — 2 minutes, no account needed to test)

1. Go to **https://app.netlify.com/drop**
2. Drag the entire **`showpad-netlify`** folder onto the page
3. Done — you get a live URL instantly

> ⚠️ Drag & Drop doesn't support environment variables. AI Insights won't work until you connect via GitHub (Option B) or add the key manually after deploying.

---

### Option B: GitHub → Netlify (Recommended — enables AI + auto-deploys)

**Push to GitHub:**
```bash
cd showpad-netlify
git init
git add .
git commit -m "Showpad Value Tool"
# Create repo at https://github.com/new then:
git remote add origin https://github.com/YOUR_USERNAME/showpad-value-tool.git
git branch -M main
git push -u origin main
```

**Connect to Netlify:**
1. Go to **https://app.netlify.com** → **"Add new site"** → **"Import from Git"**
2. Select your GitHub repo `showpad-value-tool`
3. Build settings:
   - **Build command:** *(leave blank)*
   - **Publish directory:** `.`
4. Click **"Deploy site"**

---

## Step 3 — Add the API Key (Enables AI Insights)

1. In Netlify dashboard → your site → **"Site configuration"**
2. Click **"Environment variables"** in the left sidebar
3. Click **"Add a variable"**
4. Key: `ANTHROPIC_API_KEY`
5. Value: *(paste your key)*
6. Click **"Save"**
7. Go to **"Deploys"** → **"Trigger deploy"** → **"Deploy site"**

---

## Step 4 — Verify AI is Working

Open your site and click **"Ask AI ↗"** with any question.

Or test the function directly:
```
POST https://your-site.netlify.app/api/ask
Content-Type: application/json
{"system":"You are helpful.","question":"Hello"}
```

---

## Updating the App

Every push to GitHub auto-deploys:
```bash
git add .
git commit -m "Updates"
git push
```

---

## Notes

- **Free Netlify tier** includes 125K function invocations/month — plenty for a value tool.
- PPTX generation runs entirely in the browser — no server needed.
- All cost calculations run client-side — no data sent to any server except AI queries.
