import { MouseEvent } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Flex, Text } from '@chakra-ui/react'

import { DisplayOptionIcon, HideOptionIcon } from 'src/common/icons'
import { GenerateNavOptions, serviciosOptions } from './config'
import { signOut, useSession } from 'next-auth/react'
import { APP_ROUTES } from '@/common/consts'
import { toast } from '@/components/Toast'

interface IMobileMenu {
  toggleNosotrosMenu: (option: string) => void
  toggleServiciossMenu: (option: string) => void
  nosotrosMenu: string | undefined
  serviciosMenu: string | undefined
  display: boolean | undefined
}

export const MobileMenu = (props: IMobileMenu) => {
  const router = useRouter()
  const path = usePathname()
  const { data: session } = useSession()

  const handleSignOut = () => {
    signOut({redirect: false});
    router.push(APP_ROUTES.home);
    toast.info('Cerraste sesión');
  }

  const handleOptionClick = async(e: MouseEvent<HTMLDivElement>, option: any) => {
    e.preventDefault()
    if (option.label === 'Servicios') {
      props.toggleServiciossMenu(option.label)
    } else {
      router.push(option.path)
    }
  }

  const handleGoToDashboardClick = () => {
    router.push('/dashboard')
  }

  return (
    <Flex
      position='fixed'
      top={{ base: '50px', md: '95px' }}
      left="0"
      width='100%'
      height='auto'
      zIndex={1000}
      backgroundColor='primary.400'
      flexDir='column'
      alignItems='center'
      borderBottom="0px solid rgba(0, 0, 0, 0.1)"
      boxShadow="0px 2px 4px rgba(0, 0, 0, 0.1)"
      borderTop='0px solid'
      borderColor='lightgray'
      className={`${props.display ? 'opacity-100 unfold' : 'opacity-0'}`}
    >
      {session && (
        <Flex
          flexDir='row'
          fontSize={14}
          fontWeight={700}
          height={'70px'}
          color={path === APP_ROUTES.login ? 'white' : 'white'}
          padding='30px'
          width='100%'
          cursor='pointer'
          _hover={{shadow: 'md'}}
          onClick={handleGoToDashboardClick}
          borderBottom="1px solid rgba(0, 0, 0, 0.1)"
        >
          Intranet
        </Flex>
      )}
      {GenerateNavOptions().map(opt => (
        <Flex
          flexDir='column'
          key={opt.label}
          position='relative'
          alignItems='start'
          width='full'
          height='min-content'
          borderBottom="1px solid rgba(0, 0, 0, 0.1)"
          cursor='pointer'
          _hover={{shadow: 'md'}}
          onClick={(e) => handleOptionClick(e, opt)}
        >
          <Flex
            flexDir='row'
            fontSize={14}
            fontWeight={700}
            height={'70px'}
            color={path === opt.path ? 'white' : 'white'}
            paddingX='30px'
            paddingY='30px'
            width='100%'
          >
            {opt.label === 'Nosotros' && (
              <Flex width='full' justifyContent='space-between'>
                {opt.label}
              </Flex>
            )}
            {opt.label === 'Servicios' && (
              <Flex width='full' justifyContent='space-between'>
                {opt.label}
                {props.serviciosMenu ?
                  <HideOptionIcon color='white' fontSize={19} /> :
                  <DisplayOptionIcon color='white' fontSize={19} />
                }
              </Flex>
            )}
            {opt.label !== 'Nosotros' && opt.label !== 'Servicios' && (
              opt.label
            )}
          </Flex>

          {/* SERVICIOS */}
          {props.serviciosMenu === 'Servicios' && opt.label === 'Servicios' && (
            <Flex
              flexDir='column'
              height='auto'
              width='100%'
              className={
                props.serviciosMenu === 'Servicios' && opt.label === 'Servicios' ?
                'opacity-100 unfold' :
                'opacity-0'
              }
            >
              {serviciosOptions.map(sopt => (
                <Flex
                  flexDir='column'
                  justifyContent='center'
                  width='full'
                  height='51px'
                  paddingY='10px'
                  paddingX='20px'
                  key={sopt.label}
                  borderTop="1px solid rgba(0, 0, 0, 0.1)"
                  cursor='pointer'
                  _hover={{shadow: 'md'}}
                  onClick={(e) => {
                    e.stopPropagation()
                    router.push(`${opt.path}${sopt.path}`)
                  }}
                >
                  <Text
                    width='100%'
                    fontSize={12}
                    fontWeight={700}
                    paddingX='40px'
                    color={path === `${opt.path}${sopt.path}` ? 'white' : 'white'}
                  >
                    - {sopt.label}
                  </Text>
                </Flex>
              ))}
            </Flex>
          )}
        </Flex>
      ))}

      {!session && (
        <Flex
          flexDir='row'
          fontSize={14}
          fontWeight={700}
          height={'70px'}
          color={path === APP_ROUTES.login ? 'white' : 'white'}
          padding='30px'
          width='100%'
          cursor='pointer'
          _hover={{shadow: 'md'}}
          onClick={() => router.push(APP_ROUTES.login)}
        >
          Inicia sesión
        </Flex>
      )}

      {session && (
        <Flex
          flexDir='row'
          fontSize={14}
          fontWeight={700}
          height={'70px'}
          color={path === APP_ROUTES.login ? 'white' : 'white'}
          padding='30px'
          width='100%'
          cursor='pointer'
          _hover={{shadow: 'md'}}
          onClick={handleSignOut}
        >
          Cerrar sesión
        </Flex>
      )}
    </Flex>
  )
}
