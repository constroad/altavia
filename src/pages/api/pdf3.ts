// Importa las librerías necesarias
import { NextApiRequest, NextApiResponse } from 'next';
import { templatePDF } from 'src/components';
import fs from 'fs';
import path from 'path';

// Define la ruta de las imágenes
const bgImagePath = path.resolve(process.cwd(), 'public', 'bg-cotizacion.svg');
const logoImagePath = path.resolve(process.cwd(), 'public', 'constroad.jpeg');

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Lee el contenido del cuerpo de la solicitud
    const { data } = req.body;

    // Lee el contenido de las imágenes y conviértelas a base64
    const bgImageBase64 = fs.readFileSync(bgImagePath, 'base64');
    const logoImageBase64 = fs.readFileSync(logoImagePath, 'base64');

    // Genera el HTML con el contenido y las imágenes base64
    const htmlContent = templatePDF(req.body, bgImageBase64, logoImageBase64);

    // Devuelve el HTML como respuesta
    res.status(200).send(htmlContent);
  } else {
    // Devuelve un error si el método no es POST
    res.status(405).end('Method Not Allowed');
  }
}
