/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest, NextApiResponse } from 'next';

import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';

import {
  htmlBlankPage,
  htmlCotizacionServicioPage1,
  htmlCotizacionServicioPage2,
  htmlCotizacionServicioPage2NoIGV,
  htmlDispatchNote,
  htmlDispatchReport
} from 'src/components';
import { htmlCotizacionNoIGV } from 'src/components/templates/htmlCotizacionNoIGV';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    
    const backgroundBuffer = fs.readFileSync(path.resolve(process.cwd(), 'public', 'bg-cotizacion.svg'));
    const base64bg = backgroundBuffer.toString('base64');
    
    const logoBuffer = fs.readFileSync(path.resolve(process.cwd(), 'public', 'constroad.jpeg'));
    const base64Logo = logoBuffer.toString('base64');
    
    // const htmlTemplate = htmlBlankPage(base64bg, base64Logo)    //generate blank page with costroad background

    // const htmlTemplate = htmlCotizacionNoIGV(base64bg, base64Logo)    //generate service quote page 1
    
    // const htmlTemplate = htmlCotizacionServicioPage1(base64bg, base64Logo)    //generate service quote page 1    
    // const htmlTemplate = htmlCotizacionServicioPage2(base64bg, base64Logo)    //generate service quote page 2 
    // const htmlTemplate = htmlCotizacionServicioPage2NoIGV(base64bg, base64Logo)    //generate service quote page 2
    const htmlTemplate = htmlDispatchNote(base64Logo)     //generate dispatch note

    // const htmlTemplate = htmlDispatchReport(base64Logo)

    
    // Lanza un navegador headless
    const browser = await puppeteer.launch();

    // Crea una nueva página
    const page = await browser.newPage();

    // Carga el HTML en la página
    await page.setContent(htmlTemplate);

    // Genera el PDF
    const pdfBuffer = await page.pdf({
      width: '210mm',
      height: '148mm',
      printBackground: true,
    });
    //cambiar dimensiones para hacer un pdf A4

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
