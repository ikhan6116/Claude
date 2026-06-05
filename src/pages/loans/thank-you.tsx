import Layout from '@/components/Layout';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function LoanThankYou() {
  const router = useRouter();
  const { status, ref } = router.query;

  const isQualified = status === 'qualified' || status === 'review';

  return (
    <Layout
      title={isQualified ? 'You Pre-Qualify! | BrightPath Finance' : 'Application Received | BrightPath Finance'}
      description="Thank you for your debt consolidation loan application with BrightPath Finance."
    >
      <section className="min-h-[70vh] flex items-center justify-center py-16">
        <div className="max-w-xl mx-auto px-4 text-center">
          {isQualified ? (
            <>
              <div className="w-24 h-24 bg-accent-500 rounded-full flex items-center justify-center mx-auto mb-8">
                <span className="text-white text-5xl">&#10003;</span>
              </div>
              <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
                Great News — You Pre-Qualify!
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                Based on your information, you pre-qualify for a BrightPath Finance
                debt consolidation loan. A loan specialist will be contacting you
                shortly to finalize your personalized offer.
              </p>
              {ref && (
                <p className="text-sm text-gray-400 mb-6">
                  Reference: {ref}
                </p>
              )}
              <div className="bg-accent-50 border border-accent-200 rounded-xl p-6 mb-8">
                <h3 className="font-bold text-accent-800 mb-2">What Happens Next?</h3>
                <ul className="text-sm text-accent-700 space-y-2 text-left">
                  <li className="flex items-start space-x-2">
                    <span className="font-bold">1.</span>
                    <span>A loan specialist will call you within the next few minutes to discuss your offer.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="font-bold">2.</span>
                    <span>Review your personalized rate and loan terms — no obligation.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="font-bold">3.</span>
                    <span>If you accept, funds can be deposited in as few as 2 business days.</span>
                  </li>
                </ul>
              </div>
              <p className="text-gray-600 mb-4">
                For immediate assistance, call us directly:
              </p>
              <a
                href="tel:877-867-2002"
                className="btn-primary text-xl px-10 py-4 inline-block"
              >
                Call 877-867-2002
              </a>
            </>
          ) : (
            <>
              <div className="w-24 h-24 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-8">
                <span className="text-white text-5xl">&#9993;</span>
              </div>
              <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
                Application Received
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                Thank you for your application. While a standard consolidation loan
                may not be the best fit right now, we have other options that may help
                with your situation.
              </p>
              {ref && (
                <p className="text-sm text-gray-400 mb-6">
                  Reference: {ref}
                </p>
              )}
              <div className="bg-primary-50 border border-primary-200 rounded-xl p-6 mb-8">
                <h3 className="font-bold text-primary-800 mb-2">We Can Still Help</h3>
                <p className="text-sm text-primary-700 mb-4">
                  One of our debt specialists will review your application and reach
                  out to discuss alternative solutions, including:
                </p>
                <ul className="text-sm text-primary-700 space-y-1 text-left">
                  <li>&#8226; Debt relief and settlement programs</li>
                  <li>&#8226; Credit counseling services</li>
                  <li>&#8226; Secured loan options</li>
                  <li>&#8226; Debt management plans</li>
                </ul>
              </div>
              <p className="text-gray-600 mb-4">
                Questions? Call us directly:
              </p>
              <a
                href="tel:877-867-2002"
                className="btn-primary text-xl px-10 py-4 inline-block"
              >
                Call 877-867-2002
              </a>
            </>
          )}

          <div className="mt-12">
            <Link href="/" className="text-primary-600 hover:text-primary-800 text-sm underline">
              Return to Homepage
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
