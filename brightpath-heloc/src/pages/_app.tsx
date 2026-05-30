import type { AppProps } from 'next/app'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Script from 'next/script'
import { DefaultSeo } from 'next-seo'
import '@/styles/globals.css'

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
  }
}

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
  const router = useRouter()

  // Fire PageView on every client-side route change
  useEffect(() => {
    if (!PIXEL_ID) return
    const handleRouteChange = () => {
      window.fbq?.('track', 'PageView')
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => router.events.off('routeChangeComplete', handleRouteChange)
  }, [router.events])

  // Fire Lead event when the thank-you page loads
  useEffect(() => {
    if (!PIXEL_ID) return
    if (router.pathname === '/thank-you') {
      window.fbq?.('track', 'Lead')
    }
  }, [router.pathname])

  return (
    <>
      <DefaultSeo {...DEFAULT_SEO} />

      {PIXEL_ID && (
        <>
          <Script
            id="meta-pixel"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window,document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${PIXEL_ID}');
                fbq('track', 'PageView');
              `,
            }}
          />
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              height="1"
              width="1"
              style={{ display: 'none' }}
              src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        </>
      )}

      <Component {...pageProps} />
    </>
  )
}
