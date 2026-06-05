import Layout from '@/components/Layout';
import Link from 'next/link';

export default function About() {
  return (
    <Layout
      title="About BrightPath Finance | Personal Loans & Debt Consolidation"
      description="Learn about BrightPath Finance and our mission to help Americans access affordable personal loans and debt consolidation solutions."
      canonical="/about"
    >
      <section className="bg-gradient-to-br from-primary-800 to-primary-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold mb-4">About BrightPath Finance</h1>
          <p className="text-xl text-primary-200">
            Making personal loans and debt consolidation simple, transparent, and accessible.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <p className="text-gray-600 mb-4 leading-relaxed">
            At BrightPath Finance, we believe managing your finances shouldn&apos;t be
            complicated. Too many Americans are stuck juggling multiple high-interest
            payments, paying more than they should, and feeling overwhelmed by debt.
            We&apos;re here to change that.
          </p>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Our platform connects borrowers with competitive loan offers tailored to
            their unique financial situation. Whether you need to consolidate existing
            debt into one simple payment or secure a personal loan for a major expense,
            we make it easy to check your rate, compare offers, and get funded — all
            without impacting your credit score.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Choose BrightPath?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {[
              {
                title: 'No Credit Impact',
                desc: 'Check your rate with a soft inquiry that won\'t affect your credit score. Only a hard pull occurs if you accept an offer.',
              },
              {
                title: 'Transparent Terms',
                desc: 'No hidden fees, no surprises. Every offer clearly shows your rate, monthly payment, and total cost before you commit.',
              },
              {
                title: 'Fast Funding',
                desc: 'Apply in minutes, get a decision the same day, and receive funds in as few as 2 business days.',
              },
              {
                title: 'Expert Support',
                desc: 'Our loan specialists are available to guide you through the process and answer any questions.',
              },
            ].map((item) => (
              <div key={item.title} className="border border-gray-100 rounded-lg p-5">
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Loan Products</h2>
          <div className="space-y-4 mb-12">
            <div className="bg-primary-50 border border-primary-100 rounded-lg p-6">
              <h3 className="font-bold text-primary-800 mb-2">Debt Consolidation Loans</h3>
              <p className="text-gray-600 text-sm">
                Combine credit cards, medical bills, and other unsecured debts into one
                monthly payment at a lower rate. Loans from $5,000 to $100,000+ with
                rates starting at 5.99% APR.
              </p>
            </div>
            <div className="bg-accent-50 border border-accent-100 rounded-lg p-6">
              <h3 className="font-bold text-accent-800 mb-2">Personal Loans</h3>
              <p className="text-gray-600 text-sm">
                Flexible funding from $2,000 to $50,000 for home improvement, major
                purchases, medical expenses, and more. No collateral required, fixed
                monthly payments.
              </p>
            </div>
          </div>

          <div className="text-center">
            <Link href="/loans" className="btn-primary text-lg px-10 py-4 inline-block">
              Check My Rate
            </Link>
            <p className="text-gray-500 text-sm mt-3">
              Or call us at <a href="tel:877-867-2002" className="text-primary-600 font-semibold">877-867-2002</a>
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
