export function formatISODate(isoString: string | Date) {
  let date: Date;
  if (typeof isoString === "string") {
    date = new Date(isoString);    
  } else {
    date = isoString
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDateStringRange(): { dateTo: string, dateFrom: string } {
  const dateTo = new Date();

  const dateFrom = new Date();
  dateFrom.setDate(dateTo.getDate() - 14);

  return {
    dateTo: formatISODate(dateTo.toDateString()),
    dateFrom: formatISODate(dateFrom.toDateString())
  };
}

export function formatMoney(amount: number) {
  return (amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
};

export const parseStringDateWithTime = (dateString: string | Date) => {
  const now = new Date();
  const date = new Date(`${dateString}T${now.getHours()}:${now.getMinutes()}`);
  return date
}