import { APP_ROUTES } from "src/common/consts"

export const navOptions = [
  {label: 'Inicio', path: APP_ROUTES.home},
  {label: 'Nosotros', path: APP_ROUTES.nosotros},
  {label: 'Servicios', path: APP_ROUTES.servicios},
  // {label: 'PROVEEDORES', path: APP_ROUTES.proveedores},
  {label: 'Contáctanos', path: APP_ROUTES.contactanos},
]

export const nosotrosOptions = [
  {label: 'Misión', path: APP_ROUTES.mision},
  {label: 'Visión', path: APP_ROUTES.vision},
  {label: 'Valores', path: APP_ROUTES.valores},
]

export const serviciosOptions = [
  {label: 'Mezcla asfáltica en caliente', path: APP_ROUTES.mezclaAsfaltica},
  {label: 'Colocación de mazcla asfáltica', path: APP_ROUTES.colocacionAsfaltica},
  {label: 'Transporte de carga por carretera', path: APP_ROUTES.transporte},
]

export const carouselImages = [
  {label: 'image1', url: 'url(/img/carousel/constroad1.jpeg)'},
  {label: 'image2', url: 'url(/img/carousel/constroad2.jpeg)'},
  {label: 'image3', url: 'url(/img/carousel/constroad3.jpeg)'},
  {label: 'image4', url: 'url(/img/carousel/constroad4.jpeg)'},
]
