'use client'

import React, { ReactNode, useEffect, useState } from 'react'
import { CustomHead } from '../Portal/CustomHead';
import { Flex } from '@chakra-ui/react';
import Sidebar from './Sidebar';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { dashboardTabs } from 'src/components/Dashboard';
import { NoSessionPage } from '../NoSessionPage';
import { APP_ROUTES } from '../../../common/consts';

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = (props: DashboardLayoutProps) => {
  const { data: session } = useSession();
  // const router = useRouter();
  // const userRole = session?.user?.role ?? '';
  
  return (
    <div style={{ width: '100vw', minHeight: '100vh' }}>
      <CustomHead />

      {/* {session && ( */}
        <Flex>
          <Sidebar menuOptions={dashboardTabs} > 
            { props.children }
          </Sidebar>
        </Flex>
      {/* )} */}

      {/* {!session && (
        <NoSessionPage />
      )} */}
    </div>
  )
}

export default DashboardLayout;
