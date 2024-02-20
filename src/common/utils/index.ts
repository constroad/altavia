
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

export const getDate = () => {
  const date = new Date()
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

// NUMBER TO LETTERS
export function NumberToWords(number: number): string {
  const units: string[] = ['', 'UNO', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE'];
  
  const teens: string[] = ['DIEZ', 'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE', 'DIECISEIS', 'DIECISIETE', 'DIECIOCHO', 'DIECINUEVE'];

  const tens: string[] = ['', 'DIEZ', 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA'];

  const hundreds: string[] = ['', 'CIENTO', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS', 'QUINIENTOS', 'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS'];

  if (number === 0) {
    return 'CERO';
  }

  const toWords = (num: number): string => {
    let words = '';

    if (num >= 1000000) {
      const millions = Math.floor(num / 1000000);
      if (millions === 1) {
        words += 'UN MILLÓN ';
      } else {
        words += toWords(millions) + ' MILLONES ';
      }
      num %= 1000000;
    }

    if (num >= 1000) {
      words += toWords(Math.floor(num / 1000)) + ' MIL ';
      num %= 1000;
    }

    if (num >= 100) {
      words += hundreds[Math.floor(num / 100)] + ' ';
      num %= 100;
    }

    if (num >= 30) {
      const tensPart = tens[Math.floor(num / 10)];
      const onesPart = num % 10 !== 0 ? ' Y ' : '';
      words += tensPart + onesPart;
      num %= 10;

    } else if (num >= 20) {
      words += 'VEINTI' + '';
      num %= 10;

    } else if (num >= 10) {
      words += teens[num - 10] + ' ';
      num = 0;
    }

    if (num > 0) {
      words += units[num] + ' ';
    }

    return words.trim();
  };

  const integerPart = Math.floor(number);
  const fractionalPart = Math.round((number - integerPart) * 100);

  let words = toWords(integerPart);

  if (fractionalPart > 0) {
      words += ` CON ${fractionalPart.toString().padStart(2, '0')}/100`;
  }

  return words.toUpperCase();
}
