import Layout from '@/components/Layout';
import LeadForm from '@/components/LeadForm';

export default function GetStarted() {
  return (
    <Layout
      title="Get Your Free Debt Consultation | Freedom Debt Solutions"
      description="Start your journey to financial freedom. Get a free, no-obligation debt analysis from our certified specialists. No credit check required. Reduce your debt by up to 50%."
      canonical="/get-started"
    >
      <section className="bg-gradient-to-br from-primary-800 to-primary-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="lg:sticky lg:top-24">
              <h1 className="text-4xl font-extrabold mb-6">
                Get Your Free Debt Relief Consultation
              </h1>
              <p className="text-xl text-primary-100 mb-8">
                Take the first step toward becoming debt-free. Our certified specialists
                will analyze your situation and present you with the best options — at
                absolutely no cost or obligation.
              </p>

              <div className="space-y-6 mb-8">
                {[
                  { title: 'No Upfront Fees', desc: 'You only pay when we successfully resolve your debt.' },
                  { title: 'No Credit Check', desc: 'Your consultation won\'t affect your credit score.' },
                  { title: 'Reduce Debt Up to 50%', desc: 'Our average client saves thousands on what they owe.' },
                  { title: 'One Low Payment', desc: 'Replace multiple bills with one affordable monthly payment.' },
                  { title: 'Fast Results', desc: 'Most clients complete the program in 24-48 months.' },
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
                  &ldquo;I was drowning in $42,000 of credit card debt. Freedom Debt Solutions
                  helped me settle for less than half. The process was straightforward
                  and the team was incredible.&rdquo;
                </p>
                <p className="text-sm font-semibold mt-2">— Michael T., Ohio</p>
              </div>
            </div>

            <div>
              <LeadForm
                variant="full"
                source="get-started-page"
                heading="Start Your Free Debt Analysis"
                subheading="Complete the form below. A specialist will contact you within 24 hours."
              />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
