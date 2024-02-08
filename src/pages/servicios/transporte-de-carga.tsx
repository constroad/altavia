
import { Box, Flex, Image, Text } from '@chakra-ui/react'
import React from 'react'
import { PortalLayout } from 'src/components'

const ColocacionMezclaAsfaltica = () => {
  return (
    <PortalLayout>
      <Flex width='100%' minHeight='100vh - 325px'>
        <Flex
          flexDir={{ base: 'column', md: 'row' }}
          width={{ base: '100%', md: '90%' }}
          marginX='auto'
          justifyContent='space-between'
        >
          <Flex
            flexDir='column'
            width={{ base: '100%', md: '40%' }}
            paddingX={{base: '30px', md: '0px'}}
          >
            <Text as='h2' fontSize={{ base: 25, md: 36 }} fontWeight={700} color='black' lineHeight={{ base: '28px', md: '39px' }} >
              Transporte de carga por carretera
            </Text>
            <Box color='#707070' opacity={0.8} marginTop={{ base: '25px', md: '40px'}} textAlign='justify' className='font-roboto'>
              <Text
                marginRight='10px'
                color='black'
                fontWeight={500}
                display='inline'
              >
                CONSTROAD
              </Text>
              <Text display='inline'>
                Cuenta con prefesionales que conocen las principales rutas locales, con eso mejoramos el tiempo de los recojos
                y entregas de los envíos de nuestros clientes.
              </Text>
              <Text mt='10px'>
                Nuestra flota puede atender los requerimientos de nuestros clientes, brindando la calidad y seguridad, que es
                la marca registrada de nuestros servicios.
              </Text>
            </Box>
          </Flex>

          <Flex
            width={{ base: '100%', md: '49%' }}
            justifyContent={{ base: 'center', md: 'center' }}
            marginTop={{ base: '20px', md: '0px' }}
          >
            <Image
              src='/img/mision.jpeg'
              alt='quienessomos-logo'
              width={{ base: '100%', md: '530px' }}
              height={{ base: '200px', md: '300px' }}
              paddingX={{base: '30px', md: '0px'}}
            />
          </Flex>

        </Flex>
      </Flex>
    </PortalLayout>
  )
}

export default ColocacionMezclaAsfaltica