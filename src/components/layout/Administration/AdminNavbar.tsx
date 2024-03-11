import { Button, Flex, Text } from '@chakra-ui/react'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React from 'react'
import { APP_ROUTES } from 'src/common/consts'
import { toast } from 'src/components/Toast'

export const AdminNavbar = () => {
  const { data: session } = useSession() 
  const router = useRouter()

  const handleSignOut = async() => {
    await signOut({redirect: false});
    router.push(APP_ROUTES.home)
    toast.info('Cerraste sesión');
  }

  return (
    <Flex width='100%' justifyContent='end' p={{ base: 2, md: 4 }} shadow='md'>
      {session && (
        <Flex gap='10px' alignItems='center'>
          <Text fontWeight={600} fontSize={{base: 11, md: 14}}>Bienvenido: Admin</Text>
          <Button
            fontWeight={500}
            width={{ base: '75px', md: '100px' }}
            height={{base: '25px', md: '40px'}}
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
  )
}

export default AdminNavbar
