export type ServiceType = {
  _id?: string;
  description: string,
  alias?: string,
  phase?: string,
  inches?: number,
  flete: number,
  unit: string,
  unitPrice: number,
  quantity: number,
  total: number,
  createdAt?: string,
  updatedAt?: string,
}

export const initialService: ServiceType = {
	description: '',
	alias: '',
  phase: '',
  unit: '',
  inches: 0,
  flete: 0,
  unitPrice: 1,
  quantity: 1,
  total: 1
}
