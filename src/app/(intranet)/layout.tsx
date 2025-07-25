'use client'

import { ReactNode } from 'react'
import { DashboardLayoutContent } from '@/components/layout/Dashboard/DashboardLayout'

export default function IntranetLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardLayoutContent>
      {children}
    </DashboardLayoutContent>
  )
}
