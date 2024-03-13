import { ADMIN_ROUTES } from "src/common/consts";
import {
  AdminIcon,
  ClientsIcon,
  DispatchIcon,
  EmployeesIcon,
  HighwayIcon,
  ProductionIcon,
  ProductsIcon,
  ProvidersIcon,
  PurchaseIcon,
  QuoteIcon
} from "src/common/icons";
import { CONSTROAD_COLORS } from "src/styles/shared";

export const adminTabs = [
  {
    name: 'Administración',
    path: ADMIN_ROUTES.clients,
    bgColor: CONSTROAD_COLORS.yellow,
    textColor: 'black',
    icon: AdminIcon
  },
  {
    name: 'Generar cotización',
    path: ADMIN_ROUTES.generateQuotation,
    bgColor: CONSTROAD_COLORS.black,
    textColor: 'white',
    icon: QuoteIcon
  },
  {
    name: 'Generar orden de compra',
    path: ADMIN_ROUTES.purchaseOrder,
    bgColor: CONSTROAD_COLORS.lightGray,
    textColor: 'black',
    icon: PurchaseIcon
  },
  {
    name: 'Producción',
    // path: ADMIN_ROUTES.production,
    path: null,
    bgColor: CONSTROAD_COLORS.darkGray,
    textColor: 'white',
    icon: ProductionIcon
  },
  {
    name: 'Despacho',
    path: ADMIN_ROUTES.dispatch,
    bgColor: CONSTROAD_COLORS.yellow,
    textColor: 'black',
    icon: DispatchIcon
  },
  {
    name: 'Control Highway',
    path: ADMIN_ROUTES.controlHighway,
    bgColor: CONSTROAD_COLORS.black,
    textColor: 'white',
    icon: HighwayIcon
  },
]

export const administrationTabs = [
   {
    name: 'Clientes',
    path: ADMIN_ROUTES.clients,
    bgColor: CONSTROAD_COLORS.yellow,
    textColor: 'black',
    icon: ClientsIcon
  },
  {
    name: 'Proveedores',
    path: ADMIN_ROUTES.providers,
    bgColor: CONSTROAD_COLORS.black,
    textColor: 'white',
    icon: ProvidersIcon
  },
  {
    name: 'Productos',
    path: ADMIN_ROUTES.products,
    bgColor: CONSTROAD_COLORS.darkGray,
    textColor: 'white',
    icon: ProductsIcon
  },
  // {
  //   name: 'Empleados',
  //   // path: ADMIN_ROUTES.administration.employees,
  //   path: null,
  //   bgColor: CONSTROAD_COLORS.lightGray,
  //   textColor: 'black',
  //   icon: EmployeesIcon
  // },
]
