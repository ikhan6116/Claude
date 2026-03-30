import Layout from '@/components/Layout';
import LeadForm from '@/components/LeadForm';
import Link from 'next/link';

export default function CreditCardDebtHelp() {
  return (
    <Layout
      title="Credit Card Debt Help | Reduce High-Interest Card Balances | Freedom Debt Solutions"
      description="Drowning in credit card debt? Learn how to reduce high-interest credit card balances by up to 50%. Free consultation with certified debt specialists. No upfront fees."
      canonical="/credit-card-debt-help"
    >
      <section className="bg-gradient-to-br from-primary-800 to-primary-900 text-white section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-6">
                Struggling With Credit Card Debt? There Is a Way Out
              </h1>
              <p className="text-xl text-primary-100 mb-6">
                The average American household carries over $10,000 in credit card debt.
                If high interest rates are making it impossible to pay down your balances,
                our credit card debt relief programs can help.
              </p>
            </div>
            <LeadForm
              variant="compact"
              source="credit-card-debt-page"
              heading="Get Credit Card Debt Help Now"
            />
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            How to Get Out of Credit Card Debt Without Going Bankrupt
          </h2>
          <p className="text-gray-600 mb-4 leading-relaxed">
            Credit card debt is one of the most expensive types of debt, with average
            interest rates exceeding 20%. When you&apos;re only making minimum payments,
            the majority goes toward interest — meaning your balance barely moves.
            Our programs break this cycle.
          </p>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
            Credit Card Debt Relief Options
          </h3>
          <div className="space-y-4 mb-8">
            <div className="bg-gray-50 rounded-lg p-5">
              <h4 className="font-bold text-gray-900 mb-1">Debt Settlement for Credit Cards</h4>
              <p className="text-gray-600 text-sm">
                We negotiate with credit card companies to settle your balances for
                30-50% less than what you owe. This is the fastest path to becoming
                credit card debt-free.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-5">
              <h4 className="font-bold text-gray-900 mb-1">Balance Transfer Consolidation</h4>
              <p className="text-gray-600 text-sm">
                For those who qualify, transferring high-interest balances to a lower-rate
                card can save thousands in interest charges over time.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-5">
              <h4 className="font-bold text-gray-900 mb-1">Debt Management Plans</h4>
              <p className="text-gray-600 text-sm">
                Work with credit card companies through a structured plan to reduce
                interest rates and get on a fixed repayment schedule.
              </p>
            </div>
          </div>

          <LeadForm variant="inline" source="credit-card-mid-page" />

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
            Warning Signs You Need Credit Card Debt Help
          </h3>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
            <li>You can only afford minimum payments on your cards</li>
            <li>You&apos;re using one credit card to pay another</li>
            <li>Your total credit card debt exceeds $7,500</li>
            <li>Collection agencies are calling about past-due accounts</li>
            <li>Your credit utilization is above 50%</li>
            <li>You&apos;re losing sleep over credit card bills</li>
          </ul>
        </div>
      </section>

      <section className="bg-primary-700 text-white section-padding">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Stop Paying Minimum Payments Forever</h2>
          <p className="text-xl text-primary-100 mb-8">
            Get a free consultation and see how much you could save on your credit card debt.
          </p>
          <Link href="/get-started" className="btn-accent text-lg px-10 py-4 inline-block">
            Get Free Credit Card Debt Help
          </Link>
        </div>
      </section>
    </Layout>
  );
}
