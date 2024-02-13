import { NextApiRequest, NextApiResponse } from 'next';
import { generateConstroadPDF } from '../../utils/pdfGenerator';
import { Readable } from 'stream';
import { PDF_TEMPLATE } from 'src/common/consts';

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