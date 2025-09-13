export const APP_ROUTES = {
  home: '/',
  nosotros: '/nosotros',
  expenses: '/expenses',
  mision: '/mision',
  vision: '/vision',
  valores: '/valores',
  servicios: '/servicios',
  proveedores: '/proveedores',
  contactanos: '/contactanos',
  transporteCargaGeneral: '/transporte-carga-general',
  transporteInterprovincial: '/transporte-interprovincial',
  transporteCargaCompleta: '/transporte-carga-completa',
  transporteCargaSobredimensionada: '/transporte-carga-sobredimensionada',
  login: '/login',
  // cotizar: '/cotizar',
  // quote: '/quote',
  // quoteNew: '/quote/new',
  // clientReport: '/public/client-report',
  dashboard: '/dashboard',
  vehicles: '/vehicles',
  routeCost: '/routeCost',
  trips: '/trips',
  alerts: '/alerts',
  configuration: '/configuration',
  users: '/users',
  clients: '/clients',
  drivers: '/drivers',
  medias: '/medias',
}

export const API_ROUTES = {
  sendEmail: '/api/sendEmail',
  generatePDF: '/api/generate-pdf',
  clients: '/api/clients',    
  trips: '/api/trips',    
  media: '/api/medias',    
  vehicles: '/api/vehicles',    
  drivers: '/api/drivers',    
  expenses: '/api/expenses',    
  routeCost: '/api/routeCost',    
  notificationWhatsApp: '/api/notifications/whatsapp',
  user: '/api/user',
  alerts: '/api/alerts',
}

export const ALTAVIA = {
  companyName: 'RJZ CONSTRUCTORES S.A.C',
  ruc: '20612003905',
  // email: process.env.EMAIL,
  web: 'altaviaperu.com',
  phone: '949 376 824',
  address: 'AV. MARIANO MELGAR LOTE. 9E DPTO. 301 URB. MARIANO MELGAR - LIMA - LIMA - ATE',
}
export const CONSTROAD = {
  companyName: 'RJZ CONSTRUCTORES S.A.C',
  ruc: '20612003905',
  email: process.env.EMAIL,
  web: 'altaviaperu.com',
  phoneJose: '949 376 824',
  phoneCarin: '949 376 824',
  address: 'AV. MARIANO MELGAR LOTE. 9E DPTO. 301 URB. MARIANO MELGAR - LIMA - LIMA - ATE',
}

export const PDF_TEMPLATE = {
  cotizacion: {
    path: 'public/templates/cotizacion',
    filename: 'plantilla_cotizacion.pdf',
  },
  cotizacion_no_igv: {
    path: 'public/templates/cotizacion',
    filename: 'plantilla_cotizacion_no_igv.pdf',
  },
  cotizacion_servicio: {
    page1: {
      path: 'public/templates/cotizacion-servicio',
      filename: 'plantilla_pagina_1.pdf',
    },
    page2: {
      path: 'public/templates/cotizacion-servicio',
      filename: 'plantilla_pagina_2.pdf',
    },
    page2NoIGV: {
      path: 'public/templates/cotizacion-servicio',
      filename: 'plantilla_pagina_2_no_igv.pdf',
    }
  },
  ordenCompra: {
    path: 'public/templates/orden-de-compra',
    filename: 'plantilla_orden_de_compra.pdf'
  },
  blankPage: {
    path: 'public/templates/cotizacion-servicio',
    filename: 'plantilla_blank_page.pdf'
  },
  dispatchNote: {
    path: 'public/templates/dispatch-note',
    filename: 'plantilla_dispatch_note.pdf'
  },
  dispatchReport: {
    path: 'public/templates/dispatch-note',
    filename: 'plantilla_dispatch_report.pdf'
  }
}

export enum WtspMessageType {
  'SendText' = 'SendText',
  'SendDocument' = 'SendDocument',
  'SendImage' = 'SendImage',
}
export const WHAPI_URL = 'https://gate.whapi.cloud/'
export const WHAPI_TOKEN = 't1mDU3U89NVuEZqQprhYsOSKgisZhm1O'
export const GROUP_SOCIOS_DE_LA_CONSTRUCCION = '120363043706150862@g.us'
export const GROUP_PLANTA_PRODUCCION = '120363229712975495@g.us'
export const GROUP_TRABAJADORES_CONSTROAD = '120363288945205546@g.us'
export const GROUP_ADMINISTRACION_ALTAVIA = '120363402687680206@g.us'
export const WhastAppGroups = [
  {
    id: '120363229712975495@g.us',
    name: 'Planta Produccion'
  },
  {
    "id": "120363043706150862@g.us",
    "name": "Socios de la construccion",
  },
  {
    "id": GROUP_TRABAJADORES_CONSTROAD,
    "name": "Trabajadores ConstRoad",
  },
  {
    "id": "120363279615230332@g.us",
    "name": "Proveedores",
  },
  {
    "id": "120363221222416292@g.us",
    "name": "Comprobantes de pago sac",
  },
  {
    "id": "120363284005976329@g.us",
    "name": "Cotizaciones",
  },
  {
    "id": "120363284827857219@g.us",
    "name": "Despachos de agregados Chalin",
  }
]

// --------------

const LOCAL_SERVER_WHATSAPP = 'http://localhost:3001/api';
export const ALTAVIA_BOT ='🤖 Altavia Informa:'
export const CONSTROAD_SERVER_URL = process.env.NEXT_PUBLIC_CONSTROAD_APIS ?? LOCAL_SERVER_WHATSAPP;
export const WHATSAPP_SENDER = '51949376824'
// export const WHATSAPP_SENDER = '51902049935'
export const WHATSAPP_SENDER_ALTAVIA = '51949376824'

export const TELEGRAM_GROUP_ID_ERRORS = '-1003063986345';
export const TELEGRAM_TOKEN = (process.env.NEXT_PUBLIC_TELEGRAM_TOKEN || '').trim();
export const TELEGRAM_GROUP_ID_ALTAVIA_MEDIA = '-1002667366211';
export const GROUP_ERRORS_TRACKING = '120363376500470254@g.us';
export const GROUP_COTIZACIONES = '120363284005976329@g.us'
