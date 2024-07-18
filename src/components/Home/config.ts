import { BusinessIcon, GoalIcon, IdeaIcon } from "src/common/icons";
import { CONSTROAD_COLORS } from "src/styles/shared";

export const nosotrosConfig = [
  {
    title: 'Visión',
    icon: IdeaIcon,
    mt: '35px',
    hoverMt: '25px',
    textColor: 'black',
    bgColor: CONSTROAD_COLORS.darkYellow,
    content: `Ser reconocidos como líderes en la producción de asfalto dentro de nuestra región, guiando la industria hacia un futuro más sostenible e innovador.
    Aspiramos a transformar el sector mediante la adopción de tecnologías que no solo optimicen nuestros procesos de producción, sino que también minimicen nuestro impacto ambiental.`,
  },
  {
    title: 'Negocio',
    icon: BusinessIcon,
    mt: '0px',
    hoverMt: '-10px',
    textColor: 'white',
    bgColor: CONSTROAD_COLORS.black,
    content: `En Constroad, nos dedicamos a la producción de asfalto de la más alta calidad.
    Con años de experiencia en la industria, nos enorgullece ofrecer productos que cumplen con los más estrictos estándares de calidad.
    Ya sea para grandes infraestructuras o proyectos más pequeños, tenemos la capacidad para satisfacer todas sus necesidades asfálticas.`,
  },
  {
    title: 'Misión',
    icon: GoalIcon,
    mt: '35px',
    hoverMt: '25px',
    textColor: 'black',
    bgColor: CONSTROAD_COLORS.darkYellow,
    content: `En Constroad, nuestra misión es proporcionar soluciones de asfalto que combinen calidad superior, innovación y responsabilidad ambiental.
    Trabajamos incansablemente para garantizar que cada producto y servicio que ofrecemos no solo cumpla con los más altos estándares,
    sino que también contribuya al desarrollo sostenible de nuestra comunidad.`,
  },
]

export const serviciosConfig = [
  {
    title: 'Mezcla asfáltica en caliente',
    image: '/img/carousel/produccion-madrugada.png',
    description: `Ofrecemos el servicio de producción de asfalto en caliente de alta calidad, ideales para proyectos de infraestructura vial y pavimentación.
    Nuestro proceso garantiza durabilidad y rendimiento superior, utilizando materiales de primera y tecnología avanzada para cumplir con los más altos estándares de la industria`,
    shortDescription: 'Ofrecemos el servicio de producción de asfalto en caliente de alta calidad...',
    redirect: '/servicios/mezcla-asfaltica-en-caliente' 
  },
  {
    title: 'Colocación de mezcla asfáltica',
    image: '/img/services/la-campigna.png',
    description: `Nuestro servicio de colocación asfáltica en caliente asegura superficies viales uniformes y duraderas.
    Contamos con un equipo experto y maquinaria de última generación para garantizar una instalación eficiente y de alta calidad.`,
    shortDescription: 'Nuestro servicio de colocación asfáltica en caliente asegura superficies viales duraderas...',
    redirect: '/servicios/colocacion-de-mezcla-asfaltica'
  },
  {
    title: 'Señalización Vial',
    image: '/img/segnalizacion-vial.jpg',
    description: `Ofrecemos soluciones completas de señalización vial para garantizar la seguridad y la eficiencia del tráfico.
    Utilizamos materiales duraderos y técnicas avanzadas para instalar señales y marcas viales claras y visibles.
    Ya sea para carreteras, estacionamientos o áreas urbanas, nuestro equipo se asegura de cumplir con todas las normativas y estándares de calidad.`,
    shortDescription: 'Ofrecemos soluciones completas de señalización vial...',
    redirect: '/servicios/senalizacion-vial'
  },
  {
    title: 'Alquiler de planta de asfalto',
    image: '/img/carousel/presentacion.png',
    description: `Ofrecemos el servicio de alquiler de nuestra planta de asfalto para satisfacer las necesidades de producción temporal de su proyecto.
    Nuestra planta está equipada con tecnología avanzada para garantizar una producción eficiente y de alta calidad.
    Con nuestro apoyo técnico especializado, usted puede aumentar su capacidad de producción sin la necesidad de una inversión a largo plazo.`,
    shortDescription: 'Ofrecemos el servicio de alquiler de nuestra planta de asfalto...',
    redirect: '/servicios/alquiler-planta-asfaltica'
  },
]
