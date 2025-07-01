import { APP_ROUTES } from "src/common/consts";
import {
  AlertsIcon,
  CashRegisterBoldIcon,
  ClientsIcon,
  DashboardIcon,
  GearBoldIcon,
  SignupIcon,
  TripIcon,
  VehiclesIcon
} from "src/common/icons";

export const dashboardTabs = [
  {
    name: 'Dashboard',
    path: APP_ROUTES.dashboard,
    bgColor: 'primary',
    textColor: 'white',
    icon: DashboardIcon
  },
  {
    name: 'Clientes',
    path: APP_ROUTES.clients,
    bgColor: 'primary',
    textColor: 'white',
    icon: ClientsIcon
  },
  {
    name: 'Vehiculos',
    path: APP_ROUTES.vehicles,
    bgColor: 'primary',
    textColor: 'white',
    icon: VehiclesIcon
  },
  {
    name: 'Viajes',
    path: APP_ROUTES.trips,
    bgColor: 'primary',
    textColor: 'white',
    icon: TripIcon
  },
  {
    name: 'Gastos',
    path: APP_ROUTES.expenses,
    bgColor: 'primary',
    textColor: 'white',
    icon: CashRegisterBoldIcon
  },
  {
    name: 'Alertas',
    path: APP_ROUTES.alerts,
    bgColor: 'black',
    textColor: 'white',
    icon: AlertsIcon
  },
 {
    name: 'Usuarios',
    path: APP_ROUTES.users,
    bgColor: 'black',
    textColor: 'white',
    icon: SignupIcon
 },
 {
    name: 'Configuration',
    path: APP_ROUTES.configuration,
    bgColor: 'primary',
    textColor: 'white',
    icon: GearBoldIcon
 },
]
