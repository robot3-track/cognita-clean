export const config = {
  maxDuration: 120,
};

export default async function handler(req, res) {
  const allowedOrigins = [
    'https://cognitastudy.me',
    'https://www.cognitastudy.me',
    'https://cognitastudy.vercel.app',
    'https://cognitastudyfirebase.vercel.app',
    'https://cognita.ai.studio'
  ];

  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', 'https://www.cognitastudy.me');
  }

  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({ status: 'ok', message: 'Hack Club API proxy endpoint is active.' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Please send a POST request.' });
  }

  const apiKey = (
    process.env.VITE_HACKCLUB_API_KEY || 
    process.env.HACKCLUB_API_KEY || 
    ''
  ).trim();

  if (!apiKey) {
    return res.status(500).json({ error: 'Hack Club API key is missing in server environment variables.' });
  }

  let rawBase = (
    process.env.VITE_HACKCLUB_BASE_URL || 
    process.env.HACKCLUB_BASE_URL || 
    'https://ai.hackclub.com/chat/completions'
  ).trim();

  let targetUrl = rawBase;
  if (!targetUrl.endsWith('/chat/completions')) {
    targetUrl = `${targetUrl.replace(/\/+$/, '')}/chat/completions`;
  }

  try {
    const { model, messages, temperature, response_format } = req.body || {};

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 115000);

    const hackclubRes = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model || 'qwen/qwen-2.5-72b-instruct',
        messages: messages || [],
        temperature: temperature ?? 0.7,
        ...(response_format ? { response_format } : {}),
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await hackclubRes.json();

    if (!hackclubRes.ok) {
      console.error('Hack Club Upstream Response Error:', hackclubRes.status, data);
      return res.status(hackclubRes.status).json(data);
    }

    return res.status(200).json(data);
  } catch (err) {
    if (err.name === 'AbortError') {
      return res.status(504).json({ error: 'Hack Club request timed out after 2 minutes' });
    }
    return res.status(500).json({ error: err.message || 'Internal server error while processing proxy request' });
  }
}
