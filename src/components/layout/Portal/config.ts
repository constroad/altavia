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
