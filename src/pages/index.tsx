import Layout from '@/components/Layout';
import LoanApplicationForm from '@/components/LoanApplicationForm';
import Link from 'next/link';

export default function Home() {
  return (
    <Layout
      title="BrightPath Finance | Personal Loans & Debt Consolidation"
      description="Consolidate your debt into one simple monthly payment with lower rates. Personal loans from $5,000 to $100,000+. Check your rate — no impact to your credit score."
      canonical="/"
    >
      {/* ── Hero ── */}
      <section className="hero-gradient text-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">

            <div className="pt-2">
              <span className="badge-blue mb-6 inline-block" style={{ background: 'rgba(119,182,232,0.15)', color: '#77b6e8' }}>
                No Impact to Your Credit Score
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 text-white">
                Your Path to
                <span className="block mt-1" style={{ color: '#77b6e8' }}>Financial Freedom</span>
              </h1>
              <p className="text-lg leading-relaxed mb-8" style={{ color: 'rgba(217,217,217,0.85)' }}>
                BrightPath Finance offers personal loans and debt consolidation loans designed
                to simplify your finances — one low payment, lower rates, and a clear path forward.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
                {[
                  'Rates starting at 5.99% APR',
                  'Loans from $5,000 to $100,000+',
                  'No hard credit check to apply',
                  'Funding in as few as 2 days',
                  'One simple monthly payment',
                  'No prepayment penalties',
                ].map((item) => (
                  <div key={item} className="check-item">
                    <span className="check-icon">&#10003;</span>
                    <span className="text-sm" style={{ color: 'rgba(217,217,217,0.9)' }}>{item}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center space-x-6 text-sm" style={{ color: 'rgba(119,182,232,0.9)' }}>
                <div className="flex items-center space-x-1">
                  <span style={{ color: '#f0b429' }}>&#9733;&#9733;&#9733;&#9733;&#9733;</span>
                  <span>4.9 / 5 Rating</span>
                </div>
                <div style={{ borderLeft: '1px solid rgba(119,182,232,0.3)', paddingLeft: '1.5rem' }}>
                  10,000+ Loans Funded
                </div>
              </div>
            </div>

            <div className="lg:sticky lg:top-24">
              <LoanApplicationForm source="homepage-hero" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="bg-white py-8" style={{ borderBottom: '1px solid #d9d9d9' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '$150M+',  label: 'Loans Funded' },
              { value: '10,000+', label: 'Customers Served' },
              { value: '8.5%',    label: 'Avg. Rate Reduction' },
              { value: '$312',    label: 'Avg. Monthly Savings' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-bold" style={{ color: '#2b7cff' }}>{stat.value}</p>
                <p className="text-sm mt-1" style={{ color: '#494949' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Loan Products ── */}
      <section className="section-padding" style={{ background: '#f8f9fa' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3" style={{ color: '#0d1b2a' }}>Our Loan Products</h2>
            <p className="text-base max-w-xl mx-auto" style={{ color: '#494949' }}>
              Check your rate with no impact to your credit score.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Debt Consolidation */}
            <Link href="/loans" className="card-hover p-8 block group">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: 'rgba(43,124,255,0.10)' }}>
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="#2b7cff" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 transition-colors group-hover:text-primary-500" style={{ color: '#0d1b2a' }}>
                Debt Consolidation Loans
              </h3>
              <p className="mb-5 text-sm leading-relaxed" style={{ color: '#494949' }}>
                Combine multiple high-interest debts — credit cards, medical bills, personal loans —
                into one simple monthly payment at a lower rate. Save hundreds every month.
              </p>
              <ul className="space-y-2 mb-6">
                {['Rates from 5.99% APR', '$5,000 – $100,000+', 'Fixed monthly payments'].map(i => (
                  <li key={i} className="check-item text-sm" style={{ color: '#494949' }}>
                    <span className="check-icon text-xs">&#10003;</span>
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
              <span className="font-semibold text-sm" style={{ color: '#2b7cff' }}>
                Check My Rate &rarr;
              </span>
            </Link>

            {/* Personal Loans */}
            <Link href="/personal-loans" className="card-hover p-8 block group">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: 'rgba(119,182,232,0.15)' }}>
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="#77b6e8" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 transition-colors group-hover:text-primary-500" style={{ color: '#0d1b2a' }}>
                Personal Loans
              </h3>
              <p className="mb-5 text-sm leading-relaxed" style={{ color: '#494949' }}>
                Flexible funding for whatever life brings — home improvements, major purchases,
                medical expenses, or anything in between. No collateral required.
              </p>
              <ul className="space-y-2 mb-6">
                {['Competitive fixed rates', '$2,000 – $50,000', 'No collateral required'].map(i => (
                  <li key={i} className="check-item text-sm" style={{ color: '#494949' }}>
                    <span className="check-icon text-xs">&#10003;</span>
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
              <span className="font-semibold text-sm" style={{ color: '#2b7cff' }}>
                Check My Rate &rarr;
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3" style={{ color: '#0d1b2a' }}>How It Works</h2>
            <p className="text-base max-w-xl mx-auto" style={{ color: '#494949' }}>
              Get your personalized loan offer in just a few simple steps.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Check Your Rate', desc: 'Fill out our simple application in under 5 minutes. Soft credit check — zero impact to your score.' },
              { step: '2', title: 'Review Your Offer', desc: 'Get a personalized rate, monthly payment, and total savings. No obligation to accept.' },
              { step: '3', title: 'Get Funded',       desc: 'Accept your offer and receive funds in as few as 2 business days directly to your bank.' },
            ].map((item) => (
              <div key={item.step} className="text-center px-6 py-8 rounded-2xl" style={{ background: '#f8f9fa' }}>
                <div className="step-circle w-14 h-14 text-xl mx-auto mb-4">{item.step}</div>
                <h3 className="text-xl font-bold mb-3" style={{ color: '#0d1b2a' }}>{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#494949' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="section-padding" style={{ background: '#eef5ff' }}>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12" style={{ color: '#0d1b2a' }}>
            What Our Customers Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Sarah M.', location: 'Dallas, TX',   text: 'I consolidated $32,000 in credit card debt at half the interest rate. My monthly payment dropped by $400!',                              badge: '$400/mo saved' },
              { name: 'James R.', location: 'Atlanta, GA',  text: 'Application took 3 minutes, offer same day, funded in 2 days. Couldn\'t be easier.',                                                    badge: 'Funded in 2 days' },
              { name: 'Maria L.', location: 'Phoenix, AZ',  text: 'Was drowning in 6 different payments. Now I have one payment and I\'m on track to be debt-free in 3 years.',                           badge: 'Debt-free in 3 yrs' },
            ].map((t) => (
              <div key={t.name} className="card p-6">
                <div className="mb-3" style={{ color: '#f0b429' }}>&#9733;&#9733;&#9733;&#9733;&#9733;</div>
                <p className="italic mb-5 text-sm leading-relaxed" style={{ color: '#494949' }}>&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm" style={{ color: '#0d1b2a' }}>{t.name}</p>
                    <p className="text-xs" style={{ color: '#aaaaaa' }}>{t.location}</p>
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full"
                    style={{ background: 'rgba(43,124,255,0.10)', color: '#2b7cff' }}>
                    {t.badge}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, #2b7cff 0%, #30a2ff 100%)' }}>
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Simplify Your Finances?</h2>
          <p className="text-lg mb-8" style={{ color: 'rgba(255,255,255,0.85)' }}>
            Check your rate in minutes with no impact to your credit score.
          </p>
          <Link href="/loans" className="inline-block px-10 py-4 rounded-xl font-bold text-lg transition-all duration-200 hover:-translate-y-1"
            style={{ background: '#0d1b2a', color: '#ffffff', boxShadow: '0 6px 24px rgba(13,27,42,0.35)' }}>
            Check My Rate Now
          </Link>
          <p className="mt-4 text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Or call <a href="tel:877-867-2002" className="underline font-semibold text-white">877-867-2002</a>
          </p>
        </div>
      </section>
    </Layout>
  );
}
