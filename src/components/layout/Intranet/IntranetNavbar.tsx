import { useRouter } from 'next/router'

import { Button, Flex, Image, Link, Text } from '@chakra-ui/react'
import { APP_ROUTES } from 'src/common/consts';
import { signOut, useSession } from 'next-auth/react';
import { toast } from 'src/components/Toast';

export const IntranetNavbar = () => {
  const router = useRouter()
  const { data: session } = useSession()

  const handleSignOut = async() => {
    await signOut({redirect: false});
    router.push(APP_ROUTES.home)
    toast.info('Cerraste sesión');
  }

  return (
    <Flex width='100%' height={{ base: '55px', md: '70px' }}>
      <Flex
        as='header'
        height={{ base: '55px', md: '70px' }}
        paddingX={{ base: '30px', md: '50px' }}
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
          <Link href={APP_ROUTES.admin} title='Constroad | Planta de asfalto'>
            <Image src='/img/constroad-logo.svg' width='70%' alt='constroad-logo' rounded='4px' />
          </Link>
        </Flex>
        
        {session && (
          <Flex gap='10px' alignItems='center'>
            <Text fontWeight={600} fontSize={{base: 10, md: 13}}>Bienvenido: Admin</Text>
            <Button
              fontWeight={500}
              width={{ base: '75px', md: '100px' }}
              height={{base: '25px', md: '35px'}}
              color='white'
              onClick={handleSignOut}
              bg="black"
              fontSize={{base: 10, md: 14}}
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
