import { useRouter } from 'next/router'

import { Button, Flex, Image, Link, Text } from '@chakra-ui/react'
import { APP_ROUTES } from 'src/common/consts';
import { signOut, useSession } from 'next-auth/react';
import { toast } from 'src/components/Toast';

export const IntranetNavbar = () => {
  const router = useRouter()
  const path = router.pathname
  const { data: session } = useSession()

  const handleSignOut = async() => {
    await signOut({redirect: false});
    router.push(APP_ROUTES.home)
    toast.info('Cerraste sesión');
  }

  return (
    <Flex width='100%' height={{ base: '65px', md: '95px' }}>
      <Flex
        as='header'
        height={{ base: '65px', md: '95px' }}
        paddingX={{ base: '30px', md: '70px' }}
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
          width={{ base: '130px', md: '230px' }}
          alignItems='center'
          justifyContent='center'
        >
          <Link href={APP_ROUTES.home} title='Constroad | Planta de asfalto'>
            <Image src='/img/constroad-logo.svg' width='80%' alt='constroad-logo' rounded='4px' />
          </Link>
        </Flex>
        
        {session && (
          <Flex gap='20px' alignItems='center'>
            <Text fontWeight={600} fontSize={{base: 10, md: 'normal'}}>Bienvenido: Admin</Text>
            <Button
              fontWeight={500}
              height={{base: '25px', md: '40px'}}
              color='white'
              onClick={handleSignOut}
              colorScheme="blue"
              fontSize={{base: 10, md: 'normal'}}
            >
              Logout
            </Button>
          </Flex>
        )}
      </Flex>
    </Flex>
  )
}
