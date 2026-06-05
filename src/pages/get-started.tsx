import Layout from '@/components/Layout';
import LoanApplicationForm from '@/components/LoanApplicationForm';

export default function GetStarted() {
  return (
    <Layout
      title="Check Your Rate | BrightPath Finance"
      description="Check your personalized loan rate in minutes. No impact to your credit score. Debt consolidation and personal loans from BrightPath Finance."
      canonical="/get-started"
    >
      <section className="bg-gradient-to-br from-primary-800 to-primary-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="lg:sticky lg:top-24">
              <h1 className="text-4xl font-extrabold mb-6">
                Check Your Personalized Loan Rate
              </h1>
              <p className="text-xl text-primary-100 mb-8">
                See what you qualify for in just a few minutes. No hard credit check,
                no obligation — just a clear picture of your options.
              </p>

              <div className="space-y-6 mb-8">
                {[
                  { title: 'No Credit Impact', desc: 'Soft inquiry only — your score stays the same.' },
                  { title: 'Rates From 5.99% APR', desc: 'Competitive rates based on your credit profile.' },
                  { title: 'Up to $100,000+', desc: 'Loan amounts tailored to your needs.' },
                  { title: 'Fast Funding', desc: 'Approved applicants get funds in as few as 2 days.' },
                  { title: 'One Simple Payment', desc: 'Replace multiple bills with one monthly payment.' },
                ].map((item) => (
                  <div key={item.title} className="flex items-start space-x-3">
                    <span className="text-accent-500 text-xl mt-0.5">&#10003;</span>
                    <div>
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-primary-200 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-primary-700/50 rounded-xl p-6">
                <p className="text-sm text-primary-200">
                  &ldquo;I consolidated $32,000 in credit card debt and dropped my monthly
                  payment by $400. The process was seamless.&rdquo;
                </p>
                <p className="text-sm font-semibold mt-2">— Sarah M., Dallas, TX</p>
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
