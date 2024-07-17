import React from 'react'
import { Flex, Image, Text } from '@chakra-ui/react'
import { useScreenSize } from 'src/common/hooks'
import { PortalLayout, SubtitleComponent, serviciosConfig } from 'src/components'

export const SenalizacionVial = () => {
  const { isDesktop } = useScreenSize()
  return (
    <PortalLayout>
      <Flex width='100%' pb='20px'>
        <Flex
          flexDir={{ base: 'column', md: 'row' }}
          width={{ base: '100%', md: '90%' }}
          marginX='auto'
          justifyContent='space-between'
        >
          <Flex
            flexDir='column'
            width={{ base: '100%', md: '100%' }}
            paddingX={{base: '30px', md: '0px'}}
          >
            <SubtitleComponent text='SEÑALIZACIÓN VIAL' />
            <Flex color='#707070' opacity={0.8} mt={{ base: '15px', md: '20px'}} textAlign='justify' className='font-roboto' flexDir={{ base: 'column', md: 'column' }} w='100%' justifyContent='space-between'>
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
                  Ofrecemos soluciones completas de señalización vial para garantizar la seguridad y la eficiencia del tráfico.
                  Entendemos la importancia de una correcta señalización para el flujo vehicular y la protección de peatones,
                  por lo que utilizamos materiales duraderos y técnicas avanzadas para instalar señales y marcas viales claras y visibles
                </Flex>
                {isDesktop && (
                  <>
                    <Text mt='10px' fontSize={{ base: 14, md: 16 }} className='font-logo'>
                      Ya sea para carreteras, estacionamientos o áreas urbanas, nuestro equipo se asegura de cumplir con todas las normativas y estándares de calidad.`,
                    </Text>
                  </>
                )}
              </Flex>

              <Flex
                width={{ base: '100%', md: '100%%' }}
                justifyContent={{ base: 'center', md: 'center' }}
                marginTop={{ base: '20px', md: '10px' }}
              >
                <Flex flexDir={{ base: 'column', md: 'row' }} gap='15px' mt={{ base: '', md: '20px' }} w='100%' justifyContent={{ base: 'space-between', md: 'space-around' }}>
                  <Image
                    src={serviciosConfig[2].image}
                    alt='quienessomos-logo'
                    width={{ base: '100%', md: '32%' }}
                    height={{ base: '170px', md: '200px' }}
                    rounded='10px'
                    border='1px solid black'
                    mt='0px'
                    transition="margin-top 0.3s"
                    _hover={{ mt: '-10px', border: '2px solid black' }}
                  />
                  <Image
                    src='/img/segnalizacion-vial2.jpg'
                    alt='señalizacion-vial-2'
                    width={{ base: '100%', md: '32%' }}
                    height={{ base: '170px', md: '200px' }}
                    rounded='10px'
                    border='1px solid black'
                    mt='0px'
                    transition="margin-top 0.3s"
                    _hover={{ mt: '-10px', border: '2px solid black' }}
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

export default SenalizacionVial
