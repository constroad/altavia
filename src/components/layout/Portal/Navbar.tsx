import { usePathname, useRouter } from 'next/navigation'

import { Box, Button, Flex, Image, Link, Text } from '@chakra-ui/react'
import { APP_ROUTES } from 'src/common/consts';
import { ArrowDown, HideMenuMobileIcon, ShowMenuMobileIcon } from 'src/common/icons';

import { GenerateNavOptions, serviciosOptions } from './config'
import { ALTAVIA_COLORS, CONSTROAD_COLORS } from 'src/styles/shared';
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
  const path = usePathname() as string
  const router = useRouter()
  const { isDesktop } = useScreenSize()

  console.log('path:', path)

  const menuItemClick = (option: any) => {
    if (option.label === 'Nosotros') {
      router.push(`${APP_ROUTES.nosotros}`)
    } else if (option.label === 'Servicios') {
      router.push(`${APP_ROUTES.servicios + APP_ROUTES.transporteCargaGeneral}`)
    } else {
      router.push(option.path)
    }
  }

  return (
    <Flex
      id='navbar'
      bg={ALTAVIA_COLORS.primary}
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
        bg={ALTAVIA_COLORS.primary}
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
          <Link href={APP_ROUTES.home} title='Altavía Perú | Transporte de carga' _hover={{ textDecoration: 'none' }}>
            <Flex
              w='fit-content'
              h={{base: '65px', md:'90px'}}
              rounded='6px'
              justifyContent='center'
              alignItems='center'
              flexDir={{ base: 'row', md: 'column'}}
              gap={{ base: '6px', md: '0px' }}
              mt='20px'
            >
              <Image
                alt="Logo de Altavia"
                h={{base: '65px', md:'90px'}}
                w={{base: '65px', md:'120px'}}
                src='/img/logos/logo-nobg-white.png'
              />
            </Flex>
          </Link>

        </Flex>

        <Flex
          as='ul'
          gap={1}
          display={{ base: 'none', md: 'flex' }}
          alignItems='end'
          height={{base: '65px', md: '90px'}}
          className='font-logo'
          fontWeight={600}
        >

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
                ? ALTAVIA_COLORS.darkPrimary
                : 'transparent'
            }
            _hover={{
              background: ALTAVIA_COLORS.darkPrimary,
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
                      color={path.includes(sopt.path) ? 'white' : ALTAVIA_COLORS.primary}
                      bg={path.includes(sopt.path) ? ALTAVIA_COLORS.primary : 'transparent'}
                      px={5}
                      py={2}
                      cursor="pointer"
                      alignItems="center"
                      _hover={{
                        background: ALTAVIA_COLORS.primary,
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

        </Flex>

        <Flex display={{ base: 'block', md: 'none' }} color="black">
          <Button paddingX='4px' paddingY='2px' onClick={(e) => props.handleMobileMenuClick(e)} backgroundColor='white'>
            {props.showMobileOptions ? <HideMenuMobileIcon fontSize={26}/> : <ShowMenuMobileIcon fontSize={26}/>}
          </Button>
        </Flex>
      </Flex>
    </Flex>
  )
}
