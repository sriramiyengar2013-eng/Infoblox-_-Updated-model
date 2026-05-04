const express = require('express');
const path    = require('path');
const https   = require('https');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── MIDDLEWARE ────────────────────────────────────────────────
app.use(express.json({ limit: '20kb' }));

// Serve static files (index.html, etc.)
app.use(express.static(path.join(__dirname), {
  setHeaders: (res, filePath) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    }
  }
}));

// ── AI PROXY ROUTE ────────────────────────────────────────────
// POST /api/ask  { system: string, question: string }
// Keeps ANTHROPIC_API_KEY on the server — never exposed to browser
app.post('/api/ask', async (req, res) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: 'ANTHROPIC_API_KEY is not configured. Add it in Render → Environment.'
    });
  }

  const { system, question } = req.body;
  if (!system || !question) {
    return res.status(400).json({ error: 'Missing system or question in request body.' });
  }

  const payload = JSON.stringify({
    model:      'claude-sonnet-4-20250514',
    max_tokens: 400,
    system:     system,
    messages:   [{ role: 'user', content: question }]
  });

  const options = {
    hostname: 'api.anthropic.com',
    path:     '/v1/messages',
    method:   'POST',
    headers: {
      'Content-Type':      'application/json',
      'Content-Length':    Buffer.byteLength(payload),
      'x-api-key':         apiKey,
      'anthropic-version': '2023-06-01'
    }
  };

  const apiReq = https.request(options, (apiRes) => {
    let data = '';
    apiRes.on('data', chunk => data += chunk);
    apiRes.on('end', () => {
      try {
        const parsed = JSON.parse(data);
        if (apiRes.statusCode !== 200) {
          return res.status(apiRes.statusCode).json({
            error: parsed.error?.message || 'Anthropic API error.'
          });
        }
        const answer = parsed.content
          ?.filter(c => c.type === 'text')
          .map(c => c.text)
          .join('') || 'No response.';
        res.json({ answer });
      } catch (e) {
        res.status(500).json({ error: 'Failed to parse Anthropic response.' });
      }
    });
  });

  apiReq.on('error', (e) => {
    console.error('Anthropic request error:', e.message);
    res.status(502).json({ error: 'Could not reach Anthropic API: ' + e.message });
  });

  apiReq.write(payload);
  apiReq.end();
});

// ── HEALTH CHECK ──────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    ai: process.env.ANTHROPIC_API_KEY ? 'configured' : 'missing — set ANTHROPIC_API_KEY'
  });
});

// ── FALLBACK ──────────────────────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ── START ─────────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Infoblox Value Tool running on port ${PORT}`);
  console.log(`🤖 AI: ${process.env.ANTHROPIC_API_KEY ? 'API key found ✓' : '⚠️  ANTHROPIC_API_KEY not set'}`);
});
