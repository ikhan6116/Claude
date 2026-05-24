import { NextSeo } from 'next-seo'
import Link from 'next/link'
import MultiStepForm from '@/components/MultiStepForm'

export default function ApplyPage() {
  return (
    <>
      <NextSeo
        title="Apply for a Business HELOC – BrightPath Finance"
        description="Complete your business HELOC application in 5 minutes. Get a personalized offer with no impact to your credit score. Rates from 6.75% APR. Up to $750K."
        canonical="https://heloc.brightpath-fin.com/apply"
        noindex={false}
      />

      {/* Slim nav */}
      <header className="bg-brand-navy shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-brand-blue flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <span className="text-white font-bold text-base">
                BrightPath <span className="text-brand-blue-accent">Finance</span>
              </span>
            </Link>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              256-bit SSL Secured
            </div>
          </div>
        </div>
      </header>

      <MultiStepForm />

      {/* Footer note */}
      <div className="bg-brand-navy py-6 px-4 text-center">
        <p className="text-gray-500 text-xs max-w-3xl mx-auto">
          © {new Date().getFullYear()} BrightPath Finance. NMLS #2670114. Equal Housing Lender. Powered by Figure. 898 S State St Ste 310 #714, Orem, UT 84058. Submitting this form does not constitute a loan application and does not guarantee approval. Rates from 6.75% APR subject to credit approval and may change without notice.
        </p>
      </div>
    </>
  )
}
