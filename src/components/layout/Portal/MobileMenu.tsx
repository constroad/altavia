import { MouseEvent } from 'react'
import { useRouter } from 'next/router'
import { signOut, useSession } from 'next-auth/react'
import { Flex, Text } from '@chakra-ui/react'

import { toast } from 'src/components/Toast'
import { APP_ROUTES } from 'src/common/consts'
import { DisplayOptionIcon, HideOptionIcon } from 'src/common/icons'
import { GenerateNavOptions, nosotrosOptions, serviciosOptions } from './config'

interface IMobileMenu {
  toggleNosotrosMenu: (option: string) => void
  toggleServiciossMenu: (option: string) => void
  nosotrosMenu: string | undefined
  serviciosMenu: string | undefined
  display: boolean | undefined
}

export const MobileMenu = (props: IMobileMenu) => {
  const router = useRouter()
  const path = router.pathname
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

  const handleGoToAdminClick = () => {
    router.push('/admin')
  }

  return (
    <Flex
      position='fixed'
      top={{ base: '65px', md: '95px' }}
      left="0"
      width='100%'
      height='auto'
      zIndex={1000}
      backgroundColor='white'
      flexDir='column'
      alignItems='center'
      borderBottom="1px solid rgba(0, 0, 0, 0.1)"
      boxShadow="0px 2px 4px rgba(0, 0, 0, 0.1)"
      borderTop='1px solid'
      borderColor='lightgray'
      className={`${props.display ? 'opacity-100 unfold' : 'opacity-0'}`}
    >
      {session && (
        <Flex
          flexDir='row'
          fontSize={14}
          fontWeight={700}
          height={'70px'}
          color={path === APP_ROUTES.login ? '#feb100' : '#004d89'}
          paddingX='20px'
          paddingY='30px'
          width='100%'
          cursor='pointer'
          _hover={{shadow: 'md'}}
          onClick={handleGoToAdminClick}
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
            color={path === opt.path ? '#feb100' : '#004d89'}
            paddingX='20px'
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
                  <HideOptionIcon color='#004d89' fontSize={19} /> :
                  <DisplayOptionIcon color='#004d89' fontSize={19} />
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
                  paddingX='20px'
                  color={path === `${opt.path}${sopt.path}` ? '#feb100' : '#004d89'}
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
          color={path === APP_ROUTES.login ? '#feb100' : '#004d89'}
          paddingX='20px'
          paddingY='30px'
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
          color={path === APP_ROUTES.login ? '#feb100' : '#004d89'}
          paddingX='20px'
          paddingY='30px'
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
