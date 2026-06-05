import Layout from '@/components/Layout';
import Link from 'next/link';

export default function Home() {
  return (
    <Layout
      title="BrightPath Finance | Personal Loans & Debt Consolidation"
      description="Consolidate your debt into one simple payment. Personal loans from $5,000 to $100,000+. Check your rate — no credit score impact."
      canonical="/"
    >
      {/* ── Hero ── */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #f0f7ff 0%, #ffffff 50%, #eef5ff 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight mb-6" style={{ color: '#0d1b2a' }}>
              Lower your rate,<br />
              <span style={{ color: '#2b7cff' }}>crush your debt.</span>
            </h1>
            <p className="text-lg sm:text-xl leading-relaxed mb-10" style={{ color: '#494949' }}>
              Consolidate your credit card debt into one fixed-rate personal loan.
              Lower your monthly payment, pay off debt faster, and take control of your finances.
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-10">
              <Link href="/loans" className="btn-primary text-base py-4 px-10">View Your Rate</Link>
              <span className="text-sm" style={{ color: '#494949' }}>Won&apos;t affect your credit score</span>
            </div>
          </div>
        </div>
        {/* Decorative arc */}
        <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-[0.04] hidden lg:block"
          style={{ background: 'radial-gradient(circle, #2b7cff 0%, transparent 70%)' }} />
      </section>

      {/* ── Stats ── */}
      <section className="bg-white" style={{ borderBottom: '1px solid #e9ecef' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '5.99%',    sub: 'Low fixed APR¹' },
              { value: '$100K+',   sub: 'Loan amounts' },
              { value: '2 days',   sub: 'Fast funding²' },
              { value: '$0',       sub: 'Application fees' },
            ].map(s => (
              <div key={s.sub}>
                <p className="text-3xl sm:text-4xl font-extrabold" style={{ color: '#0d1b2a' }}>{s.value}</p>
                <p className="text-sm mt-1" style={{ color: '#494949' }}>{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why consolidate ── */}
      <section className="bg-white section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4" style={{ color: '#0d1b2a' }}>
              Why consolidate with BrightPath?
            </h2>
            <p className="text-base" style={{ color: '#494949' }}>
              We make it simple to combine high-interest debt into one loan with better terms.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="#2b7cff" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                  </svg>
                ),
                title: 'Lower your rate',
                desc: 'The average credit card rate is 24%. Our consolidation loans start at 5.99% APR — so more of your payment goes to principal.',
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="#2b7cff" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: 'One simple payment',
                desc: 'Replace 5, 6, or 7 confusing bills with a single fixed monthly payment you can count on — same amount, same date, every month.',
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="#2b7cff" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: 'Pay off debt faster',
                desc: 'With a fixed term and lower rate, you\'ll have a clear payoff date. Most members are debt-free in 2–5 years.',
              },
            ].map(f => (
              <div key={f.title} className="text-center lg:text-left">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto lg:mx-0 mb-5"
                  style={{ background: 'rgba(43,124,255,0.08)' }}>
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: '#0d1b2a' }}>{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#494949' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="section-padding" style={{ background: '#f8f9fa' }}>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-14" style={{ color: '#0d1b2a' }}>
            How it works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { n: '1', title: 'Check your rate', desc: 'Fill out a short form — takes about 2 minutes. We\'ll do a soft credit check that won\'t impact your score.' },
              { n: '2', title: 'Choose your loan', desc: 'Compare your personalized rate, monthly payment, and terms. Pick the option that fits your budget.' },
              { n: '3', title: 'Get funded', desc: 'Accept your loan and receive funds directly in your bank account in as few as 2 business days.' },
            ].map(s => (
              <div key={s.n} className="bg-white rounded-2xl p-8 text-center" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-5 text-white text-lg font-bold"
                  style={{ background: 'linear-gradient(135deg, #2b7cff, #30a2ff)' }}>
                  {s.n}
                </div>
                <h3 className="text-lg font-bold mb-3" style={{ color: '#0d1b2a' }}>{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#494949' }}>{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/loans" className="btn-primary py-4 px-10 text-base">View Your Rate</Link>
          </div>
        </div>
      </section>

      {/* ── Loan products ── */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-4" style={{ color: '#0d1b2a' }}>
            Our loan products
          </h2>
          <p className="text-center mb-14" style={{ color: '#494949' }}>Find the right loan for your needs.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: 'Debt Consolidation Loans',
                desc: 'Combine multiple high-interest debts into one fixed-rate loan. Lower your rate and simplify your bills.',
                details: ['Rates from 5.99% APR', '$5,000 – $100,000+', 'Fixed monthly payments', '24–84 month terms'],
                href: '/loans',
              },
              {
                title: 'Personal Loans',
                desc: 'Flexible funding for home improvement, major purchases, medical expenses, and more.',
                details: ['Competitive fixed rates', '$2,000 – $50,000', 'No collateral required', 'Funds in 2 days'],
                href: '/personal-loans',
              },
            ].map(p => (
              <Link key={p.title} href={p.href}
                className="block rounded-2xl p-8 transition-all duration-200 hover:-translate-y-1 group"
                style={{ border: '1px solid #e9ecef', boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }}>
                <h3 className="text-2xl font-bold mb-3 group-hover:text-primary-500 transition-colors" style={{ color: '#0d1b2a' }}>
                  {p.title}
                </h3>
                <p className="text-sm mb-5 leading-relaxed" style={{ color: '#494949' }}>{p.desc}</p>
                <ul className="space-y-2 mb-6">
                  {p.details.map(d => (
                    <li key={d} className="flex items-center space-x-2 text-sm" style={{ color: '#494949' }}>
                      <span style={{ color: '#2b7cff' }}>&#10003;</span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
                <span className="text-sm font-semibold" style={{ color: '#2b7cff' }}>View Your Rate &rarr;</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Social proof ── */}
      <section className="section-padding" style={{ background: '#f8f9fa' }}>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-14" style={{ color: '#0d1b2a' }}>
            Members love BrightPath
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Sarah M.', loc: 'Dallas, TX', text: 'I consolidated $32,000 in credit card debt at half the rate. My monthly payment dropped by $400.', tag: '$400/mo saved' },
              { name: 'James R.', loc: 'Atlanta, GA', text: 'The application took 3 minutes. I had an offer the same day and was funded in 2 days.', tag: 'Funded in 2 days' },
              { name: 'Maria L.', loc: 'Phoenix, AZ', text: 'I went from 6 separate payments to one. I\'m on track to be debt-free in 3 years.', tag: 'Debt-free in 3 yrs' },
            ].map(t => (
              <div key={t.name} className="bg-white rounded-2xl p-7" style={{ border: '1px solid #e9ecef' }}>
                <div className="flex items-center space-x-0.5 mb-4">
                  {[1,2,3,4,5].map(i => (
                    <svg key={i} className="w-4 h-4" fill="#f0b429" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  ))}
                </div>
                <p className="text-sm leading-relaxed mb-5" style={{ color: '#494949' }}>&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold" style={{ color: '#0d1b2a' }}>{t.name}</p>
                    <p className="text-xs" style={{ color: '#aaa' }}>{t.loc}</p>
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full"
                    style={{ background: 'rgba(43,124,255,0.08)', color: '#2b7cff' }}>{t.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section style={{ background: '#0d1b2a' }}>
        <div className="max-w-3xl mx-auto px-4 py-20 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Ready to take control of your debt?
          </h2>
          <p className="text-lg mb-10" style={{ color: 'rgba(255,255,255,0.6)' }}>
            See your personalized rate in minutes — without affecting your credit score.
          </p>
          <Link href="/loans"
            className="inline-block px-10 py-4 rounded-xl font-bold text-base text-white transition-all duration-200 hover:-translate-y-1"
            style={{ background: 'linear-gradient(135deg, #2b7cff, #30a2ff)', boxShadow: '0 4px 20px rgba(43,124,255,0.4)' }}>
            View Your Rate
          </Link>
        </div>
      </section>

      {/* ── Footnotes ── */}
      <section className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-xs leading-relaxed space-y-2" style={{ color: '#aaa' }}>
            <p>¹ Lowest rate available with excellent credit and autopay. Your rate will depend on your credit score, loan amount, and term.</p>
            <p>² Funds available as soon as the same day for existing customers; 2 business days for new customers after verification.</p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
