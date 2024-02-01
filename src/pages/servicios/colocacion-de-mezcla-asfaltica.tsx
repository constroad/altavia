
import { Box, Flex, Image, Text } from '@chakra-ui/react'
import React from 'react'
import { WebLayout } from 'src/components'

const ColocacionMezclaAsfaltica = () => {
  return (
    <WebLayout>
      <Flex width='100%' height='max-content' alignItems='center'>
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
              Colocación de mezcla asfáltica
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
                Le ofrece un excelente servicio de pavimentación y todo lo relacionado a la aplicación de nuestros productos
                asfálticos como la colocación de mezcla asfáltica
              </Text>
              <Text mt='10px'>
                La carpeta asfáltica es la parte superior del pavimento flexible que proporciona la superficie de rodamiento,
                es elaborada con material pétreo seleccionado y un producto asfáltico dependiendo del tipo de camino que se
                va a construir
              </Text>
            </Box>
          </Flex>

          <Flex
            width={{ base: '100%', md: '49%' }}
            justifyContent={{ base: 'center', md: 'center' }}
            marginTop={{ base: '20px', md: '0px' }}
          >
            <Image
              src='/img/carousel/constroad2.jpeg'
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

export default ColocacionMezclaAsfaltica