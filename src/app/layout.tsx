// src/app/layout.tsx
import '../styles/globals.css'
import Providers from './providers'
import type { ReactNode } from 'react'
import { Rubik, Roboto, Anek_Devanagari } from 'next/font/google';

const rubik = Rubik({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const anek = Anek_Devanagari({
  subsets: ['latin'],
  weight: ['400', '600', '800'],
  display: 'swap',
});

export const metadata = {
  title: 'Altavía',
  description: 'Transporte de carga en Perú',
  metadataBase: new URL('https://altaviaperu.com'),
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className={rubik.className}>
      <head>
        <link rel="icon" href="/img/logos/altavia.ico" />
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
      <body style={{ minHeight: '100vh', width: '100%', display: 'flex', flexDirection: 'column' }}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
