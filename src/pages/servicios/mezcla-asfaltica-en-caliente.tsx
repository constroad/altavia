
import React from 'react'
import { Flex, Image, Text } from '@chakra-ui/react'
import { PortalLayout, SubtitleComponent, serviciosConfig } from 'src/components'
import { useScreenSize } from 'src/common/hooks'

const MezclaAsfaltica = () => {
  const { isDesktop } = useScreenSize()
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
            <SubtitleComponent text='MEZCLA ASFÁLTICA EN CALIENTE' />
            <Flex color='#707070' opacity={0.8} mt={{ base: '15px', md: '15px'}} textAlign='justify' className='font-roboto' flexDir={{ base: 'column', md: 'column' }} w='100%' justifyContent='space-between'>
              <Flex flexDir='column' w={{ base: '100%', md: '100%' }}>
                <Flex display='inline' fontSize={{ base: 14, md: 16 }} className='font-logo'>
                  <Text
                    marginRight='10px'
                    color='black'
                    fontWeight={600}
                    display='inline'
                    fontSize={{ base: 14, md: 16 }}
                  >
                    CONSTROAD
                  </Text>
                  Pone a disposición la venta de mezcla asfáltica en caliente gracias a nuestra planta asfáltica
                  que nos permite un volumen de producción de asfalto capaz de satisfacer las necesidades de nuestros clientes atendiéndolos de
                  manera continua y manteniendo nuestra calidad y los mas rigurosos controles de calidad
                </Flex>
                {isDesktop && (
                  <>
                    <Text mt='10px' fontSize={{ base: 14, md: 16 }} className='font-logo'>
                      Las mezclas asfálticas en caliente se utilizan como capa de rodadura en el pavimento, teniendo como principal función brindar
                      resistencia al paso de los vehículos y confort a los usuarios de la vía.
                    </Text>
                    <Text mt='10px' fontSize={{ base: 14, md: 16 }} className='font-logo'>
                      Tenemos el mejor asfalto en caliente del mercado, asfalto en caliente puesto en obra, nuestros asfaltos en caliente cumplen
                      los estándares de calidad para un optimo resultado 100% garantizado, Asfalto en caliente para Pistas y Carreteras, asfalto
                      en Lima – Perú. – venta de mezcla asfáltica
                    </Text>
                  </>
                )}
              </Flex>

              <Flex
                width={{ base: '100%', md: '100%%' }}
                justifyContent={{ base: 'center', md: 'center' }}
                marginTop={{ base: '20px', md: '10px' }}
              >
                <Flex flexDir={{ base: 'column', md: 'row' }} gap='15px' mt={{ base: '', md: '20px' }} w='100%' justifyContent='space-between'>
                  <Image
                    src='/img/carousel/produccion-madrugada.png'
                    alt='produccion-constroad-madrugada'
                    width={{ base: '100%', md: '32%' }}
                    height={{ base: '170px', md: '200px' }}
                    rounded='20px'
                    mt='0px'
                    transition="margin-top 0.3s"
                    _hover={{ mt: '-10px' }}
                  />
                  <Image
                    src='/img/carousel/produccion-dia.png'
                    alt='produccion-constroad-dia'
                    width={{ base: '100%', md: '32%' }}
                    height={{ base: '170px', md: '200px' }}
                    rounded='20px'
                    mt='0px'
                    transition="margin-top 0.3s"
                    _hover={{ mt: '-10px' }}
                  />
                  <Image
                    src='/img/carousel/produccion-noche.png'
                    alt='produccion-constroad-noche'
                    width={{ base: '100%', md: '32%' }}
                    height={{ base: '170px', md: '200px' }}
                    rounded='20px'
                    mt='0px'
                    transition="margin-top 0.3s"
                    _hover={{ mt: '-10px' }}
                  />
                </Flex>
              </Flex>
            </Flex>
          </Flex>


        </Flex>
      </Flex>
    </PortalLayout>
  )
}

export default MezclaAsfaltica