// app/api/telegram/download/route.ts

import { NextRequest } from 'next/server';
import { TELEGRAM_TOKEN } from '@/common/consts';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const fileId = searchParams.get('fileId');
  const fileName = searchParams.get('fileName');

  if (!fileId || !fileName) {
    return new Response(JSON.stringify({ error: 'Missing fileId or fileName' }), { status: 400 });
  }

  const getFileUrl = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/getFile?file_id=${fileId}`;

  try {
    const response = await fetch(getFileUrl);
    const data = await response.json();

    if (!data.ok) {
      return new Response(JSON.stringify({ error: 'Error al obtener file_path' }), { status: 400 });
    }

    const filePath = data.result.file_path;
    const fileUrl = `https://api.telegram.org/file/bot${TELEGRAM_TOKEN}/${filePath}`;
    const fileResponse = await fetch(fileUrl);
    const buffer = await fileResponse.arrayBuffer();

    const decodedFileName = decodeURIComponent(fileName)
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ñ/g, "n").replace(/Ñ/g, "N");

    return new Response(Buffer.from(buffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${decodedFileName}"`,
      },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Error en el backend' }), { status: 500 });
  }
}
