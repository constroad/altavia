import { NextApiRequest, NextApiResponse } from 'next';
import { createPdfAndConvertToImage } from './createPdfAndConvertToImage';
import fs from 'fs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const data = req.body.pdfData;

    const imageBase64 = await createPdfAndConvertToImage(data);

    res.status(200).json({ imageBase64 });

  } catch (error) {
    console.error('Error en la API:', error);
    console.log('error:', error)

    let errorMessage = 'Error al generar la previsualización del PDF';
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    res.status(500).json({ error: errorMessage });
  }
}
