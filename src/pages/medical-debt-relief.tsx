import Layout from '@/components/Layout';
import LeadForm from '@/components/LeadForm';
import Link from 'next/link';

export default function MedicalDebtRelief() {
  return (
    <Layout
      title="Medical Debt Relief Programs | Reduce Hospital & Doctor Bills | Freedom Debt Solutions"
      description="Overwhelmed by medical bills? Our medical debt relief programs can reduce hospital bills, doctor bills, and other medical debt. Free consultation. No upfront fees."
      canonical="/medical-debt-relief"
    >
      <section className="bg-gradient-to-br from-primary-800 to-primary-900 text-white section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-6">
                Medical Debt Relief: Don&apos;t Let Hospital Bills Ruin Your Finances
              </h1>
              <p className="text-xl text-primary-100 mb-6">
                Medical debt is the #1 cause of bankruptcy in America. But it doesn&apos;t
                have to be. Our medical debt relief programs help you negotiate and
                reduce overwhelming hospital and doctor bills.
              </p>
            </div>
            <LeadForm
              variant="compact"
              source="medical-debt-page"
              heading="Get Medical Debt Help Today"
            />
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            How Medical Debt Relief Works
          </h2>
          <p className="text-gray-600 mb-4 leading-relaxed">
            Medical bills are often negotiable — hospitals and medical providers
            would rather receive a reduced payment than nothing at all. Our
            specialists know how to negotiate with medical billing departments
            to significantly reduce what you owe.
          </p>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Whether you&apos;re dealing with emergency room bills, surgical costs,
            or ongoing treatment expenses, we can help you find relief and
            create a manageable payment plan.
          </p>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
            Types of Medical Debt We Help With
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {[
              'Hospital bills',
              'Emergency room charges',
              'Surgical costs',
              'Ambulance bills',
              'Lab and diagnostic testing',
              'Specialist visit charges',
              'Physical therapy bills',
              'Prescription medication debt',
            ].map((item) => (
              <div key={item} className="flex items-center space-x-2 text-gray-600">
                <span className="text-accent-500">&#10003;</span>
                <span>{item}</span>
              </div>
            ))}
          </div>

          <LeadForm variant="inline" source="medical-debt-mid-page" />

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
            Your Rights When Dealing With Medical Debt
          </h3>
          <p className="text-gray-600 mb-4 leading-relaxed">
            Many people don&apos;t realize they have significant rights when it comes
            to medical debt. You have the right to request an itemized bill,
            dispute charges, negotiate payment plans, and in many cases, apply
            for financial assistance programs offered by hospitals.
          </p>
          <p className="text-gray-600 mb-4 leading-relaxed">
            Recent changes to credit reporting also mean that paid medical
            collections are removed from your credit report, and unpaid medical
            debt under $500 is no longer reported. Our specialists stay current
            on all regulations to maximize your benefits.
          </p>
        </div>
      </section>

      <section className="bg-primary-700 text-white section-padding">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Medical Bills Shouldn&apos;t Bankrupt You</h2>
          <p className="text-xl text-primary-100 mb-8">
            Get expert help negotiating your medical debt. Free consultation, no obligation.
          </p>
          <Link href="/get-started" className="btn-accent text-lg px-10 py-4 inline-block">
            Get Medical Debt Help Now
          </Link>
        </div>
      </section>
    </Layout>
  );
}
