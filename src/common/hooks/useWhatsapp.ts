
import { API_ROUTES, CONSTROAD_SERVER_URL, GROUP_ERRORS_TRACKING, WHATSAPP_SENDER, WtspMessageType } from "../consts";
import { useMutate } from "./useMutate";
import { useFetch } from "./useFetch";
import { toast } from "src/components";
import { onPageError } from "../utils";
import { useMutateFormData } from "./useMutateFormData";

type SendingParams = {
  subTask?: string
  delayMs?: number
  onSuccess?: (response: any) => void
  onError?: (error: any) => void
}

type WhatsAppPayload = {
  to: string | string[],
  message: string
}
type WhatsAppFilePayload = WhatsAppPayload & {
  file?: File,
  fileUrl?: string,
  type: 'file' | 'image'
}

type UseWhatsappProps = {
  page: string
}
export const useWhatsapp = (props: UseWhatsappProps) => {
  const { page } = props

  const URL = `${CONSTROAD_SERVER_URL}/message/${WHATSAPP_SENDER}`
  const URL_GROUPS = `${CONSTROAD_SERVER_URL}/session/${WHATSAPP_SENDER}/groups`
  const URL_CONTACTS = `${CONSTROAD_SERVER_URL}/session/${WHATSAPP_SENDER}/contacts`

  //API
  const { data: contacts, isLoading: isLoadingContacts, refetch: refetchContacts } = useFetch(URL_CONTACTS)
  const { data: groups, isLoading: isLoadingGroups, refetch: refetchGroups } = useFetch(URL_GROUPS)
  const { mutate: onSendTextMessage } = useMutate(API_ROUTES.notificationWhatsApp);
  const { mutate: onSendFileMessage, isMutating, mutateData, mutateError } = useMutateFormData(URL);

  // handlers
  const getValidPhoneNumber = (phone: string) => {
    let validPhoneNumber = phone
    if (!phone.includes('+51') && !phone.includes('@g.us')) {
      validPhoneNumber = `+51${phone}`
    }
    return validPhoneNumber
  }

  const onSendWhatsAppFile = async (payload: WhatsAppFilePayload, params?: SendingParams) => {

    try {
      const { file, fileUrl, to, message } = payload
      const phonesToSend = typeof to === 'string' ? [ to ] : to
      for (const whatsAppNro of phonesToSend) {

        const GROUP_ID =
          process.env.NODE_ENV === 'development'
            ? GROUP_ERRORS_TRACKING
            : whatsAppNro;

        const formData = new FormData();
        if (file) {
          formData.append('file', file);
        }
        if (fileUrl) {
          formData.append('fileUrl', fileUrl);
        }

        formData.append('to', getValidPhoneNumber(GROUP_ID));
        formData.append('caption', message);

        const response = await onSendFileMessage(formData, `${URL}/${payload.type}`)
        params?.onSuccess?.(response)
      }

    } catch (error) {
      console.log(error)
      onPageError(`${page}-${params?.subTask}`)(error);
      params?.onError?.(error)
    }

  }

  const onSendWhatsAppText = async (payload: WhatsAppPayload, params?: SendingParams) => {
    const { to, message } = payload
    const phonesToSend = typeof to === 'string' ? [ to ] : to


    phonesToSend.forEach(whatsAppNro => {
      const GROUP_ID =
        process.env.NODE_ENV === 'development'
          ? GROUP_ERRORS_TRACKING
          : whatsAppNro;

      const data = {
        type: WtspMessageType.SendText,
        phone: getValidPhoneNumber(GROUP_ID),
        message,
      };

      if (params?.delayMs) {
        const timerID = setTimeout(() => {

          onSendTextMessage('POST', data, {
            onSuccess: (response) => {
              clearTimeout(timerID)
              params?.onSuccess?.(response)
            },
            onError: (err) => {
              clearTimeout(timerID)
              toast.error('Error al enviar mensaje');
              params?.onError?.(err)
              onPageError(`${page}-${params?.subTask}`)(err);
            },
          });

        }, params?.delayMs);
        return
      }

      onSendTextMessage('POST', data, {
        onSuccess: (response) => params?.onSuccess?.(response),
        onError: (err) => {
          toast.error('Error al enviar mensaje');
          params?.onError?.(err)
          onPageError(`${page}-${params?.subTask}`)(err);
        },
      });
    });

  }

  return {
    onSendWhatsAppFile,
    onSendWhatsAppText,
    isSending: isMutating,
    groups,
    refetchGroups,
    isLoadingGroups,
    mutateData,
    mutateError,
    contacts: contacts?.contacts?.filter?.((x: any) => x.id.includes('@c.us')) ?? [],
    isLoadingContacts,
    refetchContacts
  };
}
