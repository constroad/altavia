export type ProductType = {
  _id?: string;
  description: string,
  alias?: string,
  unit: string,
  unitPrice: number,
  quantity: number,
  total: number
  createdAt?: any
}

export const initialProducStore: ProductType = {
	description: '',
	alias: '',
  unit: '',
  unitPrice: 1,
  quantity: 1,
  total: 1
}
