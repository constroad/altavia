export type ContactFormType = {
  email: string,
  name: string,
  companyName?: string,
  ruc?: string,
  message?: string,
  phone?: string,
  // nroCubos?: string,
  startCity?: string,
  endCity?: string,
}

export const initialContactForm: ContactFormType = {
  email: '',
  name: '',
  companyName: '',
  ruc: '',
  message: '',
  phone: '',
  // nroCubos: '',
  startCity: '',
  endCity: '',
}