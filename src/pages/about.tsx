import Layout from '@/components/Layout';
import LeadForm from '@/components/LeadForm';
import Link from 'next/link';

export default function About() {
  return (
    <Layout
      title="About Freedom Debt Solutions | Trusted Debt Relief Experts"
      description="Learn about Freedom Debt Solutions and our mission to help Americans find relief from overwhelming debt. Certified specialists, proven results, no upfront fees."
      canonical="/about"
    >
      <section className="bg-gradient-to-br from-primary-800 to-primary-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold mb-4">About Freedom Debt Solutions</h1>
          <p className="text-xl text-primary-200">
            Helping Americans find a path to financial freedom through expert debt relief services.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <p className="text-gray-600 mb-4 leading-relaxed">
            At Freedom Debt Solutions, we believe that everyone deserves a second chance
            at financial health. Debt can happen to anyone — a medical emergency,
            job loss, divorce, or simply years of accumulating high-interest credit
            card balances. We&apos;re here to help you find the best path forward.
          </p>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Our team of certified debt specialists works with you to understand your
            unique situation and connect you with the right debt relief program. We
            don&apos;t believe in one-size-fits-all solutions — your plan should be
            as unique as your circumstances.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {[
              { title: 'No Upfront Fees', desc: 'You never pay until we deliver results. Our fees are only charged after successfully resolving your debt.' },
              { title: 'Certified Specialists', desc: 'Our debt counselors are trained and certified to provide expert guidance on all debt relief options.' },
              { title: 'Transparent Process', desc: 'We keep you informed every step of the way. No hidden fees, no surprises — just honest debt relief.' },
              { title: 'Proven Track Record', desc: 'We\'ve helped thousands of clients reduce their debt and regain financial confidence.' },
            ].map((item) => (
              <div key={item.title} className="border border-gray-100 rounded-lg p-5">
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/get-started" className="btn-primary text-lg px-10 py-4 inline-block">
              Get Your Free Consultation
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 section-padding">
        <div className="max-w-xl mx-auto">
          <LeadForm
            variant="full"
            source="about-page"
            heading="Ready to Start Your Journey?"
            subheading="Get a free, no-obligation debt analysis from our team."
          />
        </div>
      </section>
    </Layout>
  );
}
