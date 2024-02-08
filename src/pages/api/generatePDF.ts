import { NextApiRequest, NextApiResponse } from 'next';

import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';

import { templatePDF } from 'src/components/templates';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { sender, name, razonSocial } = req.body;
    console.log('req.body:', req.body)
    const number = 15

    const backgroundBuffer = fs.readFileSync(path.resolve(process.cwd(), 'public', 'bg-cotizacion.svg'));
    const base64bg = backgroundBuffer.toString('base64');

    const logoBuffer = fs.readFileSync(path.resolve(process.cwd(), 'public', 'constroad.jpeg'));
    const base64Logo = logoBuffer.toString('base64');

    const htmlTemplate = templatePDF(req.body, number, base64bg, base64Logo);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlTemplate);
    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: {
        top: '0',
        right: '0',
        bottom: '0',
        left: '0',
      },
      printBackground: true
    });
    await browser.close();

    // Enviar el PDF como respuesta al frontend
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=documento.pdf');
    res.send(pdfBuffer);
    
  } else {
    res.status(405).json({ message: 'Método no permitido' });
  }
}
