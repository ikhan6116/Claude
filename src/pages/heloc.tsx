import Head from 'next/head';
import Link from 'next/link';

const steps = [
  {
    number: '01',
    title: 'Apply Online in Minutes',
    body: 'Complete our secure application from any device. No branch visit required. We only ask what we need.',
  },
  {
    number: '02',
    title: 'Get Your Personalized Offer',
    body: 'Our system reviews your application and returns a real offer with your rate, credit limit, and estimated payment.',
  },
  {
    number: '03',
    title: 'Access Your Funds',
    body: 'Once approved, funds can be available in as few as 5 days. Draw what you need, when you need it.',
  },
];

const benefits = [
  { icon: '💸', title: 'No Closing Costs', body: 'Keep more of your equity. We cover closing costs on most loans.' },
  { icon: '⚡', title: 'Fast Funding', body: 'Get funded in as few as 5 business days after approval.' },
  { icon: '🔄', title: 'Revolving Credit Line', body: 'Draw, repay, and redraw during your 5-year draw period.' },
  { icon: '📉', title: 'Competitive APR', body: 'Rates starting from 8.50% APR — far below average credit card rates.' },
  { icon: '🔒', title: 'Bank-Level Security', body: '256-bit encryption protects your data at every step.' },
  { icon: '📱', title: '100% Online Process', body: 'Apply, sign, and manage your HELOC entirely online.' },
];

const faqs = [
  {
    q: 'What is a HELOC?',
    a: 'A Home Equity Line of Credit (HELOC) lets you borrow against the equity you\'ve built in your home. It works like a credit card — you get a credit limit and only pay interest on what you actually draw.',
  },
  {
    q: 'How much can I borrow?',
    a: 'Qualified borrowers can access between $15,000 and $400,000, depending on your available equity, credit profile, and state of residence. Your offer will show your exact approved limit.',
  },
  {
    q: 'Will applying affect my credit score?',
    a: 'The initial pre-qualification uses a soft credit pull, which does not affect your credit score. A hard inquiry is only performed when you proceed to a full application.',
  },
  {
    q: 'How is a HELOC different from a cash-out refinance?',
    a: 'A HELOC adds a revolving credit line without replacing your existing mortgage, so you keep your current rate. A cash-out refinance replaces your entire mortgage — which may not be ideal if your rate is already low.',
  },
  {
    q: 'What can I use my HELOC funds for?',
    a: 'You can use your funds for virtually any purpose: home improvements, debt consolidation, education expenses, emergency reserves, business capital, and more.',
  },
];

export default function HELOCLandingPage() {
  return (
    <>
      <Head>
        <title>HELOC — Unlock Your Home Equity | Powered by Figure</title>
        <meta
          name="description"
          content="Access up to $400,000 in home equity with competitive rates, no closing costs, and funding in as few as 5 days. Powered by Figure Technologies."
        />
      </Head>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-teal-700 text-white">
        <div className="absolute inset-0 bg-[url('/images/home-bg.jpg')] bg-cover bg-center opacity-10" />
        <div className="relative max-w-6xl mx-auto px-6 py-24 text-center">
          <span className="inline-block mb-4 px-4 py-1 rounded-full bg-teal-500/20 border border-teal-400/40 text-teal-200 text-sm font-medium tracking-wide">
            Powered by Figure Technologies
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
            Unlock Your Home&apos;s Equity
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto mb-10">
            Access up to <span className="text-teal-300 font-semibold">$400,000</span> at competitive rates.
            No closing costs. No branch visit. Funded in as few as 5 days.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/heloc/apply"
              className="px-8 py-4 bg-teal-500 hover:bg-teal-400 text-white font-bold rounded-xl text-lg transition-colors shadow-lg"
            >
              Check My Rate — No Credit Impact
            </Link>
            <a
              href="#how-it-works"
              className="px-8 py-4 border border-white/30 hover:bg-white/10 text-white font-semibold rounded-xl text-lg transition-colors"
            >
              Learn How It Works
            </a>
          </div>
          <p className="mt-6 text-blue-200 text-sm">
            Takes 3 minutes · Soft credit pull only · Bank-level encryption
          </p>
        </div>
      </section>

      {/* Trust bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-wrap justify-center gap-8 text-gray-500 text-sm font-medium">
          {['256-bit SSL Encryption', 'No Closing Costs', 'Rates from 8.50% APR', '$400K Max Credit Line', 'Funding in 5 Days'].map((item) => (
            <span key={item} className="flex items-center gap-2">
              <span className="text-teal-500">✓</span> {item}
            </span>
          ))}
        </div>
      </div>

      {/* How it works */}
      <section id="how-it-works" className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-500">Three steps from application to funded</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div key={step.number} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
                <div className="text-5xl font-black text-teal-100 mb-4">{step.number}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-500 leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose a Figure HELOC?</h2>
            <p className="text-xl text-gray-500">A smarter way to access your home equity</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b) => (
              <div key={b.title} className="p-6 rounded-2xl border border-gray-100 hover:border-teal-200 hover:shadow-md transition-all">
                <div className="text-3xl mb-4">{b.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{b.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rate comparison callout */}
      <section className="py-20 bg-gradient-to-r from-blue-900 to-teal-800 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Stop Paying Credit Card Rates</h2>
          <div className="grid grid-cols-2 gap-8 max-w-md mx-auto mb-10">
            <div className="bg-white/10 rounded-2xl p-6">
              <div className="text-sm text-blue-200 mb-1">Average Credit Card</div>
              <div className="text-4xl font-black text-red-300">24%+</div>
              <div className="text-sm text-blue-200 mt-1">APR</div>
            </div>
            <div className="bg-teal-500/20 border border-teal-400/40 rounded-2xl p-6">
              <div className="text-sm text-teal-200 mb-1">Figure HELOC</div>
              <div className="text-4xl font-black text-teal-300">8.50%+</div>
              <div className="text-sm text-teal-200 mt-1">Starting APR</div>
            </div>
          </div>
          <Link
            href="/heloc/apply"
            className="inline-block px-10 py-4 bg-teal-500 hover:bg-teal-400 text-white font-bold rounded-xl text-lg transition-colors"
          >
            Get My Personalized Rate
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <details key={faq.q} className="group bg-white rounded-2xl border border-gray-100 p-6 cursor-pointer">
                <summary className="flex justify-between items-center font-semibold text-gray-900 list-none">
                  {faq.q}
                  <span className="text-teal-500 text-xl group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-4 text-gray-500 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-white text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Ready to Put Your Equity to Work?
          </h2>
          <p className="text-xl text-gray-500 mb-8">
            Join thousands of homeowners who have unlocked their equity through Figure.
            Check your rate in under 3 minutes — no impact to your credit score.
          </p>
          <Link
            href="/heloc/apply"
            className="inline-block px-10 py-4 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-xl text-lg transition-colors"
          >
            Start My Free Application
          </Link>
          <p className="mt-4 text-sm text-gray-400">
            Powered by Figure Lending LLC. Subject to credit approval. See terms for details.
          </p>
        </div>
      </section>
    </>
  );
}
