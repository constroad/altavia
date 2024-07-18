import React from 'react'
import { Flex, Image, Text } from '@chakra-ui/react'
import { useScreenSize } from 'src/common/hooks'
import { PortalLayout, SubtitleComponent, serviciosConfig } from 'src/components'

export const AlquilerPlantaAsfaltica = () => {
  const { isDesktop } = useScreenSize()
  return (
    <PortalLayout>
      <Flex width='100%' pb='10px'>
        <Flex
          flexDir={{ base: 'column', md: 'row' }}
          width={{ base: '100%', md: '100%' }}
          justifyContent='space-between'
        >
          <Flex
            flexDir='column'
            width={{ base: '100%', md: '100%' }}
            paddingX={{base: '30px', md: '120px'}}
          >
            <SubtitleComponent text='ALQUILER DE PLANTA DE ASFALTO' />
            <Flex color='#707070' opacity={0.8} mt={{ base: '15px', md: '15px'}} textAlign='justify' className='font-roboto' flexDir={{ base: 'column', md: 'column' }} w='100%' justifyContent='space-between'>
              <Flex flexDir='column' w={{ base: '100%', md: '100%' }}>
                <Flex display='inline' fontSize={{ base: 14, md: 16 }} className='font-logo'>
                  Ofrecemos el servicio de alquiler de nuestra planta de asfalto para satisfacer las necesidades de producción temporal de su proyecto.
                  Nuestra planta está equipada con tecnología avanzada para garantizar una producción eficiente y de alta calidad.
                </Flex>
                {isDesktop && (
                  <>
                    <Text mt='10px' fontSize={{ base: 14, md: 16 }} className='font-logo'>
                      Con nuestro apoyo técnico especializado, usted puede aumentar su capacidad de producción sin la necesidad de una inversión a largo plazo.
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
                    src={serviciosConfig[3].image}
                    alt='quienessomos-logo'
                    width={{ base: '100%', md: '32%' }}
                    height={{ base: '170px', md: '200px' }}
                    rounded='20px'
                    mt='0px'
                    transition="margin-top 0.3s"
                    _hover={{ mt: '-10px'}}
                  />
                  <Image
                    src='/img/carousel/3.png'
                    alt='señalizacion-vial-2'
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

export default AlquilerPlantaAsfaltica
