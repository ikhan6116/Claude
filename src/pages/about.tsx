import Layout from '@/components/Layout';
import Link from 'next/link';

export default function About() {
  return (
    <Layout
      title="About BrightPath Finance | Personal Loans & Debt Consolidation"
      description="Learn about BrightPath Finance — making personal loans and debt consolidation simple, transparent, and accessible to all Americans."
      canonical="/about"
    >
      <section className="hero-gradient text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold mb-4 text-white">About BrightPath Finance</h1>
          <p className="text-xl" style={{ color: '#77b6e8' }}>
            Making personal loans and debt consolidation simple, transparent, and accessible.
          </p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-5" style={{ color: '#0d1b2a' }}>Our Mission</h2>
          <p className="mb-4 leading-relaxed" style={{ color: '#494949' }}>
            At BrightPath Finance, we believe managing your finances shouldn&apos;t be complicated.
            Too many Americans are stuck juggling multiple high-interest payments, paying more than they
            should, and feeling overwhelmed by debt. We&apos;re here to change that.
          </p>
          <p className="mb-10 leading-relaxed" style={{ color: '#494949' }}>
            Our platform connects borrowers with competitive loan offers tailored to their unique financial
            situation. Whether you need to consolidate debt into one simple payment or secure a personal
            loan for a major expense, we make it easy — without impacting your credit score.
          </p>

          <h2 className="text-3xl font-bold mb-6" style={{ color: '#0d1b2a' }}>Why Choose BrightPath?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
            {[
              { title: 'No Credit Impact',   desc: 'Check your rate with a soft inquiry that won\'t affect your credit score. Hard pull only if you accept an offer.' },
              { title: 'Transparent Terms',  desc: 'No hidden fees, no surprises. Every offer clearly shows your rate, monthly payment, and total cost before you commit.' },
              { title: 'Fast Funding',       desc: 'Apply in minutes, same-day decision, and receive funds in as few as 2 business days.' },
              { title: 'Expert Support',     desc: 'Our loan specialists are available to guide you and answer any questions throughout the process.' },
            ].map(item => (
              <div key={item.title} className="card p-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: 'rgba(43,124,255,0.08)' }}>
                  <span style={{ color: '#2b7cff' }}>&#10003;</span>
                </div>
                <h3 className="font-bold mb-2" style={{ color: '#0d1b2a' }}>{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#494949' }}>{item.desc}</p>
              </div>
            ))}
          </div>

          <h2 className="text-3xl font-bold mb-5" style={{ color: '#0d1b2a' }}>Our Loan Products</h2>
          <div className="space-y-4 mb-12">
            <div className="rounded-xl p-6" style={{ background: '#eef5ff', border: '1px solid #bbd5ff' }}>
              <h3 className="font-bold mb-2" style={{ color: '#2b7cff' }}>Debt Consolidation Loans</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#494949' }}>
                Combine credit cards, medical bills, and other unsecured debts into one monthly payment
                at a lower rate. Loans from $5,000 to $100,000+ with rates starting at 5.99% APR.
              </p>
            </div>
            <div className="rounded-xl p-6" style={{ background: '#f0f7ff', border: '1px solid #c9e6fa' }}>
              <h3 className="font-bold mb-2" style={{ color: '#0d1b2a' }}>Personal Loans</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#494949' }}>
                Flexible funding from $2,000 to $50,000 for home improvement, major purchases, medical
                expenses, and more. No collateral required, fixed monthly payments.
              </p>
            </div>
          </div>

          <div className="text-center">
            <Link href="/loans" className="btn-primary text-lg px-10 py-4 inline-block">Check My Rate</Link>
            <p className="mt-3 text-sm" style={{ color: '#494949' }}>
              Or call <a href="tel:877-867-2002" className="font-semibold" style={{ color: '#2b7cff' }}>877-867-2002</a>
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
