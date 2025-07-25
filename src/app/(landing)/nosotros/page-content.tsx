'use client'

import React from 'react'
import { Box, Flex, Image, Text } from '@chakra-ui/react';
import { useScreenSize } from 'src/common/hooks';
import { SubtitleComponent, nosotrosConfig } from 'src/components';

export default function NosotrosPage() {
  const { isMobile } = useScreenSize()
  return (
    <Box>
      <Flex width='100%' mt={{ base: '20px', md: '50px'}} flexDir='column' pb='30px'>
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
                  <Box fontWeight={800} color='primary' fontSize={{ base: '14px', md: '20px' }} display='inline'>
                    ALTAVÍA PERÚ
                  </Box>
                  <Box ml='10px' color='black' fontSize={{ base: '14px', md: '18px' }} fontWeight={600} display='inline'>
                    es una empresa peruana especializada en transporte de carga por carretera, con experiencia en el rubro y una sólida
                    reputación construida sobre la base del trabajo honesto, eficiente y comprometido. Cuenta con una moderna flota de
                    camiones equipada con sistemas de rastreo GPS, unidades acondicionadas para distintos tipos de carga, y un equipo
                    humano capacitado en logística, conducción, mantenimiento y atención al cliente.
                  </Box>
                </Box>
              </Flex>

              {!isMobile && (
                <Box as='p' mt={{ base: '15px', md: '25px' }} color='black' fontWeight={600} fontSize={{ base: '14px', md: '18px' }} display='inline'>
                  Atendemos a empresas de distintos sectores como agroindustria, construcción, minería, comercio, alimentos y manufactura.
                  Y nos diferenciamos en el mercado por brindar un servicio personalizado, entendiendo las necesidades específicas de cada
                  cliente y ofreciendo soluciones logísticas que optimizan tiempo y costos.
                </Box>
              )}
            </Flex>

            <Flex
              width={{ base: '100%', md: '49%' }}
              justifyContent={{ base: 'center', md: 'end' }}
              marginTop={{ base: '20px', md: '6px' }}
            >
              <Image
                src='/img/web/quienessomos2.png'
                rounded='10px'
                border={`2px solid primary.400`}
                alt='quienes-somos-logo'
                width={{ base: '100%', md: '100%' }}
                height={{ base: '200px', md: '350px' }}
                paddingX={{base: '0px', md: '0px'}}
              />
            </Flex>
          </Flex>
        </Flex>

        <Flex mt={{ base: '15px', md: '100px' }} paddingX={{base: '30px', md: '120px'}}>
          <Flex width='100%' justifyContent='space-between' flexDir={{ base: 'column', md: 'row' }} >
            {nosotrosConfig.map(item => (
              <Flex
                key={item.title}
                width={{ base: '100%', md: '32.5%' }}
                h={{ base: '250px', md: '280px' }}
                rounded='10px'
                justifyContent='start'
                py='15px'
                px='20px'
                mt={{ base: '10px', md: item.mt }}
                flexDir='column'
                bg={item.bgColor}
                transition="margin-top 0.3s"
                border={'3px solid'}
                borderColor={'primary.400'}
                _hover={{
                  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.4)",
                  mt: isMobile ? '15px' : `${item.hoverMt}`,
                  border: `3px solid`,
                  borderColor: 'primary.400'
                }}
                className='font-logo'
              >
                <Flex alignItems='center' gap='8px' fontSize={30}>
                  <Text
                    className='font-logo'
                    fontWeight={700}
                    fontSize={{ base: 20, md: 25 }}
                    mt='10px'
                    color={ item.title === 'Negocio' ? 'white' : 'black'}
                  >
                    {item.title}
                  </Text>
                  <item.icon fontSize={60} color={item.textColor} />
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
    </Box>
  )
}
