import { BankAccountType } from "../clients"

export type ProviderType = {
  _id?: string;
	name: string,
	ruc: string,
	alias?: string,
	contactPerson?: string;
	address?: string,
	phone?: string,
	email?: string,
	web?: string,
	bankAccounts: BankAccountType[],
	tags: string[],
	description?: string,
	notes?: string
}

export const initialProvider: ProviderType = {
	name: '',
	ruc: '',
	alias: '',
	contactPerson: '',
	address: '',
	phone: '',
	email: '',
	web: '',
	bankAccounts: [],
	tags: [],
	description: '',
	notes: ''
}
