import { useEffect, useState } from 'react'

import { Box, Flex, Link, Text } from '@chakra-ui/react';

import Footer from './Footer';
import { Navbar } from './Navbar';
import { MobileMenu } from './MobileMenu';
import { CustomHead } from './CustomHead';
import { useScreenSize } from 'src/common/hooks';
import { useSession } from 'next-auth/react';
import { WhatsAppIcon } from 'src/common/icons';

interface IPortalLayout {
  children: React.ReactNode
  noPaddingTop?: boolean
  bgColor?: string
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
        minHeight='calc(100vh - 306.5px)'
        paddingTop={{
          base: props.noPaddingTop ? '0px' : '20px',
          md: props.noPaddingTop ? '0px' : '50px'
        }}
        paddingBottom={{ base: '40px', md: '50px'}}
        position='relative'
        bgColor={props.bgColor ?? ''}
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
            <WhatsAppIcon fontSize={24} color='green' />
            <Text color='GrayText' fontSize={isMobile ? '14px' : '16px'}>
              Contáctanos
            </Text>
          </Flex>
        </Link>

      </Box>

      <Footer />
    </div>
  )
}
