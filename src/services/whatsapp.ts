import axios from 'axios';
import { CONSTROAD_SERVER_URL, GROUP_ERRORS_TRACKING } from '@/common/consts';

const API_TEXT_ME_BOT_URL = CONSTROAD_SERVER_URL;
const PHONE_SENDER = '51949376824';
const BASE_URL = `${API_TEXT_ME_BOT_URL}/message/${PHONE_SENDER}`;

export const sendWhatsAppTextMessage = async ({
  phone,
  message,
}: {
  phone: string;
  message: string;
}) => {
  const isDev = process.env.NODE_ENV === 'development';
  let validPhoneNumber = phone;

  if (!phone.includes('+51') && !phone.includes('@g.us')) {
    validPhoneNumber = `+51${phone}`;
  }

  const url = `${BASE_URL}/text`;
  console.log('Enviando mensaje a:', url);

  await axios.post(url, {
    to: isDev ? GROUP_ERRORS_TRACKING : validPhoneNumber,
    message,
  });
};
