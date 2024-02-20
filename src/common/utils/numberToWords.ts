export const NumberToWords = (number: number): string => {
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
