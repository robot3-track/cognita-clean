// Configure Vercel to allow up to 120 seconds (2 minutes) for this serverless function
export const config = {
  maxDuration: 120,
};

export default async function handler(req, res) {
  // Define your allowed domains list
  const allowedOrigins = [
    'https://cognitastudy.me',
    'https://www.cognitastudy.me',
    'https://cognitastudy.vercel.app',
    'https://cognitastudyfirebase.vercel.app',
    'https://cognita.ai.studio'
  ];

  const origin = req.headers.origin;
  
  // If the request comes from one of your valid domains, allow it dynamically
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    // Fallback default domain if origin doesn't match or is undefined (e.g. server-to-server)
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

  const apiKey = process.env.VITE_NVIDIA_API_KEY || process.env.NVIDIA_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Nvidia API key is not configured on the server environment' });
  }

  try {
    const { model, messages, temperature, response_format } = req.body;

    // Create a 120-second (2-minute) timeout controller
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000);

    const nvidiaRes = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model || 'meta/llama-3.1-70b-instruct',
        messages,
        temperature: temperature ?? 0.7,
        ...(response_format ? { response_format } : {}),
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await nvidiaRes.json();

    if (!nvidiaRes.ok) {
      return res.status(nvidiaRes.status).json(data);
    }

    return res.status(200).json(data);
  } catch (err) {
    if (err.name === 'AbortError') {
      return res.status(504).json({ error: 'Nvidia request timed out after 2 minutes' });
    }
    return res.status(500).json({ error: err.message || 'Internal server error while proxying to Nvidia' });
  }
}
