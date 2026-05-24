import Link from 'next/link'
import { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="bg-brand-navy shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-brand-blue flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <div>
                <span className="text-white font-bold text-lg leading-none tracking-tight">BrightPath</span>
                <span className="text-brand-blue-accent font-medium text-lg leading-none ml-1 tracking-tight">Finance</span>
              </div>
            </Link>

            {/* Nav links */}
            <div className="hidden md:flex items-center gap-6">
              <Link href="/#how-it-works" className="text-gray-300 hover:text-white text-sm font-medium transition-colors">
                How It Works
              </Link>
              <Link href="/#benefits" className="text-gray-300 hover:text-white text-sm font-medium transition-colors">
                Benefits
              </Link>
              <Link href="/#faq" className="text-gray-300 hover:text-white text-sm font-medium transition-colors">
                FAQ
              </Link>
              <a href="tel:8778672002" className="text-gray-300 hover:text-white text-sm font-medium transition-colors">
                (877) 867-2002
              </a>
            </div>

            {/* CTA */}
            <Link
              href="/apply"
              className="bg-brand-blue hover:bg-brand-blue-light text-white font-semibold px-5 py-2 rounded-lg text-sm transition-colors shadow-md hover:shadow-lg"
            >
              Apply Now
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-brand-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-md bg-brand-blue flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <span className="font-bold text-base">BrightPath Finance</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Helping small business owners unlock their home equity with fast,
                transparent financing powered by Figure.
              </p>
            </div>

            {/* Quick links */}
            <div>
              <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-400 mb-4">
                Quick Links
              </h3>
              <ul className="space-y-2">
                <li><Link href="/apply" className="text-gray-300 hover:text-white text-sm transition-colors">Apply Now</Link></li>
                <li><Link href="/#how-it-works" className="text-gray-300 hover:text-white text-sm transition-colors">How It Works</Link></li>
                <li><Link href="/#benefits" className="text-gray-300 hover:text-white text-sm transition-colors">Benefits</Link></li>
                <li><Link href="/#faq" className="text-gray-300 hover:text-white text-sm transition-colors">FAQ</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-400 mb-4">
                Contact Us
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="tel:8778672002" className="text-gray-300 hover:text-white transition-colors">
                    (877) 867-2002
                  </a>
                </li>
                <li>
                  <a href="mailto:team@brightpath-fin.com" className="text-gray-300 hover:text-white transition-colors">
                    team@brightpath-fin.com
                  </a>
                </li>
                <li className="text-gray-400 leading-relaxed pt-1">
                  898 South State St Ste 310 #714<br />
                  Orem, UT 84058
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-gray-700 pt-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <p className="text-gray-400 text-xs">
                © {new Date().getFullYear()} BrightPath Finance. NMLS #2670114. Equal Housing Lender. Powered by Figure.
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span>Privacy Policy</span>
                <span className="text-gray-600">|</span>
                <span>Terms of Service</span>
                <span className="text-gray-600">|</span>
                <a
                  href="https://www.nmlsconsumeraccess.org/EntityDetails.aspx/COMPANY/2670114"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  NMLS Consumer Access
                </a>
              </div>
            </div>
            <p className="text-gray-500 text-xs mt-4 leading-relaxed">
              APR = Annual Percentage Rate. Rates shown are for illustrative purposes and subject to change without notice.
              Actual rate depends on credit profile, property value, loan-to-value ratio, and other underwriting factors.
              HELOC is subject to credit approval. Loan products not available in all states. BrightPath Finance is a
              licensed mortgage broker, NMLS #2670114. This is not a commitment to lend.
              Funding in 5 days available on most loans; actual timing may vary.
              No appraisal required on most loans; exceptions may apply.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
