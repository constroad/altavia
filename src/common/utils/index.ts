export const onApiNoMatch = (req: any, res: any) => {
  res.status(405).end(`Method ${req.method} Not Allowed`);
}

export const getDate = () => {
  const date = new Date()
  const dayIndex = date.getDay();
  const weekDays = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const currentDayName = weekDays[dayIndex];
  const currentDayMonth = date.toLocaleDateString('es-ES', {day: '2-digit', month: 'long'})
  const currentYear = date.toLocaleDateString('es-ES', {year: 'numeric'})

  return {
    currentDayName,
    currentDayMonth,
    currentYear
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
