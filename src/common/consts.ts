export const APP_ROUTES = {
  home: '/',
  nosotros: '/nosotros',
  mision: '/mision',
  vision: '/vision',
  valores: '/valores',
  servicios: '/servicios',
  proveedores: '/proveedores',
  contactanos: '/contactanos',
  mezclaAsfaltica: '/mezcla-asfaltica-en-caliente',
  colocacionAsfaltica: '/colocacion-de-mezcla-asfaltica',
  transporte: '/transporte-de-carga',
  login: '/login',
  cotizar: '/cotizar',
}

export const API_ROUTES = {
  sendEmail: '/api/sendEmail',
  generatePDF: '/api/generate-pdf',
}

export const CONSTROAD = {
  razonSocial: 'RJZ CONSTRUCTORES S.A.C',
  ruc: '20612003905',
  email: process.env.EMAIL,
  phone1: '907 579 704',
}

export const PDF_TEMPLATE = {
  cotizacion: {
    path: 'public/templates/cotizacion',
    filename : 'plantilla_cotizacion.pdf'
  },
  ordenCompra: {
    path: 'public/templates/orden-de-compra',
    filename: ''
  },
}
