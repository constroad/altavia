'use client'

import React from 'react'
import { Button, Flex, Text } from '@chakra-ui/react'
import { signOut, useSession } from 'next-auth/react'
import { APP_ROUTES } from 'src/common/consts'
import { toast } from 'src/components/Toast'
import { useSidebar } from 'src/context'

export const DashboardNavbar = () => {
  const { data: session } = useSession() 
  console.log('session:', session)
  const { isExpanded } = useSidebar();

  const handleSignOut = async() => {
    await signOut({ callbackUrl: APP_ROUTES.login });
    toast.info('Cerraste sesión');
  }

  return (
    <Flex
      width={{
        base: '',
        md: isExpanded ? 'calc(100vw - 250px)' : 'calc(100vw - 60px)'
      }}
      justifyContent='end'
      p={{ base: 2, md: 4 }}
      shadow='md'
      minHeight={{ base: '41px', md: '72px' }}
    >
      {session && (
        <Flex gap='10px' alignItems='center'>
          <Text fontWeight={600} fontSize={{base: 11, md: 14}}>Bienvenido: Admin</Text>
          <Button
            fontWeight={600}
            onClick={handleSignOut}
            colorPalette='danger'
            variant='outline'
            size='xs'
            fontSize={{base: 10, md: 14}}
          >
            Cerrar sesión
          </Button>
        </Flex>
      )}
    </Flex>
  )
}

export default DashboardNavbar;
