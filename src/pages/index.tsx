import Layout from '@/components/Layout';
import LoanApplicationForm from '@/components/LoanApplicationForm';
import Link from 'next/link';

export default function Home() {
  return (
    <Layout
      title="BrightPath Finance | Personal Loans & Debt Consolidation"
      description="Consolidate your debt into one simple monthly payment with lower rates. Personal loans from $5,000 to $100,000+. Check your rate in minutes — no impact to your credit score."
      canonical="/"
    >
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-800 via-primary-900 to-gray-900 text-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="pt-4">
              <div className="inline-block bg-accent-500/20 text-accent-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
                No Impact to Your Credit Score
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-6">
                Your Path to
                <span className="block text-accent-400 mt-2">
                  Financial Freedom
                </span>
              </h1>
              <p className="text-xl text-primary-100 mb-8 leading-relaxed">
                BrightPath Finance offers personal loans and debt consolidation loans
                designed to simplify your finances. Combine multiple payments into one,
                lower your interest rate, and get on a clear path to being debt-free.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {[
                  'Rates starting at 5.99% APR',
                  'Loans from $5,000 to $100,000+',
                  'No hard credit check to apply',
                  'Funding in as few as 2 days',
                  'One simple monthly payment',
                  'No prepayment penalties',
                ].map((item) => (
                  <div key={item} className="flex items-center space-x-3">
                    <span className="flex-shrink-0 w-5 h-5 bg-accent-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">&#10003;</span>
                    </span>
                    <span className="text-primary-100 text-sm">{item}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center space-x-6 text-sm text-primary-200">
                <div className="flex items-center space-x-1">
                  <span className="text-yellow-400">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
                  <span>4.9/5 Rating</span>
                </div>
                <div>10,000+ Loans Funded</div>
              </div>
            </div>

            <div className="lg:sticky lg:top-24">
              <LoanApplicationForm source="homepage-hero" />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="bg-white border-b border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '$150M+', label: 'Loans Funded' },
              { value: '10,000+', label: 'Customers Served' },
              { value: '8.5%', label: 'Avg. Rate Reduction' },
              { value: '$312', label: 'Avg. Monthly Savings' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-bold text-primary-600">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Loan Products */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
            Loan Products
          </h2>
          <p className="text-gray-500 text-center mb-12 max-w-2xl mx-auto">
            Choose the right loan for your needs. Check your rate with no impact to your credit score.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link
              href="/loans"
              className="bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-shadow border border-gray-100 group"
            >
              <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-primary-600 text-2xl font-bold">$</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition">
                Debt Consolidation Loans
              </h3>
              <p className="text-gray-600 mb-4">
                Combine multiple high-interest debts — credit cards, medical bills, personal loans —
                into one simple monthly payment at a lower rate.
              </p>
              <ul className="space-y-2 text-sm text-gray-500 mb-6">
                <li className="flex items-center space-x-2">
                  <span className="text-accent-500">&#10003;</span>
                  <span>Rates from 5.99% APR</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-accent-500">&#10003;</span>
                  <span>$5,000 - $100,000+</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-accent-500">&#10003;</span>
                  <span>Fixed monthly payments</span>
                </li>
              </ul>
              <span className="text-primary-600 font-semibold text-sm group-hover:underline">
                Check Your Rate &rarr;
              </span>
            </Link>

            <Link
              href="/personal-loans"
              className="bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-shadow border border-gray-100 group"
            >
              <div className="w-14 h-14 bg-accent-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-accent-600 text-2xl font-bold">&#9733;</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition">
                Personal Loans
              </h3>
              <p className="text-gray-600 mb-4">
                Flexible funding for whatever life brings — home improvements, major purchases,
                unexpected expenses, or anything in between.
              </p>
              <ul className="space-y-2 text-sm text-gray-500 mb-6">
                <li className="flex items-center space-x-2">
                  <span className="text-accent-500">&#10003;</span>
                  <span>Competitive fixed rates</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-accent-500">&#10003;</span>
                  <span>$2,000 - $50,000</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-accent-500">&#10003;</span>
                  <span>No collateral required</span>
                </li>
              </ul>
              <span className="text-primary-600 font-semibold text-sm group-hover:underline">
                Check Your Rate &rarr;
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
            How It Works
          </h2>
          <p className="text-gray-500 text-center mb-12 max-w-2xl mx-auto">
            Get your personalized loan offer in just a few simple steps.
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
              <div key={item.step} className="text-center p-8 bg-gray-50 rounded-xl">
                <div className="w-14 h-14 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
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

      {/* Bottom CTA */}
      <section className="bg-primary-700 text-white section-padding">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Simplify Your Finances?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Check your rate in minutes with no impact to your credit score.
            Join thousands who have taken control of their debt with BrightPath Finance.
          </p>
          <Link href="/loans" className="btn-accent text-lg px-10 py-4 inline-block">
            Check My Rate Now
          </Link>
          <p className="text-primary-200 text-sm mt-4">
            Or call us at <a href="tel:877-867-2002" className="underline font-semibold">877-867-2002</a>
          </p>
        </div>
      </section>
    </Layout>
  );
}
