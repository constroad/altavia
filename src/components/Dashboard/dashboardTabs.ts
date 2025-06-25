import { APP_ROUTES } from "src/common/consts";
import { AlertsIcon, CashRegisterBoldIcon, DashboardIcon, GearBoldIcon, SignupIcon, TripIcon, TruckIcon, VehiclesIcon } from "src/common/icons";

export const dashboardTabs = [
  {
   name: 'Dashboard',
   path: APP_ROUTES.dashboard,
   bgColor: 'primary',
   textColor: 'white',
   icon: DashboardIcon
 },
  {
   name: 'Vehicles',
   path: APP_ROUTES.vehicles,
   bgColor: 'primary',
   textColor: 'white',
   icon: VehiclesIcon
 },
  {
   name: 'Trips',
   path: APP_ROUTES.trips,
   bgColor: 'primary',
   textColor: 'white',
   icon: TripIcon
 },
  {
   name: 'Egresos',
   path: APP_ROUTES.expenses,
   bgColor: 'primary',
   textColor: 'white',
   icon: CashRegisterBoldIcon
 },
 {
   name: 'Alerts',
   path: APP_ROUTES.alerts,
   bgColor: 'black',
   textColor: 'white',
   icon: AlertsIcon
 },
 {
   name: 'Users',
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
