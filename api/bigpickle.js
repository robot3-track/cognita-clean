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
  
  if (origin && allowedOrigins.includes(origin)) {
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
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Retrieve API key prioritizing VITE_ prefixes first
  const rawApiKey = process.env.VITE_BIG_PICKLE_API_KEY || process.env.BIG_PICKLE_API_KEY || process.env.VITE_OPENCODE_API_KEY || process.env.OPENCODE_API_KEY || process.env.OPENROUTER_API_KEY || '';
  const apiKey = rawApiKey.trim();

  // Retrieve Base URL prioritizing VITE_ prefixes first
  const rawBaseUrl = process.env.VITE_BIG_PICKLE_BASE_URL || process.env.BIG_PICKLE_BASE_URL || process.env.VITE_OPENCODE_BASE_URL || process.env.OPENCODE_BASE_URL || "https://openrouter.ai/api/v1";
  const baseUrl = rawBaseUrl.trim().replace(/\/+$/, '');

  if (!apiKey) {
    return res.status(500).json({ error: 'API key is missing on the Vercel server environment variables.' });
  }

  try {
    const { model, messages, temperature, response_format } = req.body || {};

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid payload: "messages" must be an array.' });
    }

    // Map custom internal model names to valid provider string IDs
    let selectedModel = model;
    if (!selectedModel || selectedModel === 'bigpickle' || selectedModel === 'big-pickle') {
      selectedModel = process.env.BIG_PICKLE_MODEL_ID || 'meta-llama/llama-3.3-70b-instruct:free';
    }

    const payload = {
      model: selectedModel,
      messages,
      temperature: typeof temperature === 'number' ? temperature : 0.7,
    };

    // Only forward response_format if explicitly passed and valid object
    if (response_format && typeof response_format === 'object') {
      payload.response_format = response_format;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 52000); // 52s timeout for Vercel 60s limit

    const bigPickleRes = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://cognitastudy.me',
        'X-Title': 'Cognita Study',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await bigPickleRes.json();

    if (!bigPickleRes.ok) {
      console.error('API Provider Error Response:', data);
      return res.status(bigPickleRes.status).json({
        error: data.error || 'Downstream API provider returned an error',
        details: data
      });
    }

    return res.status(200).json(data);
  } catch (err) {
    if (err.name === 'AbortError') {
      return res.status(504).json({ error: 'Request timed out after 52 seconds' });
    }
    console.error('Serverless Handler Error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error while processing request' });
  }
}
