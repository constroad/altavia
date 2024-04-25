import { useEffect, useState } from 'react';
import type { AppProps } from 'next/app'
import { SnackbarProvider } from 'notistack'
import { ChakraProvider } from '@chakra-ui/react'
import { SessionProvider } from 'next-auth/react'
import '@/styles/globals.css'
import { QuoteProvider, SidebarProvider } from 'src/context';

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const [domLoaded, setDomLoaded] = useState(false);

  useEffect(() => {
    setDomLoaded(true);
  }, []);
  
  return (
    <>
      <SessionProvider session={session}>
        <QuoteProvider>
          <SidebarProvider>
            {domLoaded && (
              <ChakraProvider>
                <SnackbarProvider
                  maxSnack={3}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >
                  <Component {...pageProps} /> 
                </SnackbarProvider>
              </ChakraProvider>
            )}
          </SidebarProvider>
        </QuoteProvider>
      </SessionProvider>
    </>
  )
}