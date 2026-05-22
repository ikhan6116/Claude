'use client'

const faqs = [
  {
    question: 'What is a HELOC?',
    answer:
      'A Home Equity Line of Credit (HELOC) is a revolving credit line secured by your home. It works similarly to a credit card — you have a maximum credit limit based on your home equity, and you can borrow, repay, and borrow again as needed during the draw period. You only pay interest on the amount you actually borrow.',
  },
  {
    question: 'How much can I borrow?',
    answer:
      'You can borrow up to $400,000 with a BrightPath HELOC. The exact amount depends on your available home equity (typically up to 85% of your home\'s value minus your existing mortgage balance), your credit score, income, and other factors. Use our application to get your personalized credit limit.',
  },
  {
    question: 'What credit score do I need?',
    answer:
      'We typically work with homeowners who have a credit score of 640 or higher. Higher credit scores generally qualify for better rates. However, we evaluate each application holistically, considering your income, equity, and overall financial picture. Apply to see what you qualify for.',
  },
  {
    question: 'How long does the application take?',
    answer:
      'Our streamlined application takes approximately 5 minutes to complete online. Once submitted, you can receive a personalized offer within minutes. The full funding process, including any required documentation, typically takes a few business days.',
  },
  {
    question: 'Are there any fees?',
    answer:
      'Most BrightPath HELOC loans have no closing costs. There are no origination fees, appraisal fees, or title insurance fees on qualifying loans. We believe in transparent pricing with no hidden charges. There may be a small annual fee depending on your loan terms, which will be clearly disclosed before you accept your offer.',
  },
]

export default function FAQSection() {
  return (
    <section id="faq" className="bg-gray-50 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-brand-blue font-semibold text-sm uppercase tracking-wider mb-3">
            Got Questions?
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-brand-gray text-lg">
            Everything you need to know about our HELOC product.
          </p>
        </div>

        {/* FAQ items */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <details
              key={idx}
              className="group bg-white border border-brand-gray-light rounded-2xl overflow-hidden hover:border-brand-blue transition-colors"
            >
              <summary className="flex items-center justify-between cursor-pointer px-6 py-5 select-none">
                <span className="font-semibold text-brand-navy pr-4">{faq.question}</span>
                {/* Chevron */}
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

        {/* Contact prompt */}
        <div className="text-center mt-12">
          <p className="text-brand-gray mb-4">Still have questions?</p>
          <a
            href="tel:8000000000"
            className="inline-flex items-center gap-2 text-brand-blue font-semibold hover:text-brand-blue-light transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Call us: (800) XXX-XXXX
          </a>
        </div>
      </div>
    </section>
  )
}
