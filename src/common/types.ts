export type Product = {
  description: string,
  unit: string,
  quantity: string,
  unitPrice: string,
  subtotal: string
}

export type PurchaseOrder = {
  nroOrder: string,
  ruc: string,
  companyName: string,
  address: string,
  paymentMethod: string,
  currency: string,
  proyect: string,
  products: Product[]
  total: string,
  observations: string,
  attachSignature: boolean,
}

export type Dispatch = {
  date: string;
  material: string;
  plate: string;
  invoice: string;
  guide: string;
  m3: string;
  client: string;
  project: string;
  carrier: string;
  price: string;
  igv: string;
  total: string;
  paymentDone: string;
}
