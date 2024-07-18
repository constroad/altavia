
import React from 'react'
import { Flex, Image, Text } from '@chakra-ui/react'
import { useScreenSize } from 'src/common/hooks'
import { PortalLayout, SubtitleComponent, serviciosConfig } from 'src/components'
import { proyectsImages } from 'src/components/layout/Portal/config'

const ColocacionMezclaAsfaltica = () => {
  const { isDesktop } = useScreenSize()
  return (
    <PortalLayout>
      <Flex width='100%' pb='20px'>
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
            <SubtitleComponent text='COLOCACIÓN DE MEZCLA ASFÁLTICA' fontsize={20} />
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
                  Le ofrece un excelente servicio de colocación de mezcla asfáltica y todo lo relacionado a la aplicación de nuestros productos
                  asfálticos en pavimentación.
                </Flex>
                {isDesktop && (
                  <>
                    <Text mt='10px' fontSize={{ base: 14, md: 16 }} className='font-logo'>
                      La carpeta asfáltica es la parte superior del pavimento flexible que proporciona la superficie de rodamiento,
                      es elaborada con material pétreo seleccionado y un producto asfáltico dependiendo del tipo de camino que se
                      va a construir
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
                    src={serviciosConfig[1].image}
                    alt='quienessomos-logo'
                    width={{ base: '100%', md: '32%' }}
                    height={{ base: '170px', md: '200px' }}
                    rounded='20px'
                    mt='0px'
                    transition="margin-top 0.3s"
                    _hover={{ mt: '-10px' }}
                  />
                  <Image
                    src={proyectsImages[3].url}
                    alt='quienessomos-logo'
                    width={{ base: '100%', md: '32%' }}
                    height={{ base: '170px', md: '200px' }}
                    rounded='20px'
                    mt='0px'
                    transition="margin-top 0.3s"
                    _hover={{ mt: '-10px' }}
                  />
                  <Image
                    src={proyectsImages[2].url}
                    alt='quienessomos-logo'
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

export default ColocacionMezclaAsfaltica