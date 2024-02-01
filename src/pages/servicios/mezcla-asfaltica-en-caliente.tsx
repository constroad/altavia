
import { Box, Flex, Image, Text } from '@chakra-ui/react'
import React from 'react'
import { WebLayout } from 'src/components'

const MezclaAsfaltica = () => {
  return (
    <WebLayout>
      <Flex width='100%'>
        <Flex
          flexDir={{ base: 'column', md: 'row' }}
          width={{ base: '100%', md: '90%' }}
          marginX='auto'
          justifyContent='space-between'
        >
          <Flex
            flexDir='column'
            width={{ base: '100%', md: '48%' }}
            paddingX={{base: '30px', md: '0px'}}
          >
            <Text as='h2' fontSize={{ base: 25, md: 36 }} fontWeight={700} color='black' lineHeight={{ base: '28px', md: '39px' }} >
              Mezcla asfáltica en caliente
            </Text>
            <Box color='#707070' opacity={0.8} marginTop={{ base: '25px', md: '35px'}} textAlign='justify' className='font-roboto'>
              <Text
                marginRight='10px'
                color='black'
                fontWeight={500}
                display='inline'
              >
                CONSTROAD
              </Text>
              <Text display='inline'>
                Pone a disposición su servicio de venta de mezcla asfáltica en caliente gracias a nuestra planta asfáltica
                que nos permite un volumen de producción de asfalto capaz de satisfacer las necesidades de nuestros clientes atendiéndolos de
                manera continua y manteniendo nuestra calidad y los mas rigurosos controles de calidad
              </Text>
              <Text mt='10px'>
                Las mezclas asfálticas en caliente se utilizan como capa de rodadura en el pavimento, teniendo como principal función brindar
                resistencia al paso de los vehículos y confort a los usuarios de la vía.
              </Text>
              <Text mt='10px'>
                Tenemos el mejor asfalto en caliente del mercado, asfalto en caliente puesto en obra, nuestros asfaltos en caliente cumplen
                los estándares de calidad para un optimo resultado 100% garantizado, Asfalto en caliente para Pistas y Carreteras, asfalto
                en Lima – Perú. – venta de mezcla asfáltica
              </Text>
            </Box>
          </Flex>

          <Flex
            width={{ base: '100%', md: '49%' }}
            justifyContent={{ base: 'center', md: 'center' }}
            marginTop={{ base: '20px', md: '0px' }}
          >
            <Image
              src='/img/carousel/constroad1.jpeg'
              alt='quienessomos-logo'
              width={{ base: '100%', md: '530px' }}
              height={{ base: '200px', md: '300px' }}
              paddingX={{base: '30px', md: '0px'}}
            />
          </Flex>

        </Flex>
      </Flex>
    </WebLayout>
  )
}

export default MezclaAsfaltica