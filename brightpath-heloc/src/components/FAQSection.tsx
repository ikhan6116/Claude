'use client'

const faqs = [
  {
    question: 'What is a business HELOC and how does it differ from a personal HELOC?',
    answer:
      'A business HELOC uses your primary residence as collateral but the funds are used for business purposes — working capital, expansion, equipment, and more. Figure\'s SMB HELOC product is purpose-built for small business owners who want the speed and simplicity of a home equity line without the restrictions of traditional business loans.',
  },
  {
    question: 'How much can I borrow?',
    answer:
      'Qualified borrowers can access up to $750,000. Your exact credit limit depends on your available home equity (up to 95% combined loan-to-value on most programs), your credit profile, income, and state of residence.',
  },
  {
    question: 'What are the fees?',
    answer:
      'Most Figure HELOCs have no appraisal fee, no title insurance fee, and no escrow fee. There is an origination fee, which will be clearly disclosed before you accept your offer. We believe in full transparency — no surprises at closing.',
  },
  {
    question: 'What credit score do I need?',
    answer:
      'Generally, a minimum 680 FICO score is required, with the best rates available to borrowers at 720+. We look at the full picture — your equity, income, and business history — not just a single number.',
  },
  {
    question: 'How fast can I get funded?',
    answer:
      'On most loans, funding is available in as few as 5 business days after signing — dramatically faster than an SBA loan (30–90 days) or a traditional bank business line of credit. The entire process is digital: no branch visits, no paper.',
  },
  {
    question: 'Does applying affect my credit score?',
    answer:
      'Checking your rate uses a soft credit pull and does not impact your credit score. A hard inquiry is only performed if you proceed to a full application after reviewing your personalized offer.',
  },
  {
    question: 'Can I use the funds for any business purpose?',
    answer:
      'Yes — working capital, hiring, inventory, equipment, marketing, real estate investment, and business debt refinancing all qualify. The funds are yours to deploy where your business needs them most.',
  },
  {
    question: 'What states are eligible?',
    answer:
      'Figure HELOCs are available in most U.S. states. Availability and terms may vary by state. Check your rate to confirm eligibility in your area.',
  },
]

export default function FAQSection() {
  return (
    <section id="faq" className="bg-gray-50 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-brand-blue font-semibold text-sm uppercase tracking-wider mb-3">
            Got Questions?
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-brand-gray text-lg">
            Everything business owners need to know about our HELOC product.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <details
              key={idx}
              className="group bg-white border border-brand-gray-light rounded-2xl overflow-hidden hover:border-brand-blue transition-colors"
            >
              <summary className="flex items-center justify-between cursor-pointer px-6 py-5 select-none">
                <span className="font-semibold text-brand-navy pr-4">{faq.question}</span>
                <span className="flex-shrink-0 text-brand-blue">
                  <svg
                    className="w-5 h-5 transition-transform duration-300 group-open:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </summary>
              <div className="px-6 pb-6 border-t border-brand-gray-light">
                <p className="text-brand-gray leading-relaxed pt-4">{faq.answer}</p>
              </div>
            </details>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-brand-gray mb-4">Still have questions?</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="tel:8778672002"
              className="inline-flex items-center gap-2 text-brand-blue font-semibold hover:text-brand-blue-light transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              (877) 867-2002
            </a>
            <span className="text-gray-300 hidden sm:block">|</span>
            <a
              href="mailto:team@brightpath-fin.com"
              className="inline-flex items-center gap-2 text-brand-blue font-semibold hover:text-brand-blue-light transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              team@brightpath-fin.com
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
