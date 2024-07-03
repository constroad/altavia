import { useEffect, useState } from 'react'

import { Box, Flex, Link, Text } from '@chakra-ui/react';

import Footer from './Footer';
import { Navbar } from './Navbar';
import { MobileMenu } from './MobileMenu';
import { CustomHead } from './CustomHead';
import { useScreenSize } from 'src/common/hooks';
import { useSession } from 'next-auth/react';
import { WhatsappIcon } from 'src/common/icons';
import { CONSTROAD_COLORS } from 'src/styles/shared';

interface IPortalLayout {
  children: React.ReactNode
  noPaddingTop?: boolean
}

export const PortalLayout = (props: IPortalLayout) => {
  const { children } = props
  const [isHoverButton, setIsHoverButton] = useState(false)
  const [buttonHovered, setButtonHovered] = useState<string | undefined>(undefined)

  const [showMobileOptions, setShowMobileOptions] = useState(false)
  const [nosotrosMenu, setNosotrosMenu] = useState<string | undefined>(undefined)
  const [serviciosMenu, setServiciosMenu] = useState<string | undefined>(undefined)
  const { isMobile } = useScreenSize()

  const { status } = useSession()
  const [logged, setLogged] = useState(status)

  useEffect(() => {
    if (status) setLogged(status)
  }, [status])
  
  const displayMobileMenu = isMobile && showMobileOptions

  const handleEnterMouse = (opt: string) => {
    setIsHoverButton(true)
    setButtonHovered(opt)
  }
  const handleLeaveMouse = () => {
    setIsHoverButton(false)
    setButtonHovered(undefined)
  }

  const handleMobileMenuClick = (e: any) => {
    e.stopPropagation()
    setShowMobileOptions(!showMobileOptions)
  }
  const toggleNosotrosMenu = (option: string) => {
    if (nosotrosMenu) {
      setNosotrosMenu(undefined)
    } else {
      setNosotrosMenu(option)
    }
  }

  const toggleServiciosMenu = (option: string) => {
    if (serviciosMenu) {
      setServiciosMenu(undefined)
    } else {
      setServiciosMenu(option)
    }
  }

  return (
    <div className='w-full min-h-screen'>
      <CustomHead />
      <Navbar
        isHoverButton={isHoverButton}
        buttonHovered={buttonHovered}
        handleEnterMouse={handleEnterMouse}
        handleLeaveMouse={handleLeaveMouse}
        handleMobileMenuClick={handleMobileMenuClick}
        showMobileOptions={showMobileOptions}
      />
      <Flex h='90px' w='100%' />

      {isMobile && showMobileOptions && (
        <MobileMenu
          toggleNosotrosMenu={toggleNosotrosMenu}
          toggleServiciossMenu={toggleServiciosMenu}
          nosotrosMenu={nosotrosMenu}
          serviciosMenu={serviciosMenu}
          display={displayMobileMenu}
        />
      )}

      <Box
        as='main'
        width='100%'
        minHeight='calc(100vh - 301.5px)'
        paddingTop={{
          base: props.noPaddingTop ? '0px' : '30px',
          md: props.noPaddingTop ? '0px' : '40px'
        }}
        paddingBottom={{ base: '30px', md: '40px'}}
        position='relative'
      >
        {children}

        <Link
          href="https://api.whatsapp.com/send?phone=51949376824"
          target="_blank"
          position='fixed'
          right={ isMobile ? 2 : '60px' }
          bottom={isMobile ? 14 : 4}
          width={isMobile ? '130px' : 'auto'}
          rounded='100%'
          background='#25d366'
          _hover={{ bg: '#1FAA53' }}
          zIndex={200}
          shadow='2lg'
        >
          <Flex justifyContent='center' alignItems='center' padding='5px' gap='6px'>
            <WhatsappIcon fontSize={40} color='white' />
          </Flex>
        </Link>

      </Box>

      <Footer />
    </div>
  )
}
