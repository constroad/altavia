import { NextApiRequest, NextApiResponse } from 'next';
import { createQuotePdf } from '../../utils/pdfGenerator';
import { Readable } from 'stream';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  // const fileName = 
  try {
    // Aquí maneja los datos enviados desde el frontend
    const { data } = req.body;

    // Genera el PDF
    const pdfBuffer = await createQuotePdf(data);

    // Crea un flujo de lectura desde el buffer
    const pdfStream = new Readable();
    pdfStream.push(pdfBuffer);
    pdfStream.push(null); // Indica que no hay más datos en el flujo

    // Envía el PDF como respuesta
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=quote.pdf');
    pdfStream.pipe(res);
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ error: "Error generating PDF" });
  }
}