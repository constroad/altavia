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
  quote: '/quote',
  quoteNew: '/quote/new',
  admin: '/admin',
}

export const ADMIN_ROUTES = {
  generateQuotation: '/admin/cotizar',
  purchaseOrder: '/admin/orden-de-compra',
  dispatch: '/admin/despacho',
  controlHighway: '/admin/control-highway',
  clients: '/admin/clientes',
  providers: '/admin/proveedores',
  products: '/admin/products',
  production: '/admin/produccion',
  employees: '/admin/empleados',
}

export const API_ROUTES = {
  sendEmail: '/api/sendEmail',
  generatePDF: '/api/generate-pdf',
  client: '/api/client',
  quote: '/api/quotes',
  provider: '/api/provider',
  generateQuotationPDF: '/api/generate-quotation-pdf',
  generateOrderPDF: '/api/generate-purchase-order-pdf'
}

export const CONSTROAD = {
  companyName: 'RJZ CONSTRUCTORES S.A.C',
  ruc: '20612003905',
  email: process.env.EMAIL,
  web: 'constroad.com',
  phoneCarin: '907 579 704',
  phoneJose: '949 376 824',
  address: 'AV. MARIANO MELGAR LOTE. 9E DPTO. 301 URB. MARIANO MELGAR - LIMA - LIMA - ATE',
}

export const PDF_TEMPLATE = {
  cotizacion: {
    path: 'public/templates/cotizacion',
    filename : 'plantilla_cotizacion.pdf',
  },
  ordenCompra: {
    path: 'public/templates/orden-de-compra',
    filename: 'plantilla_orden_de_compra.pdf'
  },
}
