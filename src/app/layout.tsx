// src/app/layout.tsx
'use client'

import { ReactNode, useEffect, useState } from 'react'
import { ChakraProviderWrapper } from '../chakra-provider'
import { SnackbarProvider } from 'notistack'
import { SessionProvider } from 'next-auth/react'
import { ToastProvider } from '../components/Toast'
import '../styles/globals.css'

// export const metadata = {
//   themeColor: '#000000',
//   authors: [{ name: 'Constroad' }],
// }

export default function RootLayout({ children }: { children: ReactNode }) {
  const [domLoaded, setDomLoaded] = useState(false)

  useEffect(() => {
    setDomLoaded(true)
  }, [])

  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/img/logos/altavia.ico" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600;700&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;600;700&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Anek+Devanagari:wght@400;600;800;900&display=swap" />
        <script async src="https://www.googletagmanager.com/gtag/js?id=AW-16451484138"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-16451484138');
            `,
          }}
        />
      </head>
      <body className="min-h-[100vh] w-full flex flex-col">
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
      </body>
    </html>
  )
}
