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
  TaskIcon,
  ServiceIcon,
  MaterialIcon,
  WorkerIcon
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
  {
    name: 'Generar orden de compra',
    path: ADMIN_ROUTES.purchaseOrder,
    bgColor: CONSTROAD_COLORS.darkGray,
    textColor: 'white',
    icon: PurchaseIcon
  },
  {
    name: 'Pedidos',
    path: ADMIN_ROUTES.orders,
    bgColor: CONSTROAD_COLORS.black,
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
    name: 'Control Liquidos',
    path: ADMIN_ROUTES.controlFluid,
    bgColor: CONSTROAD_COLORS.black,
    textColor: 'white',
    icon: HighwayIcon
  },
  {
    name: 'Kardex',
    path: ADMIN_ROUTES.controlMaterial,
    bgColor: CONSTROAD_COLORS.yellow,
    textColor: 'black',
    icon: MaterialIcon
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
    name: 'Empleados',
    path: ADMIN_ROUTES.employees,
    bgColor: CONSTROAD_COLORS.yellow,
    textColor: 'black',
    icon: WorkerIcon
  },
  {
    name: 'Proveedores',
    path: ADMIN_ROUTES.providers,
    bgColor: CONSTROAD_COLORS.black,
    textColor: 'white',
    icon: ProvidersIcon
  },
  {
    name: 'Pedidos',
    path: ADMIN_ROUTES.orders,
    bgColor: CONSTROAD_COLORS.lightGray,
    textColor: 'black',
    icon: ProductionIcon
  },
  {
    name: 'Tareas',
    path: ADMIN_ROUTES.tasks,
    bgColor: CONSTROAD_COLORS.lightGray,
    textColor: 'black',
    icon: TaskIcon
  },
  {
    name: 'Transportes',
    path: ADMIN_ROUTES.transports,
    bgColor: CONSTROAD_COLORS.lightGray,
    textColor: 'black',
    icon: DispatchIcon
  },
  {
    name: 'Agregados',
    path: ADMIN_ROUTES.materials,
    bgColor: CONSTROAD_COLORS.lightGray,
    textColor: 'black',
    icon: MaterialIcon
  },
]
