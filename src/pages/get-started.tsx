import Layout from '@/components/Layout';
import LoanApplicationForm from '@/components/LoanApplicationForm';

export default function GetStarted() {
  return (
    <Layout
      title="Check Your Rate | BrightPath Finance"
      description="Check your personalized loan rate in minutes. No impact to your credit score. Debt consolidation and personal loans from BrightPath Finance."
      canonical="/get-started"
    >
      <section className="hero-gradient text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

            <div className="lg:sticky lg:top-24">
              <h1 className="text-4xl font-extrabold text-white mb-6">
                Check Your Personalized Loan Rate
              </h1>
              <p className="text-lg mb-8 leading-relaxed" style={{ color: 'rgba(217,217,217,0.85)' }}>
                See what you qualify for in minutes. No hard credit check, no obligation —
                just a clear picture of your options.
              </p>
              <div className="space-y-5 mb-8">
                {[
                  { title: 'No Credit Impact',    desc: 'Soft inquiry only — your score stays the same.' },
                  { title: 'Rates From 5.99% APR',desc: 'Competitive rates based on your credit profile.' },
                  { title: 'Up to $100,000+',     desc: 'Loan amounts tailored to your needs.' },
                  { title: 'Fast Funding',         desc: 'Approved applicants receive funds in as few as 2 days.' },
                  { title: 'One Simple Payment',   desc: 'Replace multiple bills with one monthly payment.' },
                ].map(item => (
                  <div key={item.title} className="check-item">
                    <span className="check-icon">&#10003;</span>
                    <div>
                      <p className="font-semibold text-sm text-white">{item.title}</p>
                      <p className="text-xs" style={{ color: 'rgba(217,217,217,0.7)' }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-xl p-5" style={{ background: 'rgba(13,27,42,0.4)', border: '1px solid rgba(119,182,232,0.2)' }}>
                <p className="text-sm italic" style={{ color: 'rgba(217,217,217,0.85)' }}>
                  &ldquo;I consolidated $32,000 in credit card debt and dropped my monthly payment by $400.
                  The process was seamless.&rdquo;
                </p>
                <p className="text-sm font-semibold mt-2" style={{ color: '#77b6e8' }}>— Sarah M., Dallas, TX</p>
              </div>
            </div>

            <div>
              <LoanApplicationForm source="get-started-page" />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
