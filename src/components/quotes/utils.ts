import { formatPriceNumber } from "src/common/utils";

export type ItemType = {
  description: string;
  quantity: number;
  price: number;
  total: number;
}

export type QuoteType = {
  _id?: string;
  clientId: string;
  nro: number;
  date: string;
  items: ItemType[];
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
  nroCubos: string;
  unitPrice: string;
  addIGV: boolean;
}

export const initialQuote: QuoteType = {
  clientId: '',
  nro: 0,
  date: '',
  items: [{
    description: 'Mezcla asfáltica en caliente',
    quantity: 1,
    price: 480,
    total: 480
  }],
  subTotal: 480,
  igv: 86.4,
  total: 566.4,
}

export const getQuotePrices = (quantity: number, price: number, formatted?: boolean) => {
  const subtotal = quantity * price
  const igv = subtotal * 0.18
  const total = subtotal + igv

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
