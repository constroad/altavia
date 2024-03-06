
export const onApiNoMatch = (req: any, res: any) => {
  res.status(405).end(`Method ${req.method} Not Allowed`);
}

export const capitalizeText = (text: string) => {
  const capitalizedText = text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return capitalizedText
}

export const getDate = (dateIsoString?: string) => {
  let date = new Date()
  if (dateIsoString) { date = new Date(dateIsoString) }

  const dayIndex = date.getDay();
  const weekDays = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const currentDayName = weekDays[dayIndex];
  const currentDayMonth = date.toLocaleDateString('es-ES', {day: '2-digit', month: 'long'})
  const currentYear = date.toLocaleDateString('es-ES', {year: 'numeric'})

  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  const shortDate = `${day}-${month}-${year}`;
  const slashDate = `${day}/${month}/${year}`;

  return {
    currentDayName,
    currentDayMonth,
    currentYear,
    shortDate,
    slashDate
  }
}

export const formatPriceNumber = (number: number) => {
  const formattedNumber = number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return formattedNumber
}

export const addZerosAhead = (number: number) => {
  const numberWithZeros = number.toString().padStart(7, '0');
  return numberWithZeros;
}

export function b64toBlob(base64Data: any, contentType = '', sliceSize = 512) {
  const byteCharacters = atob(base64Data);
  const byteArrays = [];
  
  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  
  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
}

export * from './api'
export * from './numberToWords'
