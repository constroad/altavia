import { useEffect, useState } from 'react'

import { Box, Flex, Link, Text } from '@chakra-ui/react';

import { IoLogoWhatsapp } from "react-icons/io";
import { useScreenSize } from 'src/common/hooks';
import { CustomHead } from '../Portal/CustomHead';
import { IntranetNavbar } from './IntranetNavbar';
import { useSession } from 'next-auth/react';

interface IIntranetLayout {
  children: React.ReactNode
  noPaddingTop?: boolean
}

export const IntranetLayout = (props: IIntranetLayout) => {
  const { children } = props
  const { isMobile } = useScreenSize()

  const { status } = useSession()
  const [logged, setLogged] = useState(status)

  useEffect(() => {
    if (status) setLogged(status)
  }, [status])
  
  console.log('logged:', logged)

  return (
    <div className='w-full min-h-screen'>
      <CustomHead />
      <IntranetNavbar/>
      <Box
        as='main'
        width='100%'
        minHeight='calc(100vh - 305px)'
        paddingTop={{
          base: props.noPaddingTop ? '0px' : '40px',
          md: props.noPaddingTop ? '0px' : '50px'
        }}
        paddingBottom={{ base: '40px', md: '50px'}}
        position='relative'
      >
        {children}

        <Link
          href="https://api.whatsapp.com/send?phone=51949376824"
          target="_blank"
          position='fixed'
          right={ isMobile ? 2 : 5 }
          bottom={isMobile ? 14 : 12}
          width={isMobile ? '130px' : '150px'}
          rounded='10px'
          background='white'
          zIndex={200}
          shadow='md'
          border='1px solid'
          borderColor='lightgrey'
        >
          <Flex justifyContent='center' alignItems='center' padding='10px' gap='6px'>
            <IoLogoWhatsapp fontSize={24} color='green' />
            <Text color='GrayText' fontSize={isMobile ? '14px' : '16px'}>
              Contáctanos
            </Text>
          </Flex>
        </Link>

      </Box>
    </div>
  )
}
