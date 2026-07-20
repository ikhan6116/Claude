import type { AppProps } from 'next/app'
import { DefaultSeo } from 'next-seo'
import '@/styles/globals.css'

const DEFAULT_SEO = {
  titleTemplate: '%s | BrightPath Finance',
  defaultTitle: 'BrightPath Finance',
  description: 'BrightPath Finance — your path to smarter home financing.',
  canonical: 'https://app.brightpath-fin.com',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://app.brightpath-fin.com',
    siteName: 'BrightPath Finance',
    title: 'BrightPath Finance',
    description: 'BrightPath Finance — your path to smarter home financing.',
  },
  twitter: {
    cardType: 'summary_large_image',
  },
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <DefaultSeo {...DEFAULT_SEO} />
      <Component {...pageProps} />
    </>
  )
}
