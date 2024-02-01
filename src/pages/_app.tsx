import { useEffect, useState } from 'react';
import type { AppProps } from 'next/app'
import { SnackbarProvider } from 'notistack'
import { ChakraProvider } from '@chakra-ui/react'
import '@/styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  const [domLoaded, setDomLoaded] = useState(false);

  useEffect(() => {
    setDomLoaded(true);
  }, []);
  
  return (
    <>
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
    </>
  )
}