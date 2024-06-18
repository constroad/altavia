import { NextApiRequest, NextApiResponse } from 'next';
import { Readable } from 'stream';
import { generateDispatchReport } from 'src/utils/pdfGeneratorDispatchReport';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  try {
    const pdfBuffer = await generateDispatchReport(req.body.mockData)

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