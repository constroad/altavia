import { useRouter } from 'next/router';
import { Box, Button, Flex, Text } from '@chakra-ui/react';

import { CustomHead } from '../Portal/CustomHead';
import { IntranetNavbar } from './IntranetNavbar';
import { useSession } from 'next-auth/react';
import { APP_ROUTES } from 'src/common/consts';
import { ArrowBackIcon } from 'src/common/icons';

interface IIntranetLayout {
  children: React.ReactNode
  noPaddingTop?: boolean
  onBackClick?: () => void
}

export const IntranetLayout = (props: IIntranetLayout) => {
  const { children, onBackClick } = props
  const { data: session } = useSession()
  const router = useRouter()

  const handleBackClick = () => {
    if (onBackClick) onBackClick()
    else router.push(APP_ROUTES.admin)
  }

  return (
    <div className='w-full min-h-screen'>
      <CustomHead />
      <IntranetNavbar/>
      {session && (
        <Box
          as='main'
          width='100%'
          minHeight={{base:'calc(100vh - 55px)', md: 'calc(100vh - 70px)'}}
          paddingTop={{
            base: props.noPaddingTop ? '0px' : '30px',
            md: props.noPaddingTop ? '0px' : '40px'
          }}
          paddingBottom={{ base: '30px', md: '40px'}}
          paddingX={{ base: '30px', md: '50px' }}
          position='relative'
        >
          {children}

          {router.pathname !== '/admin' && (
            <Box position='fixed' top={{ base: '57px', md: '76px' }} left={{ base: '30px', md: '50px' }}>
              <Button
                fontSize={{ base: 12, md: 15 }}
                width={{ base: '70px', md: '161px' }}
                height={{ base: '25px', md: '30px' }}
                bg='gray.200'
                color='black'
                _hover={{bg: 'gray.100'}}
                fontWeight={500}
                onClick={handleBackClick}
                gap='10px'
                justifyContent='center'
                paddingX='5px'
              >
                <ArrowBackIcon color='black' fontSize={18}/>
                <Text>Volver</Text>
              </Button>
            </Box>
          )}

        </Box>
      )}

      {!session && (
        <Flex flexDir='column' gap='10px' justifyContent='center' alignItems='center' marginTop='150px'>
          <Text>Debes iniciar sesión para ingresar a la intranet</Text>
          <Flex gap="20px">
            <Button onClick={() => router.push(APP_ROUTES.home)}>Ir al inicio</Button>
            <Button onClick={() => router.push(APP_ROUTES.login)}>Iniciar sesión</Button>
          </Flex>
        </Flex>
      )}
    </div>
  )
}
