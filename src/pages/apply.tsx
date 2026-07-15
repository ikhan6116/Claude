import Head from 'next/head';
import Image from 'next/image';
import { useRef } from 'react';
import LoanApplicationForm from '@/components/LoanApplicationForm';

/**
 * Standalone, distraction-free landing page for paid ad traffic.
 * No site nav — just the questionnaire, trust signals, and required
 * disclosures — so ad clicks land directly on the form. Marked noindex
 * to keep it out of organic search (paid-traffic page only).
 */
export default function ApplyPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://loans.brightpath-fin.com';
  const formRef = useRef<HTMLDivElement>(null);
  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <>
      <Head>
        <title>Check Your Rate | BrightPath Finance Debt Consolidation</title>
        <meta name="description" content="See your personalized debt consolidation loan offer in minutes. Checking your rate won't affect your credit score." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href={`${siteUrl}/apply`} />
      </Head>

      {/* ── Minimal header: logo + phone only ── */}
      <header className="bg-white sticky top-0 z-50" style={{ borderBottom: '1px solid #e9ecef' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center flex-shrink-0">
              <Image src="/brightpath-logo.svg" alt="BrightPath Finance" width={170} height={47} priority />
            </div>
            <div className="flex items-center space-x-4">
              <span className="hidden sm:inline text-xs" style={{ color: '#aaaaaa' }}>NMLS #2670114</span>
              <a href="tel:877-867-2002" className="text-sm font-semibold" style={{ color: '#0d1b2a' }}>877-867-2002</a>
            </div>
          </div>
        </div>
      </header>

      {/* ── Hero + form ── */}
      <section style={{ background: 'linear-gradient(160deg, #f0f7ff 0%, #ffffff 55%, #eef5ff 100%)' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">

            {/* Left: value prop */}
            <div className="lg:pt-6">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.1] tracking-tight mb-5" style={{ color: '#0d1b2a' }}>
                Consolidate your debt.<br />
                <span style={{ color: '#2b7cff' }}>Lower your payment.</span>
              </h1>
              <p className="text-base sm:text-lg leading-relaxed mb-6" style={{ color: '#494949' }}>
                Combine credit cards and other high-interest debt into one fixed-rate loan.
                Check your rate in about 2 minutes — with no impact to your credit score.
              </p>

              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm mb-8" style={{ color: '#494949' }}>
                <span><strong style={{ color: '#0d1b2a' }}>5.99%</strong> low fixed APR</span>
                <span><strong style={{ color: '#0d1b2a' }}>$100K+</strong> loan amounts</span>
                <span><strong style={{ color: '#0d1b2a' }}>$0</strong> application fees</span>
              </div>

              <button onClick={scrollToForm} className="btn-primary text-base py-3.5 px-8 lg:hidden mb-8">
                Check Your Rate
              </button>

              <div className="space-y-4">
                {[
                  { title: 'No credit impact',    desc: 'Soft inquiry only — your score stays the same.' },
                  { title: 'Rates from 5.99% APR', desc: 'Competitive fixed rates based on your profile.' },
                  { title: 'One simple payment',   desc: 'Replace multiple bills with one fixed monthly payment.' },
                ].map(item => (
                  <div key={item.title} className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs mt-0.5"
                      style={{ background: 'linear-gradient(135deg, #2b7cff, #30a2ff)' }}>&#10003;</span>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: '#0d1b2a' }}>{item.title}</p>
                      <p className="text-sm" style={{ color: '#494949' }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid #e9ecef' }}>
                <div className="flex items-center space-x-0.5 mb-2">
                  {[1,2,3,4,5].map(i => (
                    <svg key={i} className="w-4 h-4" fill="#f0b429" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  ))}
                </div>
                <p className="text-sm italic" style={{ color: '#494949' }}>
                  &ldquo;I consolidated $32,000 in credit card debt and dropped my monthly payment by $400. The process was seamless.&rdquo;
                </p>
                <p className="text-xs mt-2 font-semibold" style={{ color: '#0d1b2a' }}>Sarah M., Dallas TX</p>
              </div>
            </div>

            {/* Right: the form */}
            <div ref={formRef} className="scroll-mt-20">
              <LoanApplicationForm source="ad-landing" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Legal / Disclosures ── */}
      <footer style={{ background: '#0d1b2a' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <Image src="/brightpath-logo-white.svg" alt="BrightPath Finance" width={150} height={41} />
            <div className="text-sm space-x-4" style={{ color: 'rgba(255,255,255,0.55)' }}>
              <a href="tel:877-867-2002" className="hover:text-white transition-colors">877-867-2002</a>
              <a href="mailto:team@brightpath-fin.com" className="hover:text-white transition-colors">team@brightpath-fin.com</a>
            </div>
          </div>
          <div className="text-xs leading-relaxed space-y-3" style={{ color: 'rgba(255,255,255,0.35)' }}>
            <p>
              &copy; {new Date().getFullYear()} BrightPath Finance. All rights reserved. NMLS #2670114.
              898 South State St Ste 310 #714, Orem, UT 84058.
            </p>
            <p>
              BrightPath Finance is a lending marketplace. All loan offers are subject to credit approval.
              Your actual rate depends upon credit score, loan amount, loan term, credit usage and history.
              The APR ranges from 5.99% to 24.99%. Loan amounts range from $5,000 to $100,000. Repayment
              terms range from 24 to 84 months. Origination fee ranges from 0% to 6%.
            </p>
            <p>
              Checking your rate generates a soft credit inquiry, which is visible to you but does not
              affect your credit score. If you accept a loan offer, a hard inquiry will be made which
              could impact your credit score.
            </p>
            <p>
              <a href="/privacy-policy" className="underline hover:text-white transition-colors">Privacy Policy</a>
              {' · '}
              <a href="/terms-conditions" className="underline hover:text-white transition-colors">Terms &amp; Conditions</a>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
