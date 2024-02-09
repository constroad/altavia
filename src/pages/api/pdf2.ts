// pages/api/pdf.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { chromium } from 'playwright-core';
import fs from 'fs';
import path from 'path';
import { templatePDF } from 'src/components';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {

    const backgroundBuffer = fs.readFileSync(path.resolve(process.cwd(), 'public', 'bg-cotizacion.svg'));
    const base64bg = backgroundBuffer.toString('base64');

    const logoBuffer = fs.readFileSync(path.resolve(process.cwd(), 'public', 'constroad.jpeg'));
    const base64Logo = logoBuffer.toString('base64');

    const htmlTemplate = templatePDF(req.body, base64bg, base64Logo);
    
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.setContent(htmlTemplate);
    const pdfBuffer = await page.pdf({ format: 'A4' });

    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="generated-pdf.pdf"');
    res.status(200).send(pdfBuffer);
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
