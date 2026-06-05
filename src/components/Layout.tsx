import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { ReactNode, useState, useEffect } from 'react';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  canonical?: string;
  hideStickyCTA?: boolean;
}

export default function Layout({
  children,
  title = 'BrightPath Finance | Personal Loans & Debt Consolidation',
  description = 'Consolidate your debt into one simple payment with lower rates. Check your rate — no credit score impact.',
  canonical,
  hideStickyCTA = false,
}: LayoutProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://loans.brightpath-fin.com';
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
              telephone: '+18778672002',
              email: 'team@brightpath-fin.com',
              address: {
                '@type': 'PostalAddress',
                streetAddress: '898 South State St Ste 310 #714',
                addressLocality: 'Orem',
                addressRegion: 'UT',
                postalCode: '84058',
              },
            }),
          }}
        />
      </Head>

      {/* ── Top bar ── */}
      <div className="hidden sm:block text-xs py-1.5" style={{ background: '#0d1b2a', color: 'rgba(255,255,255,0.6)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <span>NMLS #2670114</span>
          <div className="flex items-center space-x-4">
            <a href="mailto:team@brightpath-fin.com" className="hover:text-white transition-colors">team@brightpath-fin.com</a>
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
            <a href="tel:877-867-2002" className="hover:text-white transition-colors">877-867-2002</a>
          </div>
        </div>
      </div>

      {/* ── Header ── */}
      <header className={`bg-white sticky top-0 z-50 transition-shadow duration-300 ${scrolled ? 'shadow-md' : ''}`}
        style={{ borderBottom: scrolled ? 'none' : '1px solid #e9ecef' }}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <Image src="/brightpath-logo.svg" alt="BrightPath Finance" width={180} height={50} priority />
            </Link>

            <div className="hidden lg:flex items-center space-x-8">
              <Link href="/loans" className="text-sm font-medium hover:opacity-70 transition-opacity" style={{ color: '#494949' }}>
                Debt Consolidation
              </Link>
              <Link href="/personal-loans" className="text-sm font-medium hover:opacity-70 transition-opacity" style={{ color: '#494949' }}>
                Personal Loans
              </Link>
              <Link href="/about" className="text-sm font-medium hover:opacity-70 transition-opacity" style={{ color: '#494949' }}>
                About
              </Link>
              <a href="tel:877-867-2002" className="text-sm font-semibold" style={{ color: '#0d1b2a' }}>877-867-2002</a>
              <Link href="/loans" className="btn-primary text-sm py-2.5 px-6">View Your Rate</Link>
            </div>

            <div className="lg:hidden flex items-center space-x-3">
              <Link href="/loans" className="btn-primary text-xs py-2 px-4">View Your Rate</Link>
              <button onClick={() => setMobileOpen(!mobileOpen)} style={{ color: '#0d1b2a' }} aria-label="Menu">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  {mobileOpen
                    ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
                </svg>
              </button>
            </div>
          </div>

          {mobileOpen && (
            <div className="lg:hidden pb-4 space-y-1" style={{ borderTop: '1px solid #e9ecef' }}>
              {[
                { href: '/loans', label: 'Debt Consolidation' },
                { href: '/personal-loans', label: 'Personal Loans' },
                { href: '/about', label: 'About' },
              ].map(link => (
                <Link key={link.href} href={link.href}
                  className="block py-3 px-2 text-sm font-medium rounded-lg hover:bg-gray-50"
                  style={{ color: '#494949' }} onClick={() => setMobileOpen(false)}>
                  {link.label}
                </Link>
              ))}
              <a href="tel:877-867-2002" className="block py-3 px-2 text-sm font-semibold" style={{ color: '#0d1b2a' }}>
                877-867-2002
              </a>
            </div>
          )}
        </nav>
      </header>

      <main>{children}</main>

      {/* ── Sticky bottom CTA (mobile) ── */}
      {!hideStickyCTA && (
        <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white py-3 px-4 shadow-[0_-2px_10px_rgba(0,0,0,0.08)]">
          <Link href="/loans" className="btn-primary w-full text-center text-sm py-3 block">
            View Your Rate
          </Link>
        </div>
      )}

      {/* ── Footer ── */}
      <footer style={{ background: '#0d1b2a' }} className="pb-20 lg:pb-0">
        {/* Main footer */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">

            <div className="md:col-span-4">
              <Image src="/brightpath-logo-white.svg" alt="BrightPath Finance" width={160} height={44} />
              <p className="text-sm mt-4 leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
                Personal loans and debt consolidation solutions designed to simplify your financial life.
              </p>
              <div className="mt-5 space-y-2 text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                <p>898 South State St Ste 310 #714</p>
                <p>Orem, UT 84058</p>
              </div>
            </div>

            <div className="md:col-span-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">Products</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/loans" className="transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.55)' }}>Debt Consolidation</Link></li>
                <li><Link href="/personal-loans" className="transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.55)' }}>Personal Loans</Link></li>
              </ul>
            </div>

            <div className="md:col-span-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">Company</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/about" className="transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.55)' }}>About Us</Link></li>
                <li><Link href="/blog" className="transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.55)' }}>Blog</Link></li>
              </ul>
            </div>

            <div className="md:col-span-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">Contact</h4>
              <ul className="space-y-3 text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
                <li><a href="tel:877-867-2002" className="hover:text-white transition-colors">877-867-2002</a></li>
                <li><a href="mailto:team@brightpath-fin.com" className="hover:text-white transition-colors">team@brightpath-fin.com</a></li>
              </ul>
              <div className="mt-6">
                <Link href="/loans" className="btn-primary text-sm py-2.5 px-6 inline-block">View Your Rate</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Legal / Disclosures */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-xs leading-relaxed space-y-3" style={{ color: 'rgba(255,255,255,0.35)' }}>
              <p>
                &copy; {new Date().getFullYear()} BrightPath Finance. All rights reserved. NMLS #2670114.
                898 South State St Ste 310 #714, Orem, UT 84058.
              </p>
              <p>
                BrightPath Finance is a lending marketplace. All loan offers are subject to credit approval.
                Your actual rate depends upon credit score, loan amount, loan term, credit usage and history.
                The APR ranges from 5.99% to 24.99%. Loan amounts range from $5,000 to $100,000. Repayment
                terms range from 24 to 84 months. Origination fee ranges from 0% to 6%.
              </p>
              <p>
                Checking your rate generates a soft credit inquiry, which is visible to you but does not
                affect your credit score. If you accept a loan offer, a hard inquiry will be made which
                could impact your credit score.
              </p>
              <p>
                Not all applicants will qualify for the lowest rate or largest loan amount. Lowest rates
                are reserved for the most creditworthy applicants. Rate and terms are subject to change
                at any time without notice.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
