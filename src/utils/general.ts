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