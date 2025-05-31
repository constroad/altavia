import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { APP_ROUTES } from "src/common/consts"


export const GenerateNavOptions = () => {
  const { status } = useSession()
  const [logged, setLogged] = useState(status)

  useEffect(() => {
    if (status) setLogged(status)
  }, [status])

  const navOptions = [
    {label: 'Inicio', path: APP_ROUTES.home, display: true},
    {label: 'Nosotros', path: APP_ROUTES.nosotros, display: true},
    {label: 'Servicios', path: APP_ROUTES.servicios, display: true},
    {label: 'PROVEEDORES', path: APP_ROUTES.proveedores, display: false},
    {label: 'Contáctanos', path: APP_ROUTES.contactanos, display: true},
  ]

  return navOptions.filter(x => x.display === true)
}

export const nosotrosOptions = [
  {label: 'Misión', path: APP_ROUTES.mision},
  {label: 'Visión', path: APP_ROUTES.vision},
  {label: 'Valores', path: APP_ROUTES.valores},
]

export const serviciosOptions = [
  {label: 'Transporte de carga general', path: APP_ROUTES.transporteCargaGeneral},
  {label: 'Transporte interprovincial', path: APP_ROUTES.transporteInterprovincial},
  {label: 'Transporte de carga completa', path: APP_ROUTES.transporteCargaCompleta},
  {label: 'Transporte de carga sobredimensionada', path: APP_ROUTES.transporteCargaSobredimensionada},
]

export const carouselImages = [
  {labe: 'img1', url: 'url(/img/carousel/img1.png)'},
  {labe: 'img3', url: 'url(/img/carousel/img3.png)'},
  {labe: 'img0', url: 'url(/img/carousel/img0.png)'},
  {labe: 'img2', url: 'url(/img/carousel/img2.png)'},
]

export const clientsImages = [
  {labe: 'img1', url: '/img/carousel/img1.png'},
  {labe: 'img3', url: '/img/carousel/img3.png'},
  {labe: 'img0', url: '/img/carousel/img0.png'},
  {labe: 'img2', url: '/img/carousel/img2.png'},
]
