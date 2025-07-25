'use client'

import { useCallback, useEffect, useState } from 'react'

import { Box, Flex, Link } from '@chakra-ui/react';

import Footer from './Footer';
import { Navbar } from './Navbar';
import { MobileMenu } from './MobileMenu';
import { useScreenSize } from 'src/common/hooks';
import { useSession } from 'next-auth/react';
import { WhatsappIcon } from 'src/common/icons';

interface IPortalLayout { 
  children: React.ReactNode
  // noPaddingTop?: boolean
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

  const handleEnterMouse = useCallback((opt: string) => {
    setIsHoverButton(true)
    setButtonHovered(opt)
  }, [])
  
  const handleLeaveMouse = useCallback(() => {
    setIsHoverButton(false)
    setButtonHovered(undefined)
  }, [])
  
  const handleMobileMenuClick = useCallback((e: any) => {
    e.stopPropagation()
    setShowMobileOptions(prev => !prev)
  }, [])

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
      <Navbar
        isHoverButton={isHoverButton}
        buttonHovered={buttonHovered}
        handleEnterMouse={handleEnterMouse}
        handleLeaveMouse={handleLeaveMouse}
        handleMobileMenuClick={handleMobileMenuClick}
        showMobileOptions={showMobileOptions}
      />
      <Flex h={{base: '50px', md: '90px'}} w='100%' bg='white' />

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
        minHeight='calc(100vh - 339px)'
        // paddingTop={{
        //   base: props.noPaddingTop ? '0px' : '20px',
        //   md: props.noPaddingTop ? '0px' : '50px'
        // }}
        paddingBottom={{ base: '10px', md: '40px'}}
        position='relative'
        bgColor={props.bgColor ?? ''}
      >
        {children}

        <Link
          href="https://api.whatsapp.com/send?phone=51949376824"
          target="_blank"
          position='fixed'
          right={ isMobile ? 2 : '60px' }
          bottom={isMobile ? 14 : '40px'}
          rounded='100%'
          background='#25d366'
          _hover={{ bg: '#1FAA53' }}
          zIndex={200}
          shadow='2lg'
        >
          <Flex justifyContent='center' alignItems='center' padding='5px' gap='6px' fontSize='32px'>
            <WhatsappIcon color='white' fontSize="32px" />
          </Flex>
        </Link>

      </Box>

      <Footer />
    </div>
  )
}
