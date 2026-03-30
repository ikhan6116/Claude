import Layout from '@/components/Layout';
import LeadForm from '@/components/LeadForm';
import Link from 'next/link';

export default function Home() {
  return (
    <Layout canonical="/">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-800 via-primary-700 to-primary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-6">
                Struggling With Debt?
                <span className="block text-primary-200 mt-2">
                  Get Relief Without Bankruptcy
                </span>
              </h1>
              <p className="text-xl text-primary-100 mb-8 leading-relaxed">
                Our certified debt specialists have helped thousands of Americans
                reduce their unsecured debt by up to 50%. No upfront fees.
                No credit check required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="flex items-center space-x-2">
                  <span className="text-accent-500 text-xl">&#10003;</span>
                  <span>Free Consultation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-accent-500 text-xl">&#10003;</span>
                  <span>No Upfront Fees</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-accent-500 text-xl">&#10003;</span>
                  <span>Reduce Debt Up to 50%</span>
                </div>
              </div>
            </div>
            <LeadForm variant="compact" source="homepage-hero" />
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-primary-600">$50M+</p>
              <p className="text-sm text-gray-500">Debt Resolved</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary-600">10,000+</p>
              <p className="text-sm text-gray-500">Clients Helped</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary-600">48%</p>
              <p className="text-sm text-gray-500">Avg. Debt Reduction</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary-600">A+</p>
              <p className="text-sm text-gray-500">BBB Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How Our Debt Relief Program Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our proven 3-step process has helped thousands become debt-free
              in as little as 24-48 months.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Free Consultation',
                description:
                  'Speak with a certified debt specialist who will review your financial situation and explain all your options at no cost.',
              },
              {
                step: '2',
                title: 'Custom Debt Plan',
                description:
                  'We negotiate directly with your creditors to reduce what you owe. You make one affordable monthly payment.',
              },
              {
                step: '3',
                title: 'Become Debt-Free',
                description:
                  'Watch your debts get resolved one by one. Most clients complete the program in 24-48 months.',
              },
            ].map((item) => (
              <div key={item.step} className="text-center p-6">
                <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="bg-gray-50 section-padding">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Debt Solutions We Offer
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Debt Consolidation',
                desc: 'Combine multiple debts into one manageable payment with lower interest rates.',
                href: '/debt-consolidation',
              },
              {
                title: 'Debt Settlement',
                desc: 'Negotiate with creditors to settle your debts for less than what you owe.',
                href: '/debt-relief',
              },
              {
                title: 'Credit Card Relief',
                desc: 'Specialized programs for high-interest credit card debt reduction.',
                href: '/credit-card-debt-help',
              },
              {
                title: 'Medical Debt Help',
                desc: 'Relief programs designed specifically for overwhelming medical bills.',
                href: '/medical-debt-relief',
              },
            ].map((svc) => (
              <Link
                key={svc.title}
                href={svc.href}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-2">{svc.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{svc.desc}</p>
                <span className="text-primary-600 font-medium text-sm">Learn More &rarr;</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            What Our Clients Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah M.',
                location: 'Texas',
                text: 'I had over $35,000 in credit card debt and felt hopeless. Freedom Debt Solutions helped me settle everything for less than half. I\'m finally debt-free!',
                savings: 'Saved $18,000',
              },
              {
                name: 'James R.',
                location: 'Florida',
                text: 'The team was professional and transparent from day one. They explained every step and I always knew where I stood. Highly recommend.',
                savings: 'Saved $22,000',
              },
              {
                name: 'Maria L.',
                location: 'California',
                text: 'Medical bills were crushing me after surgery. They negotiated my $28,000 in bills down significantly. I can finally breathe again.',
                savings: 'Saved $15,000',
              },
            ].map((t) => (
              <div key={t.name} className="bg-gray-50 rounded-xl p-6">
                <div className="text-yellow-400 text-lg mb-3">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
                <p className="text-gray-700 mb-4 italic">&ldquo;{t.text}&rdquo;</p>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-900">{t.name}</p>
                    <p className="text-sm text-gray-500">{t.location}</p>
                  </div>
                  <span className="text-accent-600 font-bold text-sm">{t.savings}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-primary-700 text-white section-padding">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Take the First Step Toward Financial Freedom
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of Americans who have reduced their debt by up to 50%.
            Your free consultation is just a click away.
          </p>
          <Link href="/get-started" className="btn-accent text-lg px-10 py-4 inline-block">
            Get Your Free Debt Analysis
          </Link>
        </div>
      </section>
    </Layout>
  );
}
