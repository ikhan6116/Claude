const benefits = [
  {
    title: 'No Appraisal, Title, or Escrow Fees',
    description:
      'Unlike traditional loans, most Figure HELOCs require no appraisal, no title insurance, and no escrow fees — keeping more capital where it belongs: in your business.',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Faster Than an SBA Loan',
    description:
      'SBA loans can take 30–90 days. A Figure business HELOC can fund in as few as 5 business days on most loans — so you can move at the speed of your business.',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: 'Rates from 6.75% APR',
    description:
      'Business credit cards average 20–29% APR. Merchant cash advances cost even more. A Figure HELOC starts as low as 6.75% APR — a fraction of the cost.',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
  {
    title: 'Revolving Credit Line',
    description:
      'Draw what you need, repay, and draw again. A revolving line gives your business the flexibility to cover payroll, inventory, or unexpected expenses on demand.',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: 'Lines Up to $750,000',
    description:
      'Access serious capital — up to $750,000 — based on your available home equity. Enough to fund expansion, equipment, hiring, or a real estate acquisition.',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    title: 'Powered by Figure',
    description:
      "Figure's blockchain-powered platform delivers a fully digital process with industry-leading speed and security — no branch visits, no paper, no waiting.",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
  },
]

export default function BenefitsSection() {
  return (
    <section id="benefits" className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-brand-blue font-semibold text-sm uppercase tracking-wider mb-3">
            Why BrightPath
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
            Built for Business Owners
          </h2>
          <p className="text-brand-gray text-lg max-w-2xl mx-auto">
            If you own your home and run a business, you have access to one of the most
            powerful — and underused — financing tools available.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, idx) => (
            <div
              key={idx}
              className="group bg-white border border-brand-gray-light rounded-2xl p-6 hover:border-brand-blue hover:shadow-lg transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-blue-50 group-hover:bg-brand-blue text-brand-blue group-hover:text-white flex items-center justify-center mb-5 transition-all duration-300">
                {benefit.icon}
              </div>
              <h3 className="text-lg font-bold text-brand-navy mb-2">{benefit.title}</h3>
              <p className="text-brand-gray text-sm leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>

        {/* Use-case callout */}
        <div
          className="mt-14 rounded-2xl p-8 md:p-10"
          style={{ background: 'linear-gradient(135deg, #0d1b2a 0%, #1a3a5c 100%)' }}
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
              What Can You Use Your Business HELOC For?
            </h3>
            <p className="text-blue-200">
              Any legitimate business purpose qualifies. Here are the most common use cases:
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: '🏗️', label: 'Business Expansion' },
              { icon: '💰', label: 'Working Capital' },
              { icon: '🛠️', label: 'Equipment Purchase' },
              { icon: '📦', label: 'Inventory Financing' },
              { icon: '👥', label: 'Hiring & Payroll' },
              { icon: '🏢', label: 'Real Estate Investment' },
              { icon: '📣', label: 'Marketing & Growth' },
              { icon: '🔄', label: 'Debt Refinancing' },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-white/10 border border-white/20 rounded-xl px-4 py-4 text-center"
              >
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className="text-white text-sm font-medium">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
