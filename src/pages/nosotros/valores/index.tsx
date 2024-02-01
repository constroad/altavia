
import { Box, Flex, Image, Text } from '@chakra-ui/react'
import React from 'react'
import { WebLayout } from 'src/components'

const Valores = () => {
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
            <Text as='h2' fontSize={{ base: 25, md: 36 }} fontWeight={700} color='black'>
              VALORES
            </Text>
            <Box as='ul' marginLeft='12px' color='#707070'>
              <Box as='li' listStyleType='disc'>
                Orientación al cliente.
              </Box>
              <Box as='li' listStyleType='disc'>
                Innovación.
              </Box>
              <Box as='li' listStyleType='disc'>
                Excelencia.
              </Box>
              <Box as='li' listStyleType='disc'>
                Flexibilidad.
              </Box>
              <Box as='li' listStyleType='disc'>
                Ética.
              </Box>
              <Box as='li' listStyleType='disc'>
                Pasión y Compromiso.
              </Box>
              <Box as='li' listStyleType='disc'>
                Trabajo en Equipo.
              </Box>
              <Box as='li' listStyleType='disc'>
                Humildad.
              </Box>
            </Box>
          </Flex>

          <Flex
            width={{ base: '100%', md: '49%' }}
            justifyContent={{ base: 'center', md: 'center' }}
            marginTop={{ base: '20px', md: '0px' }}
          >
            <Image
              src='/img/valores.jpeg'
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

export default Valores