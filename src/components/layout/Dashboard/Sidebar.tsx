'use client'

import React from 'react'
import { Box, Button, Flex, Icon, Image, Stack, Text } from '@chakra-ui/react'
import { AiOutlineDoubleLeft } from "react-icons/ai";
import { AiOutlineDoubleRight } from "react-icons/ai";
import { useRouter, usePathname } from 'next/navigation';
import { APP_ROUTES } from 'src/common/consts';
import { ArrowBackIcon } from 'src/common/icons';
import { useScreenSize } from 'src/common/hooks';
import DashboardNavbar from './DashboardNavbar';
import { useSidebar } from 'src/context';

interface AdminSidebarProps {
  menuOptions?: any[]
  children: React.ReactNode
}

export const Sidebar = (props: AdminSidebarProps) => {
  const { menuOptions, children } = props;
  const { isExpanded, toggleSidebar } = useSidebar();
  const { isMobile, isDesktop } = useScreenSize()
  const router = useRouter()
  const pathname = usePathname()

  const handleToggleSidebar = () => {
    if (isMobile) return;
    toggleSidebar()
  };

  const isNotDashboard = pathname !== '/dashboard'

  return (
    <Flex>
      <Flex
        flexDirection='column'
        bgColor='primary.700'
        color="white"
        h='100vh'
        flexDir='column'
        w={{ 
          base: '50px',
          md: isExpanded ? '250px' : '60px'
        }}
        justifyContent='space-between'
      >
        <Box>
          <Flex
            alignItems='center'
            justifyContent={ !isMobile ? 'space-between' : 'center'}
            px={ !isMobile ? isExpanded ? '16px' : '8px' : '4px'}
            h={{ base: '41px', md: '72px' }}
            shadow='md'
          >
            <Flex gap='6px' alignItems='center' h='72px' cursor='pointer' onClick={() => router.push(APP_ROUTES.dashboard)}>
              <Image src='/img/logos/altavia.ico' alt='altavia-logo' w='25px' h='25px'/>
              {isExpanded && !isMobile && (
                <Text fontWeight={600} fontSize={18} className='font-logo' mt='8px'>Altavía Perú</Text>
              )}
            </Flex>

            {!isMobile && (
              <Button
                aria-label="Toggle sidebar"
                onClick={handleToggleSidebar}
                bg="transparent"
                color="white"
                maxW="20px"
                minW="20px"
                w="20px"
                h="20px"
                p="0"
                fontSize={{ base: "14px", md: "18px" }}
                borderRadius="0"
                _hover={{ bg: 'transparent' }}
              >
                {isExpanded ? <AiOutlineDoubleLeft /> : <AiOutlineDoubleRight />}
              </Button>
            )}
          </Flex>

          <Stack mt='10px'>
            {menuOptions?.map((opt, idx) => {
              return (
                <Box key={idx}>
                  <Flex
                    alignItems="center"
                    cursor='pointer'
                    _hover={{ bg: 'primary.400' }}
                    bg={pathname.includes(opt.path) ? 'primary.400' : ''}
                    p={4}
                    h='56px'
                    minH='56px'
                    maxH='56px'
                    onClick={ opt.path !== null ?
                      () => router.push(opt.path) :
                      () => null
                    }
                  >
                    <Icon as={opt.icon} mr={2} w={{ base: '18px', md: '22px' }} h={{ base: '18px', md: '22px'}} />
                    {!isMobile && (
                      <Text fontWeight={500} fontSize={16}>{isExpanded && !isMobile ? opt.name : ''}</Text>
                    )}
                  </Flex>
                </Box>
              )
            })}
          </Stack>
        </Box>

        <Flex>
          <Box
            p={4}
            cursor='pointer'
            onClick={
              () => isNotDashboard 
                ? router.push(APP_ROUTES.dashboard) 
                : null
            }
            _hover={{ bg: 'gray.600' }}
            w='100%'
            bg='black'
            color='white'
          >
            <Flex alignItems="center" justifyContent={ isNotDashboard ? '' : 'center' }>
              {
                isNotDashboard 
                  ? <Icon as={ArrowBackIcon} mr={3} w='20px' h='20px' fontWeight={600} /> 
                  : <Box w='20px' h='20px' />
              }
              <Text fontWeight={600}>
                {
                  isExpanded && !isMobile
                    ? isNotDashboard
                      ? 'Volver al dashboard'
                      : 'Altavía Perú'
                    : ''
                }
              </Text>
            </Flex>
          </Box>
        </Flex>
      </Flex>

      <Flex
        w={{
          base: 'calc(100vw - 50px)',
          md: isExpanded ? 'calc(100vw - 250px)' : 'calc(100vw - 60px)'
        }}
        flexDir='column'
      >
        <DashboardNavbar />
        
        <Flex
          px={{ base: 4, md: 6 }}
          height={{
            base: 'calc(100vh - 41px)',
            md: 'calc(100vh - 72px)'
          }}
          py={2}
          pt={6}
          overflowY='scroll'
          w={isMobile ? 'calc(100vw - 50px)' : ''}
          flexDir="column"
        >
          {children}
        </Flex>
      </Flex>
    </Flex>
  )
}

export default Sidebar
