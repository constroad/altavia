import { formatPriceNumber } from "src/common/utils";
import { ProductType } from "../products";

export type QuoteType = {
  _id?: string;
  clientId: string;
  nro: number;
  date: string;
  items: ProductType[];
  subTotal: number;
  igv: number;
  total: number;
}

export type QuotePDFType = {
  companyName: string;
  nroQuote: string;
  ruc: string;
  date: string;
  notes: string;
  products: ProductType[];
  addIGV: boolean;
}

export const initialQuoteProduct: ProductType = {
  description: 'MEZCLA ASFÁLTICA EN CALIENTE',
  alias: 'ASFALTO',
  unit: 'M3',
  quantity: 1,
  unitPrice: 480,
  total: 480
}

export const newQuoteProduct: ProductType = {
  description: '',
  alias: '',
  unit: '',
  quantity: 1,
  unitPrice: 1,
  total: 1
}

export const initialQuote: QuoteType = {
  clientId: '',
  nro: 0,
  date: '',
  items: [],
  subTotal: 480,
  igv: 86.4,
  total: 566.4,
}

export const getQuotePrices = (
  items: ProductType[],
  applyIGV: boolean,
  formatted?: boolean
) => {

  console.log('applyIGV:', applyIGV)

  const subtotal = items.reduce((accumulator, currentItem) => {
    return accumulator + currentItem?.total;
  }, 0);

  const igv = applyIGV === true ? subtotal * 0.18 : 0

  const total = applyIGV === true ? subtotal + igv : subtotal

  let formattedSubtotal
  let formattedIGV
  let formattedTotal

  if (!formatted) {
    formattedSubtotal = formatPriceNumber(subtotal).replaceAll(',', '')
    formattedIGV = formatPriceNumber(igv).replaceAll(',', '')
    formattedTotal = formatPriceNumber(total).replaceAll(',', '')
  } else {
    formattedSubtotal = formatPriceNumber(subtotal)
    formattedIGV = formatPriceNumber(igv)
    formattedTotal = formatPriceNumber(total)
  }

  return {
    formattedSubtotal,
    formattedIGV,
    formattedTotal
  }
}
