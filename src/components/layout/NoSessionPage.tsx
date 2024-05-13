import React from 'react'
import { Button, Flex, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { APP_ROUTES } from 'src/common/consts'

export const NoSessionPage = () => {
  const router = useRouter()
  return (
    <Flex flexDir='column' gap='10px' justifyContent='center' alignItems='center' marginTop='150px'>
      <Text>Debes iniciar sesión para ingresar a la intranet</Text>
      <Flex gap="20px">
        <Button onClick={() => router.push(APP_ROUTES.home)}>Ir al inicio</Button>
        <Button onClick={() => router.push(APP_ROUTES.login)}>Iniciar sesión</Button>
      </Flex>
    </Flex>
  )
}
