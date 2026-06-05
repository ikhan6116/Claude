import Layout from '@/components/Layout';
import LoanApplicationForm from '@/components/LoanApplicationForm';

export default function PersonalLoans() {
  return (
    <Layout
      title="Personal Loans | BrightPath Finance"
      description="Flexible personal loans from $2,000 to $50,000. No collateral required. Check your rate with no impact to your credit score."
      canonical="/personal-loans"
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
                Personal Loans for
                <span className="block mt-1" style={{ color: '#77b6e8' }}>Whatever Life Brings</span>
              </h1>
              <p className="text-lg mb-8 leading-relaxed" style={{ color: 'rgba(217,217,217,0.85)' }}>
                Whether it&apos;s a home renovation, a major purchase, or an unexpected expense,
                BrightPath Finance personal loans give you flexible funding with fixed monthly payments.
              </p>
              <ul className="space-y-3 mb-8">
                {['Borrow $2,000 to $50,000','Competitive fixed interest rates','No collateral required','Funds in as few as 2 business days','No prepayment penalties'].map(item => (
                  <li key={item} className="check-item">
                    <span className="check-icon">&#10003;</span>
                    <span className="text-sm" style={{ color: 'rgba(217,217,217,0.9)' }}>{item}</span>
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

      {/* ── Use Cases ── */}
      <section className="section-padding" style={{ background: '#f8f9fa' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3" style={{ color: '#0d1b2a' }}>Use Your Loan For Anything</h2>
            <p style={{ color: '#494949' }}>No restrictions on how you use your funds.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Home Improvement',  desc: 'Kitchen remodel, bathroom upgrade, new roof — invest in your home.' },
              { title: 'Major Purchases',   desc: 'Furniture, appliances, electronics — buy what you need without maxing out cards.' },
              { title: 'Medical Expenses',  desc: 'Cover medical bills with a fixed payment instead of high-interest credit.' },
              { title: 'Moving Costs',      desc: 'Security deposits, movers, new furniture — cover the costs of a fresh start.' },
              { title: 'Special Events',    desc: 'Weddings, vacations, or milestone celebrations funded responsibly.' },
              { title: 'Emergency Expenses',desc: 'Life happens. Get the funds you need quickly when unexpected costs arise.' },
            ].map(item => (
              <div key={item.title} className="card-hover p-6">
                <h3 className="font-bold mb-2" style={{ color: '#0d1b2a' }}>{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#494949' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12" style={{ color: '#0d1b2a' }}>How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Check Your Rate',    desc: 'Answer a few questions and see your personalized rate in minutes. No hard credit check.' },
              { step: '2', title: 'Choose Your Terms',  desc: 'Select the loan amount and repayment term that fits your budget. Fixed payments, no surprises.' },
              { step: '3', title: 'Get Your Funds',     desc: 'Accept your offer and money is deposited directly into your bank account in as few as 2 days.' },
            ].map(item => (
              <div key={item.step} className="text-center px-6 py-8 rounded-2xl" style={{ background: '#f8f9fa' }}>
                <div className="step-circle mx-auto">{item.step}</div>
                <h3 className="text-xl font-bold mb-3" style={{ color: '#0d1b2a' }}>{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#494949' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="section-padding" style={{ background: '#f8f9fa' }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12" style={{ color: '#0d1b2a' }}>FAQs</h2>
          <div className="space-y-4">
            {[
              { q: 'What can I use a personal loan for?',        a: 'Anything you need — home improvement, debt payoff, medical bills, major purchases, moving expenses. No restrictions.' },
              { q: 'Do I need collateral?',                      a: 'No. BrightPath personal loans are unsecured. You don\'t need to put up your home, car, or any other asset.' },
              { q: 'How much can I borrow?',                     a: 'Personal loans range from $2,000 to $50,000 depending on your credit profile and income.' },
              { q: 'Will checking my rate affect my credit?',    a: 'No. We use a soft inquiry to check your rate — zero impact to your credit score.' },
              { q: 'How long does it take to get funded?',       a: 'After accepting your offer and completing verification, funds can be deposited in as few as 2 business days.' },
            ].map(faq => (
              <div key={faq.q} className="rounded-xl p-6 bg-white" style={{ border: '1px solid #d9d9d9' }}>
                <h3 className="font-bold mb-2" style={{ color: '#0d1b2a' }}>{faq.q}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#494949' }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg,#2b7cff 0%,#30a2ff 100%)' }}>
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Get the Funds You Need</h2>
          <p className="text-lg mb-8" style={{ color: 'rgba(255,255,255,0.85)' }}>Check your rate in minutes — no credit score impact.</p>
          <a href="#top" onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="inline-block px-10 py-4 rounded-xl font-bold text-lg transition-all duration-200 hover:-translate-y-1"
            style={{ background: '#0d1b2a', color: '#fff', boxShadow: '0 6px 24px rgba(13,27,42,0.35)' }}>
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
