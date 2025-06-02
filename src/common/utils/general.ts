import { TELEGRAM_GROUP_ID_ERRORS, TELEGRAM_TOKEN } from "../consts";

function escapeMarkdown(message: string) {
  const escapeMessage = message.replace(/([_\[\]()~`>#+\-=|{}.!])/g, '\\$1');
  return escapeMessage
}

export function escapeMarkdownV2(text: string) {
  return text.replace(/([_*[\]()~`>#+\-=|{}.!\\])/g, '\\$1');
}

export const sendTelegramTextMessage = async (message: string, chaiId?: string) => {
  let url
  if (process.env.NODE_ENV === 'development') {
    url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage?chat_id=${TELEGRAM_GROUP_ID_ERRORS}`;
  } else {
    url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage?chat_id=${chaiId}`;
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: escapeMarkdown(message),
        parse_mode: 'MarkdownV2',
      }),
    });

    const data = await response.json();
    if (data.ok) {
      console.log('Message sent successfully');
    } else {
      console.error('Error sending message:', data.description);
    }
  } catch (err) {
    console.log('error', err);
  }
  return;
};