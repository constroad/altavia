'use client'

import { KeyboardEvent, useState } from 'react';
import { signIn } from 'next-auth/react';
import { Input, Button, Flex, Box } from '@chakra-ui/react';
import { FormControl, FormLabel } from '@chakra-ui/form-control'
import { useRouter } from 'next/navigation';
import { PortalLayout, SubtitleComponent, toast } from 'src/components';
import { APP_ROUTES } from 'src/common/consts';

export default function Page() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter()

  const handleSignIn = async () => {
    setLoading(true);
    const result = await signIn('credentials', {
      username,
      password,
      redirect: false,
    });
    setLoading(false);

    if (result && !result.error) {
      router.push(APP_ROUTES.admin);
      toast.info('Iniciaste sesión')
    } else {
      if (result?.error === "Tu usuario está deshabilitado.") {
        toast.warning("Tu usuario está deshabilitado.");
      } else {
        toast.error('Usuario o contraseña incorrectos');
      }
      console.log('result.error:', result?.error)
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSignIn();
    }
  };

  return (
    <PortalLayout>
      <Flex flexDir='column' alignItems='center'>
        <SubtitleComponent text='INICIA SESIÓN' />

        <Box width='400px' paddingX='30px' marginTop={{ base: '30px', md: '60px' }} textAlign='center'>
          <FormControl id="username">
            <FormLabel className='font-logo' mb='0px'>USUARIO</FormLabel>
            <Input type="text" value={username} onChange={(e) => setUsername(e.target.value.toLowerCase())} />
          </FormControl>
          <FormControl id="password" marginTop='15px'>
            <FormLabel className='font-logo' mb='0px'>CONTRASEÑA</FormLabel>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={handleKeyDown}/>
          </FormControl>
          <Button
            onClick={handleSignIn}
            marginTop='40px'
            marginX='auto'
            className='font-logo'
            colorScheme='orange'
            border='1px solid black'
            disabled={loading}
            fontWeight={600}
          >
            Ingresar
          </Button>
        </Box>
      </Flex>
    </PortalLayout>
  );
};
