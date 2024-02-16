import { Product, PurchaseOrder, Quotation } from "src/common/types";

// COTIZACION
export const initialClient: Quotation = {
  email: '',
  name: '',
  razonSocial: '',
  ruc: '',
  message: '',
  phone: '',
  nroCubos: '1',
  precioUnitario: '480',
  nroCotizacion: '',
}


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


