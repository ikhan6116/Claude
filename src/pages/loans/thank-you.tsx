import Layout from '@/components/Layout';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function LoanThankYou() {
  const router   = useRouter();
  const { status, ref } = router.query;
  const isQualified = status === 'qualified' || status === 'review';

  return (
    <Layout
      title={isQualified ? 'You Pre-Qualify! | BrightPath Finance' : 'Application Received | BrightPath Finance'}
      description="Thank you for your loan application with BrightPath Finance."
    >
      <section className="min-h-[75vh] flex items-center justify-center py-16" style={{ background: '#f8f9fa' }}>
        <div className="max-w-xl mx-auto px-4 text-center">
          {isQualified ? (
            <>
              <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8"
                style={{ background: 'linear-gradient(135deg,#2b7cff,#30a2ff)', boxShadow: '0 8px 32px rgba(43,124,255,0.35)' }}>
                <span className="text-white text-5xl">&#10003;</span>
              </div>
              <h1 className="text-4xl font-extrabold mb-4" style={{ color: '#0d1b2a' }}>Great News — You Pre-Qualify!</h1>
              <p className="text-lg mb-6" style={{ color: '#494949' }}>
                Based on your information, you pre-qualify for a BrightPath Finance loan.
                A specialist will be contacting you shortly to finalize your personalized offer.
              </p>
              {ref && <p className="text-sm mb-6" style={{ color: '#aaaaaa' }}>Reference: {ref}</p>}
              <div className="rounded-xl p-6 mb-8" style={{ background: '#eef5ff', border: '1px solid #bbd5ff' }}>
                <h3 className="font-bold mb-3" style={{ color: '#2b7cff' }}>What Happens Next?</h3>
                <ul className="text-sm space-y-2 text-left" style={{ color: '#494949' }}>
                  {[
                    'A loan specialist will call you within the next few minutes.',
                    'Review your personalized rate and loan terms — no obligation.',
                    'Accept and funds can be deposited in as few as 2 business days.',
                  ].map((s, i) => (
                    <li key={i} className="check-item">
                      <span className="check-icon text-xs flex-shrink-0">{i + 1}</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="mb-4" style={{ color: '#494949' }}>For immediate assistance, call us directly:</p>
              <a href="tel:877-867-2002" className="btn-primary text-xl px-10 py-4 inline-block">
                Call 877-867-2002
              </a>
            </>
          ) : (
            <>
              <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8"
                style={{ background: '#0d1b2a', boxShadow: '0 8px 32px rgba(13,27,42,0.25)' }}>
                <span className="text-white text-5xl">&#9993;</span>
              </div>
              <h1 className="text-4xl font-extrabold mb-4" style={{ color: '#0d1b2a' }}>Application Received</h1>
              <p className="text-lg mb-6" style={{ color: '#494949' }}>
                Thank you for your application. While a standard consolidation loan may not be the
                best fit right now, we have other options that may help your situation.
              </p>
              {ref && <p className="text-sm mb-6" style={{ color: '#aaaaaa' }}>Reference: {ref}</p>}
              <div className="rounded-xl p-6 mb-8" style={{ background: '#f8f9fa', border: '1px solid #d9d9d9' }}>
                <h3 className="font-bold mb-3" style={{ color: '#0d1b2a' }}>We Can Still Help</h3>
                <ul className="text-sm space-y-2 text-left" style={{ color: '#494949' }}>
                  {['Debt relief and settlement programs','Credit counseling services','Secured loan options','Debt management plans'].map(s => (
                    <li key={s} className="flex items-center space-x-2">
                      <span style={{ color: '#2b7cff' }}>&#8226;</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <a href="tel:877-867-2002" className="btn-primary text-xl px-10 py-4 inline-block">
                Call 877-867-2002
              </a>
            </>
          )}
          <div className="mt-10">
            <Link href="/" className="text-sm underline" style={{ color: '#2b7cff' }}>Return to Homepage</Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
