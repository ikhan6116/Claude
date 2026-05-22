import { NextSeo } from 'next-seo'
import Link from 'next/link'
import Layout from '@/components/Layout'
import TrustBar from '@/components/TrustBar'
import HELOCHero from '@/components/HELOCHero'
import HowItWorks from '@/components/HowItWorks'
import BenefitsSection from '@/components/BenefitsSection'
import FAQSection from '@/components/FAQSection'

export default function HomePage() {
  return (
    <>
      <NextSeo
        title="BrightPath Finance – Unlock Your Home Equity with a HELOC"
        description="Access up to $400,000 with a BrightPath HELOC. Competitive rates starting from 8.50% APR. Fast approval, no closing costs on most loans. Powered by Figure."
        canonical="https://heloc.brightpath-fin.com"
        openGraph={{
          title: 'BrightPath Finance – Unlock Your Home Equity with a HELOC',
          description: 'Access up to $400,000 with a BrightPath HELOC. Competitive rates from 8.50% APR.',
          url: 'https://heloc.brightpath-fin.com',
        }}
      />
      <Layout>
        <TrustBar />
        <HELOCHero />
        <HowItWorks />
        <BenefitsSection />
        <FAQSection />

        {/* Final CTA Section */}
        <section className="bg-brand-blue py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Unlock Your Equity?
            </h2>
            <p className="text-blue-100 text-xl mb-10 max-w-2xl mx-auto">
              Join thousands of homeowners who have unlocked their home equity with BrightPath. Apply in 5 minutes and get your offer instantly.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/apply"
                className="w-full sm:w-auto bg-white text-brand-blue font-bold px-10 py-4 rounded-xl text-lg shadow-xl hover:bg-blue-50 transition-all transform hover:-translate-y-0.5"
              >
                Apply Now — It&apos;s Free
              </Link>
              <a
                href="tel:8000000000"
                className="w-full sm:w-auto border-2 border-white/60 text-white font-semibold px-8 py-4 rounded-xl text-lg hover:border-white hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call (800) XXX-XXXX
              </a>
            </div>
            <p className="text-blue-200 text-sm mt-6">
              No obligation. No hard credit pull to check your rate.
            </p>
          </div>
        </section>
      </Layout>
    </>
  )
}
