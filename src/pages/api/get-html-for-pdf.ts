import { NextApiRequest, NextApiResponse } from 'next';

const htmlSample = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ejemplo de HTML para PDF</title>
</head>
<body>
  <h1 style="font-size: 24px; color: #333; text-align: center;">Ejemplo de HTML para PDF</h1>
  <p style="font-size: 16px; color: #666; text-align: center;">Este es un ejemplo de HTML con estilos en línea para generar un PDF.</p>
  <div style="width: 200px; height: 200px; background-color: #007bff; margin: 0 auto;"></div>
</body>
</html>

`

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Devuelve el HTML como respuesta
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(htmlSample);
  } catch (error) {
    console.error("Error generating HTML for PDF:", error);
    res.status(500).json({ error: "Error generating HTML for PDF" });
  }
}
