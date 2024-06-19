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

export const getDispatchesPerMonth = (date: Date | string, listDispatch: IDispatchList[]) => {
  const { currentYear } = getDate()
  const newDate = new Date(date)

  const month = newDate.toISOString().substring(5,7)
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
  }
}
