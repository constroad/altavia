import { useRouter } from 'next/router'

import { Button, Flex, Image, Link, Text } from '@chakra-ui/react'
import { APP_ROUTES } from 'src/common/consts';
import { signOut, useSession } from 'next-auth/react';
import { toast } from 'src/components/Toast';
import { useScreenSize } from 'src/common/hooks';
import { CONSTROAD_COLORS } from 'src/styles/shared';

export const IntranetNavbar = () => {
  const router = useRouter()
  const { data: session } = useSession()
  const { isDesktop } = useScreenSize()

  const handleSignOut = async() => {
    await signOut({redirect: false});
    router.push(APP_ROUTES.home)
    toast.info('Cerraste sesión');
  }

  return (
    <Flex width='100%' height={{ base: '65px', md: '90px' }}>
      <Flex
        as='header'
        height={{ base: '65px', md: '90px' }}
        paddingX={{ base: '30px', md: '120px' }}
        alignItems='center'
        justifyContent='space-between'
        backgroundColor='white'
        position='fixed'
        left='0'
        top='0'
        zIndex={1000}
        width={{ base: '100vw', md: '100vw' }}
        marginX='auto'
        boxShadow="0px 2px 4px rgba(0, 0, 0, 0.1)"
      >
        <Flex
          as='h1'
          cursor='pointer'
          width={{ base: '160px', md: 'fit-content' }}
          alignItems='center'
          justifyContent='center'
        >
          <Link href={APP_ROUTES.home} title='Constroad | Planta de asfalto' _hover={{ textDecoration: 'none' }}>
            <Flex w='fit-content' h={{base: '65px', md:'90px'}} rounded='6px' justifyContent='center' alignItems='center' flexDir={{ base: 'row', md: 'column'}} gap={{ base: '6px', md: '0px' }}>
              <Image src='/constroad.jpeg' width={{ base: '26px', md: '32px' }} h={{ base: '26px', md: '32px' }} alt='constroad-logo' rounded='4px' />
              <Text className='font-logo' fontWeight={650} fontSize={{ base: 25, md: 30 }} lineHeight={{ base: '25px', md: '30px' }} textAlign='end' pt={{base: '8px', md: '5px'}}>
                ConstRoad
              </Text>
              {isDesktop && (
                <Text className='font-logo' fontWeight={650} fontSize={16} lineHeight='16px' textAlign='center' textDecoration='none' color={CONSTROAD_COLORS.darkYellow} h='10p'>
                  Planta de Asfalto
                </Text>
              )}
            </Flex>
          </Link>

        </Flex>
        
        {session && (
          <Flex gap='10px' alignItems='center'>
            {isDesktop && (
              <Text fontWeight={600} fontSize={{base: 10, md: 13}}>Bienvenido: Admin</Text>
            )}
            <Button
              fontWeight={600}
              width={{ base: '100px', md: '100px' }}
              height={{base: '25px', md: '35px'}}
              color='white'
              onClick={handleSignOut}
              bg="black"
              fontSize={{base: 12, md: 14}}
              _hover={{opacity: 0.7}}
            >
              Cerrar sesión
            </Button>
          </Flex>
        )}
      </Flex>
    </Flex>
  )
}
