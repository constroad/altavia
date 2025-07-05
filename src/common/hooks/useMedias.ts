import { IMediaValidationSchema, MediaType } from "src/models/media";
import { API_ROUTES, TELEGRAM_GROUP_ID_ERRORS, TELEGRAM_GROUP_ID_ALTAVIA_MEDIA } from "../consts";
import { useFetch } from "./useFetch";
import { useMutate } from "./useMutate";
import { useTelegram, TelegramMedia } from "./useTelegram";
import { toast } from "src/components";
import { onPageError } from "../utils";

interface UseMediasProps {
  chat_id?: string
  enabled?: boolean;
  type?: MediaType
  id?: string
  resourceId?: string
  onPasteMetadata?: {
    fileName: string
    type?: MediaType
    metadata?: any
    onSuccess?: (fileTelegram: TelegramMedia) => void;
  }
}

interface UploadParams {
  resourceId?: string
  fileName?: string;
  type?: MediaType
  metadata?: any;
  onSuccess?: (file: TelegramMedia, media: IMediaValidationSchema) => void;
}

interface DeleteParams {
  onSuccess?: () => void;
}
const maxSize = 18 * 1024 * 1024; // 18 MB en bytes
export const useMedias = (props: UseMediasProps) => {
  const { id, resourceId, type, enabled } = props

  const isDev = process.env.NODE_ENV === 'development'
  const TELEGRAM_CHAT_MEDIAS = (chatParam?: string) => {
    if (isDev) return TELEGRAM_GROUP_ID_ERRORS
    
    return chatParam ?? TELEGRAM_GROUP_ID_ALTAVIA_MEDIA
  }
  // API
  const { uploadFile: uploadTelegram, isLoading: isUploading, isDeleting } = useTelegram({
    chat_id: TELEGRAM_CHAT_MEDIAS(props.chat_id),
  });

  const { data: mediasResponse, isLoading, refetch } = useFetch<IMediaValidationSchema[]>(API_ROUTES.media, {
    queryParams: {
      resourceId,
      type
    },
    raceCondition: false,
    enabled
  })

  const { mutate, isMutating } = useMutate(`${API_ROUTES.media}/:id`, {
    urlParams: {
      id
    }
  })
  const { mutate: handleDelete, isMutating: deletingMedia } = useMutate(`${API_ROUTES.media}/:id`, {
    urlParams: {
      id
    }
  })

  const onPasteImages = (event: ClipboardEvent) => {
    if (isUploading || isMutating) {
      return
    }
    const params = {
      fileName: props.onPasteMetadata?.fileName,
      type: props.onPasteMetadata?.type,
      metadata: props.onPasteMetadata?.metadata,
      onSuccess: props.onPasteMetadata?.onSuccess,
    }
    const clipboardItems = event.clipboardData?.items ?? [];    
    for (const element of clipboardItems) {
      if (element.type.startsWith('image')) {
        const blob = element.getAsFile();
        if (!blob) continue;
        onUpload(blob, params);
      }
    }
  };

  const onUpload = (file: string | File, params: UploadParams) => {
    let fileToResponse: File | undefined = undefined;
    if (isUploading || isMutating) {
      return
    }
    if (typeof file !== "string" && file.size > maxSize) {
      toast.error('El archivo es demasiado grande. Por favor, selecciona un archivo de menos de 18 MB.')
      return
    } 
    if (typeof file !== "string" && file?.size) {      
      fileToResponse = file
    }
    
    

    const { fileName = 'upload', type, metadata } = params
    uploadTelegram(file, {
      fileName,
      onSuccess: (fileUploaded) => {
        const {
          messageId,
          fileId,
          file_name,
          fileUrl,
          thumbnailUrl,
          thumbnailFileId,
          mime_type,
        } = fileUploaded;

        mutate(
          'POST',
          {
            resourceId: params.resourceId ?? resourceId,
            type,
            name: fileName,
            mimeTye: mime_type,
            url: fileUrl,
            thumbnailUrl: thumbnailUrl ?? fileUrl,
            date: new Date(),
            metadata: {
              ...(metadata ?? {}),
              thumbnailUrl,
              fileUrl,
              thumbnailFileId,
              messageId,
              fileId,
              file_name
            },
          },
          {
            onSuccess: (mediaCreated) => {
              params.onSuccess?.({...fileUploaded, file: fileToResponse}, mediaCreated)
            },
          }
        );
      },
      onError: (err) => {
        toast.error('error subiendo el archivo');
        onPageError('useMedia - uploadTelegram')(err)
      },
    })
  }

  const onDelete = (id: string, params: DeleteParams) => {
    handleDelete('DELETE', {}, {
      requestUrl: `${API_ROUTES.media}/${id}`,
      onSuccess: () => {
        params.onSuccess?.()
      }
    })
  }

  return {
    onPasteImages,
    onUpload,
    isUploading: isUploading || isMutating,
    onDelete,
    isDeleting: isDeleting || deletingMedia,
    medias: mediasResponse ?? [],
    isLoading,
    refetch,
    mutate,
    isMutating
  };
}
