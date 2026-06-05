import Layout from '@/components/Layout';
import LoanApplicationForm from '@/components/LoanApplicationForm';

export default function LoansLandingPage() {
  return (
    <Layout
      title="Debt Consolidation Loans | BrightPath Finance"
      description="Consolidate your debt into one simple monthly payment. Check your rate with no impact to your credit score. Apply online in minutes."
      canonical="/loans"
    >
      {/* ── Hero ── */}
      <section className="hero-gradient text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">

            <div className="pt-2">
              <span className="inline-block text-sm font-semibold px-4 py-1.5 rounded-full mb-6"
                style={{ background: 'rgba(119,182,232,0.15)', color: '#77b6e8' }}>
                No Impact to Your Credit Score
              </span>
              <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight text-white mb-6">
                Debt Consolidation Loans.<br />
                <span style={{ color: '#77b6e8' }}>One Payment. Lower Rate.</span>
              </h1>
              <p className="text-lg mb-8 leading-relaxed" style={{ color: 'rgba(217,217,217,0.85)' }}>
                Stop juggling multiple payments and high interest rates. Combine your
                debts into one affordable monthly payment and save hundreds per month.
              </p>

              <div className="space-y-3 mb-10">
                {[
                  'Rates starting as low as 5.99% APR',
                  'Loan amounts from $5,000 to $100,000+',
                  'No hard credit check to see your rate',
                  'Funding in as few as 2 business days',
                  'One simple monthly payment',
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
                  <span>4.9/5 Rating</span>
                </div>
                <div style={{ borderLeft: '1px solid rgba(119,182,232,0.3)', paddingLeft: '1.5rem' }}>
                  10,000+ Loans Funded
                </div>
              </div>
            </div>

            <div className="lg:sticky lg:top-24">
              <LoanApplicationForm source="loans-landing-meta-ads" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust bar ── */}
      <section className="bg-white py-8" style={{ borderBottom: '1px solid #d9d9d9' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { label: 'Average Rate Reduction', value: '8.5%' },
              { label: 'Average Monthly Savings', value: '$312' },
              { label: 'Application Time',        value: '< 5 Min' },
              { label: 'Customer Satisfaction',   value: '98%' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-bold" style={{ color: '#2b7cff' }}>{stat.value}</div>
                <div className="text-sm mt-1" style={{ color: '#494949' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="section-padding" style={{ background: '#f8f9fa' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3" style={{ color: '#0d1b2a' }}>How It Works</h2>
            <p style={{ color: '#494949' }}>Get your personalized offer in just three steps.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Check Your Rate',   desc: 'Fill out our application in under 5 minutes. Soft inquiry — no credit score impact.' },
              { step: '2', title: 'Review Your Offer', desc: 'Get a personalized rate, monthly payment, and total savings. No obligation.' },
              { step: '3', title: 'Get Funded',        desc: 'Accept your offer and receive funds in as few as 2 business days.' },
            ].map((item) => (
              <div key={item.step} className="bg-white rounded-2xl p-8 text-center" style={{ boxShadow: '0 2px 12px rgba(13,27,42,0.06)' }}>
                <div className="step-circle mx-auto">{item.step}</div>
                <h3 className="text-xl font-bold mb-3" style={{ color: '#0d1b2a' }}>{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#494949' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why BrightPath ── */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12" style={{ color: '#0d1b2a' }}>
            Why Choose BrightPath Finance?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Lower Interest Rates',    desc: 'Reduce your average interest rate from 20%+ down to as low as 5.99% APR.' },
              { title: 'One Monthly Payment',     desc: 'Replace multiple confusing bills with a single, predictable payment each month.' },
              { title: 'No Hidden Fees',          desc: 'Transparent terms with no prepayment penalties on select offers.' },
              { title: 'Fast Funding',            desc: 'Approved applicants can receive funds in as few as 2 business days.' },
              { title: 'Credit Score Protection', desc: 'Soft inquiry pre-qualification doesn\'t affect your credit score.' },
              { title: 'Expert Support',          desc: 'Dedicated loan specialists guide you through every step of the process.' },
            ].map((item) => (
              <div key={item.title} className="card-hover p-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: 'rgba(43,124,255,0.08)' }}>
                  <span style={{ color: '#2b7cff', fontSize: '18px' }}>&#10003;</span>
                </div>
                <h3 className="font-bold mb-2" style={{ color: '#0d1b2a' }}>{item.title}</h3>
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
              { name: 'Sarah M.', location: 'Dallas, TX',  text: 'I consolidated $32,000 in credit card debt into one loan at half the interest rate. My monthly payment dropped by $400!', badge: '$400/mo saved' },
              { name: 'James R.', location: 'Atlanta, GA', text: 'The application took 3 minutes and I had my offer the same day. Funded in 2 days.', badge: 'Funded in 2 days' },
              { name: 'Maria L.', location: 'Phoenix, AZ', text: 'Was drowning in 6 different payments. Now I have one payment and I\'m on track to be debt-free in 3 years.', badge: 'Debt-free in 3 yrs' },
            ].map((t) => (
              <div key={t.name} className="card p-6">
                <div className="mb-3" style={{ color: '#f0b429' }}>&#9733;&#9733;&#9733;&#9733;&#9733;</div>
                <p className="italic text-sm leading-relaxed mb-5" style={{ color: '#494949' }}>&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm" style={{ color: '#0d1b2a' }}>{t.name}</p>
                    <p className="text-xs" style={{ color: '#aaaaaa' }}>{t.location}</p>
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full"
                    style={{ background: 'rgba(43,124,255,0.10)', color: '#2b7cff' }}>{t.badge}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="section-padding bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12" style={{ color: '#0d1b2a' }}>
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              { q: 'Will checking my rate affect my credit score?', a: 'No. We use a soft credit inquiry to check your rate, which does not impact your score. A hard inquiry only occurs if you accept an offer and proceed.' },
              { q: 'What credit score do I need to qualify?',       a: 'We work with borrowers across the credit spectrum. While better rates are available for higher scores, we have options for scores as low as 550.' },
              { q: 'How much can I borrow?',                        a: 'Loan amounts range from $5,000 to over $100,000, depending on your creditworthiness, income, and existing debt load.' },
              { q: 'How fast can I get funded?',                    a: 'Approved applicants can receive funds in as few as 2 business days after accepting their offer and completing verification.' },
              { q: 'Are there any fees?',                           a: 'There are no application fees. Some loan offers may include an origination fee, clearly disclosed before you accept. Never any prepayment penalties.' },
            ].map((faq) => (
              <div key={faq.q} className="rounded-xl p-6 border" style={{ borderColor: '#d9d9d9' }}>
                <h3 className="font-bold mb-2" style={{ color: '#0d1b2a' }}>{faq.q}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#494949' }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, #2b7cff 0%, #30a2ff 100%)' }}>
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Consolidate Your Debt?</h2>
          <p className="text-lg mb-8" style={{ color: 'rgba(255,255,255,0.85)' }}>
            Check your rate in minutes. No impact to your credit score.
          </p>
          <a href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="inline-block px-10 py-4 rounded-xl font-bold text-lg transition-all duration-200 hover:-translate-y-1"
            style={{ background: '#0d1b2a', color: '#ffffff', boxShadow: '0 6px 24px rgba(13,27,42,0.35)' }}>
            Check My Rate Now
          </a>
          <p className="mt-4 text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Or call <a href="tel:877-867-2002" className="underline font-semibold text-white">877-867-2002</a>
          </p>
        </div>
      </section>
    </Layout>
  );
}
