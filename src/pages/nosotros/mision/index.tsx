
import { Flex, Image, Text } from '@chakra-ui/react'
import React from 'react'
import { WebLayout } from 'src/components'

const Mision = () => {
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
              MISIÓN
            </Text>
            <Text color='#707070' opacity={0.8} marginTop='10px' textAlign='justify' className='font-roboto'>
              Nuestra Misión es convertirnos una empresa altamente competitiva en el rubro de construcción, capaz de brindar soluciones asfálticas
              para pavimentos de calidad con un capital humano calificado
            </Text>
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
    </WebLayout>
  )
}

export default Mision