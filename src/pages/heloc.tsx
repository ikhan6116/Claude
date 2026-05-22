import Layout from '@/components/Layout';
import HELOCForm from '@/components/HELOCForm';
import Link from 'next/link';

export default function HELOCPage() {
  return (
    <Layout
      title="HELOC - Home Equity Line of Credit | Freedom Debt Solutions"
      description="Access up to 90% of your home equity with a Figure HELOC. Rates from 8.50% APR. Check your offer in 5 minutes — no impact to your credit score."
      canonical="/heloc"
    >
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-800 via-primary-700 to-primary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="pt-4">
              <span className="inline-block bg-accent-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
                Powered by Figure Lending
              </span>
              <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-6">
                Tap Into Your Home Equity —
                <span className="block text-primary-200 mt-2">
                  See Your Rate in 5 Minutes
                </span>
              </h1>
              <p className="text-xl text-primary-100 mb-8 leading-relaxed">
                A Home Equity Line of Credit (HELOC) lets you borrow against the equity in your
                home at significantly lower rates than credit cards or personal loans.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { label: 'Rates from', value: '8.50% APR*' },
                  { label: 'Access up to', value: '90% LTV' },
                  { label: 'Min. line size', value: '$20,000' },
                  { label: 'Decision in', value: '5 minutes' },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                    <p className="text-primary-200 text-sm">{stat.label}</p>
                    <p className="text-white font-bold text-xl">{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-2">
                {[
                  '✓  No appraisal required in most cases',
                  '✓  Soft credit pull — no score impact',
                  '✓  Close in as few as 5 days',
                  '✓  No prepayment penalties',
                ].map((point) => (
                  <p key={point} className="text-primary-100">{point}</p>
                ))}
              </div>
            </div>

            <div>
              <HELOCForm source="heloc-hero" />
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Can You Use Your HELOC For?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your home equity is one of your most valuable financial assets. Put it to work.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: '🏠',
                title: 'Home Improvements',
                description:
                  'Fund renovations that increase your home\'s value — kitchens, bathrooms, additions, and more.',
              },
              {
                icon: '💳',
                title: 'Debt Consolidation',
                description:
                  'Replace high-interest credit card debt (20–30% APR) with a lower-rate HELOC and save thousands.',
              },
              {
                icon: '🎓',
                title: 'Education Expenses',
                description:
                  'Finance college tuition or vocational training at rates well below private student loans.',
              },
              {
                icon: '🏥',
                title: 'Medical Bills',
                description:
                  'Cover unexpected medical or dental expenses without depleting your savings.',
              },
              {
                icon: '🚗',
                title: 'Major Purchases',
                description:
                  'Buy a vehicle, boat, or RV at home equity rates instead of high-rate auto financing.',
              },
              {
                icon: '💼',
                title: 'Business Investment',
                description:
                  'Seed or expand a business with flexible, revolving capital at competitive rates.',
              },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How the HELOC Process Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: '1',
                title: 'Check Your Offer',
                description: 'Fill out our 4-step form. Soft credit pull only — zero impact to your score.',
              },
              {
                step: '2',
                title: 'Review Offers',
                description: 'See personalized rate and line amount offers from Figure in real-time.',
              },
              {
                step: '3',
                title: 'Upload Documents',
                description: 'Securely upload income verification and property documents online.',
              },
              {
                step: '4',
                title: 'Close & Access Funds',
                description: 'Sign electronically and access your line of credit in as few as 5 business days.',
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-14 h-14 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HELOC vs Other Products */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            HELOC vs. Other Borrowing Options
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse bg-white rounded-xl overflow-hidden shadow-sm">
              <thead>
                <tr className="bg-primary-700 text-white">
                  <th className="text-left p-4">Feature</th>
                  <th className="p-4 text-center">HELOC</th>
                  <th className="p-4 text-center">Credit Card</th>
                  <th className="p-4 text-center">Personal Loan</th>
                  <th className="p-4 text-center">Cash-Out Refi</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Typical APR', '8–12%', '20–30%', '10–20%', '7–9%'],
                  ['Credit Required', '680+', '600+', '640+', '680+'],
                  ['Funding Time', '5–15 days', 'Instant', '1–5 days', '30–45 days'],
                  ['Flexibility', 'Revolving', 'Revolving', 'Fixed', 'Lump sum'],
                  ['Closing Costs', 'Low / None', 'None', 'None', 'High (2–5%)'],
                ].map(([feature, heloc, cc, pl, refi]) => (
                  <tr key={feature} className="border-t border-gray-100">
                    <td className="p-4 font-medium text-gray-700">{feature}</td>
                    <td className="p-4 text-center text-accent-600 font-semibold">{heloc}</td>
                    <td className="p-4 text-center text-gray-500">{cc}</td>
                    <td className="p-4 text-center text-gray-500">{pl}</td>
                    <td className="p-4 text-center text-gray-500">{refi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: 'Will checking my rate affect my credit score?',
                a: 'No. We use a soft credit inquiry to pre-qualify you, which has zero impact on your credit score. A hard pull only occurs if you proceed to a full application after reviewing your offers.',
              },
              {
                q: 'How much can I borrow?',
                a: 'You can typically access up to 90% of your home\'s appraised value minus any existing mortgage balance (combined loan-to-value). For example, a $500,000 home with a $300,000 mortgage could qualify for up to $150,000 in HELOC access.',
              },
              {
                q: 'What credit score do I need?',
                a: 'Figure HELOC products generally require a minimum 680 FICO score, though the best rates are available to borrowers with scores of 720+.',
              },
              {
                q: 'How quickly can I access funds?',
                a: 'Once approved and after the 3-day right-of-rescission period (for primary residences), funds can be available in as few as 5 business days.',
              },
              {
                q: 'Is there an appraisal required?',
                a: 'In many cases, Figure uses an automated valuation model (AVM) in lieu of a full appraisal, which speeds up the process and reduces costs.',
              },
            ].map((item) => (
              <details key={item.q} className="border border-gray-200 rounded-xl p-5 group">
                <summary className="font-semibold text-gray-900 cursor-pointer list-none flex justify-between items-center">
                  {item.q}
                  <span className="text-primary-600 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-gray-600 mt-3 text-sm leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-primary-700 text-white section-padding">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Unlock Your Home Equity?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Check your personalized HELOC offer in under 5 minutes. No commitment required.
          </p>
          <Link href="#" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="btn-accent text-lg px-10 py-4 inline-block">
            Check My Rate — No Credit Impact
          </Link>
          <p className="text-primary-200 text-sm mt-4">
            * APR shown is for illustrative purposes. Actual rate depends on credit profile,
            property type, and loan-to-value ratio. Figure Lending LLC. NMLS #1717824.
          </p>
        </div>
      </section>
    </Layout>
  );
}
