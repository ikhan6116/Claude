import Link from 'next/link'

export default function HELOCHero() {
  const handleLearnMore = () => {
    const el = document.getElementById('how-it-works')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0d1b2a 0%, #1a3a5c 50%, #2b7cff 100%)',
      }}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #30a2ff 0%, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #77b6e8 0%, transparent 70%)' }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm text-blue-200 font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Powered by Figure — Industry-Leading Fintech
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
            Unlock Your Home&apos;s Equity
            <span className="block text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg, #77b6e8, #30a2ff)' }}>
              with BrightPath
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-blue-100 mb-10 leading-relaxed max-w-2xl mx-auto">
            Access up to <span className="font-bold text-white">$400,000</span> with competitive rates.
            Fast approval. No closing costs on most loans.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <Link
              href="/apply"
              className="w-full sm:w-auto bg-white text-brand-navy font-bold px-8 py-4 rounded-xl text-lg shadow-xl hover:shadow-2xl hover:bg-blue-50 transition-all duration-200 transform hover:-translate-y-0.5"
            >
              Check My Rate
            </Link>
            <button
              onClick={handleLearnMore}
              className="w-full sm:w-auto border-2 border-white/50 text-white font-semibold px-8 py-4 rounded-xl text-lg hover:border-white hover:bg-white/10 transition-all duration-200"
            >
              Learn More
            </button>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-10">
            {[
              { value: 'Up to $400K', label: 'Credit Line' },
              { value: '8.50% APR', label: 'Rates From' },
              { value: '5 Minutes', label: 'Application' },
              { value: '$0', label: 'Closing Costs*' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white/10 border border-white/20 rounded-xl px-4 py-4 backdrop-blur-sm"
              >
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-blue-200 text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Trust badge */}
          <div className="inline-flex items-center gap-2 text-blue-200 text-sm">
            <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            256-bit encrypted &amp; secure. Your information is never sold.
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 60L1440 60L1440 30C1200 60 900 0 720 20C540 40 240 10 0 30L0 60Z" fill="white" />
        </svg>
      </div>
    </section>
  )
}
