import { CONSTROAD_PORTAL } from "../consts";

// src/lib/telegramClient.ts
export const BASE_CONSTROAD_PORTAL_API = `${CONSTROAD_PORTAL.replace(/\/+$/, '')}/api`;

export type TelegramMedia = {
  file_name: string;
  mime_type: string;
  messageId: string;
  fileId: string;
  fileUrl: string;
  thumbnailFileId: string;
  thumbnailUrl?: string;
  filePath?: string;
};

export type SendOpts = {
  chatId: string;
  text?: string;
  photoUrl?: string;
  base64Image?: string;   // dataURL o base64 puro
  documentUrl?: string;
  caption?: string;
  parseMode?: 'MarkdownV2' | 'Markdown' | 'HTML';
};

async function jfetch<T>(path: string, init?: RequestInit): Promise<T> {
  const r = await fetch(`${BASE_CONSTROAD_PORTAL_API}${path}`, init);
  const j = await r.json();
  if (!r.ok) throw j;
  return j as T;
}

// ---------- SEND ----------
export async function send(opts: SendOpts) {
  return jfetch<any>('/telegram/send', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(opts),
  });
}

// ---------- UPLOAD (multipart o base64) ----------
export async function uploadDocumentMultipart(chat_id: string, file: File, caption?: string, file_name?: string, mime_type?: string) {
  const form = new FormData();
  form.set('chat_id', chat_id);
  if (caption) form.set('caption', caption);
  if (file_name) {
    // renombra si quieres
    const renamed = new File([file], file_name, { type: mime_type || file.type });
    form.set('document', renamed);
  } else {
    form.set('document', file);
  }
  return jfetch<any>('/telegram/upload', { method: 'POST', body: form });
}

export async function uploadDocumentBase64(chat_id: string, base64: string, caption?: string, file_name?: string, mime_type?: string) {
  const p = new URLSearchParams();
  p.set('chat_id', chat_id);
  if (caption) p.set('caption', caption);
  p.set('file_base64', base64);
  if (file_name) p.set('file_name', file_name);
  if (mime_type) p.set('mime_type', mime_type);

  return jfetch<any>('/telegram/upload', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: p.toString(),
  });
}

// ---------- UTILS ----------
export async function getFileUrl(file_id: string) {
  return jfetch<{ ok: true; file_path: string; file_url: string; raw: any }>(
    `/telegram/get-file-url?file_id=${encodeURIComponent(file_id)}`
  );
}

export async function deleteMessage(chat_id: string, message_id: number) {
  return jfetch<any>('/telegram/delete-message', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ chat_id, message_id }),
  });
}

// Para <img src>, usa el PROXY del servicio externo (no expone el token):
export function proxySrcByFileId(fileId: string) {
  return `${BASE_CONSTROAD_PORTAL_API}/telegram/file?fileId=${encodeURIComponent(fileId)}`;
}
export function proxySrcByFilePath(filePath: string) {
  return `${BASE_CONSTROAD_PORTAL_API}/telegram/file?filePath=${encodeURIComponent(filePath)}`;
}

// Descarga (fuerza filename)
export function downloadHref(fileId: string, fileName = 'download.bin') {
  return `${BASE_CONSTROAD_PORTAL_API}/telegram/download?fileId=${encodeURIComponent(fileId)}&fileName=${encodeURIComponent(fileName)}`;
}
