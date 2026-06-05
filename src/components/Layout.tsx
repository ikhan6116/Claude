import Head from 'next/head';
import Link from 'next/link';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  canonical?: string;
}

export default function Layout({
  children,
  title = 'Freedom Debt Solutions | Expert Debt Relief & Consolidation Help',
  description = 'Get free debt relief consultation. We help Americans reduce credit card debt, medical bills, and unsecured debt by up to 50%. No upfront fees. Get your free quote today.',
  canonical,
}: LayoutProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://freedomdebtsolutions.com';

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {canonical && <link rel="canonical" href={`${siteUrl}${canonical}`} />}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonical ? `${siteUrl}${canonical}` : siteUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="robots" content="index, follow" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FinancialService',
              name: 'Freedom Debt Solutions',
              description: 'Professional debt relief and consolidation services',
              areaServed: 'US',
              serviceType: ['Debt Consolidation', 'Debt Relief', 'Debt Settlement', 'Credit Counseling'],
            }),
          }}
        />
      </Head>

      <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="text-xl font-bold text-primary-800">Freedom Debt Solutions</span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <Link href="/loans" className="text-gray-600 hover:text-primary-600 font-medium">
                Consolidation Loans
              </Link>
              <Link href="/debt-consolidation" className="text-gray-600 hover:text-primary-600 font-medium">
                Debt Consolidation
              </Link>
              <Link href="/debt-relief" className="text-gray-600 hover:text-primary-600 font-medium">
                Debt Relief
              </Link>
              <Link href="/blog" className="text-gray-600 hover:text-primary-600 font-medium">
                Resources
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-primary-600 font-medium">
                About Us
              </Link>
              <Link href="/get-started" className="btn-primary text-sm">
                Free Consultation
              </Link>
            </div>

            <div className="md:hidden">
              <Link href="/get-started" className="btn-primary text-sm">
                Get Help Now
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <main>{children}</main>

      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Freedom Debt Solutions</h3>
              <p className="text-sm leading-relaxed">
                Helping Americans find relief from overwhelming debt since 2024.
                Licensed and accredited debt relief specialists.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/loans" className="hover:text-white">Consolidation Loans</Link></li>
                <li><Link href="/debt-consolidation" className="hover:text-white">Debt Consolidation</Link></li>
                <li><Link href="/debt-relief" className="hover:text-white">Debt Relief Programs</Link></li>
                <li><Link href="/credit-card-debt-help" className="hover:text-white">Credit Card Debt Help</Link></li>
                <li><Link href="/medical-debt-relief" className="hover:text-white">Medical Debt Relief</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/blog" className="hover:text-white">Blog & Guides</Link></li>
                <li><Link href="/debt-calculator" className="hover:text-white">Debt Calculator</Link></li>
                <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Get Started</h4>
              <p className="text-sm mb-4">Ready to become debt-free? Get your free, no-obligation consultation today.</p>
              <Link href="/get-started" className="btn-accent text-sm inline-block">
                Free Consultation
              </Link>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-sm text-center">
            <p>&copy; {new Date().getFullYear()} Freedom Debt Solutions. All rights reserved.</p>
            <p className="mt-2 text-xs text-gray-500">
              Disclaimer: Results may vary. Not all debts are eligible for relief programs.
              We are not a loan provider. Free consultation does not guarantee enrollment.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
