import React from 'react'
import { Button, Flex, Text } from '@chakra-ui/react'
import { useScreenSize } from 'src/common/hooks'
import { useRouter } from 'next/navigation'
import { ALTAVIA_COLORS, CONSTROAD_COLORS } from 'src/styles/shared'
import { ALTAVIA } from 'src/common/consts'

interface ServiceCardProps {
  service: any
}

export const ServiceCard = (props: ServiceCardProps) => {
  const { service } = props;
  const { isMobile } = useScreenSize();
  const router = useRouter();

  return (
    <Flex
      w='100%'
      h={{ base: '230px', md: '250px' }}
      _hover={{
        '& > .child1': {
          width: '60%',
          transition: 'width 0.5s',
        },
        '& > .child1 > .child3': {
          opacity: 0,
          transition: 'opacity 0.5s'
        },
        '& > .child2': {
          w: isMobile ? '60%' : '40%',
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
          transition: 'clip-path 0.5s',
        },
      }}
      rounded='10px'
      overflow='hidden'
      position='relative'
      justifyContent='end'
      className='font-logo'
      border={`2px solid ${ALTAVIA_COLORS.primary}`}
    >
       <Flex
        w={{ base: '60%', md: '40%' }}
        className='child2'
        bg='black'
        color='white'
        flexDir='column'
        overflow='hidden'
        clipPath="polygon(0 0, 0 0, 0 100%, 0 100%)"
        transition="clip-path 0.5s"
        transformOrigin="right"
        zIndex={100}
        position='absolute'
        left={0}
        h='100%'
        px='15px'
        py='15px'
        justifyContent='center'
      >
        <Text className='font-logo' fontWeight={600} fontSize={{ base: 20, md: 24 }}>{service.title}</Text>
        <Text mt='10px' className='font-logo' fontSize={{ base: 14, md: 16 }}>{service.shortDescription}</Text>
        <Button
          mt='10px'
          size='sm'
          bg='transparent'
          rounded='10px'
          border='2px solid white'
          color='white'
          w='50%'
          _hover={{ color: 'black', bg: 'white' }}
          onClick={() => router.push(service.redirect)}
          fontSize={{ base: 14, md: 16 }}
          fontWeight={600}
          pt='5px'
        >
          Ver más...
        </Button>
      </Flex>
      <Flex
        w="100%"
        h='100%'
        className='child1'
        backgroundImage={`url(${service.image})`}
        backgroundSize="cover"
        backgroundPosition='center'
        backgroundRepeat="no-repeat"
        position='relative'
        transition='width 0.5s'
      >
        <Flex
          className='child3'
          position='absolute'
          bg={ALTAVIA_COLORS.primary}
          color='white'
          fontWeight={600}
          rounded='10px'
          py='5px'
          px='15px'
          top='10px'
          left='10px'
          opacity={1}
          transition='opacity 1.2s'
          fontSize={{ base: 16, md: 18 }}
          pt='10px'
        >
          {service.title}
        </Flex>
      </Flex>
    </Flex>
  )
}
