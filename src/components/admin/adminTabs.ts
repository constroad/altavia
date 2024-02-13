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
    name: 'Test 1',
    path: ADMIN_ROUTES.purchaseOrder,
    bgColor: CONSTROAD_COLORS.darkGray,
    textColor: 'white'
  },
  {
    name: 'Test 2',
    path: ADMIN_ROUTES.purchaseOrder,
    bgColor: CONSTROAD_COLORS.lightGray,
    textColor: 'black'
  },
]
