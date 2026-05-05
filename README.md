# Infoblox Value Analysis Tool — Render Deployment

## Architecture

```
Browser  ──POST /api/ask──▶  server.js  ──▶  Anthropic API
                              (API key stored securely as env var)
```

The Anthropic API key **never touches the browser** — all AI calls go through the Node.js server.

---

## Step 1 — Get an Anthropic API Key

1. Go to **https://console.anthropic.com**
2. Sign in (or create a free account)
3. Click **"API Keys"** in the left sidebar
4. Click **"Create Key"** → name it `infoblox-value-tool`
5. **Copy the key** — it starts with `sk-ant-...`
6. Keep it safe — you'll paste it into Render in Step 3

---

## Step 2 — Push to GitHub

```bash
# In this folder:
git init
git add .
git commit -m "Infoblox Value Tool with AI proxy"

# Create repo at https://github.com/new then:
git remote add origin https://github.com/YOUR_USERNAME/infoblox-value-tool.git
git branch -M main
git push -u origin main
```

Or use GitHub Desktop — drag this folder in, then click "Publish repository".

---

## Step 3 — Deploy on Render

1. Go to **https://dashboard.render.com** → sign up free
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repo `infoblox-value-tool`
4. Configure:

| Setting | Value |
|---------|-------|
| **Name** | `infoblox-value-tool` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | `Free` |

5. **⚠️ IMPORTANT — Add Environment Variable:**
   - Scroll down to **"Environment Variables"**
   - Click **"Add Environment Variable"**
   - Key: `ANTHROPIC_API_KEY`
   - Value: *(paste your key from Step 1)*
   - Click **"Save"**

6. Click **"Create Web Service"**

Render deploys in ~2 minutes. Your URL: `https://infoblox-value-tool.onrender.com`

---

## Step 4 — Verify AI is Working

Visit: `https://infoblox-value-tool.onrender.com/health`

You should see:
```json
{ "status": "ok", "ai": "configured" }
```

If you see `"ai": "missing"`, go back to Render → Environment and add the key.

---

## Updating the App

Every push to GitHub auto-deploys:
```bash
git add .
git commit -m "Your changes"
git push
```

---

## Local Testing

```bash
# Create a .env file (never commit this!)
echo "ANTHROPIC_API_KEY=sk-ant-your-key-here" > .env

npm install
node -r dotenv/config server.js   # or just: ANTHROPIC_API_KEY=sk-ant-... npm start

# Open http://localhost:3000
```

---

## Notes

- Free Render tier sleeps after 15 min idle. First load ~30s. Upgrade to **Starter ($7/mo)** for always-on.
- PPTX download is fully browser-side — works offline once page is loaded.
- The `.env` file is in `.gitignore` — your key will never be committed.
