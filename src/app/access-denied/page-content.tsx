'use client';

import { Button, Flex, Text } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export function AccessDeniedPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const handleGoToMenu = () => {
    router.push('/dashboard');
  };

  return (
    <Flex w='100%' h='calc(100vh - 150px)' justifyContent='center' alignItems='center' flexDir='column'>
      <Text>No tienes acceso a esta página</Text>
      <Flex mt='20px'>
        <Button bg='primary.700' fontWeight={600} onClick={handleGoToMenu} size='sm'>
          Regresar al menú
        </Button>
      </Flex>
    </Flex>
  );
}
