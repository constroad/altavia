'use client'

import { ReactNode, useEffect, useState } from 'react'
import { ChakraProviderWrapper } from '../chakra-provider'
import { SnackbarProvider } from 'notistack'
import { SessionProvider } from 'next-auth/react'
import { ToastProvider } from '../components/Toast'
import { SidebarProvider } from 'src/context'

interface ProvidersProps {
  children: ReactNode
  // session: any // o `Session | null` si tienes tipos de `next-auth`
}

export default function Providers({ children }: ProvidersProps) {
  const [domLoaded, setDomLoaded] = useState(false)

  useEffect(() => {
    setDomLoaded(true)
  }, [])

  return (
    <ToastProvider>
      <SessionProvider>
        <SidebarProvider>
          {domLoaded && (
            <ChakraProviderWrapper>
              <SnackbarProvider
                maxSnack={3}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                {children}
              </SnackbarProvider>
            </ChakraProviderWrapper>
          )}
        </SidebarProvider>
      </SessionProvider>
    </ToastProvider>
  )
}
