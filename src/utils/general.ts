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
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
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
  return (amount).toFixed(decimals ?? 2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
};

export const parseStringDateWithTime = (dateString: string | Date) => {
  const now = new Date();

  let minutes = String(now.getMinutes())
  if ( Number(minutes) < 10 ) {
    minutes = `0${now.getMinutes()}`
  }

  let hours = String(now.getHours())
  if (Number(hours) < 10) {
    hours = `0${now.getHours()}`
  }

  const date = new Date(`${dateString}T${hours}:${minutes}`);

  return date
}