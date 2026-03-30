import Layout from '@/components/Layout';
import LeadForm from '@/components/LeadForm';
import Link from 'next/link';

export default function DebtConsolidation() {
  return (
    <Layout
      title="Debt Consolidation Programs That Actually Work | Freedom Debt Solutions"
      description="Consolidate multiple debts into one low monthly payment. Learn how debt consolidation can lower your interest rates and help you become debt-free faster. Free consultation."
      canonical="/debt-consolidation"
    >
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-800 to-primary-900 text-white section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-6">
                Debt Consolidation Programs That Actually Work
              </h1>
              <p className="text-xl text-primary-100 mb-6">
                Stop juggling multiple payments with high interest rates. Our debt
                consolidation programs combine your debts into one affordable monthly
                payment — saving you money and stress.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Lower your overall interest rate',
                  'One simple monthly payment',
                  'Stop creditor calls and late fees',
                  'Become debt-free in 24-48 months',
                  'No impact on your credit to apply',
                ].map((item) => (
                  <li key={item} className="flex items-center space-x-2">
                    <span className="text-accent-500">&#10003;</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <LeadForm
              variant="compact"
              source="debt-consolidation-page"
              heading="Get Your Free Consolidation Quote"
              subheading="See how much you could save with debt consolidation."
            />
          </div>
        </div>
      </section>

      {/* What Is Debt Consolidation */}
      <section className="section-padding">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            What Is Debt Consolidation and How Does It Work?
          </h2>
          <p className="text-gray-600 mb-4 leading-relaxed">
            Debt consolidation is a financial strategy that combines multiple debts —
            such as credit card balances, medical bills, and personal loans — into a
            single, more manageable payment. Instead of keeping track of multiple due
            dates and varying interest rates, you make one payment each month.
          </p>
          <p className="text-gray-600 mb-4 leading-relaxed">
            Our debt consolidation program works by negotiating with your creditors to
            reduce your interest rates and create a structured repayment plan. This can
            significantly reduce your total cost of repayment and help you become
            debt-free faster than making minimum payments.
          </p>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
            Who Qualifies for Debt Consolidation?
          </h3>
          <p className="text-gray-600 mb-4 leading-relaxed">
            You may be a good candidate for debt consolidation if you have:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
            <li>$5,000 or more in unsecured debt (credit cards, medical bills, personal loans)</li>
            <li>Multiple monthly payments that are difficult to manage</li>
            <li>High-interest rates making it hard to pay down principal</li>
            <li>A desire to simplify your finances with one monthly payment</li>
            <li>Difficulty keeping up with minimum payments</li>
          </ul>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
            Debt Consolidation vs. Debt Settlement: What&apos;s the Difference?
          </h3>
          <p className="text-gray-600 mb-4 leading-relaxed">
            While both strategies aim to help you become debt-free, they work differently.
            Debt consolidation combines your debts into one payment, often with a lower
            interest rate. Debt settlement involves negotiating with creditors to accept
            less than the full amount owed. Our specialists can help determine which
            approach is best for your unique situation.
          </p>
        </div>
      </section>

      {/* Inline CTA */}
      <section className="bg-primary-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <LeadForm
            variant="inline"
            source="debt-consolidation-mid-page"
          />
        </div>
      </section>

      {/* Benefits */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Benefits of Debt Consolidation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Lower Interest Rates',
                desc: 'Reduce the average interest rate on your combined debts, which means more of your payment goes toward principal.',
              },
              {
                title: 'Simplified Finances',
                desc: 'Replace multiple confusing bills with a single, predictable monthly payment that fits your budget.',
              },
              {
                title: 'Stop Collection Calls',
                desc: 'Once enrolled in our program, we work with creditors on your behalf to stop harassing phone calls.',
              },
              {
                title: 'Clear Payoff Timeline',
                desc: 'Know exactly when you\'ll be debt-free with a structured repayment plan, typically 24-48 months.',
              },
              {
                title: 'Protect Your Credit',
                desc: 'Consolidation can be less damaging to your credit score than bankruptcy or continued missed payments.',
              },
              {
                title: 'Expert Guidance',
                desc: 'Work with certified debt counselors who understand your options and advocate for your best interests.',
              },
            ].map((b) => (
              <div key={b.title} className="border border-gray-100 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{b.title}</h3>
                <p className="text-gray-600 text-sm">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-primary-700 text-white section-padding">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Consolidate Your Debt?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Get your free, no-obligation consultation today. See how much you could
            save with our debt consolidation program.
          </p>
          <Link href="/get-started" className="btn-accent text-lg px-10 py-4 inline-block">
            Get Free Consultation
          </Link>
        </div>
      </section>
    </Layout>
  );
}
