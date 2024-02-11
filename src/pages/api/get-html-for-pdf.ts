import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  const time = new Date()
  try {
    // Devuelve el HTML como respuesta
    // res.setHeader('Content-Type', 'application/json');
    res.status(200).send(
      `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ejemplo de HTML para PDF</title>
  <style>
    html {
      margin: 0;
      padding:0;
    }
    body {
      margin: 0;
      font-family: Arial, sans-serif;
      font-size: 12px;
    }
    .container {
      width: 100%;
      margin: 0;
      text-align: left;
      font-size: 10px;
    }
  </style>
</head>
<body style="margin: 0; padding:0;">
  <div class="container">
    <h1 style="left: 0; font-size: 12px;color: blue;">HTML para PDF ${time}</h1>
    <p style="font-size: 10px;color: #666;">
    Este es un ejemplo de HTML con estilos integrados para generar un PDF.
    </p>
  </div>
</body>
</html>
`
    );
  } catch (error) {
    console.error("Error generating HTML for PDF:", error);
    res.status(500).json({ error: "Error generating HTML for PDF" });
  }
}
