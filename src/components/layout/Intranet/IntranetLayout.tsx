import { useRouter } from 'next/router';
import { Box, Button, Text } from '@chakra-ui/react';

import { CustomHead } from '../Portal/CustomHead';
import { IntranetNavbar } from './IntranetNavbar';
import { useSession } from 'next-auth/react';
import { APP_ROUTES } from 'src/common/consts';
import { ArrowBackIcon } from 'src/common/icons';
import { NoSessionPage } from '../NoSessionPage';

interface IIntranetLayout {
  children: React.ReactNode
  noPaddingTop?: boolean
}

export const IntranetLayout = (props: IIntranetLayout) => {
  const { children } = props
  const { data: session } = useSession()
  const router = useRouter()

  return (
    <div className='w-full min-h-screen'>
      <CustomHead />
      <IntranetNavbar/>
      {session && (
        <Box
          as='main'
          width='100%'
          minHeight={{base:'calc(100vh - 65px)', md: 'calc(100vh - 95px)'}}
          paddingTop={{
            base: props.noPaddingTop ? '0px' : '40px',
            md: props.noPaddingTop ? '0px' : '50px'
          }}
          paddingBottom={{ base: '40px', md: '50px'}}
          paddingX={{ base: '30px', md: '70px' }}
          position='relative'
        >
          {children}

          {router.pathname !== '/admin' && (
            <Box position='absolute' top={{ base: '10px', md: '10px' }} left={{ base: '30px', md: '70px' }}>
              <Button
                fontSize={{ base: 12, md: 15 }}
                width={{ base: '70px', md: '184px' }}
                height={{ base: '25px', md: '40px' }}
                bg='transparent'
                color='black'
                _hover={{bg: 'gray.100'}}
                fontWeight={500}
                onClick={() => router.push(APP_ROUTES.admin)}
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
        <NoSessionPage />
      )}
    </div>
  )
}
