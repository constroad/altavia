'use client';

import React, { ReactNode } from 'react';
import { CustomHead } from '../Portal/CustomHead';
import { Flex, Show, Text } from '@chakra-ui/react';
import Sidebar from './Sidebar';
import { useSession } from 'next-auth/react';
import { dashboardTabs } from 'src/components/Dashboard';
import { NoSessionPage } from '../NoSessionPage';

interface DashboardLayoutProps {
  title?: string;
  actions?: React.ReactNode;
  children: ReactNode;
}

export const DashboardLayout = (props: DashboardLayoutProps) => {
  const { title, actions } = props;
  const { data: session } = useSession();

  return (
    <div style={{ width: '100vw', minHeight: '100vh' }}>
      <CustomHead />

      {session && (
        <Flex>
          <Sidebar menuOptions={dashboardTabs}>
            <Flex
              width="100%"
              justifyContent="space-between"
              alignItems="center"
              mb={4}
            >
              <Show when={title}>
                <Text
                  fontSize={{ base: 16, md: 25 }}
                  fontWeight={700}
                  lineHeight={{ base: '28px', md: '39px' }}
                >
                  {title}
                </Text>
              </Show>
              {actions}
            </Flex>
            {props.children}
          </Sidebar>
        </Flex>
      )}

      {!session && <NoSessionPage />}
    </div>
  );
};

export default DashboardLayout;
