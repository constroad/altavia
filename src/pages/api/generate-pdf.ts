import { NextApiRequest, NextApiResponse } from 'next';
import { createHtmlToPdf, createQuotePdf } from '../../utils/pdfGenerator';
import { Readable } from 'stream';

const htmlSample = `
<!-- 
Online HTML, CSS and JavaScript editor to run code online.
-->
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="style.css" />
  <title>Browser</title>
</head>

<body>
  <h1>
    Write, edit and run HTML, CSS and JavaScript code online.
  </h1>
  <p>
    Our HTML editor updates the webview automatically in real-time as you write code.
  </p>
  <script src="script.js"></script>
</body>

</html>
`

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  try {
    const { data } = req.body;

    // Genera el PDF con pdf-lib
    // const pdfBuffer = await createQuotePdf(data);

    // Genera el PDF desde de un html
    const pdfBuffer = await createHtmlToPdf(htmlSample);

    const pdfStream = new Readable();
    pdfStream.push(pdfBuffer);
    pdfStream.push(null); // Indica que no hay más datos en el flujo

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=quote.pdf');
    pdfStream.pipe(res);
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ error: "Error generating PDF" });
  }
}