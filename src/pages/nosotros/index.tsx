import { Box, Flex, Image, Text } from '@chakra-ui/react';
import React from 'react'
import { useScreenSize } from 'src/common/hooks';
import { PortalLayout, SubtitleComponent, nosotrosConfig } from 'src/components';

export const NosotrosPage = () => {
  const { isMobile } = useScreenSize()
  return (
    <PortalLayout noPaddingTop>
      <Flex width='100%' mt={{ base: '20px', md: '40px'}} flexDir='column' pb='30px'>
        <Flex
          flexDir='column'
          width={{ base: '100%', md: '100%' }}
          paddingX={{base: '30px', md: '120px'}}
        >
          <SubtitleComponent text='NOSOTROS' />
          {!isMobile && (
            <Text as='h2' fontSize={{ base: 16, md: 22 }} fontWeight={700} color='black' className='font-logo' mt={{ base: '5px', md: '5px' }}>
              ¿QUIÉNES SOMOS?
            </Text>
          )}
          <Flex color='#707070' textAlign='justify' flexDir={{ base: 'column', md: 'row' }} w='100%' justifyContent='space-between' mt={{ base: '10px', md: '0px' }}>
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
                  <Box className='ml-[6px] text-[#707070]' fontSize={{ base: '14px', md: '16px' }} display='inline' >
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
              marginTop={{ base: '10px', md: '0px' }}
            >
              <Image
                src='/img/carousel/presentacion.png'
                rounded='10px'
                alt='quienes-somos-logo'
                width={{ base: '100%', md: '100%' }}
                height={{ base: '200px', md: '240px' }}
                paddingX={{base: '0px', md: '0px'}}
              />
            </Flex>
          </Flex>
        </Flex>

        <Flex mt={{ base: '15px', md: '30px' }} paddingX={{base: '30px', md: '120px'}}>
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
                className='font-logo'
              >
                <Flex alignItems='center' gap='8px'>
                  <Text className='font-logo' fontWeight={700} fontSize={{ base: 20, md: 25 }} mt='10px' color={item.textColor}>
                    {item.title}
                  </Text>
                  <item.icon fontSize={30} color={item.textColor} />
                </Flex>
                <Flex flexDir='column'>
                  <Text w='100%' color={item.textColor} fontSize={{ base: '14px', md: '16px' }}>
                    {item.content}
                  </Text>
                </Flex>
              </Flex>
            ))}
          </Flex>
        </Flex>
      </Flex>
    </PortalLayout>
  )
}

export default NosotrosPage;
