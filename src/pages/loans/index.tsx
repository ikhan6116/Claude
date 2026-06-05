import Layout from '@/components/Layout';
import LoanApplicationForm from '@/components/LoanApplicationForm';

export default function LoansLandingPage() {
  return (
    <Layout
      title="Debt Consolidation Loans | BrightPath Finance"
      description="Consolidate your debt into one simple monthly payment. Check your rate with no impact to your credit score. Apply online in minutes."
      canonical="/loans"
    >
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-800 via-primary-900 to-gray-900 text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="pt-4">
              <div className="inline-block bg-accent-500/20 text-accent-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
                No Impact to Your Credit Score
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-6">
                Consolidate Your Debt.<br />
                <span className="text-accent-400">Simplify Your Life.</span>
              </h1>
              <p className="text-xl text-primary-100 mb-8 leading-relaxed">
                Stop juggling multiple payments and high interest rates. BrightPath Finance
                helps you combine your debts into one affordable monthly payment with lower rates.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Rates starting as low as 5.99% APR',
                  'Loan amounts from $5,000 to $100,000+',
                  'No hard credit check to see your rate',
                  'Funding in as few as 2 business days',
                  'One simple monthly payment',
                ].map((item) => (
                  <li key={item} className="flex items-center space-x-3">
                    <span className="flex-shrink-0 w-5 h-5 bg-accent-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">&#10003;</span>
                    </span>
                    <span className="text-primary-100">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex items-center space-x-6 text-sm text-primary-200">
                <div className="flex items-center space-x-1">
                  <span className="text-yellow-400">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
                  <span>4.9/5 Rating</span>
                </div>
                <div>10,000+ Loans Funded</div>
              </div>
            </div>

            <div className="lg:sticky lg:top-24">
              <LoanApplicationForm source="loans-landing-meta-ads" />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-white border-b border-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { label: 'Average Rate Reduction', value: '8.5%' },
              { label: 'Average Monthly Savings', value: '$312' },
              { label: 'Application Time', value: '< 5 Min' },
              { label: 'Customer Satisfaction', value: '98%' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-bold text-primary-700">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
            How It Works
          </h2>
          <p className="text-gray-500 text-center mb-12 max-w-2xl mx-auto">
            Get your personalized debt consolidation loan offer in just a few simple steps.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Check Your Rate',
                desc: 'Fill out our simple application in under 5 minutes. We run a soft credit check that won\'t impact your score.',
              },
              {
                step: '2',
                title: 'Review Your Offer',
                desc: 'Get a personalized loan offer with your rate, monthly payment, and total savings. No obligation to accept.',
              },
              {
                step: '3',
                title: 'Get Funded',
                desc: 'Accept your offer and receive funds as quickly as 2 business days. Start saving with one simple payment.',
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

      {/* Why Choose BrightPath */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Why Choose BrightPath Finance?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Lower Interest Rates',
                desc: 'Reduce your average interest rate from 20%+ down to as low as 5.99% APR.',
              },
              {
                title: 'One Monthly Payment',
                desc: 'Replace multiple confusing bills with a single, predictable payment each month.',
              },
              {
                title: 'No Hidden Fees',
                desc: 'Transparent terms with no prepayment penalties, no origination fees on select offers.',
              },
              {
                title: 'Fast Funding',
                desc: 'Approved applicants can receive funds in as few as 2 business days.',
              },
              {
                title: 'Credit Score Protection',
                desc: 'Our soft inquiry pre-qualification doesn\'t affect your credit score.',
              },
              {
                title: 'Expert Support',
                desc: 'Dedicated loan specialists guide you through every step of the process.',
              },
            ].map((item) => (
              <div key={item.title} className="border border-gray-100 rounded-xl p-6 hover:shadow-md transition">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-primary-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            What Our Customers Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah M.',
                location: 'Dallas, TX',
                text: 'I consolidated $32,000 in credit card debt into one loan at half the interest rate. My monthly payment dropped by $400!',
                savings: '$400/mo saved',
              },
              {
                name: 'James R.',
                location: 'Atlanta, GA',
                text: 'The application took 3 minutes and I had my offer the same day. Funded in 2 days. Couldn\'t be easier.',
                savings: 'Funded in 2 days',
              },
              {
                name: 'Maria L.',
                location: 'Phoenix, AZ',
                text: 'I was drowning in 6 different payments. Now I have one payment and I\'m on track to be debt-free in 3 years.',
                savings: 'Debt-free in 3 yrs',
              },
            ].map((t) => (
              <div key={t.name} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="text-yellow-400 mb-3">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
                <p className="text-gray-600 mb-4 italic">&quot;{t.text}&quot;</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.location}</p>
                  </div>
                  <span className="text-xs bg-accent-100 text-accent-700 font-semibold px-3 py-1 rounded-full">
                    {t.savings}
                  </span>
                </div>
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
                q: 'Will checking my rate affect my credit score?',
                a: 'No. We use a soft credit inquiry to check your rate, which does not impact your credit score. A hard inquiry only occurs if you accept an offer and proceed with the full application.',
              },
              {
                q: 'What credit score do I need to qualify?',
                a: 'We work with borrowers across the credit spectrum. While better rates are available for higher scores, we have options for scores as low as 550. Check your rate to see what you qualify for.',
              },
              {
                q: 'How much can I borrow?',
                a: 'Loan amounts range from $5,000 to over $100,000, depending on your creditworthiness, income, and existing debt load.',
              },
              {
                q: 'How fast can I get funded?',
                a: 'Approved applicants can receive funds in as few as 2 business days after accepting their offer and completing verification.',
              },
              {
                q: 'Are there any fees?',
                a: 'There are no application fees. Some loan offers may include an origination fee, which will be clearly disclosed before you accept. There are never any prepayment penalties.',
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
            Ready to Consolidate Your Debt?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Check your rate in minutes with no impact to your credit score.
            Join thousands who have simplified their finances with BrightPath Finance.
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
