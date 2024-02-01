import { useRouter } from 'next/router'
import { ImMenu3, ImMenu4 } from "react-icons/im";

import { Box, Button, Flex, Image, Link, Text } from '@chakra-ui/react'
import { APP_ROUTES } from 'src/common/consts';
import { navOptions, nosotrosOptions, serviciosOptions } from './config'

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
  const path = router.pathname

  const menuItemClick = (option: any) => {
    if (option.label === 'Nosotros') {
      return router.push(`${APP_ROUTES.nosotros + APP_ROUTES.mision}`)
    } else if (option.label === 'Servicios') {
      return router.push(`${APP_ROUTES.servicios + APP_ROUTES.mezclaAsfaltica}`)
    } else {
      router.push(option.path)
    }
  }

  return (
    <Flex width='100%' height={{ base: '65px', md: '95px' }}>
      <Flex
        as='header'
        height={{ base: '65px', md: '95px' }}
        paddingX={{ base: '30px', md: '70px' }}
        alignItems='center'
        justifyContent='space-between'
        backgroundColor='white'
        position='fixed'
        left='0'
        top='0'
        zIndex={1000}
        width={{ base: '100vw', md: '100vw' }}
        marginX='auto'
        boxShadow="0px 2px 4px rgba(0, 0, 0, 0.1)"
      >
        <Flex
          as='h1'
          cursor='pointer'
          width={{ base: '130px', md: '230px' }}
          alignItems='center'
          justifyContent='center'
        >
          <Link href={APP_ROUTES.home} title='Constroad | Planta de asfalto'>
            <Image src='/img/constroad-logo.svg' width='80%' alt='constroad-logo' rounded='4px' />
          </Link>
        </Flex>

        <Flex as='ul' gap={1} display={{ base: 'none', md: 'flex' }} alignItems='end' height='95px'>
          {navOptions.map(opt => (
            <Box
              as='li'
              key={opt.label}
              fontWeight={500}
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
                  fontWeight={500}
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
                  fontWeight={500}
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
        </Flex>

        <Flex display={{ base: 'block', md: 'none' }} textColor='black'>
          <Button paddingX='4px' paddingY='2px' onClick={(e) => props.handleMobileMenuClick(e)} backgroundColor='white'>
            {props.showMobileOptions ? <ImMenu4 fontSize={26}/> : <ImMenu3 fontSize={26}/>}
          </Button>
        </Flex>
      </Flex>
    </Flex>
  )
}
