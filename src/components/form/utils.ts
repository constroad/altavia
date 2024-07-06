import { Dispatch, Product, PurchaseOrder } from "src/common/types";

// ORDEN DE COMPRA
export const initialProduct: Product = {
  description: '',
  unit: '',
  quantity: '1',
  unitPrice: '1',
  subtotal: '1'
}

export const initialOrder: PurchaseOrder = {
  nroOrder: '',
  ruc: '',
  companyName: '',
  address: '',
  paymentMethod: '',
  currency: 'PEN - SOLES',
  proyect: '',
  products: [initialProduct],
  total: '0',
  observations: '',
  attachSignature: false
}

// DESPACHO
export const initialDispatch: Dispatch = {
  date: '',
  material: 'MEZCLA ASFALTICA',
  plate: '',
  guide: '',
  m3: '1',
  client: '',
  project: '',
  carrier: '',
  price: '480',
  igv: '86.40',
  total: '566.40',
  paymentDone: ''
}
