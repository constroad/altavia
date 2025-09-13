import { useState } from "react";
import { TELEGRAM_TOKEN } from "../consts";
import { sendTelegramImageText, sendTelegramTextMessage } from "src/utils/general";
import * as telegramApi from "../utils/telegramClient";
import { BASE_CONSTROAD_PORTAL_API } from "../utils/telegramClient";

// curl -s "https://api.telegram.org/bot<token>/getUpdates"

export type TelegramMedia = {
  file_name: string,
  mime_type: string,
  messageId: string,
  fileId: string,
  fileUrl: string,
  thumbnailFileId: string,
  thumbnailUrl?: string
  file?: File
}

interface UseTelegramProps {
  chat_id: string
}

interface UpLoadParams {
  onSuccess?: (data: TelegramMedia) => void
  onError?: (error: any) => void
  fileName?: string
  mimeType?: string
  chat_id?: string
  caption?: string;
}
interface DeleteParams {
  onSuccess?: () => void
  onError?: (error: any) => void
  chat_id?: string
}


export const useTelegram = (props: UseTelegramProps) => {
  const [ isLoading, setIsLoading ] = useState(false)
  const [ isDeleting, setIsDeleting ] = useState(false)
  const [ isDownloading, setIsDownloading ] = useState(false)

  function base64ToBlob(base64: string, mimeType: string) {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);

      for (let i = 0; i < slice.length; i++) {
        byteNumbers[ i ] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: mimeType });
  }

  function base64ToDataUrl(base64: string, mimeType = 'application/octet-stream') {
    return base64.startsWith('data:') ? base64 : `data:${mimeType};base64,${base64}`;
  }

  const getTelegramFileUrl = async (fileId: string) => {
    // setIsLoading(true)
    // const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/getFile?file_id=${fileId}`;

    // try {
    //   const response = await fetch(url);
    //   const data = await response.json();
    //   if (data.ok) {
    //     const filePath = data.result.file_path;
    //     const fileUrl = `https://api.telegram.org/file/bot${TELEGRAM_TOKEN}/${filePath}`;
    //     return fileUrl;
    //   } else {
    //     console.error('Error al obtener la URL del archivo:', data.description);
    //   }
    // } catch (error) {
    //   console.error('Error en la solicitud:', error);
    // } finally {
    //   setIsLoading(false)
    // }
    try {
      const j = await telegramApi.getFileUrl(fileId);
      return j.file_url; // si prefieres usar el proxy para <img>, usa proxySrcByFileId
    } catch (e) {
      console.error('get-file-url error:', e);
    }
  };

  const uploadFile = async (file: File | string, params?: UpLoadParams) => {

    // setIsLoading(true)
    // const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendDocument`;
    // const localChatId = params?.chat_id ?? props.chat_id
    // const form = new FormData();
    // form.append('chat_id', localChatId);
    // if (typeof file === 'string') {
    //   const blob = base64ToBlob(file, 'application/pdf');
    //   form.append('document', blob, params?.fileName ?? 'upload.pdf');
    // } 
    // else {
    //   const fileConverted = file
    //   const fileName = fileConverted.name ?? `file_${new Date().getTime()}`
    //   form.append('document', file, params?.fileName ?? fileName);
    // }

    // try {
    //   const response = await fetch(url, {
    //     method: 'POST',
    //     body: form,
    //   });
    //   const data = await response.json();
    //   if (data.ok) {

    //     console.log('Archivo subido exitosamente', data);
    //     const fileTelegram = data.result.document ?? data.result.video
    //     const fileId = fileTelegram.file_id;
    //     const file_name = fileTelegram.file_name;
    //     const mime_type = fileTelegram.mime_type;
    //     const getFileUrl = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/getFile?file_id=${fileId}`;

    //     const messageId = data.result.message_id; // Obtén el message_id
    //     const fileResponse = await fetch(getFileUrl);
    //     const fileData = await fileResponse.json();

    //     const thumbnailUrl = fileTelegram.thumb ? await getTelegramFileUrl(fileTelegram.thumb.file_id) : undefined
    //     if (fileData.ok) {
    //       const filePath = fileData.result.file_path;
    //       const fileUrl = `https://api.telegram.org/file/bot${TELEGRAM_TOKEN}/${filePath}`;
    //       const result: TelegramMedia = {
    //         file_name,
    //         mime_type,
    //         messageId,
    //         fileId,
    //         fileUrl,
    //         thumbnailFileId: fileTelegram?.thumb?.file_id ?? '',
    //         thumbnailUrl,
    //       }
    //       params?.onSuccess?.(result)
    //       return result;
    //     }

    //   } else {
    //     params?.onError?.(data)
    //     console.error('Error al subir el archivo:', data.description);
    //   }
    // } catch (error) {
    //   console.error('Error en la solicitud:', error);
    //   params?.onError?.(error)
    // } finally {
    //   setIsLoading(false)
    // }


    setIsLoading(true);
    const chatId = params?.chat_id ?? props.chat_id;

    try {
      let resp: any;
      if (typeof file === 'string') {
        // base64 (dataURL o base64 “pelado”)
        const dataUrl = base64ToDataUrl(file, params?.mimeType || 'application/octet-stream');
        resp = await telegramApi.uploadDocumentBase64(chatId, dataUrl, params?.caption, params?.fileName, params?.mimeType);
      } else {
        // multipart
        resp = await telegramApi.uploadDocumentMultipart(chatId, file, params?.caption, params?.fileName, params?.mimeType);
      }

      if (resp?.ok === false) {
        params?.onError?.(resp);
        return;
      }

      // La API de Express (service) devuelve el payload de Telegram tal cual (ok/result)
      const data = resp;
      const msg = data.result ?? data.raw?.result ?? {};
      // Compat: acepta las dos formas del backend que te pasé
      const fileTelegram = msg.document || msg.video || msg.sticker || msg.animation || msg.audio || msg.voice || {};
      const fileId = fileTelegram.file_id;
      const file_name = fileTelegram.file_name;
      const mime_type = fileTelegram.mime_type;
      const messageId = msg.message_id;

      // Si tu backend ya devuelve result completo, úsalo directo:
      const result: TelegramMedia = data.result ?? {
        file_name,
        mime_type,
        messageId,
        fileId,
        fileUrl: data.fileUrl || '',
        thumbnailFileId: fileTelegram?.thumb?.file_id ?? '',
        thumbnailUrl: data.thumbnailUrl || undefined,
      };
      params?.onSuccess?.(result);
      return result;
    } catch (e) {
      console.error('upload error:', e);
      params?.onError?.(e);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadFile = async (fileId: string, file_name: string) => {
    // setIsDownloading(true)
    // const backendUrl = `/api/telegram/download?fileId=${fileId}&fileName=${file_name}`;

    // try {
    //   const response = await fetch(backendUrl);
    //   if (response.ok) {
    //     const blob = await response.blob();
    //     const url = URL.createObjectURL(blob);
    //     const link = document.createElement('a');
    //     link.href = url;
    //     link.download = file_name; // Puedes definir un nombre de archivo más específico aquí
    //     link.click();
    //     URL.revokeObjectURL(url);
    //   } else {
    //     console.error('Error al descargar el archivo desde el backend');
    //   }
    // } catch (error) {
    //   console.error('Error en la solicitud:', error);
    // } finally {
    //   setIsDownloading(false)
    // }
    setIsDownloading(true);
    try {
      const href = `${BASE_CONSTROAD_PORTAL_API}/telegram/download?fileId=${encodeURIComponent(fileId)}&fileName=${encodeURIComponent(file_name)}`;
      const a = document.createElement('a');
      a.href = href;
      a.download = file_name;
      a.click();
      // toast?.success?.('Archivo descargado');
    } catch (e) {
      console.error('download error:', e);
    } finally {
      setIsDownloading(false);
    }
  };

  const deleteFile = async (messageId: number, params: DeleteParams) => {
    // const localChatId = params.chat_id ?? props.chat_id
    // const deleteMessageUrl = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/deleteMessage?chat_id=${localChatId}&message_id=${messageId}`;

    // try {
    //   setIsDeleting(true)
    //   const response = await fetch(deleteMessageUrl, { method: 'GET' });
    //   const data = await response.json();
    //   if (data.ok) {
    //     console.log('Mensaje eliminado exitosamente');
    //   } else {
    //     console.error('Error al eliminar el mensaje:', data.description);
    //   }
    // } catch (error) {
    //   console.error('Error en la solicitud:', error);
    // } finally {
    //   setIsDeleting(false)
    // }
    setIsDeleting(true);
    try {
      await telegramApi.deleteMessage(params.chat_id ?? props.chat_id, messageId);
      params?.onSuccess?.();
    } catch (e) {
      console.error('delete error:', e);
      params?.onError?.(e);
    } finally {
      setIsDeleting(false);
    }
  };

  const sendTextMessage = async (message: string, chatId?: string) => {
    // return sendTelegramTextMessage(message, chatId ?? props.chat_id);
    return telegramApi.send({
      chatId: chatId ?? props.chat_id,
      text: message,
      parseMode: 'MarkdownV2',
    });
  };

  const sendImageTextMessage = async (base64Image: string, message: string, chatId?: string) => {
    // return sendTelegramImageText(base64Image, message, chatId ?? props.chat_id);
    const cid = chatId || props.chat_id;
    const toData = (b64: string) => base64ToDataUrl(b64, 'image/jpeg');
    const images = Array.isArray(base64Image) ? base64Image : [base64Image];

    // igual que antes: caption sólo en la última
    for (let i = 0; i < images.length; i++) {
      await telegramApi.send({
        chatId: cid,
        base64Image: toData(images[i]),
        caption: i === images.length - 1 ? message : undefined,
        parseMode: 'MarkdownV2',
      });
    }
  };


  return {
    isLoading,
    uploadFile,
    downloadFile,
    isDownloading,
    deleteFile,
    isDeleting,
    sendTextMessage,
    sendImageTextMessage,
    getFileUrl: getTelegramFileUrl,
  };
}
