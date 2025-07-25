'use client'

import { ReactNode } from 'react'
import { ChakraProviderWrapper } from '../chakra-provider'
import { SessionProvider } from 'next-auth/react'
import { ToastProvider } from '../components/Toast'
import { SidebarProvider } from 'src/context'

interface ProvidersProps {
  children: ReactNode
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <ToastProvider>
      <SessionProvider>
        <SidebarProvider>
          <ChakraProviderWrapper>
            {children}
          </ChakraProviderWrapper>
        </SidebarProvider>
      </SessionProvider>
    </ToastProvider>
  )
}
