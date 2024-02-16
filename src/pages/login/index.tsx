import { KeyboardEvent, useState } from 'react';
import { signIn } from 'next-auth/react';
import { FormControl, FormLabel, Input, Button, Flex, Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { PortalLayout, toast } from 'src/components';
import { APP_ROUTES } from 'src/common/consts';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter()

  const handleSignIn = async () => {
    const result = await signIn('credentials', {
      username,
      password,
      redirect: false,
    });

    if (result && !result.error) {
      router.push(APP_ROUTES.admin);
      toast.info('Iniciaste sesión')
    } else {
      toast.error('Usuario o contraseña incorrecta')
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
        <Box as='h1' fontWeight={600} fontSize={26}>Inicia sesion</Box>

        <Box width='400px' paddingX='30px' marginTop={{ base: '30px', md: '60px' }} textAlign='center'>
          <FormControl id="username">
            <FormLabel>Usuario</FormLabel>
            <Input type="text" value={username} onChange={(e) => setUsername(e.target.value.toLowerCase())} />
          </FormControl>
          <FormControl id="password" marginTop='15px'>
            <FormLabel>Contraseña</FormLabel>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={handleKeyDown}/>
          </FormControl>
          <Button onClick={handleSignIn} marginTop='40px' marginX='auto'>Ingresar</Button>
        </Box>
      </Flex>
    </PortalLayout>
  );
};

export default LoginPage;
