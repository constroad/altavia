import { usePathname, useRouter } from 'next/navigation'

import { Box, Button, Flex, Text } from '@chakra-ui/react'
import { APP_ROUTES } from 'src/common/consts';
import { ArrowDown, HideMenuMobileIcon, ShowMenuMobileIcon } from 'src/common/icons';

import { GenerateNavOptions, serviciosOptions } from './config'
import { useScreenSize } from 'src/common/hooks';
import { signOut, useSession } from 'next-auth/react';
import { toast } from 'src/components/Toast';
import { IconWrapper } from '@/components/IconWrapper/IconWrapper';
import Image from 'next/image';
import React from 'react';
import Link from 'next/link';

interface INavbar {
  isHoverButton: boolean
  buttonHovered: string | undefined
  handleEnterMouse: (option: string) => void
  handleLeaveMouse: () => void
  handleMobileMenuClick: (e: any) => void
  showMobileOptions: boolean
}

const NavbarComponent = React.memo( (props: INavbar) => {
  const path = usePathname() as string
  const router = useRouter()
  const { isDesktop, isMobile } = useScreenSize()
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
      router.push(`${APP_ROUTES.servicios + APP_ROUTES.transporteCargaGeneral}`)
    } else {
      router.push(option.path)
    }
  }

  const isActivePath = (current: string, target: string): boolean => {
    if (current === target) return true;
    const esSubrutaNosotros = current.includes(APP_ROUTES.nosotros) && target.includes(APP_ROUTES.nosotros);
    const esSubrutaServicios = current.includes(APP_ROUTES.servicios) && target.includes(APP_ROUTES.servicios);
    return esSubrutaNosotros || esSubrutaServicios;
  };

  return (
    <Flex
      id='navbar'
      bg='primary'
      as='nav'
      width='100%'
      height={{ base: '50px', md: '90px' }}
      position={'fixed'}
      top={{ base: '', md: '0px'}}
      zIndex={1000}
      justifyContent='center'
      boxShadow="0 4px 6px -1px rgba(15, 92, 61, 0.5)" // primary500
    >
      <Flex
        as='header'
        height={{ base: '50px', md: '90px' }}
        paddingX={{ base: '20px', md: '110px' }}
        alignItems='center'
        justifyContent='space-between'
        bg='primary'
        width={{ base: '100vw', md: '100vw' }}
        marginX={{ base: '', md: 'auto' }}
      >
        <Flex
          as='h1'
          cursor='pointer'
          width={{ base: '85px', md: 'fit-content' }}
          alignItems='center'
          justifyContent='center'
          pt='5px'
        >
          <Link href={APP_ROUTES.home} title='Altavía Perú | Transporte de carga' prefetch >
            <Flex
              w='fit-content'
              h={{base: '50px', md:'90px'}}
              rounded='6px'
              justifyContent='center'
              alignItems='center'
              flexDir={{ base: 'row', md: 'column'}}
              gap={{ base: '6px', md: '0px' }}
              mt={{ base: '0px', md: '20px' }}
              _hover={{ cursor: 'pointer' }}
            >
              {!isMobile && (
                <Image
                  alt="Logo de Altavia"
                  height={90}
                  width={120}
                  src='/img/logos/logo-nobg-white.png'
                />
              )}
              {isMobile && (
                <Image
                  alt="Logo de Altavia"
                  height={50}
                  width={85}
                  src='/img/logos/altavia-logo-mobile.png'
                />
              )}
            </Flex>
          </Link>

        </Flex>

        <Flex
          as='ul'
          gap={1}
          display={{ base: 'none', md: 'flex' }}
          alignItems='end'
          height={{base: '50px', md: '90px'}}
          className='font-logo'
          fontWeight={600}
        >
          {session && (
            <Link href={APP_ROUTES.dashboard} prefetch>
              <Box
                fontWeight={600}
                display='flex'
                justifyContent='center'
                alignItems='end'
                paddingBottom='10px'
                paddingX={5}
                height='50px'
                color='white'
                position='relative'
                roundedTop='4px'
                _hover={{
                  background: 'primary.700',
                  color: 'white',
                  cursor: 'pointer',
                }}
              >
                <Text className='font-logo'>
                  Intranet
                </Text>
              </Box>
            </Link>
          )}
          

          {/* aqui */}
          {GenerateNavOptions().map(opt => {
            const activo = isActivePath(path, opt.path);
            const href =
              opt.label === 'Nosotros'
                ? APP_ROUTES.nosotros
                : opt.label === 'Servicios'
                  ? APP_ROUTES.servicios + APP_ROUTES.transporteCargaGeneral
                  : opt.path;

            const mostrarServicios = opt.label === 'Servicios' && props.buttonHovered === 'Servicios';

            return (
              <Box
                key={opt.label}
                as="li"
                position="relative"
                onMouseEnter={() => props.handleEnterMouse(opt.label)}
                onMouseLeave={props.handleLeaveMouse}
              >
                <Link href={href} passHref prefetch>
                  <Box
                    fontWeight={600}
                    display="flex"
                    justifyContent="center"
                    alignItems="end"
                    paddingBottom="10px"
                    paddingX={5}
                    height="50px"
                    color={activo ? 'white' : 'white'}
                    bg={activo ? 'primary.700' : 'transparent'}
                    _hover={{
                      background: 'primary.700',
                      color: 'white',
                      cursor: 'pointer',
                    }}
                    position="relative"
                    borderTopRadius="4px"
                  >
                    <Flex alignItems="center" gap="2px">
                      <Text>{opt.label}</Text>
                      {opt.label === 'Servicios' && (
                        <Flex mb="4px">
                          <IconWrapper icon={ArrowDown} />
                        </Flex>
                      )}
                    </Flex>
                  </Box>
                </Link>

                {/* Submenú de servicios */}
                {mostrarServicios && (
                  <Flex
                    as="ul"
                    position="absolute"
                    top="100%"
                    left="0px"
                    flexDir="column"
                    gap="1px"
                    background="white"
                    width="180px"
                    visibility={props.isHoverButton ? 'visible' : 'hidden'}
                    fontSize={13}
                    fontWeight={600}
                    zIndex={1000}
                    border="1px solid #9CA3AF"
                    className={props.isHoverButton ? 'opacity-100 unfold-03' : 'opacity-0'}
                  >
                    {serviciosOptions.map(sopt => (
                      <Link
                        key={sopt.label}
                        href={`${opt.path}${sopt.path}`}
                        passHref
                        prefetch
                      >
                        <Flex
                          as="li"
                          color={path.includes(sopt.path) ? 'white' : 'primary'}
                          bg={path.includes(sopt.path) ? 'primary' : 'transparent'}
                          px={5}
                          py={2}
                          cursor="pointer"
                          alignItems="center"
                          _hover={{
                            background: 'primary',
                            color: 'white',
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {sopt.label}
                        </Flex>
                      </Link>
                    ))}
                  </Flex>
                )}
              </Box>
            );
          })}

          {!session && (
            <Link href={APP_ROUTES.login} passHref prefetch>
              <Box
                fontWeight={600}
                display="flex"
                justifyContent="center"
                alignItems="end"
                paddingBottom="10px"
                paddingX={5}
                height="50px"
                color="white"
                position="relative"
                roundedTop="4px"
                _hover={{
                  background: 'primary.700',
                  color: 'white',
                  cursor: 'pointer',
                }}
                bg={path === APP_ROUTES.login ? 'primary.700' : 'transparent'}
                className={
                  path === APP_ROUTES.login
                    ? 'bg-[#feb100] !text-white hover:text-white'
                    : ''
                }
              >
                <Text>Iniciar sesión</Text>
              </Box>
            </Link>
          )}

          {session && (
            <Box
              fontWeight={600}
              display='flex'
              justifyContent='center'
              alignItems='end'
              paddingBottom='10px'
              paddingX={5}
              height='50px'
              color='white'
              position='relative'
              roundedTop='4px'
              _hover={{
                background: 'primary.700',
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

        <Flex display={{ base: 'block', md: 'none' }} color="black" mr='10px'>
          <Button
            size='xs'
            paddingX='4px'
            paddingY='2px'
            onClick={(e) => props.handleMobileMenuClick(e)}
            backgroundColor='primary.700'
          >
            {props.showMobileOptions ? <IconWrapper icon={HideMenuMobileIcon} fontSize={10}/> : <IconWrapper icon={ShowMenuMobileIcon} fontSize={10}/>}
          </Button>
        </Flex>
      </Flex>
    </Flex>
  )
})

NavbarComponent.displayName = 'Navbar';

export const Navbar = React.memo(NavbarComponent);
