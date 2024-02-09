import { NextApiRequest, NextApiResponse } from 'next';

import fs from 'fs';
import path from 'path';
import { templatePDF } from 'src/components/templates';
import chromium from 'chrome-aws-lambda';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method === 'POST') {

    const backgroundBuffer = fs.readFileSync(path.resolve(process.cwd(), 'public', 'bg-cotizacion.svg'));
    const base64bg = backgroundBuffer.toString('base64');

    const logoBuffer = fs.readFileSync(path.resolve(process.cwd(), 'public', 'constroad.jpeg'));
    const base64Logo = logoBuffer.toString('base64');

    const htmlTemplate = templatePDF(req.body, base64bg, base64Logo);

    const browser = await chromium.puppeteer.launch({
      args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: true,
      ignoreHTTPSErrors: true,
    })

    const page = await browser.newPage();
    await page.setContent(htmlTemplate);
    const pdfBuffer = await page.pdf({
      format: 'a4',
      margin: {
        top: '0',
        right: '0',
        bottom: '0',
        left: '0',
      },
      printBackground: true
    });
    const pdfBase64 = pdfBuffer.toString('base64');
    await browser.close();

    res.status(200).json({ pdfBase64 });
    
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ message: 'Método no permitido' });
  }
}
