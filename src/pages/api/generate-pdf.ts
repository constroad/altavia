import { NextApiRequest, NextApiResponse } from 'next';
import { 
  createHtmlToPdf, 
  createQuotePdf, 
  generateConstroadPDF } from '../../utils/pdfGenerator';
import { Readable } from 'stream';


const htmlSample = `
<!DOCTYPE html>
<html lang="en">
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
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  try {
    const { data } = req.body;

    // Genera el PDF con pdf-lib
    // const pdfBuffer = await createQuotePdf(data);

    // Genera el PDF desde de un html
    // const pdfBuffer = await createHtmlToPdf(htmlSample);

    const pdfBuffer = await generateConstroadPDF(data)
  

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