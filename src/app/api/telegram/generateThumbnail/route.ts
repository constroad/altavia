import { NextRequest } from 'next/server';
import { PDFDocument } from 'pdf-lib';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const fileUrl = searchParams.get('fileUrl');

  if (!fileUrl) {
    return new Response(JSON.stringify({ error: 'fileUrl is required' }), {
      status: 400,
    });
  }

  try {
    const response = await fetch(fileUrl);
    const arrayBuffer = await response.arrayBuffer();

    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pages = pdfDoc.getPages();

    if (pages.length > 0) {
      const page = pages[0];
      const { width, height } = page.getSize();

      //@ts-ignore
      const thumbnail = await page.renderToImage({
        width: Math.min(width, 200),
        height: Math.min(height, 200),
        format: 'png',
      });

      return new Response(thumbnail, {
        status: 200,
        headers: { 'Content-Type': 'image/png' },
      });
    } else {
      return new Response(JSON.stringify({ error: 'El PDF no tiene páginas' }), {
        status: 400,
      });
    }
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Error al procesar el PDF' }), {
      status: 500,
    });
  }
}
