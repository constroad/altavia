import HomePageContent from './page-content'

export const metadata = {
  title: 'Altavía Perú',
  description: 'Transporte de carga por carretera',
  keywords: 'Transporte de carga por carretera, transporte peru, peru, cotiza, carretera',
  openGraph: {
    title: 'Altavía Perú',
    description: 'Transporte de carga por carretera',
    url: 'https://altaviaperu.com',
    images: ['/img/logos/altavia-peru.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Altavía Perú',
    description: 'Transporte de carga por carretera',
    images: ['/img/logos/altavia-peru.png'],
  },
}

export default function Page() {
  return <HomePageContent />
}
