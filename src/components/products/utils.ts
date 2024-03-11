export type ProductType = {
  _id?: string;
	name: string,
  description?: string,
  alias?: string,
  price: number,
  quantity: number,
  unit: string,
}

export const initialProducStore: ProductType = {
	name: '',
	description: '',
	alias: '',
  price: 0,
  quantity: 0,
  unit: ''
}
