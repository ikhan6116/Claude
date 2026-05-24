const steps = [
  {
    number: '01',
    title: 'Apply Online in Minutes',
    description:
      'Complete our secure 5-step application from any device. No branch visit. No paper. We only ask what we need to get you an offer.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Get Your Personalized Offer',
    description:
      'Our system returns a real offer with your rate, credit limit, and estimated payment — usually within minutes of submitting your application.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Fund Your Business',
    description:
      'Accept your offer, e-sign your documents, and receive funds in as few as 5 days on most loans. Draw what you need, when you need it.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-brand-blue font-semibold text-sm uppercase tracking-wider mb-3">
            Simple Process
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
            From Application to Funded in Days — Not Months
          </h2>
          <p className="text-brand-gray text-lg max-w-2xl mx-auto">
            While traditional business loans take 30–90 days, most BrightPath business HELOCs
            fund in as few as 5 business days.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          <div
            className="hidden md:block absolute top-16 h-0.5 bg-brand-gray-light z-0"
            style={{ left: '16.666%', right: '16.666%' }}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {steps.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-white border-2 border-brand-gray-light group-hover:border-brand-blue shadow-md flex items-center justify-center text-brand-blue transition-all duration-300 group-hover:shadow-xl group-hover:scale-105">
                    {step.icon}
                  </div>
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-brand-blue text-white text-xs font-bold flex items-center justify-center shadow-md">
                    {idx + 1}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-brand-navy mb-3">{step.title}</h3>
                <p className="text-brand-gray leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison callout */}
        <div className="mt-14 bg-white border border-brand-gray-light rounded-2xl p-6 md:p-8 overflow-x-auto">
          <h3 className="text-xl font-bold text-brand-navy text-center mb-6">
            Business HELOC vs. Other Financing Options
          </h3>
          <table className="w-full text-sm min-w-[560px]">
            <thead>
              <tr className="border-b-2 border-brand-gray-light">
                <th className="text-left py-3 pr-4 text-brand-gray font-semibold">Feature</th>
                <th className="text-center py-3 px-4 text-brand-blue font-bold">Business HELOC</th>
                <th className="text-center py-3 px-4 text-brand-gray font-semibold">SBA Loan</th>
                <th className="text-center py-3 px-4 text-brand-gray font-semibold">Biz Credit Card</th>
                <th className="text-center py-3 px-4 text-brand-gray font-semibold">MCA</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Typical APR', 'From 6.75%', '~10–13%', '20–30%', '40–150%'],
                ['Funding Time', 'As few as 5 days', '30–90 days', 'Instant', '1–3 days'],
                ['Line Amount', 'Up to $750K', 'Up to $5M', 'Up to $100K', 'Varies'],
                ['Collateral', 'Home equity', 'Business assets', 'None', 'Future revenue'],
                ['Flexibility', 'Revolving', 'Fixed term', 'Revolving', 'Fixed'],
              ].map(([feature, heloc, sba, card, mca]) => (
                <tr key={feature} className="border-b border-brand-gray-light">
                  <td className="py-3 pr-4 text-brand-gray font-medium">{feature}</td>
                  <td className="py-3 px-4 text-center text-brand-blue font-semibold">{heloc}</td>
                  <td className="py-3 px-4 text-center text-brand-gray">{sba}</td>
                  <td className="py-3 px-4 text-center text-brand-gray">{card}</td>
                  <td className="py-3 px-4 text-center text-brand-gray">{mca}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-center mt-10">
          <a
            href="/apply"
            className="inline-flex items-center gap-2 bg-brand-blue hover:bg-brand-blue-light text-white font-semibold px-8 py-3.5 rounded-xl transition-colors shadow-md hover:shadow-lg"
          >
            Check My Rate — No Credit Impact
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
