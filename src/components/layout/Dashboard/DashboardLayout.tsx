'use client'

import React, { ReactNode } from 'react'
import { Flex } from '@chakra-ui/react'
import Sidebar from './Sidebar'
import { useSession } from 'next-auth/react'
import { dashboardTabs } from 'src/components/Dashboard'
import { NoSessionPage } from '../NoSessionPage'

interface Props {
  children: ReactNode
}

export const DashboardLayoutContent = ({ children }: Props) => {
  const { data: session } = useSession()
  const isProduction = process.env.NODE_ENV !== 'production'
  const isValidSession = isProduction || session

  return (
    <div style={{ width: '100vw', minHeight: '100vh' }}>
      {isValidSession && (
        <Flex width="100%" minHeight="100vh">
          <Sidebar menuOptions={dashboardTabs}>
            {children}
          </Sidebar>
        </Flex>
      )}
      {!isValidSession && <NoSessionPage />}
    </div>
  )
}
