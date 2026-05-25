import { NextSeo } from 'next-seo'
import Link from 'next/link'
import { useRouter } from 'next/router'

const nextSteps = [
  {
    number: 1,
    title: 'Application Review',
    description: 'Our team reviews your application and verifies your information. This usually takes just a few minutes.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
  {
    number: 2,
    title: 'Receive Your Offer',
    description: "You'll receive a personalized HELOC offer via email with your rate, credit limit, and full terms.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    number: 3,
    title: 'Access Your Funds',
    description: 'Accept your offer, complete any required documentation, and start drawing from your credit line.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
]

export default function ThankYouPage() {
  const router = useRouter()
  const { firstName, leadId, inquiryId } = router.query

  const displayName = typeof firstName === 'string' ? firstName : 'there'

  return (
    <>
      <NextSeo
        title="Application Received – BrightPath Finance"
        description="Thank you for applying for a BrightPath HELOC. We'll be in touch shortly."
        canonical="https://heloc.brightpath-fin.com/thank-you"
        noindex={true}
      />

      {/* Nav */}
      <header className="bg-brand-navy shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-14">
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
          </div>
        </div>
      </header>

      <div className="min-h-screen bg-gray-50 py-16 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Success card */}
          <div className="bg-white rounded-3xl shadow-sm border border-brand-gray-light p-8 md:p-10 text-center mb-8">
            {/* Checkmark */}
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-green-50 border-4 border-green-100 flex items-center justify-center">
                <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-brand-navy mb-3">
              You&apos;re on Your Way!
            </h1>

            <p className="text-lg text-brand-gray mb-2">
              Thank you, <span className="font-semibold text-brand-navy">{displayName}</span>!
            </p>
            <p className="text-brand-gray mb-6 leading-relaxed">
              We&apos;ve received your HELOC application. A BrightPath advisor will review your information and contact you shortly with your personalized offer.
            </p>

            {/* Reference IDs */}
            {(leadId || inquiryId) && (
              <div className="bg-blue-50 border border-blue-100 rounded-xl px-5 py-4 mb-6 text-left">
                <p className="text-xs font-semibold text-brand-blue uppercase tracking-wider mb-2">
                  Application Reference
                </p>
                {leadId && (
                  <p className="text-sm text-brand-gray">
                    Lead ID: <span className="font-mono font-medium text-brand-navy">{leadId}</span>
                  </p>
                )}
                {inquiryId && (
                  <p className="text-sm text-brand-gray">
                    Inquiry ID: <span className="font-mono font-medium text-brand-navy">{inquiryId}</span>
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-1">Save this for your records.</p>
              </div>
            )}

            {/* Call CTA */}
            <a
              href="tel:8778672002"
              className="inline-flex items-center gap-2 bg-brand-navy text-white font-semibold px-6 py-3 rounded-xl hover:bg-opacity-90 transition-colors text-sm"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Have questions? Call us: (877) 867-2002
            </a>
          </div>

          {/* What happens next */}
          <div className="bg-white rounded-3xl shadow-sm border border-brand-gray-light p-8 md:p-10">
            <h2 className="text-xl font-bold text-brand-navy mb-6 text-center">
              What Happens Next
            </h2>

            <div className="space-y-6">
              {nextSteps.map((step) => (
                <div key={step.number} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-brand-blue text-white flex items-center justify-center">
                    {step.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-brand-blue uppercase tracking-wider">
                        Step {step.number}
                      </span>
                    </div>
                    <h3 className="font-semibold text-brand-navy mb-1">{step.title}</h3>
                    <p className="text-sm text-brand-gray leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Back to home */}
            <div className="text-center mt-8 pt-6 border-t border-brand-gray-light">
              <Link
                href="/"
                className="text-brand-blue hover:text-brand-blue-light font-medium text-sm transition-colors"
              >
                ← Back to BrightPath Finance
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-brand-navy py-6 px-4 text-center">
        <p className="text-gray-500 text-xs max-w-3xl mx-auto">
          © {new Date().getFullYear()} BrightPath Finance. NMLS #2670114. Equal Housing Lender. Powered by Figure.
        </p>
      </div>
    </>
  )
}
