/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest, NextApiResponse } from 'next';

import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';

import { initialClient, htmlCotizacion } from 'src/components';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    
    const backgroundBuffer = fs.readFileSync(path.resolve(process.cwd(), 'public', 'bg-cotizacion.svg'));
    const base64bg = backgroundBuffer.toString('base64');
    
    const logoBuffer = fs.readFileSync(path.resolve(process.cwd(), 'public', 'constroad.jpeg'));
    const base64Logo = logoBuffer.toString('base64');
    
    const htmlTemplate = htmlCotizacion(initialClient, base64bg, base64Logo)
    
    // Lanza un navegador headless
    const browser = await puppeteer.launch();

    // Crea una nueva página
    const page = await browser.newPage();

    // Carga el HTML en la página
    await page.setContent(htmlTemplate);

    // Genera el PDF
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });

    // Cierra el navegador
    await browser.close();

    // Envía el PDF como respuesta
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="output.pdf"');
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error al generar el PDF:', error);
    res.status(500).send('Error interno del servidor');
  }
};
