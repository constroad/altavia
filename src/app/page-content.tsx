'use client'

import { Box, Flex, Grid, GridItem, Icon, Image, Text } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { FaAnglesDown } from 'react-icons/fa6'
import { GiGears } from 'react-icons/gi'
import { ImLeaf } from 'react-icons/im'
import {
  PortalLayout,
  ServiceCard,
  SubtitleComponent,
  nosotrosConfig,
  serviciosConfig,
} from 'src/components'
import { CarouselComponent } from 'src/components/layout/Portal/Carousel'
import { MiniCarousel } from 'src/components/layout/Portal/MiniCarousel'
import {
  carouselImages,
  clientsImages,
} from 'src/components/layout/Portal/config'
import { useScreenSize } from 'src/common/hooks'
import { ALTAVIA_COLORS } from 'src/styles/shared'

export default function HomePageContent() {
  const [showArrow, setShowArrow] = useState(true)
  const { isMobile, isDesktop } = useScreenSize()

  useEffect(() => {
    const handleScroll = () => {
      setShowArrow(window.scrollY <= 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  function scrollTo() {
    const element = document.getElementById('nosotrosBox')
    if (element) {
      window.scrollTo({
        top: element.offsetTop,
        behavior: 'smooth',
      })
    }
  }

  return (
    <PortalLayout noPaddingTop >

      {/* Carousel */}
      <CarouselComponent images={carouselImages} />

      {/* Page */}
      <Flex width='100%'>
        <Flex
          flexDir={{ base: 'column', md: 'column' }}
          width='100%'
          justifyContent='space-between'
          id='nosotrosBox'
        >
          <Flex
            flexDir='column'
            width={{ base: '100%', md: '100%' }}
            h={{ base: '', md: 'calc((100vh - 45px) *2 )' }}
            backgroundImage="url(/img/web/mision-portada2.png)"
            backgroundSize="cover"
            backgroundPosition="center"
            backgroundRepeat="no-repeat"
          >
            <Flex
              flexDir='column'
              width={{ base: '100%', md: '100%' }}
              paddingX={{ base: '30px', md: '120px' }}
              h={{ base: '', md: 'calc(100vh - 90px)' }}
            >
              <Box mt='50px'>
                <SubtitleComponent text='NOSOTROS' />
              </Box>
              {!isMobile && (
                <Text
                  as='h2'
                  fontSize={{ base: 18, md: 22 }}
                  fontWeight={700}
                  color={ALTAVIA_COLORS.black}
                  className='font-logo'
                  mt={{ base: '5px', md: '20px' }}
                >
                  ¿QUIÉNES SOMOS?
                </Text>
              )}
              <Flex
                w='100%'
                textAlign=''
                className='font-roboto'
                flexDir={{ base: 'column', md: 'row' }}
                justifyContent='space-between'
                mt={{ base: '10px', md: '0px' }}
              >
                <Flex flexDir='column' width={{ base: '100%', md: '49%' }} className='font-logo'>
                  <Flex flex='inline' mt='10px'>
                    <Box
                      marginRight='10px'
                      color='black'
                      display='inline'
                    >
                      <Box fontWeight={800} color={ALTAVIA_COLORS.primary} fontSize={{ base: '14px', md: '20px' }} display='inline'>
                        ALTAVÍA PERÚ
                      </Box>
                      <Box ml='10px' color={ALTAVIA_COLORS.black} fontSize={{ base: '14px', md: '18px' }} fontWeight={600} display='inline'>
                        es una empresa peruana especializada en transporte de carga por carretera, con experiencia en el rubro y una sólida
                        reputación construida sobre la base del trabajo honesto, eficiente y comprometido. Cuenta con una moderna flota de
                        camiones equipada con sistemas de rastreo GPS, unidades acondicionadas para distintos tipos de carga, y un equipo
                        humano capacitado en logística, conducción, mantenimiento y atención al cliente.
                      </Box>
                    </Box>
                  </Flex>

                  {!isMobile && (
                    <Box as='p' mt={{ base: '15px', md: '25px' }} color={ALTAVIA_COLORS.black} fontWeight={600} fontSize={{ base: '14px', md: '18px' }} display='inline'>
                      Atendemos a empresas de distintos sectores como agroindustria, construcción, minería, comercio, alimentos y manufactura.
                      Y nos diferenciamos en el mercado por brindar un servicio personalizado, entendiendo las necesidades específicas de cada
                      cliente y ofreciendo soluciones logísticas que optimizan tiempo y costos.
                    </Box>
                  )}
                </Flex>

                <Flex
                  width={{ base: '100%', md: '49%' }}
                  justifyContent={{ base: 'center', md: 'end' }}
                  marginTop={{ base: '20px', md: '12px' }}
                >
                  <Image
                    src='/img/web/quienessomos2.png'
                    rounded='10px'
                    border={`2px solid ${ALTAVIA_COLORS.lightPrimary}`}
                    alt='quienes-somos-logo'
                    width={{ base: '100%', md: '100%' }}
                    height={{ base: '200px', md: '350px' }}
                    paddingX={{base: '0px', md: '0px'}}
                  />
                </Flex>
              </Flex>
            </Flex>

            <Flex
              w='100%'
              flexDir='column'
              mt={{ base: '40px', md: '0px' }}
              paddingX={{base: '30px', md: '120px'}}
              h={{ base: '', md: 'calc(100vh - 90px)' }}
            >
              <Box mt='10px'>
                <SubtitleComponent text='NUESTROS SERVICIOS' />
              </Box>

              <Flex w='100%' mt={{ base: '10px', md: '40px' }}>
                <Grid
                  w='100%'
                  templateColumns={{ base: 'repeat(1, 1fr)', md: "repeat(2, 1fr)"}}
                  columnGap={{ base: '20px', md: '50px' }}
                  rowGap={{ base: '20px', md: '50px' }}>
                  {serviciosConfig.map(item => (
                    <GridItem key={item.title}>
                      <ServiceCard service={item} />
                    </GridItem>
                  ))}
                </Grid>
              </Flex>
            </Flex>
          </Flex>


          {/* ESTADISTICAS */}
          <Flex
            w='100%'
            flexDir='column'
            mt={{ base: '40px', md: '0px' }}
            position='relative'
            h={{ base: '420px', md: 'calc(60vh)'}}
          >
            <Flex
              position='absolute'
              w='100%'
              top='0px'
              flexDir={{ base: 'column', md: 'column' }}
              className='100vw'
              gap={{ base: '10px', md: '' }}
              alignItems='start'
              px={{base: '30px', md: '120px' }}
            >
              <Flex
                w='100%'
                opacity={0.9}
                backgroundImage='url(/img/carousel/img0.png)'
                backgroundSize="cover"
                backgroundPosition='center'
                backgroundRepeat="no-repeat"
                position='absolute'
                left='0px'
                top='0px'
                h={{ base: '420px', md: 'calc(60vh)' }}
              >
                <Flex w='100%' bg='gray.800' opacity={0.8} zIndex={20} h='100%'></Flex>
              </Flex>

              <Box mt='80px' >
                <SubtitleComponent text='LOGROS DE LA EMPRESA' color='#fff' />
              </Box>

              <Flex w='100%' opacity={1} zIndex={100} gap='20px' flexDir='column' mt='10px'>
                <Flex justifyContent='space-between' flexDir={{ base: 'column', md: 'row' }}>
                  <Image rounded='5px' w='260px' h='220px' alt='nuestros clientes' src='/img/goals/clientes.png'/>
                  <Image rounded='5px' w='260px' h='220px' alt='nuestra cobertura' src='/img/goals/cobertura.png' />
                  <Image rounded='5px' w='260px' h='220px' alt='nuestro equipo' src='/img/goals/equipo.png'/>
                  <Image rounded='5px' w='260px' h='220px' alt='cantidad de viajes' src='/img/goals/viajes.png' />
                </Flex>
              </Flex>
            </Flex>
          </Flex>

          <Flex
            w='100%'
            flexDir='column'
            mt={{ base: '60px', md: '0px' }}
            h={{ base: '150px', md: '350px'}}
            position='relative'
          >
            <Flex px={{ base: '30px', md: '120px' }} mt='120px'>
              <SubtitleComponent text='NUESTROS CLIENTES' />
            </Flex>
            <Flex
              position='relative'
              left={{ base: '0px', md: '0px' }}
              top={{ base: '50px', md: '10px' }}
              className='w-screen'
              // h={{ base: '90px', md: '135px' }}
              px={{ base: '30px', md: '120px' }}
            >
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
