import { Box, Flex, Grid, GridItem, Image, Text } from '@chakra-ui/react'
import { BusinessIcon, GoalIcon, IdeaIcon } from 'src/common/icons'
import { PortalLayout } from 'src/components'
import { CarouselComponent } from 'src/components/layout/Portal/Carousel'
import { CONSTROAD_COLORS } from 'src/styles/shared'

const Home = () => {
  const CardImage = (title: string, description: string, urlImage: string) => {
    return (
      <Flex
        w="100%"
        h='270px'
        rounded='20px'
        alignItems='center'
        flexDir='column'
        backgroundImage={`url(${urlImage})`}
        backgroundSize="cover"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        position='relative'
      >
        <Flex position='absolute' w='100%' h='100%' opacity='0.5' rounded='10px' zIndex={10} />
        <Flex position='absolute' zIndex={20} flexDir='column' alignItems='center' bg='gray' w='100%' h='100%' opacity='0.8' rounded='20px' p='20px'>
          <Text className='font-logo' fontWeight={600} fontSize={26} color='white'>{title}</Text>
          <Text fontWeight={500} mt='20px' color='white'>{description}</Text>
        </Flex>
      </Flex>
    );
  }
  return (
    <PortalLayout noPaddingTop >
      <CarouselComponent />
      <Flex width='100%' mt={{ base: '30px', md: '40px'}}>
        <Flex
          flexDir={{ base: 'column', md: 'column' }}
          width='100%'
          paddingX={{ base: '', md: '120px' }}
          marginX='auto'
          justifyContent='space-between'
        >
          <Flex
            flexDir='column'
            width={{ base: '100%', md: '100%' }}
            paddingX={{base: '30px', md: '0px'}}
          >
            <Text as='h2' fontSize={{ base: 25, md: 40 }} fontWeight={800} color='black' className='font-logo' mt='10px'>
              NOSOTROS
            </Text>
            <Text as='h2' fontSize={{ base: 18, md: 22 }} fontWeight={700} color='black' className='font-logo' mt='20px'>
              ¿QUIÉNES SOMOS?
            </Text>
            <Flex color='#707070' opacity={0.8} textAlign='justify' className='font-roboto' flexDir='row' w='100%' justifyContent='space-between'>
              <Flex flexDir='column' width={{ base: '100%', md: '49%' }}>
                <Flex flex='inline'>
                  <Box
                    as='p'
                    marginRight='10px'
                    color='black'
                    display='inline'
                  >
                    <span className='font-[600]'>
                      CONSTROAD
                    </span>
                    <span className='ml-[6px] text-[#707070]'>
                      es una empresa peruana líder en el sector de la construcción de infraestructura vial, ya que contamos con instalaciones propias para fabricar los materiales necesarios
                      (cantera de áridos y planta de aglomerados) así como con los medios precisos para abarcar todo tipo de obras asfálticas con la
                      mayor calidad y prontitud ya que contamos con una amplia flota de maquinaria especializada en pavimentaciones asfálticas.
                    </span>
                  </Box>
                </Flex>

                <Box as='p' mt='24px' color='#707070'>
                  La mejora continua hace que seamos una empresa con un espíritu joven, innovador y responsable con nuestros clientes. Buscamos afrontar el futuro con
                  los principios de esfuerzo, responsabilidad, innovación y deseos de crecimiento.  Por otro lado, nos preocupamos por la seguridad de nuestro equipo humano y 
                  de nuestro medio ambiente por lo que nuestro personal recibe capacitación en forma constante y completa
                </Box>
              </Flex>

              <Flex
                width={{ base: '100%', md: '49%' }}
                justifyContent={{ base: 'center', md: 'end' }}
                marginTop={{ base: '20px', md: '0px' }}
              >
                <Image
                  src='/img/carousel/presentacion.png'
                  alt='quienes-somos-logo'
                  width={{ base: '100%', md: '100%' }}
                  height={{ base: '200px', md: '290px' }}
                  paddingX={{base: '30px', md: '0px'}}
                />
              </Flex>
            </Flex>
          </Flex>

          <Flex mt='100px'>
            <Flex width='100%' justifyContent='space-between'>
              <Flex width='32.5%' h='325px' bg={CONSTROAD_COLORS.darkYellow} rounded='10px' justifyContent='start' py='15px' px='20px' mt='35px' flexDir='column'>
                <Flex alignItems='center' gap='8px'>
                  <Text className='font-logo' fontWeight={700} fontSize={{ base: 20, md: 25 }} mt='10px'>Visión</Text>
                  <IdeaIcon fontSize={30} />
                </Flex>
                <Flex flexDir='column'>
                  <Text w='100%'>
                    Ser reconocidos como líderes en la producción de asfalto dentro de nuestra región,
                    guiando la industria hacia un futuro más sostenible e innovador. Aspiramos a transformar
                    el sector mediante la adopción de tecnologías que no solo optimicen nuestros procesos
                    de producción, sino que también minimicen nuestro impacto ambiental.
                  </Text>
                </Flex>
              </Flex>

              <Flex width='32.5%' h='325px' bg={CONSTROAD_COLORS.black} rounded='10px' justifyContent='start' py='15px' px='20px' flexDir='column'>
                <Flex alignItems='center' gap='8px'>
                  <Text className='font-logo' fontWeight={700} fontSize={{ base: 20, md: 25 }} color='white' mt='10px'>Negocio</Text>
                  <BusinessIcon color='white' fontSize={30} />
                </Flex>
                <Flex flexDir='column'>
                  <Text w='100%' color='white'>
                    En Constroad, nos dedicamos a la producción de asfalto de la más alta calidad. Con años de experiencia en la industria,
                    nos enorgullece ofrecer productos que cumplen con los más estrictos estándares de calidad.
                    Ya sea para grandes infraestructuras o proyectos más pequeños, tenemos la capacidad para
                    satisfacer todas sus necesidades asfálticas.
                  </Text>
                </Flex>
              </Flex>

              <Flex width='32.5%' h='325px' bg={CONSTROAD_COLORS.darkYellow} rounded='10px' justifyContent='start' py='15px' px='20px' mt='35px' flexDir='column'>
                <Flex alignItems='center' gap='8px'>
                  <Text className='font-logo' fontWeight={700} fontSize={{ base: 20, md: 25 }} mt='10px'>Misión</Text>
                  <GoalIcon fontSize={30} />
                </Flex>
                <Flex flexDir='column'>
                  <Text w='100%'>
                    En Constroad, nuestra misión es proporcionar soluciones de asfalto que combinen calidad superior, innovación y
                    responsabilidad ambiental. Trabajamos incansablemente para garantizar que cada producto y servicio que ofrecemos
                    no solo cumpla con los más altos estándares, sino que también contribuya al desarrollo sostenible de nuestra comunidad.
                  </Text>
                </Flex>
              </Flex>
            </Flex>
          </Flex>

          <Flex mt='100px' flexDir='column' w='100%'>
            <Text as='h2' fontSize={{ base: 25, md: 40 }} fontWeight={800} color='black' className='font-logo' mt='10px'>
              SERVICIOS
            </Text>

            <Flex w='100%'>
              <Grid templateColumns="repeat(2, 1fr)" w='100%' columnGap='100px' rowGap='40px'>
                <GridItem>
                  {CardImage(
                    'Mezcla asfáltica en caliente',
                    'Ofrecemos el servicio de producción de asfalto en caliente de alta calidad, ideales para proyectos de infraestructura vial y pavimentación. Nuestro proceso garantiza durabilidad y rendimiento superior, utilizando materiales de primera y tecnología avanzada para cumplir con los más altos estándares de la industria',
                    '/img/carousel/produccion-madrugada.png'
                  )}
                </GridItem>
                <GridItem>
                  {CardImage(
                    'Colocación de mezcla asfáltica',
                    'Nuestro servicio de colocación asfáltica en caliente asegura superficies viales uniformes y duraderas. Contamos con un equipo experto y maquinaria de última generación para garantizar una instalación eficiente y de alta calidad.',
                    '/img/services/la-campigna.png'
                  )}
                </GridItem>
                <GridItem>
                  {CardImage(
                    'Señalización Vial',
                    'Ofrecemos soluciones completas de señalización vial para garantizar la seguridad y la eficiencia del tráfico. Utilizamos materiales duraderos y técnicas avanzadas para instalar señales y marcas viales claras y visibles. Ya sea para carreteras, estacionamientos o áreas urbanas, nuestro equipo se asegura de cumplir con todas las normativas y estándares de calidad.',
                    '/img/segnalizacion-vial.jpg'
                  )}
                </GridItem>
                <GridItem>
                  {CardImage(
                    'Alquiler de planta de asfalto',
                    'Ofrecemos el servicio de alquiler de nuestra planta de asfalto para satisfacer las necesidades de producción temporal de su proyecto. Nuestra planta está equipada con tecnología avanzada para garantizar una producción eficiente y de alta calidad. Con nuestro apoyo técnico especializado, usted puede aumentar su capacidad de producción sin la necesidad de una inversión a largo plazo.',
                    '/img/carousel/presentacion.png'
                  )}
                </GridItem>
              </Grid>
            </Flex>
          </Flex>

        </Flex>
      </Flex>
    </PortalLayout>
  )
}

export default Home