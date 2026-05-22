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
                <span className="text-white font-bold text-lg leading-none tracking-tight">
                  BrightPath
                </span>
                <span className="text-brand-blue-accent font-medium text-lg leading-none ml-1 tracking-tight">
                  Finance
                </span>
              </div>
            </Link>

            {/* Nav links - desktop */}
            <div className="hidden md:flex items-center gap-6">
              <Link
                href="/#how-it-works"
                className="text-gray-300 hover:text-white text-sm font-medium transition-colors"
              >
                How It Works
              </Link>
              <Link
                href="/#benefits"
                className="text-gray-300 hover:text-white text-sm font-medium transition-colors"
              >
                Benefits
              </Link>
              <Link
                href="/#faq"
                className="text-gray-300 hover:text-white text-sm font-medium transition-colors"
              >
                FAQ
              </Link>
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

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-brand-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Brand column */}
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
                Helping homeowners access their equity with fast, transparent, and competitive HELOC products.
              </p>
            </div>

            {/* Quick links */}
            <div>
              <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-400 mb-4">
                Quick Links
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/apply" className="text-gray-300 hover:text-white text-sm transition-colors">
                    Apply Now
                  </Link>
                </li>
                <li>
                  <Link href="/#how-it-works" className="text-gray-300 hover:text-white text-sm transition-colors">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/#faq" className="text-gray-300 hover:text-white text-sm transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-400 mb-4">
                Contact
              </h3>
              <p className="text-gray-300 text-sm mb-1">(800) XXX-XXXX</p>
              <p className="text-gray-300 text-sm">info@brightpath-fin.com</p>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-gray-700 pt-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <p className="text-gray-400 text-xs">
                © 2025 BrightPath Finance. NMLS #XXXXXXX. Equal Housing Lender. Powered by Figure.
              </p>
              <div className="flex items-center gap-4">
                <span className="text-gray-400 text-xs">Privacy Policy</span>
                <span className="text-gray-600">|</span>
                <span className="text-gray-400 text-xs">Terms of Service</span>
                <span className="text-gray-600">|</span>
                <span className="text-gray-400 text-xs">NMLS Consumer Access</span>
              </div>
            </div>
            <p className="text-gray-500 text-xs mt-4 leading-relaxed">
              APR = Annual Percentage Rate. Rates shown are illustrative and subject to change. Your actual rate will depend on your credit profile, property value, and other factors. HELOC is subject to credit approval. Not available in all states.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
