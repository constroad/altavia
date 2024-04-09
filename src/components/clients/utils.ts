export type BankAccountType = {
  type: string,
  name: string,
  accountNumber: string,
  cci: string
}

export type ClientType = {
  _id?: string;
  name: string;
  ruc?: string;
  alias: string;
  contactPerson?: string;
  address: string;
  phone: string;
  email: string;
  web: string;
  bankAccounts: BankAccountType[];
  createdAt?: any
}

export const initialBankAcc: BankAccountType = {name: '', type: '', accountNumber: '', cci: ''}

export const InitialClient: ClientType = {
  name: '',
  ruc: '',
  alias: '',
  contactPerson: '',
  address: '',
  phone: '',
  email: '',
  web: '',
  bankAccounts: []
}
