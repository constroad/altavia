import { usePathname, useRouter } from 'next/navigation'

import { Box, Button, Flex, Image, Link, Text } from '@chakra-ui/react'
import { APP_ROUTES } from 'src/common/consts';
import { ArrowDown, HideMenuMobileIcon, ShowMenuMobileIcon } from 'src/common/icons';

import { GenerateNavOptions, serviciosOptions } from './config'
import { useScreenSize } from 'src/common/hooks';
import { signOut, useSession } from 'next-auth/react';
import { toast } from 'src/components/Toast';
import { IconWrapper } from '@/components/IconWrapper/IconWrapper';

interface INavbar {
  isHoverButton: boolean
  buttonHovered: string | undefined
  handleEnterMouse: (option: string) => void
  handleLeaveMouse: () => void
  handleMobileMenuClick: (e: any) => void
  showMobileOptions: boolean
}

export const Navbar = (props: INavbar) => {
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

  const handleGoToDashboardClick = () => {
    router.push('/dashboard')
  }

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
          <Link href={APP_ROUTES.home} title='Altavía Perú | Transporte de carga' _hover={{ textDecoration: 'none' }}>
            <Flex
              w='fit-content'
              h={{base: '50px', md:'90px'}}
              rounded='6px'
              justifyContent='center'
              alignItems='center'
              flexDir={{ base: 'row', md: 'column'}}
              gap={{ base: '6px', md: '0px' }}
              mt={{ base: '0px', md: '20px' }}
            >
              {!isMobile && (
                <Image
                  alt="Logo de Altavia"
                  h='90px'
                  w='120px'
                  src='/img/logos/logo-nobg-white.png'
                />
              )}
              {isMobile && (
                <Image
                  alt="Logo de Altavia"
                  h='50px'
                  w='85px'
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
            <Box
              as='li'
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
              onClick={handleGoToDashboardClick}
            >
              <Text className='font-logo'>
                Intranet
              </Text>
            </Box>
          )}
          {GenerateNavOptions().map(opt => (
            <Box
              as="li"
              key={opt.label}
              fontWeight={600}
              display="flex"
              justifyContent="center"
              alignItems="end"
              paddingBottom="10px"
              paddingX={5}
              height="50px"
              color={
                path === opt.path ||
                (path.includes(APP_ROUTES.nosotros) && opt.path.includes(APP_ROUTES.nosotros)) ||
                (path.includes(APP_ROUTES.servicios) && opt.path.includes(APP_ROUTES.servicios))
                  ? 'white'
                  : 'white'
              }
              bg={
                path === opt.path ||
                (path.includes(APP_ROUTES.nosotros) && opt.path.includes(APP_ROUTES.nosotros)) ||
                (path.includes(APP_ROUTES.servicios) && opt.path.includes(APP_ROUTES.servicios))
                  ? 'primary.700'
                  : 'transparent'
              }
              _hover={{
                background: 'primary.700',
                color: 'white',
                cursor: 'pointer',
              }}
              position="relative"
              borderTopRadius="4px"
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
                    <IconWrapper icon={ArrowDown} />
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
                  // paddingY='1px'
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
                      as="li"
                      key={sopt.label}
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
              color='white'
              position='relative'
              roundedTop='4px'
              _hover={{
                background: 'primary.700',
                color: 'white',
                cursor: 'pointer',
              }}
              bg={ path === APP_ROUTES.login ? 'primary.700' : 'transparent'}
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
}
