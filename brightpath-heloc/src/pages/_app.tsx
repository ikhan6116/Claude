import type { AppProps } from 'next/app'
import { DefaultSeo } from 'next-seo'
import '@/styles/globals.css'

const DEFAULT_SEO = {
  titleTemplate: '%s | BrightPath Finance',
  defaultTitle: 'BrightPath Finance – HELOC',
  description:
    'Unlock your home equity with BrightPath Finance. Access up to $400,000 with competitive HELOC rates. Fast approval, no closing costs on most loans.',
  canonical: 'https://heloc.brightpath-fin.com',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://heloc.brightpath-fin.com',
    siteName: 'BrightPath Finance – HELOC',
    title: 'BrightPath Finance – HELOC',
    description:
      'Unlock your home equity with BrightPath Finance. Access up to $400,000 with competitive HELOC rates.',
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
