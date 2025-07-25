'use client';

import React, { useEffect } from 'react';
import { Box, Button, Flex, Icon, Stack, Text } from '@chakra-ui/react';
import { AiOutlineDoubleLeft } from 'react-icons/ai';
import { AiOutlineDoubleRight } from 'react-icons/ai';
import { useRouter, usePathname } from 'next/navigation';
import { APP_ROUTES } from 'src/common/consts';
import { ArrowBackIcon } from 'src/common/icons';
import { useScreenSize } from 'src/common/hooks';
import DashboardNavbar from './DashboardNavbar';
import { useSidebar } from 'src/context';
import { IconWrapper } from '@/components/IconWrapper/IconWrapper';
import Link from 'next/link';
import Logo from './Logo';
import { SidebarItem } from './SidebarItem';

interface AdminSidebarProps {
  menuOptions?: readonly any[];
  children: React.ReactNode;
}

export const Sidebar = (props: AdminSidebarProps) => {
  const { menuOptions, children } = props;
  const { isExpanded, toggleSidebar } = useSidebar();
  const { isMobile, isDesktop } = useScreenSize();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    router.prefetch(APP_ROUTES.dashboard)
    router.prefetch(APP_ROUTES.expenses)
    router.prefetch(APP_ROUTES.trips)
  }, [])

  const handleToggleSidebar = () => {
    if (isMobile) return;
    toggleSidebar();
  };

  const isNotDashboard = pathname !== '/dashboard';
  const widthSideBar = 220;

  return (
    <Flex>
      <Flex
        flexDirection="column"
        bgColor="primary.700"
        color="white"
        minH="100vh"
        flexDir="column"
        w={{
          base: '50px',
          md: isExpanded ? `${widthSideBar}px` : '60px',
        }}
        justifyContent="space-between"
      >
        <Box>
          <Flex
            alignItems="center"
            justifyContent={!isMobile ? 'space-between' : 'center'}
            px={!isMobile ? (isExpanded ? '16px' : '8px') : '4px'}
            h={{ base: '41px', md: '72px' }}
            shadow="md"
          >
            <Link href={APP_ROUTES.dashboard} prefetch>
              <Logo isExpanded={isExpanded} isMobile={isMobile} />
            </Link>

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
                fontSize={{ base: '14px', md: '18px' }}
                borderRadius="0"
                _hover={{ bg: 'transparent' }}
              >
                {isExpanded ? (
                  <IconWrapper icon={AiOutlineDoubleLeft} />
                ) : (
                  <IconWrapper icon={AiOutlineDoubleRight} />
                )}
              </Button>
            )}
          </Flex>

          <Stack mt="10px">
            {menuOptions?.map((opt, idx) => {
              return (
                <SidebarItem
                  key={idx}
                  opt={opt}
                  pathname={pathname}
                  isExpanded={isExpanded}
                  isMobile={isMobile}
                />
              );
            })}
          </Stack>
        </Box>

        <Box
          p={4}
          _hover={{ bg: 'gray.600' }}
          w="100%"
          bg="black"
          color="white"
        >
          {isNotDashboard ? (
            <Link href={APP_ROUTES.dashboard} prefetch>
              <Flex alignItems="center">
                <IconWrapper icon={ArrowBackIcon} fontWeight={600} />
                <Text fontWeight={600}>
                  {isExpanded && !isMobile ? 'Volver al dashboard' : ''}
                </Text>
              </Flex>
            </Link>
          ) : (
            <Flex alignItems="center" justifyContent="center">
              <Box w="20px" h="20px" />
              <Text fontWeight={600}>
                {isExpanded && !isMobile ? 'Altavía Perú' : ''}
              </Text>
            </Flex>
          )}
        </Box>
      </Flex>

      <Flex
        w={{
          base: 'calc(100vw - 50px)',
          md: isExpanded
            ? `calc(100vw - ${widthSideBar}px)`
            : 'calc(100vw - 60px)',
        }}
        flexDir="column"
      >
        <DashboardNavbar />

        <Flex
          px={{ base: 4, md: 6 }}
          minHeight={{
            base: 'calc(100vh - 48px)',
            md: 'calc(100vh - 72px)',
          }}
          py={4}
          // className='scrollbar-fino'
          w={isMobile ? 'calc(100vw - 50px)' : ''}
          flexDir="column"
        >
          {children}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Sidebar;
