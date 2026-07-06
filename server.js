require('dotenv').config();

const express = require('express');
const rateLimit = require('express-rate-limit');
const fetch = require('node-fetch');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '16kb' }));

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
});

app.get('/', (req, res) => {
  res.json({ ok: true, service: 'tell-api' });
});

app.post('/send', limiter, async (req, res) => {
  if (process.env.API_KEY) {
    const apiKey = req.get('x-api-key');
    if (apiKey !== process.env.API_KEY) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }

  const { message, userId = 41869015 } = req.body || {};

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' });
  }

  if (message.length > 500) {
    return res.status(400).json({ error: 'Message is too long' });
  }

  if (!process.env.TELLONYM_TOKEN) {
    return res.status(500).json({ error: 'TELLONYM_TOKEN is not configured' });
  }

  try {
    const response = await fetch('https://api.tellonym.me/tells/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.TELLONYM_TOKEN}`,
        'Tellonym-Client': 'ios:3.159.1:2691:26:iPhone12,1',
        'User-Agent': 'Tellonym/2691 CFNetwork/3860.200.71 Darwin/25.1.0',
      },
      body: JSON.stringify({
        senderStatus: 0,
        referalId: 0,
        tell: message,
        userId,
      }),
    });

    const text = await response.text();
    let data;

    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }

    return res.status(response.status).json({
      success: response.ok,
      status: response.status,
      data,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
