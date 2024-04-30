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
  QuoteIcon,
  ServiceIcon
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
    name: 'Cotizaciones',
    path: ADMIN_ROUTES.quotes,
    bgColor: CONSTROAD_COLORS.black,
    textColor: 'white',
    icon: QuoteIcon
  },
  // {
  //   name: 'Cotizar asfalto',
  //   path: ADMIN_ROUTES.generateQuotation,
  //   bgColor: CONSTROAD_COLORS.black,
  //   textColor: 'white',
  //   icon: QuoteIcon
  // },
  // {
  //   name: 'Cotizar servicios',
  //   path: ADMIN_ROUTES.serviceQuote,
  //   bgColor: CONSTROAD_COLORS.lightGray,
  //   textColor: 'black',
  //   icon: QuoteIcon
  // },
  {
    name: 'Generar orden de compra',
    path: ADMIN_ROUTES.purchaseOrder,
    bgColor: CONSTROAD_COLORS.darkGray,
    textColor: 'white',
    icon: PurchaseIcon
  },
  {
    name: 'Producción',
    // path: ADMIN_ROUTES.production,
    path: null,
    bgColor: CONSTROAD_COLORS.black,
    textColor: 'white',
    icon: ProductionIcon
  },
  {
    name: 'Despacho',
    // path: ADMIN_ROUTES.dispatch,
    path: null,
    bgColor: CONSTROAD_COLORS.yellow,
    textColor: 'black',
    icon: DispatchIcon
  },
  {
    name: 'Control Liquidos',
    path: ADMIN_ROUTES.controlFluid,
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
  {
    name: 'Servicios',
    path: ADMIN_ROUTES.services,
    bgColor: CONSTROAD_COLORS.darkGray,
    textColor: 'white',
    icon: ServiceIcon
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
