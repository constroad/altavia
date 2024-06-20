import { getDate } from "src/common/utils";
import { IDispatchList } from "src/models/dispatch";

export type DispatchNotePDFType = {
  nro: string;
  date: string;
  clientName: string;
  proyect: string;
  material: string;
  amount: number;
  plate: string;
  transportist: string;
  hour: string;
  note: string;
}

export const getDispatchesPerMonth = (date: Date, listDispatch: IDispatchList[]) => {
  const { currentYear } = getDate()

  const month = date.toISOString().substring(5,7)
  const day = date.toISOString().substring(8,10)
  const monthDispatches = listDispatch.filter(disp => {
    const date = new Date(disp.date)
    return date.toISOString().includes(`${currentYear}-${month}`)
  })

  const sortedMonthDispatches = monthDispatches.sort((a,b) => {
    const dateA = a.date instanceof Date ? a.date : new Date(a.date);
    const dateB = b.date instanceof Date ? b.date : new Date(b.date);
    return (dateA as Date).getTime() - (dateB as Date).getTime();
  })

  return {
    month,
    monthDispatches: sortedMonthDispatches,
    day: day
  }
}

export const get12HoursFormat = (hour: string) => {
  const numberHour = +hour.substring(0,2)
  const minuts = hour.substring(3,5)
  let hourToSave
  if (numberHour < 12) {
    hourToSave = `${hour} AM`
  } else if (numberHour === 12) {
    hourToSave = `${12}:${minuts} PM`
  } else {
    hourToSave = `${numberHour - 12}:${minuts} PM`
  }

  return hourToSave
}
