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
  title = 'BrightPath Finance | Personal Loans & Debt Consolidation',
  description = 'Consolidate your debt into one simple monthly payment with lower rates. Personal loans from $5,000 to $100,000+. Check your rate — no impact to your credit score.',
  canonical,
}: LayoutProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://loans.brightpath-fin.com';

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

      <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <span className="text-xl font-bold text-primary-800">BrightPath Finance</span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <Link href="/loans" className="text-gray-600 hover:text-primary-600 font-medium">
                Debt Consolidation
              </Link>
              <Link href="/personal-loans" className="text-gray-600 hover:text-primary-600 font-medium">
                Personal Loans
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-primary-600 font-medium">
                About Us
              </Link>
              <Link href="/loans" className="btn-primary text-sm">
                Check My Rate
              </Link>
            </div>

            <div className="md:hidden">
              <Link href="/loans" className="btn-primary text-sm">
                Check My Rate
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
              <h3 className="text-white font-bold text-lg mb-4">BrightPath Finance</h3>
              <p className="text-sm leading-relaxed">
                Helping Americans simplify their finances with personal loans
                and debt consolidation solutions.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Loan Products</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/loans" className="hover:text-white">Debt Consolidation Loans</Link></li>
                <li><Link href="/personal-loans" className="hover:text-white">Personal Loans</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-white">About Us</Link></li>
                <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Get Started</h4>
              <p className="text-sm mb-4">Ready to simplify your finances? Check your rate with no impact to your credit score.</p>
              <Link href="/loans" className="btn-accent text-sm inline-block">
                Check My Rate
              </Link>
              <p className="text-sm mt-4">
                <a href="tel:877-867-2002" className="hover:text-white">877-867-2002</a>
              </p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-sm text-center">
            <p>&copy; {new Date().getFullYear()} BrightPath Finance. All rights reserved.</p>
            <p className="mt-2 text-xs text-gray-500">
              BrightPath Finance is a lending marketplace. All loan offers are subject to
              credit approval. Rates, terms, and conditions vary by applicant. A soft credit
              inquiry does not affect your credit score. Not all applicants will qualify.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
