import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { ReactNode, useState } from 'react';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  canonical?: string;
}

export default function Layout({
  children,
  title = 'BrightPath Finance | Personal Loans & Debt Consolidation',
  description = 'Consolidate your debt into one simple monthly payment with lower rates. Personal loans from $5,000 to $100,000+. Check your rate — no impact to your credit score.',
  canonical,
}: LayoutProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://loans.brightpath-fin.com';
  const [mobileOpen, setMobileOpen] = useState(false);

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
              name: 'BrightPath Finance',
              description: 'Personal loans and debt consolidation loans',
              areaServed: 'US',
              serviceType: ['Personal Loans', 'Debt Consolidation Loans'],
            }),
          }}
        />
      </Head>

      {/* ── Header ── */}
      <header className="bg-white sticky top-0 z-50" style={{ borderBottom: '1px solid #d9d9d9' }}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-18 py-3">

            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image
                src="/brightpath-logo.svg"
                alt="BrightPath Finance"
                width={200}
                height={56}
                priority
              />
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/loans" className="font-medium transition-colors duration-200 hover:text-primary-500" style={{ color: '#494949' }}>
                Debt Consolidation
              </Link>
              <Link href="/personal-loans" className="font-medium transition-colors duration-200 hover:text-primary-500" style={{ color: '#494949' }}>
                Personal Loans
              </Link>
              <Link href="/about" className="font-medium transition-colors duration-200 hover:text-primary-500" style={{ color: '#494949' }}>
                About Us
              </Link>
              <a href="tel:877-867-2002" className="font-medium text-sm" style={{ color: '#0d1b2a' }}>
                877-867-2002
              </a>
              <Link href="/loans" className="btn-primary text-sm py-2.5 px-5">
                Check My Rate
              </Link>
            </div>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 rounded-lg"
              style={{ color: '#0d1b2a' }}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>

          {/* Mobile dropdown */}
          {mobileOpen && (
            <div className="md:hidden pb-4 space-y-3 border-t pt-4" style={{ borderColor: '#d9d9d9' }}>
              <Link href="/loans" className="block font-medium py-2" style={{ color: '#494949' }} onClick={() => setMobileOpen(false)}>
                Debt Consolidation
              </Link>
              <Link href="/personal-loans" className="block font-medium py-2" style={{ color: '#494949' }} onClick={() => setMobileOpen(false)}>
                Personal Loans
              </Link>
              <Link href="/about" className="block font-medium py-2" style={{ color: '#494949' }} onClick={() => setMobileOpen(false)}>
                About Us
              </Link>
              <a href="tel:877-867-2002" className="block font-medium py-2" style={{ color: '#0d1b2a' }}>877-867-2002</a>
              <Link href="/loans" className="btn-primary w-full text-center text-sm" onClick={() => setMobileOpen(false)}>
                Check My Rate
              </Link>
            </div>
          )}
        </nav>
      </header>

      <main>{children}</main>

      {/* ── Footer ── */}
      <footer style={{ background: '#0d1b2a', color: '#d9d9d9' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

            {/* Brand col */}
            <div className="md:col-span-1">
              <div className="mb-4">
                <Image src="/brightpath-logo.svg" alt="BrightPath Finance" width={160} height={45}
                  style={{ filter: 'brightness(0) invert(1)' }} />
              </div>
              <p className="text-sm leading-relaxed" style={{ color: '#77b6e8', opacity: 0.8 }}>
                Helping Americans simplify their finances with transparent personal loans
                and debt consolidation solutions.
              </p>
              <a href="tel:877-867-2002" className="mt-4 block text-sm font-semibold" style={{ color: '#77b6e8' }}>
                877-867-2002
              </a>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-white text-sm uppercase tracking-wider">Loan Products</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/loans" className="hover:text-white transition-colors" style={{ color: '#d9d9d9' }}>Debt Consolidation Loans</Link></li>
                <li><Link href="/personal-loans" className="hover:text-white transition-colors" style={{ color: '#d9d9d9' }}>Personal Loans</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-white text-sm uppercase tracking-wider">Company</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/about" className="hover:text-white transition-colors" style={{ color: '#d9d9d9' }}>About Us</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors" style={{ color: '#d9d9d9' }}>Blog</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-white text-sm uppercase tracking-wider">Get Started</h4>
              <p className="text-sm mb-5" style={{ color: '#d9d9d9' }}>
                Check your rate in minutes with no impact to your credit score.
              </p>
              <Link href="/loans" className="btn-primary text-sm py-2.5 px-5 inline-block">
                Check My Rate
              </Link>
            </div>
          </div>

          <div className="mt-12 pt-6 text-xs text-center" style={{ borderTop: '1px solid rgba(119,182,232,0.2)', color: '#aaaaaa' }}>
            <p>&copy; {new Date().getFullYear()} BrightPath Finance. All rights reserved.</p>
            <p className="mt-2 max-w-3xl mx-auto" style={{ color: '#888' }}>
              BrightPath Finance is a lending marketplace. All loan offers are subject to credit approval.
              Rates, terms, and conditions vary by applicant. A soft credit inquiry does not affect your credit score.
              Not all applicants will qualify.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
