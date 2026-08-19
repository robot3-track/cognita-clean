// Configure Vercel to allow up to 60 seconds for this serverless function
export const config = {
  maxDuration: 60,
};

export default async function handler(req, res) {
  // Define allowed origins for CORS
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

  // Handle browser preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Retrieve and trim API key prioritizing VITE_ prefixes first
  const rawApiKey = process.env.VITE_BIG_PICKLE_API_KEY || process.env.BIG_PICKLE_API_KEY || process.env.VITE_OPENCODE_API_KEY || process.env.OPENCODE_API_KEY || '';
  const apiKey = rawApiKey.trim();

  // Retrieve Base URL prioritizing VITE_ prefixes first
  const rawBaseUrl = process.env.VITE_BIG_PICKLE_BASE_URL || process.env.BIG_PICKLE_BASE_URL || process.env.VITE_OPENCODE_BASE_URL || process.env.OPENCODE_BASE_URL || "https://openrouter.ai/api/v1";
  const baseUrl = rawBaseUrl.trim().replace(/\/+$/, '');

  if (!apiKey) {
    return res.status(500).json({ error: 'API key is missing on the Vercel server environment.' });
  }

  try {
    const { model, messages, temperature, response_format } = req.body;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 55000); // 55s timeout

    const bigPickleRes = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://cognitastudy.me', // OpenRouter requirement
        'X-Title': 'Cognita Study',               // OpenRouter requirement
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // Uses a free tier model if no model is explicitly passed
        model: model || 'meta-llama/llama-3.3-70b-instruct:free',
        messages,
        temperature: temperature ?? 0.7,
        ...(response_format ? { response_format } : {}),
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await bigPickleRes.json();

    if (!bigPickleRes.ok) {
      console.error('API Provider Error:', data);
      return res.status(bigPickleRes.status).json(data);
    }

    return res.status(200).json(data);
  } catch (err) {
    if (err.name === 'AbortError') {
      return res.status(504).json({ error: 'Request timed out after 55 seconds' });
    }
    return res.status(500).json({ error: err.message || 'Internal server error while processing request' });
  }
}
