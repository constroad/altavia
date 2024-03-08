import React, { ReactNode } from 'react'
import { CustomHead } from '../Portal/CustomHead';
import { Flex } from '@chakra-ui/react';
import AdminSidebar from './AdminSidebar';
import { administrationTabs } from 'src/components/admin';
import { IntranetNavbar } from '../Intranet';
import { useScreenSize } from 'src/common/hooks';

interface AdministrationLayoutProps {
  children: ReactNode;
}

export const AdministrationLayout = (props: AdministrationLayoutProps) => {
  const { isMobile } = useScreenSize()
  return (
    <div className='w-full min-h-screen'>
      <CustomHead />
      <Flex>
        <AdminSidebar menuOptions={administrationTabs} isMobile={isMobile}>
          {props.children}
        </AdminSidebar>
      </Flex>
    </div>
  )
}

export default AdministrationLayout
