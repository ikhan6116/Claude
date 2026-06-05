import { useRef } from 'react';
import Layout from '@/components/Layout';
import LoanApplicationForm from '@/components/LoanApplicationForm';

export default function LoansPage() {
  const formRef = useRef<HTMLDivElement>(null);
  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <Layout
      title="Debt Consolidation Loans | BrightPath Finance"
      description="Consolidate your debt into one simple monthly payment. Check your rate with no impact to your credit score."
      canonical="/loans"
      hideStickyCTA
    >
      {/* ── Hero ── */}
      <section style={{ background: 'linear-gradient(160deg, #f0f7ff 0%, #ffffff 50%, #eef5ff 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight mb-6" style={{ color: '#0d1b2a' }}>
              Consolidate your debt.<br />
              <span style={{ color: '#2b7cff' }}>Save every month.</span>
            </h1>
            <p className="text-lg sm:text-xl leading-relaxed mb-8" style={{ color: '#494949' }}>
              Combine credit cards, medical bills, and other high-interest debt into one
              fixed-rate loan with a lower monthly payment. Check your rate with no credit score impact.
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
              <button onClick={scrollToForm} className="btn-primary text-base py-4 px-10">View Your Rate</button>
              <span className="text-sm" style={{ color: '#494949' }}>Takes about 2 minutes</span>
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm" style={{ color: '#494949' }}>
              <span><strong style={{ color: '#0d1b2a' }}>5.99%</strong> low fixed APR</span>
              <span><strong style={{ color: '#0d1b2a' }}>$100K+</strong> loan amounts</span>
              <span><strong style={{ color: '#0d1b2a' }}>$0</strong> application fees</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why consolidate ── */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-4" style={{ color: '#0d1b2a' }}>
            Why consolidate with BrightPath?
          </h2>
          <p className="text-center mb-14 max-w-xl mx-auto" style={{ color: '#494949' }}>
            Simplify your finances and save money every month.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Lower interest rates',    desc: 'Go from 20%+ credit card APR to a fixed rate as low as 5.99%. More of each payment goes to principal.' },
              { title: 'One monthly payment',     desc: 'Replace multiple due dates with one fixed payment — same amount, same day, every month.' },
              { title: 'No hidden fees',           desc: 'No application fees. No prepayment penalties. Transparent terms before you commit.' },
              { title: 'Fast funding',             desc: 'Get funds deposited in as few as 2 business days after accepting your offer.' },
              { title: 'No credit score impact',   desc: 'Checking your rate is a soft inquiry — it won\'t affect your credit score.' },
              { title: 'Clear payoff date',        desc: 'Know exactly when you\'ll be debt-free with a fixed loan term of 24–84 months.' },
            ].map(f => (
              <div key={f.title} className="p-6 rounded-2xl transition-all hover:-translate-y-1 duration-200"
                style={{ border: '1px solid #e9ecef' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: 'rgba(43,124,255,0.08)' }}>
                  <span className="text-lg" style={{ color: '#2b7cff' }}>&#10003;</span>
                </div>
                <h3 className="font-bold mb-2" style={{ color: '#0d1b2a' }}>{f.title}</h3>
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
              { n: '1', title: 'Check your rate',  desc: 'Answer a few questions. We\'ll do a soft credit check — no impact to your score.' },
              { n: '2', title: 'Review your offer', desc: 'See your personalized rate, payment, and term. Compare options with no obligation.' },
              { n: '3', title: 'Get funded',        desc: 'Accept and receive funds in your bank account in as few as 2 business days.' },
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
        </div>
      </section>

      {/* ── Application form ── */}
      <section ref={formRef} id="apply" className="section-padding bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold mb-4" style={{ color: '#0d1b2a' }}>
                Check your rate
              </h2>
              <p className="text-base mb-8 leading-relaxed" style={{ color: '#494949' }}>
                See your personalized loan offer in minutes. Checking your rate is free
                and won&apos;t affect your credit score.
              </p>
              <div className="space-y-5">
                {[
                  { title: 'No credit impact',    desc: 'Soft inquiry only — your score stays the same.' },
                  { title: 'Rates from 5.99% APR', desc: 'Competitive fixed rates based on your profile.' },
                  { title: 'Up to $100,000+',      desc: 'Loan amounts tailored to your debt.' },
                  { title: 'Fixed payments',        desc: 'Same amount every month — no surprises.' },
                ].map(item => (
                  <div key={item.title} className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs mt-0.5"
                      style={{ background: 'linear-gradient(135deg, #2b7cff, #30a2ff)' }}>&#10003;</span>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: '#0d1b2a' }}>{item.title}</p>
                      <p className="text-sm" style={{ color: '#494949' }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 p-5 rounded-xl" style={{ background: '#f8f9fa', border: '1px solid #e9ecef' }}>
                <div className="flex items-center space-x-0.5 mb-2">
                  {[1,2,3,4,5].map(i => (
                    <svg key={i} className="w-4 h-4" fill="#f0b429" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  ))}
                </div>
                <p className="text-sm italic" style={{ color: '#494949' }}>
                  &ldquo;I consolidated $32,000 in credit card debt and dropped my monthly payment by $400. The process was seamless.&rdquo;
                </p>
                <p className="text-xs mt-2 font-semibold" style={{ color: '#0d1b2a' }}>Sarah M., Dallas TX</p>
              </div>
            </div>

            <div>
              <LoanApplicationForm source="loans-landing" />
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="section-padding" style={{ background: '#f8f9fa' }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-extrabold text-center mb-12" style={{ color: '#0d1b2a' }}>
            Frequently asked questions
          </h2>
          <div className="space-y-4">
            {[
              { q: 'Will checking my rate affect my credit score?', a: 'No. We use a soft credit inquiry that doesn\'t impact your score. A hard inquiry only occurs if you accept a loan offer.' },
              { q: 'What credit score do I need?',                  a: 'We work with a range of credit profiles. Better rates are available for higher scores, but we have options for scores as low as 550.' },
              { q: 'How much can I borrow?',                        a: 'Loan amounts range from $5,000 to over $100,000, depending on your creditworthiness and income.' },
              { q: 'How fast can I get funded?',                    a: 'Funds can be deposited in as few as 2 business days after you accept your offer and complete verification.' },
              { q: 'Are there any fees?',                           a: 'No application fees. Some offers may include an origination fee (0–6%), clearly disclosed before you accept. No prepayment penalties.' },
            ].map(faq => (
              <div key={faq.q} className="bg-white rounded-2xl p-6" style={{ border: '1px solid #e9ecef' }}>
                <h3 className="font-bold mb-2" style={{ color: '#0d1b2a' }}>{faq.q}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#494949' }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
