import { APP_ROUTES } from "src/common/consts";
import { AlertsIcon, ClientsIcon, DashboardIcon, GearBoldIcon, SignupIcon, TripIcon, TruckIcon, VehiclesIcon } from "src/common/icons";
import { ALTAVIA_COLORS } from "src/styles/shared";

export const dashboardTabs = [
  {
   name: 'Dashboard',
   path: APP_ROUTES.dashboard,
   bgColor: ALTAVIA_COLORS.primary,
   textColor: 'white',
   icon: DashboardIcon
 },
  {
   name: 'Vehicles',
   path: APP_ROUTES.vehicles,
   bgColor: ALTAVIA_COLORS.primary,
   textColor: 'white',
   icon: VehiclesIcon
 },
  {
   name: 'Trips',
   path: APP_ROUTES.trips,
   bgColor: ALTAVIA_COLORS.primary,
   textColor: 'white',
   icon: TripIcon
 },
 {
   name: 'Alerts',
   path: APP_ROUTES.alerts,
   bgColor: ALTAVIA_COLORS.black,
   textColor: 'white',
   icon: AlertsIcon
 },
 {
   name: 'Users',
   path: APP_ROUTES.users,
   bgColor: ALTAVIA_COLORS.black,
   textColor: 'white',
   icon: SignupIcon
 },
 {
   name: 'Configuration',
   path: APP_ROUTES.configuration,
   bgColor: ALTAVIA_COLORS.primary,
   textColor: 'white',
   icon: GearBoldIcon
 },
]
