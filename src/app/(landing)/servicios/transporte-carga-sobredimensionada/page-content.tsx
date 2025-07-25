'use client'

import React from 'react'
import { Box, Flex, Image, Text } from '@chakra-ui/react'
import { useScreenSize } from 'src/common/hooks'
import { SubtitleComponent } from 'src/components'

export default function CargaSobredimensionada() {
  const { isMobile } = useScreenSize()
  return (
    <Box pt={{ base: '20px', md: '50px' }}>
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
            <SubtitleComponent text='TRANSPORTE DE CARGA SOBREDIMENSIONADA' />

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
                    <Box fontWeight={800} color='primary' fontSize={{ base: '14px', md: '20px' }} display='inline'>
                      ALTAVÍA PERÚ
                    </Box>
                    <Box ml='10px' color='black' fontSize={{ base: '14px', md: '18px' }} fontWeight={600} display='inline'>
                      Servicio especializado para trasladar cargas que exceden las dimensiones o pesos estándar,
                      como maquinaria pesada, estructuras industriales o equipos de gran volumen. Requiere planificación de rutas,
                      permisos especiales y experiencia en maniobras seguras.
                    </Box>
                  </Box>
                </Flex>

                {!isMobile && (
                  <Box as='p' mt={{ base: '15px', md: '25px' }} color='black' fontWeight={600} fontSize={{ base: '14px', md: '18px' }} display='inline'>
                    Contamos con unidades acondicionadas para este tipo de transporte, personal capacitado y
                    el respaldo técnico necesario para cumplir con las exigencias legales y operativas.
                    Garantizamos una ejecución segura y eficiente, minimizando riesgos y asegurando la
                    integridad de la carga desde el punto de partida hasta su destino final.
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
                  src='/img/services/transporte-de-carga-sobredimensionada.jpg'
                  rounded='10px'
                  border='2px solid primary'
                  alt='transporte de carga sobredimensionada'
                  width={{ base: '100%', md: '100%' }}
                  height={{ base: '200px', md: '300px' }}
                  paddingX={{base: '0px', md: '0px'}}
                />
              </Flex>
            </Flex>
          </Flex>


        </Flex>
      </Flex>
    </Box>
  )
}
