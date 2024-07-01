import { useRouter } from 'next/router'
import { signOut, useSession } from 'next-auth/react';

import { Box, Button, Flex, Image, Link, Text } from '@chakra-ui/react'
import { toast } from 'src/components/Toast';
import { APP_ROUTES } from 'src/common/consts';
import { HideMenuMobileIcon, ShowMenuMobileIcon } from 'src/common/icons';

import { GenerateNavOptions, nosotrosOptions, serviciosOptions } from './config'
import { CONSTROAD_COLORS } from 'src/styles/shared';
import { useEffect, useState } from 'react';

interface INavbar {
  isHoverButton: boolean
  buttonHovered: string | undefined
  handleEnterMouse: (option: string) => void
  handleLeaveMouse: () => void
  handleMobileMenuClick: (e: any) => void
  showMobileOptions: boolean
}

export const Navbar = (props: INavbar) => {
  const [isScrolledDown, setIsScrolledDown] = useState(false)
  const router = useRouter()
  const path = router.pathname
  const { data: session } = useSession()

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const nav = document.getElementById('navbar');
      const navHeight = nav!.offsetHeight * 6;

      if (scrollTop > navHeight) {
        setIsScrolledDown(true);
      } else {
        setIsScrolledDown(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSignOut = async() => {
    await signOut({redirect: false});
    router.push(APP_ROUTES.home)
    toast.info('Cerraste sesión');
  }

  const menuItemClick = (option: any) => {
    if (option.label === 'Nosotros') {
      router.push(`${APP_ROUTES.nosotros}` + APP_ROUTES.mision)
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
      as='nav'
      width='100%'
      height={{ base: '65px', md: '90px' }}
      position={'fixed'}
      top={{ base: '', md: isScrolledDown ? '0px' : '0px'}}
      zIndex={1000}
      justifyContent='center'
      rounded='6px'
      boxShadow={ (isScrolledDown || isNotHomePage) ? 'lg' : 'lg'}
    >
      <Flex
        as='header'
        height={{ base: '65px', md: '90px' }}
        paddingX={{ base: '30px', md: isScrolledDown ? '70px' : '70px' }}
        alignItems='center'
        justifyContent='space-between'
        bg='white'
        rounded={ isScrolledDown ? '0px' : '0px' }
        width={{ base: '100vw', md: isScrolledDown ? '100vw' : '100vw' }}
        marginX='auto'
      >
        <Flex
          as='h1'
          cursor='pointer'
          width={{ base: '130px', md: 'fit-content' }}
          alignItems='center'
          justifyContent='center'
        >
          <Link href={APP_ROUTES.home} title='Constroad | Planta de asfalto' _hover={{ textDecoration: 'none' }}>
            <Flex w='fit-content' h='90px' rounded='6px' justifyContent='center' alignItems='center' flexDir='column'>
              <Image src='/constroad.jpeg' width='32px' h='32px' alt='constroad-logo' rounded='4px' />
                <Text className='font-logo' fontWeight={650} fontSize='24px' lineHeight='24px' textAlign='end' pt='5px'>
                  ConstRoad
                </Text>
                <Text className='font-logo' fontWeight={650} fontSize={14} lineHeight='14px' textAlign='center' textDecoration='none' color={CONSTROAD_COLORS.darkYellow} h='10p'>
                  Planta de Asfalto
                </Text>
            </Flex>
          </Link>

        </Flex>

        <Flex as='ul' gap={1} display={{ base: 'none', md: 'flex' }} alignItems='end' height='90px' className='font-logo' fontWeight={600}>
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
              <Text>
                {opt.label}
              </Text>

              {/* NOSOTROS */}
              {props.buttonHovered === 'Nosotros' && opt.label === 'Nosotros' && (
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
                    props.buttonHovered === 'Nosotros' && opt.label === 'Nosotros' ?
                    'opacity-100 unfold-03' :
                    'opacity-0'
                  }
                >
                  {nosotrosOptions.map(nopt => (
                    <Flex
                      as='li'
                      key={nopt.label}
                      color='black'
                      paddingX={5}
                      paddingY={2}
                      cursor='pointer'
                      alignItems='center'
                      className={ path.includes(nopt.path) ? 'bg-[#feb100]' : 'text-black' }
                      _hover={{
                        background: '#feb100',
                        color: 'white',
                      }}
                      onClick={(e) => {
                        e.stopPropagation()
                        router.push(`${opt.path}${nopt.path}`)
                      }}
                    >
                      {nopt.label}
                    </Flex>
                  ))}
                </Flex>
              )}

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
