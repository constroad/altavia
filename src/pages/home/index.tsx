import { Box, Flex, Grid, GridItem, Icon, Image, Text } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { FaAnglesDown } from 'react-icons/fa6'
import { GiGears } from 'react-icons/gi'
import { PortalLayout, ServiceCard, SubtitleComponent, nosotrosConfig, serviciosConfig } from 'src/components'
import { CarouselComponent } from 'src/components/layout/Portal/Carousel'
import { MiniCarousel } from 'src/components/layout/Portal/MiniCarousel'
import { carouselImages, clientsImages, proyectsImages } from 'src/components/layout/Portal/config'
import { SiNintendogamecube } from "react-icons/si";
import { ImLeaf } from "react-icons/im";
import { useScreenSize } from 'src/common/hooks'

const Home = () => {
  const [showArrow, setShowArrow] = useState(true);
  const { isMobile, isDesktop } = useScreenSize()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setShowArrow(false);
      } else {
        setShowArrow(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  function scrollTo() {
    var element = document.getElementById('nosotrosBox');
    var offset = 0;
    var scrollToPosition = element!.offsetTop - offset;

    window.scrollTo({
      top: scrollToPosition,
      behavior: 'smooth'
    });
  }

  return (
    <PortalLayout noPaddingTop >

      {/* Carousel */}
      <CarouselComponent images={carouselImages} />

      {/* Page */}
      <Flex width='100%' mt={{ base: '25px', md: '20px'}}>
        <Flex
          flexDir={{ base: 'column', md: 'column' }}
          width='100%'
          paddingX={{ base: '', md: '120px' }}
          marginX='auto'
          justifyContent='space-between'
          id='nosotrosBox'
        >
          <Flex
            flexDir='column'
            width={{ base: '100%', md: '100%' }}
            paddingX={{base: '30px', md: '0px'}}
            mt={{ base: '20px', md: '' }}
          >
            <SubtitleComponent text='NOSOTROS' />
            {!isMobile && (
              <Text as='h2' fontSize={{ base: 18, md: 22 }} fontWeight={700} color='black' className='font-logo' mt={{ base: '5px', md: '5px' }}>
                ¿QUIÉNES SOMOS?
              </Text>
            )}
            <Flex color='#707070' textAlign='justify' className='font-roboto' flexDir={{ base: 'column', md: 'row' }} w='100%' justifyContent='space-between' mt={{ base: '10px', md: '0px' }}>
              <Flex flexDir='column' width={{ base: '100%', md: '49%' }} className='font-logo'>
                <Flex flex='inline'>
                  <Box
                    marginRight='10px'
                    color='black'
                    display='inline'
                  >
                    <Box className='font-[600]' fontSize={{ base: '14px', md: '16px' }} display='inline'>
                      CONSTROAD
                    </Box>
                    <Box className='ml-[6px] text-[#707070]' fontSize={{ base: '14px', md: '16px' }} display='inline'>
                      es una empresa peruana líder en el sector de la construcción de infraestructura vial, ya que contamos con instalaciones propias para fabricar los materiales necesarios
                      (cantera de áridos y planta de aglomerados) así como con los medios precisos para abarcar todo tipo de obras asfálticas con la
                      mayor calidad y prontitud ya que contamos con una amplia flota de maquinaria especializada en pavimentaciones asfálticas.
                    </Box>
                  </Box>
                </Flex>

                {!isMobile && (
                  <Box as='p' mt={{ base: '15px', md: '10px' }} color='#707070' fontSize={{ base: '14px', md: '16px' }} display='inline'>
                    La mejora continua hace que seamos una empresa con un espíritu joven, innovador y responsable con nuestros clientes. Buscamos afrontar el futuro con
                    los principios de esfuerzo, responsabilidad, innovación y deseos de crecimiento.  Por otro lado, nos preocupamos por la seguridad de nuestro equipo humano y 
                    de nuestro medio ambiente por lo que nuestro personal recibe capacitación en forma constante y completa.
                  </Box>
                )}
              </Flex>

              <Flex
                width={{ base: '100%', md: '49%' }}
                justifyContent={{ base: 'center', md: 'end' }}
                marginTop={{ base: '20px', md: '0px' }}
              >
                <Image
                  src='/img/carousel/presentacion.png'
                  rounded='10px'
                  alt='quienes-somos-logo'
                  width={{ base: '100%', md: '100%' }}
                  height={{ base: '200px', md: '245px' }}
                  paddingX={{base: '0px', md: '0px'}}
                />
              </Flex>
            </Flex>
          </Flex>

          <Flex mt={{ base: '40px', md: '30px' }} paddingX={{base: '30px', md: '0px'}}>
            <Flex width='100%' justifyContent='space-between' flexDir={{ base: 'column', md: 'row' }} >
              {nosotrosConfig.map(item => (
                <Flex
                  key={item.title}
                  width={{ base: '100%', md: '32.5%' }}
                  h={{ base: '250px', md: '250px' }}
                  rounded='10px'
                  justifyContent='start'
                  py='15px'
                  px='20px'
                  mt={{ base: '10px', md: item.mt }}
                  flexDir='column'
                  bg={item.bgColor}
                  transition="margin-top 0.3s"
                  _hover={{ boxShadow: "0 8px 16px rgba(0, 0, 0, 0.4)", mt: isMobile ? '15px' : `${item.hoverMt}`, border: `2px solid ${item.textColor}`, px: '18px', py: '13px' }}
                >
                  <Flex alignItems='center' gap='8px'>
                    <Text className='font-logo' fontWeight={700} fontSize={{ base: 20, md: 25 }} mt='10px' color={item.textColor}>
                      {item.title}
                    </Text>
                    <item.icon fontSize={30} color={item.textColor} />
                  </Flex>
                  <Flex flexDir='column'>
                    <Text w='100%' color={item.textColor} fontSize={{ base: '14px', md: '16px' }} className='font-logo'>
                      {item.content}
                    </Text>
                  </Flex>
                </Flex>
              ))}
            </Flex>
          </Flex>

          <Flex mt={{ base: '40px', md: '50px' }} flexDir='column' w='100%' paddingX={{base: '30px', md: '0px'}}>
            <SubtitleComponent text='SERVICIOS' />

            <Flex w='100%' mt={{ base: '10px', md: '10px' }}>
              <Grid templateColumns={{ base: 'repeat(1, 1fr)', md: "repeat(2, 1fr)"}} w='100%' columnGap={{ base: '20px', md: '40px' }} rowGap={{ base: '20px', md: '40px' }}>
                {serviciosConfig.map(item => (
                  <GridItem key={item.title}>
                    <ServiceCard service={item} />
                  </GridItem>
                ))}
              </Grid>
            </Flex>
          </Flex>

          {/* ESTADISTICAS */}
          <Flex mt={{ base: '40px', md: '70px' }} flexDir='column' w='100%' h={{ base: '420px', md: '200px'}} position='relative' >
            <Flex
              position='absolute'
              left={{ base: '0px', md: '-120px'}}
              top='0px'
              flexDir={{ base: 'column', md: 'row' }}
              className='w-screen'

              h={{ base: '420px', md: '200px' }}
              justifyContent={{ base: 'center', md: 'space-between' }}
              gap={{ base: '10px', md: '' }}
              px={{ base: '30px', md: '120px' }}
              alignItems='center'
            >
              <Flex
                w='100%'
                opacity={0.9}
                backgroundImage='url(/img/proyects/estadisticas.png)'
                backgroundSize="cover"
                backgroundPosition='center'
                backgroundRepeat="no-repeat"
                position='absolute'
                left='0px'
                top='0px'
                h={{ base: '420px', md: '200px' }}
              >
                <Flex w='100%' bg='gray.800' opacity={0.8} zIndex={20} h='100%'></Flex>
              </Flex>

              <Flex border='2px solid white' w={{ base: '100%', md: '370px' }} zIndex={30} opacity={1} fontWeight={900} color='white' className='font-logo' h='120px'>
                <Flex w='30%' justifyContent='center' alignItems='center'>
                  <GiGears fontSize={60} color='white' />
                </Flex>
                <Flex flexDir='column' w='70%' justifyContent='center' alignItems='start' color='white'>
                  <Text w='100%' textAlign='start' fontWeight={900} fontSize={30}>
                    +117,000
                  </Text>
                  <Text fontSize={{ base: 18, md: 20 }}>
                    Horas máquina trabajadas
                  </Text>
                </Flex>
              </Flex>

              <Flex border='2px solid white' w={{ base: '100%', md: '370px' }} zIndex={30} opacity={1} fontWeight={900} color='white' className='font-logo' h='120px'>
                <Flex w='30%' justifyContent='center' alignItems='center'>
                  <SiNintendogamecube fontSize={60} color='white' />
                </Flex>
                <Flex flexDir='column' w='70%' justifyContent='center' alignItems='start' color='white'>
                  <Text w='100%' textAlign='start' fontWeight={900} fontSize={30}>
                    +7000
                  </Text>
                  <Text fontSize={{ base: 18, md: 20 }}>
                    M3 de asfalto producidos
                  </Text>
                </Flex>
              </Flex>

              <Flex border='2px solid white' w={{ base: '100%', md: '370px' }} zIndex={30} opacity={1} fontWeight={900} color='white' className='font-logo' h='120px'>
                <Flex w='30%' justifyContent='center' alignItems='center'>
                  <ImLeaf fontSize={60} color='white' />
                </Flex>
                <Flex flexDir='column' w='70%' justifyContent='center' alignItems='start' color='white'>
                  <Text w='100%' textAlign='start' fontWeight={900} fontSize={30}>
                    +40
                  </Text>
                  <Text fontSize={{ base: 18, md: 20 }}>
                    Proyectos completados
                  </Text>
                </Flex>
              </Flex>

            </Flex>
          </Flex>

          <Flex mt={{ base: '40px', md: '70px' }} flexDir='column' w='100%' paddingX={{base: '30px', md: '0px'}}>
            <SubtitleComponent text='PROYECTOS' />
            <Flex mt={{ base: '10px', md: '' }}>
              <Grid templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }} w='100%' columnGap='20px' rowGap='20px'>
                {proyectsImages.map(item => (
                  <GridItem key={item.label}>
                    <Flex w='100%' h='100%' justifyContent='center' alignItems='center'>
                      <Image alt={item.label} src={item.url} w='100%' h={{ base: '300px', md: '400px' }} />
                    </Flex>
                  </GridItem>
                ))}
              </Grid>
            </Flex>
          </Flex>

          <Flex mt={{ base: '60px', md: '80px' }} flexDir='column' w='100%' position='relative' h={{ base: '150px', md: '250px' }}>
            <Flex px={{ base: '30px', md: '0px' }}>
              <SubtitleComponent text='NUESTROS CLIENTES' />
            </Flex>
            <Flex position='absolute' left={{ base: '0px', md: '-120px' }} top={{ base: '50px', md: '70px' }} className='w-screen' h={{ base: '90px', md: '135px' }} px={{ base: '30px', md: '120px' }}>
              <MiniCarousel images={clientsImages} />
            </Flex>
          </Flex>
        </Flex>
      </Flex>

      {/* Arrow Scroll */}
      {isDesktop && (
        <Box
          position="fixed"
          bottom="50px"
          left="50%"
          transform="translateX(-50%)"
          opacity={showArrow ? 1 : 0}
          transition="opacity 0.5s"
          zIndex="10"
          visibility={{ base: 'hidden', md: 'visible' }}
          _hover={{ cursor: 'pointer' }}
          onClick={scrollTo}
        >
          <Icon
            as={FaAnglesDown}
            w={8}
            h={8}
            _hover={{ w: 10, h: 10 }}
            transition='width 0.4s, height 0.4s'
            color="white"
            className="scroll-down-arrow"
            animation={showArrow ? 'bounce 2s infinite' : 'none'}
          />
        </Box>
      )}
    </PortalLayout>
  )
}

export default Home
