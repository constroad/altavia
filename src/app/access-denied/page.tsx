'use client'

import React from 'react'
import { Button, Flex, Text } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { ALTAVIA_COLORS } from 'src/styles/shared';
import { useSession } from 'next-auth/react';

export default function Page() {
  const router = useRouter()

  const handleGoToMenu = () => {
    router.push('/dashboard')
  }

  const { data: session } = useSession() 
  const userRole = session?.user?.role ?? '';

  console.log('session:', session)
  console.log('userRole:', userRole)

  return (
    <Flex w='100%' h='calc(100vh - 150px)' justifyContent='center' alignItems='center' flexDir='column'>
      <Text>No tienes acceso a esta página</Text>
      <Flex mt='20px'>
        <Button bg={ALTAVIA_COLORS.darkPrimary} fontWeight={600} onClick={handleGoToMenu} size='sm'>
          Regresar al menú
        </Button>
      </Flex>
    </Flex>
  )
}
