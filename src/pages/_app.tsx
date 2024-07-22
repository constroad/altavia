import { useEffect, useState } from 'react';
import type { AppProps } from 'next/app';
import { SnackbarProvider } from 'notistack';
import { ChakraProvider } from '@chakra-ui/react';
import { SessionProvider } from 'next-auth/react';
import { ToastProvider } from 'src/components/Toast';
import '@/styles/globals.css';


export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const [domLoaded, setDomLoaded] = useState(false);

  useEffect(() => {
    setDomLoaded(true);
  }, []);

  return (
    <ToastProvider>
      <SessionProvider session={session}>
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
      </SessionProvider>
    </ToastProvider>
  );
}
