import { Box, Flex, Image, Text } from '@chakra-ui/react'

import { WebLayout } from 'src/components'
import { CarouselComponent } from 'src/components/layout/Carousel'

const Home = () => {
  return (  
    <WebLayout noPaddingTop >
      <CarouselComponent />
      <Flex width='100%' mt={{ base: '40px', md: '50px'}}>
        <Flex
          flexDir={{ base: 'column', md: 'row' }}
          width='100%'
          paddingX={{ base: '', md: '70px' }}
          marginX='auto'
          justifyContent='space-between'
        >
          <Flex
            flexDir='column'
            width={{ base: '100%', md: '49%' }}
            paddingX={{base: '30px', md: '0px'}}
          >
            <Text as='h2' fontSize={{ base: 25, md: 36 }} fontWeight={700} color='black'>
              ¿QUIÉNES SOMOS?
            </Text>
            <Box color='#707070' opacity={0.8} marginTop='10px' textAlign='justify' className='font-roboto'>
              <Box
                as='p'
                marginRight='10px'
                color='black'
                fontWeight={500}
                display='inline'
              >
                CONSTROAD
              </Box>

              Es una empresa líder en el sector de la construcción de infraestructura vial, ya que contamos con instalaciones propias para fabricar los materiales necesarios
              (cantera de áridos y planta de aglomerados) así como con los medios precisos para abarcar todo tipo de obras asfálticas con la
              mayor calidad y prontitud ya que contamos una amplia flota de maquinaria especializada en pavimentaciones asfálticas.

              <Box as='p' mt='24px'>
                La mejora continua hace que seamos una empresa con un espíritu joven, innovador y responsable con nuestros clientes. Buscamos afrontar el futuro con
                los principios de esfuerzo, responsabilidad, innovación y deseos de crecimiento.  Por otro lado, nos preocupamos por la seguridad de nuestro equipo humano y 
                de nuestro medio ambiente por lo que nuestro personal recibe capacitación en forma constante y completa
              </Box>
            </Box>
          </Flex>

          <Flex
            width={{ base: '100%', md: '49%' }}
            justifyContent={{ base: 'center', md: 'end' }}
            marginTop={{ base: '20px', md: '0px' }}
          >
            <Image
              src='/img/quienessomos.jpeg'
              alt='quienessomos-logo'
              width={{ base: '100%', md: '400px' }}
              height={{ base: '200px', md: '300px' }}
              paddingX={{base: '30px', md: '0px'}}
            />
          </Flex>
        </Flex>
      </Flex>
    </WebLayout>
  )
}

export default Home