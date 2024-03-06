import { ADMIN_ROUTES } from "src/common/consts";
import { CONSTROAD_COLORS } from "src/styles/shared";

export const adminTabs = [
  {
    name: 'Clientes',
    path: ADMIN_ROUTES.clients,
    bgColor: CONSTROAD_COLORS.yellow,
    textColor: 'black'
  },
  {
    name: 'Proveedores',
    path: ADMIN_ROUTES.providers,
    bgColor: CONSTROAD_COLORS.black,
    textColor: 'white'
  },
  {
    name: 'Productos',
    path: ADMIN_ROUTES.products,
    bgColor: CONSTROAD_COLORS.darkGray,
    textColor: 'white'
  },
  {
    name: 'Empleados',
    // path: ADMIN_ROUTES.employees,
    path: null,
    bgColor: CONSTROAD_COLORS.lightGray,
    textColor: 'black'
  },
  {
    name: 'Generar cotización',
    path: ADMIN_ROUTES.generateQuotation,
    bgColor: CONSTROAD_COLORS.yellow,
    textColor: 'black'
  },
  {
    name: 'Generar orden de compra',
    path: ADMIN_ROUTES.purchaseOrder,
    bgColor: CONSTROAD_COLORS.black,
    textColor: 'white'
  },
  {
    name: 'Producción',
    // path: ADMIN_ROUTES.production,
    path: null,
    bgColor: CONSTROAD_COLORS.darkGray,
    textColor: 'white'
  },
  {
    name: 'Despacho',
    path: ADMIN_ROUTES.dispatch,
    bgColor: CONSTROAD_COLORS.lightGray,
    textColor: 'black'
  },
  {
    name: 'Control Highway',
    // path: ADMIN_ROUTES.controlHighway,
    path: null,
    bgColor: CONSTROAD_COLORS.yellow,
    textColor: 'black'
  },
]
