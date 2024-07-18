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
  {label: 'Colocación de mezcla asfáltica', path: APP_ROUTES.colocacionAsfaltica},
  {label: 'Señalización vial', path: APP_ROUTES.senalizacionVial},
  {label: 'Alquiler de planta de asfalto', path: APP_ROUTES.alquilerPlanta},
]

export const carouselImages = [
  {label: 'planta-de-asfalto-constroad', url: 'url(/img/carousel/presentacion.png)'},
  {label: 'produccion-asfalto-dia', url: 'url(/img/carousel/produccion-dia.png)'},
  {label: 'produccion-asfalto-madrugada', url: 'url(/img/carousel/produccion-madrugada.png)'},
  {label: 'produccion-asfalto-noche', url: 'url(/img/carousel/produccion-noche.png)'},
]

export const clientsImages = [
  {label: 'falcob-logo', url: '/img/clients/falcob-logo.png'},
  {label: 'globo-fast-logo', url: '/img/clients/globo-fast-logo.png'},
  {label: 'cyf-logo', url: '/img/clients/cyf-logo.png'},
  {label: 'sercon-logo', url: '/img/clients/sercon-logo.png'},
  {label: 'alfaco-logo', url: '/img/clients/alfaco-logo.png'},
  {label: 'astec-logo', url: '/img/clients/astec-logo.png'},
  {label: 'proconstruc-logo', url: '/img/clients/proconstruc-logo.png'},
]

export const proyectsImages = [
  {label: 'proyecto-la-campigna', url: '/img/proyects/la-campigna-cajamarquilla.png'},
  {label: 'proyecto-los-plateros', url: '/img/proyects/los-plateros-ate.jpeg'},
  {label: 'proyecto-los-tulipanes', url: '/img/proyects/los-tulipanes-carapongo.jpeg'},
  {label: 'proyecto-surco', url: '/img/proyects/surco.jpg'}, 
]
