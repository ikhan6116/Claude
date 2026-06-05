import Layout from '@/components/Layout';
import LoanApplicationForm from '@/components/LoanApplicationForm';

export default function PersonalLoans() {
  return (
    <Layout
      title="Personal Loans | BrightPath Finance"
      description="Flexible personal loans from $2,000 to $50,000 for home improvement, major purchases, and more. Check your rate with no impact to your credit score."
      canonical="/personal-loans"
    >
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-800 via-primary-900 to-gray-900 text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="pt-4">
              <div className="inline-block bg-accent-500/20 text-accent-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
                No Impact to Your Credit Score
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-6">
                Personal Loans for
                <span className="block text-accent-400 mt-2">Whatever Life Brings</span>
              </h1>
              <p className="text-xl text-primary-100 mb-8 leading-relaxed">
                Whether it&apos;s a home renovation, a major purchase, or an unexpected expense,
                BrightPath Finance personal loans give you the funds you need with predictable
                fixed monthly payments.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Borrow $2,000 to $50,000',
                  'Competitive fixed interest rates',
                  'No collateral required',
                  'Funds in as few as 2 business days',
                  'No prepayment penalties',
                ].map((item) => (
                  <li key={item} className="flex items-center space-x-3">
                    <span className="flex-shrink-0 w-5 h-5 bg-accent-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">&#10003;</span>
                    </span>
                    <span className="text-primary-100">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:sticky lg:top-24">
              <LoanApplicationForm source="personal-loans-page" />
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
            Use Your Loan For Anything
          </h2>
          <p className="text-gray-500 text-center mb-12 max-w-2xl mx-auto">
            A BrightPath personal loan gives you flexible funding with no restrictions on how you use it.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Home Improvement', desc: 'Kitchen remodel, bathroom upgrade, new roof — invest in your home.' },
              { title: 'Major Purchases', desc: 'Furniture, appliances, electronics — buy what you need without maxing out cards.' },
              { title: 'Medical Expenses', desc: 'Cover medical bills with a fixed payment instead of high-interest credit.' },
              { title: 'Moving Costs', desc: 'Security deposits, movers, new furniture — cover the costs of a fresh start.' },
              { title: 'Special Events', desc: 'Weddings, vacations, or milestone celebrations funded responsibly.' },
              { title: 'Emergency Expenses', desc: 'Life happens. Get the funds you need quickly when unexpected costs arise.' },
            ].map((item) => (
              <div key={item.title} className="border border-gray-100 rounded-xl p-6 hover:shadow-md transition">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Check Your Rate',
                desc: 'Answer a few questions and see your personalized rate in minutes. No hard credit check.',
              },
              {
                step: '2',
                title: 'Choose Your Terms',
                desc: 'Select the loan amount and repayment term that fits your budget. Fixed payments, no surprises.',
              },
              {
                step: '3',
                title: 'Get Your Funds',
                desc: 'Accept your offer and money is deposited directly into your bank account in as few as 2 days.',
              },
            ].map((item) => (
              <div key={item.step} className="bg-white rounded-xl p-8 shadow-sm text-center">
                <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {[
              {
                q: 'What can I use a personal loan for?',
                a: 'Anything you need. Home improvement, debt payoff, medical bills, major purchases, moving expenses, events — there are no restrictions on how you use the funds.',
              },
              {
                q: 'Do I need collateral?',
                a: 'No. BrightPath personal loans are unsecured, meaning you don\'t need to put up your home, car, or any other asset as collateral.',
              },
              {
                q: 'How much can I borrow?',
                a: 'Personal loans range from $2,000 to $50,000, depending on your credit profile and income.',
              },
              {
                q: 'Will checking my rate affect my credit?',
                a: 'No. We use a soft inquiry to check your rate, which has zero impact on your credit score. A hard inquiry only occurs if you accept an offer.',
              },
              {
                q: 'How long does it take to get funded?',
                a: 'After accepting your offer and completing verification, funds can be deposited in as few as 2 business days.',
              },
            ].map((faq) => (
              <div key={faq.q} className="border border-gray-200 rounded-lg p-6">
                <h3 className="font-bold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-primary-700 text-white section-padding">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Get the Funds You Need
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Check your rate in minutes with no impact to your credit score.
          </p>
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="btn-accent text-lg px-10 py-4 inline-block"
          >
            Check My Rate Now
          </a>
          <p className="text-primary-200 text-sm mt-4">
            Or call us at <a href="tel:877-867-2002" className="underline font-semibold">877-867-2002</a>
          </p>
        </div>
      </section>
    </Layout>
  );
}
