import React, { ReactNode } from 'react'
import { CustomHead } from '../Portal/CustomHead';
import { Flex } from '@chakra-ui/react';
import AdminSidebar from './AdminSidebar';
import { administrationTabs } from 'src/components/admin';
import { NoSessionPage } from '../NoSessionPage';
import { useSession } from 'next-auth/react';

interface AdministrationLayoutProps {
  children: ReactNode;
}

export const AdministrationLayout = (props: AdministrationLayoutProps) => {
  const { data: session } = useSession() 

  return (
    <div className='w-full min-h-screen'>
      <CustomHead />

      {session && (
        <Flex>
          <AdminSidebar menuOptions={administrationTabs} >
            {props.children}
          </AdminSidebar>
        </Flex>
      )}

      {!session && (
        <NoSessionPage />
      )}
    </div>
  )
}

export default AdministrationLayout
