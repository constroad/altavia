import React from 'react'
import { Box, Flex, Icon, IconButton, Image, Stack, Text, Tooltip } from '@chakra-ui/react'
import { CONSTROAD_COLORS } from 'src/styles/shared'
import { AiOutlineDoubleLeft } from "react-icons/ai";
import { AiOutlineDoubleRight } from "react-icons/ai";
import { useRouter } from 'next/router';
import { APP_ROUTES } from 'src/common/consts';
import AdminNavbar from './AdminNavbar';
import { ArrowBackIcon } from 'src/common/icons';
import { useSidebar } from 'src/context';
import { CustomTooltip } from 'src/components/CustomTooltip';
import { useScreenSize } from 'src/common/hooks';

interface AdminSidebarProps {
  menuOptions?: any[]
  children: React.ReactNode
}

export const AdminSidebar = (props: AdminSidebarProps) => {
  const { menuOptions, children } = props;
  const { isExpanded, toggleSidebar } = useSidebar();
  const { isMobile, isDesktop } = useScreenSize()
  const router = useRouter()

  const handleToggleSidebar = () => {
    if (isMobile) return;
    toggleSidebar()
  };

  return (
    <Flex className='w-screen h-screen'>
      <Flex
        flexDirection='column'
        bgColor={CONSTROAD_COLORS.yellow}
        color="black"
        className='h-screen'
        flexDir='column'
        w={{ 
          base: '50px',
          md: isExpanded ? '300px' : '60px'
        }}
        h='100vh'
        justifyContent='space-between'
      >
        <Box>
          <Flex
            alignItems='center'
            justifyContent={ !isMobile ? 'space-between' : 'center'}
            px={ !isMobile ? isExpanded ? '16px' : '8px' : '4px'}
            h={{ base: '41px', md: '72px' }}
            onClick={() => router.push(APP_ROUTES.admin)}
            shadow='md'
          >
            <Flex gap='6px' alignItems='center' h='72px' cursor='pointer'>
              <Image src='/constroad.ico' alt='constroad-logo' w='25px' h='25px'/>
              {isExpanded && !isMobile && (
                <Text fontWeight={600} fontSize={18} >ConstRoad</Text>
              )}
            </Flex>

            {!isMobile && (
              <IconButton
                aria-label="Toggle sidebar"
                icon={isExpanded ? <AiOutlineDoubleLeft /> : <AiOutlineDoubleRight />}
                onClick={handleToggleSidebar}
                bg="transparent"
                color="black"
                maxWidth='20px'
                minWidth='20px'
                width='20px'
                fontSize={{ base: 14, md: 18 }}
                borderRadius="0"
                _hover={{ bg: 'transparent' }}
              />
            )}
          </Flex>

          <Stack spacing={1} mt='10px'>
            {menuOptions?.map((opt, idx) => {
              return (
                <Box key={idx}>
                  {isMobile && (
                    <CustomTooltip label={opt.name}>
                      <Flex
                        alignItems="center"
                        cursor='pointer'
                        _hover={{ bg: '#E1AB00' }}
                        bg={router.pathname.includes(opt.path) ? '#E1AB00' : ''}
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
                      </Flex>
                    </CustomTooltip>
                  )}

                  {isDesktop && (
                    <Flex
                      alignItems="center"
                      cursor='pointer'
                      _hover={{ bg: '#E1AB00' }}
                      bg={router.pathname.includes(opt.path) ? '#E1AB00' : ''}
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
                      <Text fontWeight={400} fontSize={16}>{isExpanded && !isMobile ? opt.name : ''}</Text>
                    </Flex>
                  )}
                </Box>
              )
            })}
          </Stack>
        </Box>

        <Flex>
          <Box p={4} cursor='pointer' onClick={() => router.push(APP_ROUTES.admin)} _hover={{ bg: '#E1AB00' }} w='100%'>
            <Flex alignItems="center">
              <Icon as={ArrowBackIcon} mr={2} w='20px' h='20px' />
              <Text>{isExpanded && !isMobile ? 'Volver al menu' : ''}</Text>
            </Flex>
          </Box>
        </Flex>
      </Flex>

      <Flex className='w-screen' flexDir='column'>
        <AdminNavbar />
        
        <Flex marginY={{ base: 4, md: 6 }} px={{ base: 4, md: 6 }} height={{ base: 'calc(100vh - 41px)', md: 'calc(100vh - 72px)'}} overflowY='scroll'>
          {children}
        </Flex>
      </Flex>
    </Flex>
  )
}

export default AdminSidebar
