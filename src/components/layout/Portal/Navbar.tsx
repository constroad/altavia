import { useRouter } from 'next/router'
import { signOut, useSession } from 'next-auth/react';

import { Box, Button, Flex, Image, Link, Text } from '@chakra-ui/react'
import { toast } from 'src/components/Toast';
import { APP_ROUTES } from 'src/common/consts';
import { ArrowDown, HideMenuMobileIcon, ShowMenuMobileIcon } from 'src/common/icons';

import { GenerateNavOptions, nosotrosOptions, serviciosOptions } from './config'
import { CONSTROAD_COLORS } from 'src/styles/shared';
import { useEffect, useState } from 'react';
import { useScreenSize } from 'src/common/hooks';

interface INavbar {
  isHoverButton: boolean
  buttonHovered: string | undefined
  handleEnterMouse: (option: string) => void
  handleLeaveMouse: () => void
  handleMobileMenuClick: (e: any) => void
  showMobileOptions: boolean
}

export const Navbar = (props: INavbar) => {
  const router = useRouter()
  const { isMobile, isDesktop } = useScreenSize()
  const path = router.pathname
  const { data: session } = useSession()

  const handleSignOut = async() => {
    await signOut({redirect: false});
    router.push(APP_ROUTES.home)
    toast.info('Cerraste sesión');
  }

  const menuItemClick = (option: any) => {
    if (option.label === 'Nosotros') {
      router.push(`${APP_ROUTES.nosotros}`)
    } else if (option.label === 'Servicios') {
      router.push(`${APP_ROUTES.servicios + APP_ROUTES.mezclaAsfaltica}`)
    } else {
      router.push(option.path)
    }
  }

  const handleGoToAdminClick = () => {
    router.push('/admin')
  }

  const isNotHomePage = path !== '/'

  return (
    <Flex
      id='navbar'
      bg='white'
      as='nav'
      width='100%'
      height={{ base: '65px', md: '90px' }}
      position={'fixed'}
      top={{ base: '', md: '0px'}}
      zIndex={1000}
      justifyContent='center'
      boxShadow='lg'
    >
      <Flex
        as='header'
        height={{ base: '65px', md: '90px' }}
        paddingX={{ base: '30px', md: '120px' }}
        alignItems='center'
        justifyContent='space-between'
        bg='white'
        width={{ base: '100vw', md: '100vw' }}
        marginX={{ base: '', md: 'auto' }}
      >
        <Flex
          as='h1'
          cursor='pointer'
          width={{ base: '160px', md: 'fit-content' }}
          alignItems='center'
          justifyContent='center'
        >
          <Link href={APP_ROUTES.home} title='Constroad | Planta de asfalto' _hover={{ textDecoration: 'none' }}>
            <Flex w='fit-content' h={{base: '65px', md:'90px'}} rounded='6px' justifyContent='center' alignItems='center' flexDir={{ base: 'row', md: 'column'}} gap={{ base: '6px', md: '0px' }}>
              <Image src='/constroad.jpeg' width={{ base: '26px', md: '32px' }} h={{ base: '26px', md: '32px' }} alt='constroad-logo' rounded='4px' />
              <Text className='font-logo' fontWeight={650} fontSize={{ base: 25, md: 30 }} lineHeight={{ base: '25px', md: '30px' }} textAlign='end' pt={{base: '8px', md: '5px'}}>
                ConstRoad
              </Text>
              {isDesktop && (
                <Text className='font-logo' fontWeight={650} fontSize={16} lineHeight='16px' textAlign='center' textDecoration='none' color={CONSTROAD_COLORS.darkYellow} h='10p'>
                  Planta de Asfalto
                </Text>
              )}
            </Flex>
          </Link>

        </Flex>

        <Flex as='ul' gap={1} display={{ base: 'none', md: 'flex' }} alignItems='end' height={{base: '65px', md: '90px'}} className='font-logo' fontWeight={600}>
          {session && (
            <Box
              as='li'
              fontWeight={600}
              display='flex'
              justifyContent='center'
              alignItems='end'
              paddingBottom='10px'
              paddingX={5}
              height='50px'
              color='black'
              position='relative'
              roundedTop='4px'
              _hover={{
                background: '#feb100',
                color: 'white',
                cursor: 'pointer',
              }}
              onClick={handleGoToAdminClick}
            >
              <Text className='font-logo'>
                Intranet
              </Text>
            </Box>
          )}

          {GenerateNavOptions().map(opt => (
            <Box
              as='li'
              key={opt.label}
              fontWeight={600}
              display='flex'
              justifyContent='center'
              alignItems='end'
              paddingBottom='10px'
              paddingX={5}
              height='50px'
              color='black'
              position='relative'
              roundedTop='4px'
              _hover={{
                background: '#feb100',
                color: 'white',
                cursor: 'pointer',
              }}
              className={
                path === opt.path ||
                path.includes(APP_ROUTES.nosotros) && opt.path.includes(APP_ROUTES.nosotros) ||
                path.includes(APP_ROUTES.servicios) && opt.path.includes(APP_ROUTES.servicios) ?
                'bg-[#feb100] !text-white hover:text-white' : ''
              }
              onMouseEnter={() => props.handleEnterMouse(opt.label)}
              onMouseLeave={props.handleLeaveMouse}
              onClick={() => menuItemClick(opt)}
            >
              <Flex alignItems='center' gap='2px'>
                <Text>
                  {opt.label}
                </Text>
                {opt.label === 'Servicios' && (
                  <Flex mb='4px'>
                    <ArrowDown />
                  </Flex>
                )}
              </Flex>

              {/* SERVICIOS */}
              {props.buttonHovered === 'Servicios' && opt.label === 'Servicios' && (
                <Flex
                  as='ul'
                  position='absolute'
                  top='100%'
                  left='0px'
                  flexDir='column'
                  gap='1px'
                  paddingY='1px'
                  background='white'
                  width='180px'
                  visibility={props.isHoverButton ? 'visible' : 'hidden'}
                  fontSize={13}
                  fontWeight={600}
                  zIndex={1000}
                  border='1px solid #9CA3AF'
                  className={
                    props.buttonHovered === 'Servicios' && opt.label === 'Servicios' ?
                    'opacity-100 unfold-03' :
                    'opacity-0'
                  }
                >
                  {serviciosOptions.map(sopt => (
                    <Flex
                      as='li'
                      key={sopt.label}
                      color='black'
                      paddingX={5}
                      paddingY={2}
                      cursor='pointer'
                      alignItems='center'
                      className={ path.includes(sopt.path) ? 'bg-[#feb100]' : 'text-black' }
                      _hover={{
                        background: '#feb100',
                        color: 'white',
                      }}
                      onClick={(e) => {
                        e.stopPropagation()
                        router.push(`${opt.path}${sopt.path}`)
                      }}
                    >
                      {sopt.label}
                    </Flex>
                  ))}
                </Flex>
              )}
            </Box>
          ))}

          {!session && (
            <Box
              as='li'
              fontWeight={600}
              display='flex'
              justifyContent='center'
              alignItems='end'
              paddingBottom='10px'
              paddingX={5}
              height='50px'
              color='black'
              position='relative'
              roundedTop='4px'
              _hover={{
                background: '#feb100',
                color: 'white',
                cursor: 'pointer',
              }}
              className={
                path === APP_ROUTES.login ?
                'bg-[#feb100] !text-white hover:text-white' : ''
              }
              onClick={() => router.push(APP_ROUTES.login)}
            >
              <Text>
                Iniciar sesión
              </Text>
            </Box>
          )}

          {session && (
            <Box
              as='li'
              fontWeight={600}
              display='flex'
              justifyContent='center'
              alignItems='end'
              paddingBottom='10px'
              paddingX={5}
              height='50px'
              color='black'
              position='relative'
              roundedTop='4px'
              _hover={{
                background: '#feb100',
                color: 'white',
                cursor: 'pointer',
              }}
              onClick={handleSignOut}
            >
              <Text>
                Cerrar sesión
              </Text>
            </Box>
          )}

        </Flex>

        <Flex display={{ base: 'block', md: 'none' }} textColor='black'>
          <Button paddingX='4px' paddingY='2px' onClick={(e) => props.handleMobileMenuClick(e)} backgroundColor='white'>
            {props.showMobileOptions ? <HideMenuMobileIcon fontSize={26}/> : <ShowMenuMobileIcon fontSize={26}/>}
          </Button>
        </Flex>
      </Flex>
    </Flex>
  )
}
