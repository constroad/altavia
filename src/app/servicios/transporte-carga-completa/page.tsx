'use client'

import React from 'react'
import { Flex, Image, Box } from '@chakra-ui/react'
import { useScreenSize } from 'src/common/hooks'
import { PortalLayout, SubtitleComponent } from 'src/components'
import { ALTAVIA_COLORS } from 'src/styles/shared'

export default function Page() {
  const { isDesktop, isMobile } = useScreenSize()
  return (
    <PortalLayout>
      <Flex width='100%' pb='20px'>
        <Flex
          flexDir={{ base: 'column', md: 'row' }}
          width={{ base: '100%', md: '100%' }}
          // marginX='auto'
          justifyContent='space-between'
        >
          <Flex
            flexDir='column'
            width={{ base: '100%', md: '100%' }}
            paddingX={{base: '30px', md: '120px'}}
          >
            <SubtitleComponent text='TRANSPORTE DE CARGA COMPLETA' />

            <Flex
              color='#707070'
              textAlign='justify'
              flexDir={{ base: 'column', md: 'row' }}
              w='100%'
              justifyContent='space-between'
              mt={{ base: '10px', md: '30px' }}
            >
              <Flex flexDir='column' width={{ base: '100%', md: '49%' }} className='font-logo'>
                <Flex flex='inline'>
                  <Box
                    marginRight='10px'
                    color='black'
                    display='inline'
                  >
                    <Box fontWeight={800} color={ALTAVIA_COLORS.primary} fontSize={{ base: '14px', md: '20px' }} display='inline'>
                      ALTAVÍA PERÚ
                    </Box>
                    <Box ml='10px' color={ALTAVIA_COLORS.black} fontSize={{ base: '14px', md: '18px' }} fontWeight={600} display='inline'>
                      Transporte exclusivo para un solo cliente que necesita usar todo el espacio del camión.
                      Se garantiza mayor seguridad, rapidez y menor manipulación de la mercancía.
                    </Box>
                  </Box>
                </Flex>

                {!isMobile && (
                  <Box as='p' mt={{ base: '15px', md: '25px' }} color={ALTAVIA_COLORS.black} fontWeight={600} fontSize={{ base: '14px', md: '18px' }} display='inline'>
                    Este servicio está diseñado para cargas sensibles, urgentes o de alto valor, donde
                    la prioridad es minimizar riesgos y optimizar tiempos de entrega. Ofrecemos unidades dedicadas,
                    rutas directas y atención personalizada desde el origen hasta el destino final,
                    asegurando total confidencialidad y control sobre el proceso logístico.
                  </Box>
                )}
              </Flex>

              <Flex
                width={{ base: '100%', md: '49%' }}
                justifyContent={{ base: 'center', md: 'end' }}
                marginTop={{ base: '20px', md: '4px' }}
                marginBottom={{ base: '0px', md: '40px' }}
              >
                <Image
                  src='/img/services/transporte-de-carga-completa.png'
                  rounded='10px'
                  border={`2px solid ${ALTAVIA_COLORS.lightPrimary}`}
                  alt='transporte de carga completa'
                  width={{ base: '100%', md: '100%' }}
                  height={{ base: '200px', md: '300px' }}
                  paddingX={{base: '0px', md: '0px'}}
                />
              </Flex>
            </Flex>
          </Flex>


        </Flex>
      </Flex>
    </PortalLayout>
  )
}
