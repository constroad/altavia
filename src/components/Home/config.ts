import { BusinessIcon, GoalIcon, IdeaIcon } from "src/common/icons";
import { ALTAVIA_COLORS, CONSTROAD_COLORS } from "src/styles/shared";

export const nosotrosConfig = [
  {
    title: 'Visión',
    icon: IdeaIcon,
    mt: '35px',
    hoverMt: '15px',
    textColor: ALTAVIA_COLORS.primary,
    bgColor: '#fff',
    content: `Ser la empresa líder en transporte de carga en el Perú, reconocida por su innovación, confiabilidad
    y excelencia operativa. Altavía Perú busca crecer de forma sostenible, incorporando tecnología de vanguardia
    y fortaleciendo relaciones duraderas con clientes, colaboradores y aliados.`,
  },
  {
    title: 'Negocio',
    icon: BusinessIcon,
    mt: '-10px',
    hoverMt: '-30px',
    textColor: 'white',
    bgColor: ALTAVIA_COLORS.primary,
    content: `Altavía Perú brinda soluciones integrales de transporte de carga terrestre a nivel nacional,
    adaptadas a las necesidades de cada cliente. Con una flota moderna, tecnología de monitoreo y un equipo
    comprometido, garantiza seguridad, eficiencia y puntualidad en cada operación. Es el socio logístico
    confiable para empresas que buscan calidad y respaldo en sus envíos.`,
  },
  {
    title: 'Misión',
    icon: GoalIcon,
    mt: '35px',
    hoverMt: '15px',
    textColor: ALTAVIA_COLORS.primary,
    bgColor: '#fff',
    content: `Brindar un servicio de transporte de carga terrestre eficiente, seguro y confiable en todo el Perú.
    Altavía Perú se compromete a ser el socio logístico estratégico de sus clientes, ofreciendo soluciones flexibles
    mediante tecnología, procesos optimizados y un equipo capacitado, garantizando calidad, puntualidad y alto nivel
    de servicio.`,
  },
]

export const serviciosConfig = [
  {
    title: 'Transporte de carga general',
    image: '/img/services/transporte-de-carga-general.jpg',
    description: `Servicio de traslado de bienes que no requieren condiciones especiales. Incluye
    productos terminados (empaquetados), materiales de construcción, maquinaria, herramientas, y más.`,
    shortDescription: 'Servicio de traslado de bienes que no requieren condiciones especiales...',
    redirect: '/servicios/mezcla-asfaltica-en-caliente' 
  },
  {
    title: 'Transporte interprovincial',
    image: '/img/services/transporte-interprovincial.png',
    description: `Servicio de traslado de mercancías entre distintas regiones o provincias del país, ya
    sea de costa, sierra o selva. Involucra planificación de rutas, permisos y seguimiento en tiempo real.`,
    shortDescription: 'Servicio de traslado de mercancías entre distintas regiones o provincias...',
    redirect: '/servicios/colocacion-de-mezcla-asfaltica'
  },
  {
    title: 'Transporte carga completa',
    image: '/img/services/transporte-de-carga-completa.png',
    description: `Transporte exclusivo para un solo cliente que necesita usar todo el espacio del camión.
    Se garantiza mayor seguridad, rapidez y menor manipulación de la mercancía.`,
    shortDescription: 'Transporte exclusivo para un solo cliente...',
    redirect: '/servicios/senalizacion-vial'
  },
  {
    title: 'Transporte de carga sobredimensionada',
    image: '/img/services/transporte-de-carga-sobredimensionada.jpg',
    description: `Servicio especializado para trasladar cargas que exceden las dimensiones o pesos estándar,
    como maquinaria pesada, estructuras industriales o equipos de gran volumen. Requiere planificación de rutas,
    permisos especiales y experiencia en maniobras seguras.`,
    shortDescription: 'Servicio especializado para trasladar cargas que exceden las dimensiones o pesos estándar...',
    redirect: '/servicios/alquiler-planta-asfaltica'
  },
]
