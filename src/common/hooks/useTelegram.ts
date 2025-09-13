import { useState } from "react";
import { TELEGRAM_TOKEN } from "../consts";
import { sendTelegramImageText, sendTelegramTextMessage } from "src/utils/general";

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

  const getTelegramFileUrl = async (fileId: string) => {
    setIsLoading(true)
    const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/getFile?file_id=${fileId}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.ok) {
        const filePath = data.result.file_path;
        const fileUrl = `https://api.telegram.org/file/bot${TELEGRAM_TOKEN}/${filePath}`;
        return fileUrl;
      } else {
        console.error('Error al obtener la URL del archivo:', data.description);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    } finally {
      setIsLoading(false)
    }
  };

  const uploadFile = async (file: File | string, params?: UpLoadParams) => {

    setIsLoading(true)
    const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendDocument`;
    const localChatId = params?.chat_id ?? props.chat_id
    const form = new FormData();
    form.append('chat_id', localChatId);
    if (typeof file === 'string') {
      const blob = base64ToBlob(file, 'application/pdf');
      form.append('document', blob, params?.fileName ?? 'upload.pdf');
    } 
    else {
      const fileConverted = file
      const fileName = fileConverted.name ?? `file_${new Date().getTime()}`
      form.append('document', file, params?.fileName ?? fileName);
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: form,
      });
      const data = await response.json();
      if (data.ok) {

        console.log('Archivo subido exitosamente', data);
        const fileTelegram = data.result.document ?? data.result.video
        const fileId = fileTelegram.file_id;
        const file_name = fileTelegram.file_name;
        const mime_type = fileTelegram.mime_type;
        const getFileUrl = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/getFile?file_id=${fileId}`;

        const messageId = data.result.message_id; // Obtén el message_id
        const fileResponse = await fetch(getFileUrl);
        const fileData = await fileResponse.json();

        const thumbnailUrl = fileTelegram.thumb ? await getTelegramFileUrl(fileTelegram.thumb.file_id) : undefined
        if (fileData.ok) {
          const filePath = fileData.result.file_path;
          const fileUrl = `https://api.telegram.org/file/bot${TELEGRAM_TOKEN}/${filePath}`;
          const result: TelegramMedia = {
            file_name,
            mime_type,
            messageId,
            fileId,
            fileUrl,
            thumbnailFileId: fileTelegram?.thumb?.file_id ?? '',
            thumbnailUrl,
          }
          params?.onSuccess?.(result)
          return result;
        }

      } else {
        params?.onError?.(data)
        console.error('Error al subir el archivo:', data.description);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      params?.onError?.(error)
    } finally {
      setIsLoading(false)
    }
  };

  const downloadFile = async (fileId: string, file_name: string) => {
    setIsDownloading(true)
    const backendUrl = `/api/telegram/download?fileId=${fileId}&fileName=${file_name}`;

    try {
      const response = await fetch(backendUrl);
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = file_name; // Puedes definir un nombre de archivo más específico aquí
        link.click();
        URL.revokeObjectURL(url);
      } else {
        console.error('Error al descargar el archivo desde el backend');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    } finally {
      setIsDownloading(false)
    }
  };

  const deleteFile = async (messageId: number, params: DeleteParams) => {
    const localChatId = params.chat_id ?? props.chat_id
    const deleteMessageUrl = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/deleteMessage?chat_id=${localChatId}&message_id=${messageId}`;

    try {
      setIsDeleting(true)
      const response = await fetch(deleteMessageUrl, { method: 'GET' });
      const data = await response.json();
      if (data.ok) {
        console.log('Mensaje eliminado exitosamente');
      } else {
        console.error('Error al eliminar el mensaje:', data.description);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    } finally {
      setIsDeleting(false)
    }
  };

  const sendTextMessage = async (message: string, chaiId?: string) => {
    return sendTelegramTextMessage(message, chaiId ?? props.chat_id);
  };

  const sendImageTextMessage = async (base64Image: string, message: string, chatId?: string) => {
    return sendTelegramImageText(base64Image, message, chatId ?? props.chat_id);
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
