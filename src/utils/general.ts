import { TELEGRAM_GROUP_ID_ERRORS, TELEGRAM_TOKEN } from "src/common/consts";

export function formatUtcDateTime(
  isoString: string,
  options: { showDate?: boolean; showTime?: boolean } = { showDate: true }
): string {
  const date = new Date(isoString);

  if (isNaN(date.getTime())) {
    throw new Error("Invalid ISO date string");
  }

  const { showDate = true, showTime = false } = options;
  const parts: string[] = [];

  if (showDate) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 0-indexed
    const year = date.getFullYear();
    parts.push(`${day}/${month}/${year}`);
  }

  if (showTime) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    parts.push(`${hours}:${minutes}:${seconds}`);
  }

  return parts.join(' ');
}


export function formatISODate(isoString: string | Date) {
  let date: Date;
  if (typeof isoString === "string") {
    date = new Date(isoString);
  } else {
    date = isoString
  }
  const year = date?.getFullYear();
  const month = String(date?.getMonth() + 1).padStart(2, '0');
  const day = String(date?.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseLocalDate(dateString: string): Date {
  const now = new Date();
  const hour = now.getHours();
  const min = now.getMinutes();
  const [ year, month, day ] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day, hour, min);
}

export function getDateStringRange(differenceInDays: number = 14): { dateTo: string, dateFrom: string } {
  const dateTo = new Date();

  const dateFrom = new Date();
  dateFrom.setDate(dateTo.getDate() - differenceInDays);

  return {
    dateTo: formatISODate(dateTo.toDateString()),
    dateFrom: formatISODate(dateFrom.toDateString())
  };
}

export function formatMoney(amount: number, decimals?: number) {
  return (amount ?? 0).toFixed(decimals ?? 2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
};

export const parseStringDateWithTime = (dateString: string | Date) => {
  const now = new Date();

  let minutes = String(now.getMinutes())
  if (Number(minutes) < 10) {
    minutes = `0${now.getMinutes()}`
  }

  let hours = String(now.getHours())
  if (Number(hours) < 10) {
    hours = `0${now.getHours()}`
  }

  const date = new Date(`${dateString}T${hours}:${minutes}`);

  return date
}


// Util function to format date
export function formatDate(date?: Date): string {
  // If no date is provided, use the current date
  const currentDate = date ? new Date(date) : new Date();

  // Arrays for day and month names
  const daysOfWeek = [
    'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
  ];
  const months = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto',
    'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];

  // Get day, month, and year
  const dayOfWeek = daysOfWeek[currentDate.getDay()];
  const dayOfMonth = currentDate.getDate();
  const month = months[currentDate.getMonth()];
  const year = currentDate.getFullYear();

  // Format the date string
  return `Hoy es ${dayOfWeek} ${dayOfMonth} de ${month} del ${year}`;
}

export function addHoursAndFormat(dateString: string, hoursToAdd: number): string {
  const date = new Date(dateString);
  date.setHours(date.getHours() + hoursToAdd);

  const options: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  };

  return date.toLocaleTimeString('en-US', options);
}

function escapeMarkdown(message: string) {  
  const escapeMessage = message.replace(/([_\[\]()~`>#+\-=|{}.!])/g, '\\$1');
  return escapeMessage
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

export const sendTelegramImageText = async (imagesBase64: string | string[], text: string, chatId?: string) => {
  const url =
    process.env.NODE_ENV === 'development'
      ? `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendPhoto?chat_id=${TELEGRAM_GROUP_ID_ERRORS}`
      : `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendPhoto?chat_id=${chatId}`;

  const message = escapeMarkdown(text);

  const images = Array.isArray(imagesBase64) ? imagesBase64 : [ imagesBase64 ];

  // Itera sobre las imágenes y envía cada una con sendPhoto
  for (let i = 0; i < images.length; i++) {
    try {
      const formData = new FormData();
      const response = await fetch(images[ i ]);
      const blob = await response.blob();
      formData.append('photo', blob, 'photo.png');

      // Si es la última imagen, agrega el mensaje al caption
      if (i === images.length - 1) {
        formData.append('caption', message);
        formData.append('parse_mode', 'MarkdownV2');
      }

      await fetch(url, {
        method: 'POST',
        body: formData,
      });
    } catch (err) {
      console.error('Error al enviar la imagen a Telegram:', err);
    }
  }
};
