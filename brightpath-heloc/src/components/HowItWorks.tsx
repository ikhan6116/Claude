const steps = [
  {
    number: '01',
    title: 'Apply Online',
    description: 'Complete our quick 5-minute application from the comfort of your home.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Get Your Offer',
    description: 'Receive a personalized HELOC offer instantly with your rate and credit limit.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"
        />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Access Your Funds',
    description: 'Draw from your credit line as needed, whenever you need it.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-brand-blue font-semibold text-sm uppercase tracking-wider mb-3">
            Simple Process
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
            How It Works
          </h2>
          <p className="text-brand-gray text-lg max-w-2xl mx-auto">
            Getting your HELOC has never been easier. Our streamlined process gets you from application to funded in record time.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line (desktop) */}
          <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-0.5 bg-brand-gray-light z-0"
            style={{ left: '16.666%', right: '16.666%' }}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {steps.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center text-center group">
                {/* Icon circle */}
                <div className="relative mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-white border-2 border-brand-gray-light group-hover:border-brand-blue shadow-md flex items-center justify-center text-brand-blue transition-all duration-300 group-hover:shadow-xl group-hover:scale-105">
                    {step.icon}
                  </div>
                  {/* Step number badge */}
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

        {/* Bottom CTA */}
        <div className="text-center mt-14">
          <a
            href="/apply"
            className="inline-flex items-center gap-2 bg-brand-blue hover:bg-brand-blue-light text-white font-semibold px-8 py-3.5 rounded-xl transition-colors shadow-md hover:shadow-lg"
          >
            Start Your Application
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
