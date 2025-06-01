// src/app/providers.tsx
'use client'

import { ReactNode, useEffect, useState } from 'react'
import { ChakraProviderWrapper } from '../chakra-provider'
import { SnackbarProvider } from 'notistack'
import { SessionProvider } from 'next-auth/react'
import { ToastProvider } from '../components/Toast'

export default function Providers({ children }: { children: ReactNode }) {
  const [domLoaded, setDomLoaded] = useState(false)

  useEffect(() => {
    setDomLoaded(true)
  }, [])

  return (
    <ToastProvider>
      <SessionProvider>
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
      </SessionProvider>
    </ToastProvider>
  )
}
