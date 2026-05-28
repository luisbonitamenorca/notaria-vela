// Proxy serverless hacia la API de Anthropic.
// La API key vive en la variable de entorno ANTHROPIC_API_KEY de Vercel
// (Settings → Environment Variables). Nunca aparece en el HTML cliente.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'Falta la variable de entorno ANTHROPIC_API_KEY en Vercel.'
    });
  }

  try {
    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(req.body)
    });

    const data = await upstream.json();
    return res.status(upstream.status).json(data);
  } catch (e) {
    return res.status(500).json({ error: 'Error contactando con Anthropic: ' + e.message });
  }
}
