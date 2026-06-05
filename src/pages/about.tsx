import Layout from '@/components/Layout';
import Link from 'next/link';

export default function About() {
  return (
    <Layout
      title="About BrightPath Finance | Personal Loans & Debt Consolidation"
      description="BrightPath Finance makes personal loans and debt consolidation simple, transparent, and accessible."
      canonical="/about"
    >
      {/* ── Hero ── */}
      <section style={{ background: '#0d1b2a' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">About BrightPath Finance</h1>
          <p className="text-lg" style={{ color: '#77b6e8' }}>
            Simplifying personal finance for everyday Americans.
          </p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-extrabold mb-5" style={{ color: '#0d1b2a' }}>Our mission</h2>
          <p className="mb-4 leading-relaxed" style={{ color: '#494949' }}>
            Too many Americans are stuck juggling multiple high-interest payments and feeling
            overwhelmed by debt. BrightPath Finance was built to change that.
          </p>
          <p className="mb-10 leading-relaxed" style={{ color: '#494949' }}>
            We connect borrowers with competitive loan offers tailored to their unique situation —
            whether that&apos;s consolidating debt into one simple payment or funding an important
            expense. No hidden fees, no hard credit check to see your rate, no games.
          </p>

          <h2 className="text-2xl font-extrabold mb-6" style={{ color: '#0d1b2a' }}>Why BrightPath</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12">
            {[
              { title: 'No credit impact',  desc: 'Soft inquiry to check your rate. Hard pull only if you accept.' },
              { title: 'Transparent terms',  desc: 'Rate, payment, and total cost shown upfront before you commit.' },
              { title: 'Fast funding',       desc: 'Same-day decisions. Funds in as few as 2 business days.' },
              { title: 'Expert support',     desc: 'Real people available to answer questions and guide you.' },
            ].map(item => (
              <div key={item.title} className="p-5 rounded-xl" style={{ border: '1px solid #e9ecef' }}>
                <h3 className="font-bold mb-1 text-sm" style={{ color: '#0d1b2a' }}>{item.title}</h3>
                <p className="text-sm" style={{ color: '#494949' }}>{item.desc}</p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-extrabold mb-6" style={{ color: '#0d1b2a' }}>Our products</h2>
          <div className="space-y-4 mb-12">
            <div className="p-6 rounded-xl" style={{ background: '#f0f7ff', border: '1px solid #d6e8ff' }}>
              <h3 className="font-bold mb-1" style={{ color: '#2b7cff' }}>Debt Consolidation Loans</h3>
              <p className="text-sm" style={{ color: '#494949' }}>$5K–$100K+ &middot; Rates from 5.99% APR &middot; 24–84 month terms</p>
            </div>
            <div className="p-6 rounded-xl" style={{ background: '#f8f9fa', border: '1px solid #e9ecef' }}>
              <h3 className="font-bold mb-1" style={{ color: '#0d1b2a' }}>Personal Loans</h3>
              <p className="text-sm" style={{ color: '#494949' }}>$2K–$50K &middot; Fixed rates &middot; No collateral &middot; Funds in 2 days</p>
            </div>
          </div>

          <div className="rounded-xl p-6 mb-12" style={{ background: '#f8f9fa', border: '1px solid #e9ecef' }}>
            <h3 className="text-sm font-bold mb-2" style={{ color: '#0d1b2a' }}>Company information</h3>
            <div className="text-sm space-y-1" style={{ color: '#494949' }}>
              <p>BrightPath Finance &middot; NMLS #2670114</p>
              <p>898 South State St Ste 310 #714, Orem, UT 84058</p>
              <p><a href="mailto:team@brightpath-fin.com" style={{ color: '#2b7cff' }}>team@brightpath-fin.com</a> &middot; <a href="tel:877-867-2002" style={{ color: '#2b7cff' }}>877-867-2002</a></p>
            </div>
          </div>

          <div className="text-center">
            <Link href="/loans" className="btn-primary py-4 px-10 text-base">View Your Rate</Link>
            <p className="text-sm mt-3" style={{ color: '#494949' }}>No impact to your credit score</p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
