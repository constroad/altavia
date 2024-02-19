import { ADMIN_ROUTES } from "src/common/consts";
import { CONSTROAD_COLORS } from "src/styles/shared";

export const adminTabs = [
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
    name: 'Despacho',
    path: ADMIN_ROUTES.dispatch,
    bgColor: CONSTROAD_COLORS.darkGray,
    textColor: 'white'
  },
  // {
  //   name: 'Control Highway',
  //   path: ADMIN_ROUTES.controlHighway,
  //   bgColor: CONSTROAD_COLORS.lightGray,
  //   textColor: 'black'
  // },
]
