import { NextApiRequest, NextApiResponse } from 'next';
import { generatePurchaseOrderPDF } from '../../utils/pdfGeneratorPurchaseOrder';
import { Readable } from 'stream';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  try {
    const { data } = req.body;

    const signatureBuffer = fs.readFileSync(path.resolve(process.cwd(), 'public', 'signature-jose-zena.png'));
    const base64Signature = signatureBuffer.toString('base64')

    // Genera el PDF con pdf-lib
    // const pdfBuffer = await createQuotePdf(data);

    // Genera el PDF desde de un html
    // const pdfBuffer = await createHtmlToPdf(htmlSample);

    const pdfBuffer = await generatePurchaseOrderPDF(data, base64Signature)
  

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