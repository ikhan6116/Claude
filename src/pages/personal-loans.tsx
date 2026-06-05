import { useRef } from 'react';
import Layout from '@/components/Layout';
import LoanApplicationForm from '@/components/LoanApplicationForm';

export default function PersonalLoans() {
  const formRef = useRef<HTMLDivElement>(null);
  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <Layout
      title="Personal Loans | BrightPath Finance"
      description="Flexible personal loans from $2,000 to $50,000. No collateral required. Check your rate — no credit score impact."
      canonical="/personal-loans"
      hideStickyCTA
    >
      {/* ── Hero ── */}
      <section style={{ background: 'linear-gradient(160deg, #f0f7ff 0%, #ffffff 50%, #eef5ff 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight mb-6" style={{ color: '#0d1b2a' }}>
              Personal loans for<br />
              <span style={{ color: '#2b7cff' }}>whatever life brings.</span>
            </h1>
            <p className="text-lg sm:text-xl leading-relaxed mb-8" style={{ color: '#494949' }}>
              From home improvement to unexpected expenses — get flexible funding
              with fixed monthly payments and no collateral required.
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
              <button onClick={scrollToForm} className="btn-primary text-base py-4 px-10">View Your Rate</button>
              <span className="text-sm" style={{ color: '#494949' }}>No credit score impact</span>
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm" style={{ color: '#494949' }}>
              <span><strong style={{ color: '#0d1b2a' }}>$50K</strong> max loan</span>
              <span><strong style={{ color: '#0d1b2a' }}>Fixed</strong> rates</span>
              <span><strong style={{ color: '#0d1b2a' }}>2 days</strong> to fund</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Use cases ── */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-14" style={{ color: '#0d1b2a' }}>
            Use it for anything
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Home improvement',  desc: 'Kitchen remodel, bathroom upgrade, new roof — invest in your home.' },
              { title: 'Major purchases',   desc: 'Furniture, appliances, electronics — buy what you need without maxing out cards.' },
              { title: 'Medical expenses',  desc: 'Cover medical bills with a fixed payment instead of high-interest credit.' },
              { title: 'Moving costs',      desc: 'Security deposits, movers, new furniture — everything for a fresh start.' },
              { title: 'Special events',    desc: 'Weddings, vacations, or milestone celebrations — funded responsibly.' },
              { title: 'Emergency expenses',desc: 'Life happens. Get the funds you need quickly when unexpected costs arise.' },
            ].map(c => (
              <div key={c.title} className="p-6 rounded-2xl transition-all hover:-translate-y-1 duration-200"
                style={{ border: '1px solid #e9ecef' }}>
                <h3 className="font-bold mb-2" style={{ color: '#0d1b2a' }}>{c.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#494949' }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="section-padding" style={{ background: '#f8f9fa' }}>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-14" style={{ color: '#0d1b2a' }}>How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { n: '1', title: 'Check your rate',   desc: 'Quick form, soft credit check — no impact to your score.' },
              { n: '2', title: 'Choose your terms',  desc: 'Pick the amount and repayment term that fits your budget.' },
              { n: '3', title: 'Get your funds',     desc: 'Accept and money goes directly to your bank in as few as 2 days.' },
            ].map(s => (
              <div key={s.n} className="bg-white rounded-2xl p-8 text-center" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-5 text-white text-lg font-bold"
                  style={{ background: 'linear-gradient(135deg, #2b7cff, #30a2ff)' }}>{s.n}</div>
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
              <h2 className="text-3xl sm:text-4xl font-extrabold mb-4" style={{ color: '#0d1b2a' }}>Check your rate</h2>
              <p className="text-base mb-8 leading-relaxed" style={{ color: '#494949' }}>
                See your personalized loan offer in minutes. Free and no credit score impact.
              </p>
              <div className="space-y-5">
                {[
                  { title: 'No credit impact',    desc: 'Soft inquiry only.' },
                  { title: 'No collateral needed', desc: 'Unsecured — no assets required.' },
                  { title: 'Up to $50,000',        desc: 'Flexible loan amounts.' },
                  { title: 'Fixed payments',        desc: 'Same amount every month.' },
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
            </div>
            <LoanApplicationForm source="personal-loans" />
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="section-padding" style={{ background: '#f8f9fa' }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-extrabold text-center mb-12" style={{ color: '#0d1b2a' }}>FAQs</h2>
          <div className="space-y-4">
            {[
              { q: 'What can I use a personal loan for?',     a: 'Anything — home improvement, debt payoff, medical bills, major purchases. No restrictions.' },
              { q: 'Do I need collateral?',                   a: 'No. BrightPath personal loans are unsecured.' },
              { q: 'How much can I borrow?',                  a: '$2,000 to $50,000, depending on your credit profile and income.' },
              { q: 'Will checking my rate affect my credit?', a: 'No. Soft inquiry only — zero impact to your credit score.' },
              { q: 'How long until I get funded?',            a: 'As few as 2 business days after accepting your offer.' },
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
