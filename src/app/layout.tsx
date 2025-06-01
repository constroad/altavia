// src/app/layout.tsx
import '../styles/globals.css'
import Providers from './providers'
import type { ReactNode } from 'react'

export const metadata = {
  title: 'Altavía',
  description: 'Transporte de carga en Perú',
}

export default function RootLayout({ children }: { children: ReactNode }) {
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
      <body style={{ minHeight: '100vh', width: '100%', display: 'flex', flexDirection: 'column' }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
