import { IFluidValidationSchema } from "src/models/fluids";

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

export const getPenAvailable = (fluid: IFluidValidationSchema) => {
  const { name, volumeInStock: volumeInStockOriginal, levelCentimeter, bgColor } = fluid;


  const volumeInStock = () => {
    if (name === 'PEN #2' || name === 'PEN #3') {
      if (volumeInStockOriginal > 683) return volumeInStockOriginal
      else if (volumeInStockOriginal > 416) return volumeInStockOriginal - 106
      else if (volumeInStockOriginal > 192) return volumeInStockOriginal - 60
      else if (volumeInStockOriginal > 33) return volumeInStockOriginal - 20
      else  return volumeInStockOriginal

    } else return volumeInStockOriginal
  }

  const unusedGalons =
  name === 'PEN #1' ? (363 + 50) :
  name === 'PEN #2' ? 123 :
  name === 'PEN #3' ? 123 :
  name === 'GASOHOL' ? 825 :
  name === 'ACEITE TÉRMICO' ? 0 : 0

  const availableGalons = volumeInStock() - unusedGalons
  const cubes =
    name.includes('PEN') ? +(availableGalons/24).toFixed(2) :
    name === 'GASOHOL' ? +(availableGalons/2).toFixed(2) :
    +availableGalons.toFixed(2)

  return {
    volumeInStock,
    toProduce: cubes,
    cubes: availableGalons
  }
}