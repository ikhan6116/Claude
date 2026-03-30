import Layout from '@/components/Layout';
import LeadForm from '@/components/LeadForm';
import Link from 'next/link';

export default function DebtRelief() {
  return (
    <Layout
      title="Debt Relief Programs for Americans in Financial Hardship | Freedom Debt Solutions"
      description="Explore debt relief options including debt settlement, consolidation, and management plans. Reduce your unsecured debt by up to 50%. Free consultation, no upfront fees."
      canonical="/debt-relief"
    >
      <section className="bg-gradient-to-br from-primary-800 to-primary-900 text-white section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-6">
                Debt Relief Programs That Help You Regain Control
              </h1>
              <p className="text-xl text-primary-100 mb-6">
                When minimum payments aren&apos;t enough, our debt relief programs
                can help you reduce what you owe and become debt-free in as little
                as 24-48 months — without filing for bankruptcy.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Reduce total debt by up to 50%',
                  'No upfront fees — pay only for results',
                  'Stop overwhelming creditor calls',
                  'Avoid bankruptcy and its long-term impact',
                  'Personalized plan for your situation',
                ].map((item) => (
                  <li key={item} className="flex items-center space-x-2">
                    <span className="text-accent-500">&#10003;</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <LeadForm
              variant="compact"
              source="debt-relief-page"
              heading="See If You Qualify for Debt Relief"
              subheading="Free analysis — no credit check required."
            />
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Understanding Your Debt Relief Options
          </h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            If you&apos;re struggling with overwhelming debt, you have several options
            beyond just making minimum payments. Our debt relief specialists will help
            you understand which program is the best fit for your financial situation,
            goals, and timeline.
          </p>

          <div className="space-y-8">
            <div className="border-l-4 border-primary-500 pl-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Debt Settlement</h3>
              <p className="text-gray-600">
                We negotiate directly with your creditors to settle your debts for
                significantly less than what you owe. This is ideal for people with
                $10,000+ in unsecured debt who are experiencing genuine financial hardship.
              </p>
            </div>

            <div className="border-l-4 border-primary-500 pl-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Debt Consolidation</h3>
              <p className="text-gray-600">
                Combine multiple high-interest debts into a single monthly payment
                with a lower interest rate. Great for people who can afford to pay
                their debts but want simpler management and lower costs.
              </p>
            </div>

            <div className="border-l-4 border-primary-500 pl-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Debt Management Plans</h3>
              <p className="text-gray-600">
                Work with a credit counseling agency to create a structured repayment
                plan with reduced interest rates and waived fees from your creditors.
              </p>
            </div>
          </div>

          <LeadForm variant="inline" source="debt-relief-mid-page" />

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
            How Much Can Debt Relief Save You?
          </h2>
          <p className="text-gray-600 mb-4 leading-relaxed">
            The amount you can save depends on your total debt, the types of debt
            you have, and your financial circumstances. On average, our clients
            save 30-50% on their total enrolled debt through our settlement program.
            For someone with $30,000 in credit card debt, that could mean savings
            of $9,000 to $15,000.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
            Is Debt Relief Right for You?
          </h2>
          <p className="text-gray-600 mb-4 leading-relaxed">
            Debt relief programs are designed for people who are experiencing genuine
            financial hardship. You may be a good candidate if:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
            <li>You have $7,500 or more in unsecured debt</li>
            <li>You&apos;re struggling to make minimum payments</li>
            <li>You&apos;re considering bankruptcy as an option</li>
            <li>You&apos;ve experienced a financial hardship (job loss, medical emergency, divorce)</li>
            <li>Your debt is growing due to high interest rates</li>
          </ul>
        </div>
      </section>

      <section className="bg-primary-700 text-white section-padding">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Don&apos;t Let Debt Control Your Life
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Every day you wait costs you more in interest and fees. Get your free
            debt analysis today and discover how much you could save.
          </p>
          <Link href="/get-started" className="btn-accent text-lg px-10 py-4 inline-block">
            Get Free Debt Analysis
          </Link>
        </div>
      </section>
    </Layout>
  );
}
