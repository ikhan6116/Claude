import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useAbandonedLead } from '@/lib/useAbandonedLead';
import { computeLeadValue, LEAD_CURRENCY } from '@/lib/leadValue';

interface LoanFormData {
  firstName: string;
  lastName: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  unsecuredDebtBalance: string;
  monthlyDebtPayment: string;
  loanRequestAmount: string;
  estimatedFico: string;
  loanPurpose: string;
  email: string;
  phone: string;
  creditInquiryConsent: boolean;
  tcpaConsent: boolean;
}

type FormStep = 'personal' | 'debt' | 'contact' | 'verify' | 'processing' | 'result';

interface LoanResult {
  approved: boolean;
  score: number | null;
  totalDebt: number | null;
  message: string;
  offerId?: string;
}

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY','DC',
];

function newEventId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `evt-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

const FICO_RANGES    = ['Excellent (750+)','Good (700-749)','Fair (650-699)','Below Average (600-649)','Poor (550-599)','Very Poor (Below 550)','Not Sure'];
const LOAN_PURPOSES  = ['Consolidate Credit Card Debt','Pay Off Medical Bills','Consolidate Multiple Loans','Reduce Monthly Payments','Lower Interest Rates','Home Improvement','Major Purchase','Other'];
const DEBT_AMOUNTS   = ['$5,000 - $10,000','$10,000 - $25,000','$25,000 - $50,000','$50,000 - $75,000','$75,000 - $100,000','$100,000+'];
const LOAN_AMOUNTS   = ['$5,000 - $10,000','$10,000 - $25,000','$25,000 - $50,000','$50,000 - $75,000','$75,000 - $100,000','$100,000+'];
const MONTHLY_PAYMENTS = ['Less than $250','$250 - $500','$500 - $1,000','$1,000 - $1,500','$1,500 - $2,500','$2,500+'];

const STEP_LABELS: Record<string, string> = {
  personal: 'Personal Info',
  debt:     'Loan Details',
  contact:  'Contact',
  verify:   'Verify',
};

export default function LoanApplicationForm({ source = 'landing-page' }: { source?: string }) {
  const [step, setStep]                   = useState<FormStep>('personal');
  const [enteredCode, setEnteredCode]     = useState('');
  const [codeSent, setCodeSent]           = useState(false);
  const [codeVerified, setCodeVerified]   = useState(false);
  const [codeError, setCodeError]         = useState('');
  const [sendingCode, setSendingCode]     = useState(false);
  const [phoneError, setPhoneError]       = useState('');
  const [phoneLookupDone, setPhoneLookupDone] = useState(false);
  const [checkingPhone, setCheckingPhone] = useState(false);
  const [result, setResult]               = useState<LoanResult | null>(null);
  const [error, setError]                 = useState('');
  const { schedule: scheduleAbandoned, cancel: cancelAbandoned } = useAbandonedLead();

  // Schedule an abandoned-lead capture once we have contact info. Held 30s so a
  // lead who finishes phone verification doesn't trigger a false alert; sends
  // early if they leave the page first. Cancelled on successful submission.
  const scheduleAbandonedLead = () => {
    const v = getValues();
    scheduleAbandoned({
      firstName: v.firstName, lastName: v.lastName, email: v.email, phone: v.phone,
      streetAddress: v.streetAddress, city: v.city, state: v.state, zipCode: v.zipCode,
      unsecuredDebtBalance: v.unsecuredDebtBalance, monthlyDebtPayment: v.monthlyDebtPayment,
      loanRequestAmount: v.loanRequestAmount, estimatedFico: v.estimatedFico, loanPurpose: v.loanPurpose,
      source, lastStep: 'phone verification',
    });
  };

  const { register, handleSubmit, watch, trigger, getValues, formState: { errors } } =
    useForm<LoanFormData>({ mode: 'onBlur' });

  const watchConsent = watch('creditInquiryConsent');
  const watchPhone   = watch('phone');

  const steps      = ['personal', 'debt', 'contact', 'verify'] as const;
  const stepIndex  = steps.indexOf(step as typeof steps[number]);
  const progress   = (step === 'processing' || step === 'result') ? 100
                   : ((stepIndex + 1) / steps.length) * 100;

  const lookupPhone = async () => {
    const phone = getValues('phone');
    if (!phone || phone.replace(/\D/g, '').length < 10) return;
    setCheckingPhone(true); setPhoneError('');
    try {
      const r = await fetch('/api/loans/lookup-phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const d = await r.json();
      if (!d.valid) {
        setPhoneError(d.error === 'landline'
          ? 'Landline numbers cannot receive SMS. Please enter a mobile phone number.'
          : "That doesn't appear to be a valid US phone number. Please check and try again.");
        setPhoneLookupDone(false);
      } else {
        setPhoneLookupDone(true);
      }
    } catch {
      setPhoneLookupDone(true);
    } finally { setCheckingPhone(false); }
  };

  const validateAndNext = async (fields: (keyof LoanFormData)[], next: FormStep) => {
    if (await trigger(fields)) setStep(next);
  };

  const sendCode = async (): Promise<boolean> => {
    const phone = getValues('phone');
    if (!phone) return false;
    setSendingCode(true); setCodeError(''); setPhoneError('');
    try {
      const r = await fetch('/api/loans/verify-phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const d = await r.json();
      if (!r.ok) {
        // 422 = landline or invalid — show inline on the phone field
        if (r.status === 422) { setPhoneError(d.error); return false; }
        throw new Error(d.error || 'Failed to send code');
      }
      setCodeSent(true);
      return true;
    } catch (e) {
      setCodeError(e instanceof Error ? e.message : 'Failed to send code. Please try again.');
      return false;
    } finally { setSendingCode(false); }
  };

  const verifyCode = useCallback(async () => {
    if (enteredCode.length !== 6) { setCodeError('Please enter the 6-digit code.'); return; }
    setCodeError('');
    try {
      const r = await fetch('/api/loans/verify-phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: getValues('phone'), code: enteredCode }),
      });
      const d = await r.json();
      if (r.ok && d.verified) {
        setCodeVerified(true); setCodeError('');
      } else {
        setCodeError(d.error || 'Invalid code. Try again.');
      }
    } catch {
      setCodeError('Could not verify the code. Please try again.');
    }
  }, [enteredCode, getValues]);

  useEffect(() => {
    if (enteredCode.length === 6 && !codeVerified) verifyCode();
  }, [enteredCode, codeVerified, verifyCode]);

  const onSubmit = async (data: LoanFormData) => {
    setStep('processing'); setError('');
    // Shared id so the browser pixel Lead and server CAPI Lead dedupe into one.
    const metaEventId = newEventId();
    try {
      const r = await fetch('/api/loans/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, source, metaEventId, phoneVerified: codeVerified, submittedAt: new Date().toISOString(), consentTimestamp: new Date().toISOString() }),
      });
      if (!r.ok) { const e = await r.json(); throw new Error(e.error || 'Submission failed'); }
      const d = await r.json();
      cancelAbandoned(); // completed — suppress the pending abandoned-lead alert
      setResult({ approved: d.approved, score: d.creditScore, totalDebt: d.totalDebtBalance, message: d.message, offerId: d.offerId });
      setStep('result');
      if (typeof window !== 'undefined' && typeof (window as any).fbq === 'function') {
        (window as any).fbq('track', 'Lead',
          { value: computeLeadValue(data.loanRequestAmount), currency: LEAD_CURRENCY },
          { eventID: metaEventId });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setStep('contact');
    }
  };

  // ── Processing screen ──
  if (step === 'processing') return (
    <div className="bg-white rounded-2xl p-10 text-center" style={{ boxShadow: '0 8px 40px rgba(43,124,255,0.15)' }}>
      <div className="w-16 h-16 mx-auto mb-6 rounded-full animate-spin"
        style={{ border: '4px solid #d9d9d9', borderTopColor: '#2b7cff' }} />
      <h2 className="text-2xl font-bold mb-2" style={{ color: '#0d1b2a' }}>Processing Your Application</h2>
      <p className="text-sm" style={{ color: '#494949' }}>
        Running a soft credit inquiry — no impact to your credit score. Just a moment…
      </p>
    </div>
  );

  // ── Result screen ──
  if (step === 'result' && result) return (
    <div className="bg-white rounded-2xl p-10" style={{ boxShadow: '0 8px 40px rgba(43,124,255,0.15)' }}>
      <div className="text-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: result.approved ? 'linear-gradient(135deg,#2b7cff,#30a2ff)' : '#f0b429' }}>
          <span className="text-white text-4xl">{result.approved ? '✓' : '!'}</span>
        </div>
        <h2 className="text-3xl font-bold mb-4" style={{ color: '#0d1b2a' }}>
          {result.approved ? 'Great News!' : 'Thank You for Applying'}
        </h2>
        <p className="mb-6" style={{ color: '#494949' }}>{result.message}</p>
        {result.offerId && <p className="text-xs mb-6" style={{ color: '#aaaaaa' }}>Reference: {result.offerId}</p>}
        <div className="rounded-xl p-5 mb-6" style={{ background: result.approved ? '#eef5ff' : '#f8f9fa', border: `1px solid ${result.approved ? '#bbd5ff' : '#d9d9d9'}` }}>
          <p className="text-sm font-medium" style={{ color: result.approved ? '#2b7cff' : '#0d1b2a' }}>
            {result.approved
              ? <>An agent will reach out shortly. For immediate help, call <a href="tel:877-867-2002" className="font-bold underline">877-867-2002</a>.</>
              : <>A specialist will call to discuss all your options. Or call us now at <a href="tel:877-867-2002" className="font-bold underline">877-867-2002</a>.</>
            }
          </p>
        </div>

        <div className="space-y-3">
          <a href="tel:877-867-2002"
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-white font-semibold text-sm transition-transform hover:scale-[1.01]"
            style={{ background: 'linear-gradient(135deg,#2b7cff,#30a2ff)', boxShadow: '0 4px 14px rgba(43,124,255,0.35)' }}>
            📞 Call (877) 867-2002
          </a>
          <a href="https://calendly.com/team-brightpath-fin/30min" target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold text-sm transition-colors"
            style={{ border: '1.5px solid #d9d9d9', color: '#0d1b2a', background: 'white' }}>
            📅 Review my offers now
          </a>
        </div>
      </div>
    </div>
  );

  // ── Input style helper ──
  const inp = 'input-field text-sm';
  const lbl = 'block text-sm font-medium mb-1';
  const err = 'text-red-500 text-xs mt-1';

  return (
    <div className="bg-white rounded-2xl p-8" style={{ boxShadow: '0 8px 40px rgba(43,124,255,0.15)' }}>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold" style={{ color: '#0d1b2a' }}>Check Your Rate</h2>
        <p className="text-sm mt-1" style={{ color: '#494949' }}>No impact to your credit score</p>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          {steps.map((s, i) => (
            <span key={s} className="text-xs font-medium" style={{ color: i <= stepIndex ? '#2b7cff' : '#aaaaaa' }}>
              {STEP_LABELS[s]}
            </span>
          ))}
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {error && (
        <div className="rounded-xl p-4 mb-5 text-sm" style={{ background: '#fff0f0', border: '1px solid #ffcdd2', color: '#d32f2f' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>

        {/* ── Step 1: Personal Info ── */}
        {step === 'personal' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={lbl} style={{ color: '#0d1b2a' }}>First Name *</label>
                <input {...register('firstName', { required: 'Required' })} className={inp} placeholder="John" />
                {errors.firstName && <p className={err}>{errors.firstName.message}</p>}
              </div>
              <div>
                <label className={lbl} style={{ color: '#0d1b2a' }}>Last Name *</label>
                <input {...register('lastName', { required: 'Required' })} className={inp} placeholder="Smith" />
                {errors.lastName && <p className={err}>{errors.lastName.message}</p>}
              </div>
            </div>

            <div>
              <label className={lbl} style={{ color: '#0d1b2a' }}>Street Address *</label>
              <input {...register('streetAddress', { required: 'Required' })} className={inp} placeholder="123 Main Street" />
              {errors.streetAddress && <p className={err}>{errors.streetAddress.message}</p>}
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1">
                <label className={lbl} style={{ color: '#0d1b2a' }}>City *</label>
                <input {...register('city', { required: 'Required' })} className={inp} placeholder="New York" />
                {errors.city && <p className={err}>{errors.city.message}</p>}
              </div>
              <div>
                <label className={lbl} style={{ color: '#0d1b2a' }}>State *</label>
                <select {...register('state', { required: 'Required' })} className={inp}>
                  <option value="">—</option>
                  {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.state && <p className={err}>{errors.state.message}</p>}
              </div>
              <div>
                <label className={lbl} style={{ color: '#0d1b2a' }}>ZIP *</label>
                <input {...register('zipCode', { required: 'Required', pattern: { value: /^\d{5}(-\d{4})?$/, message: 'Invalid ZIP' } })} className={inp} placeholder="10001" />
                {errors.zipCode && <p className={err}>{errors.zipCode.message}</p>}
              </div>
            </div>

            {/* Legal consent */}
            <div className="rounded-xl p-4 mt-2" style={{ background: '#f8f9fa', border: '1px solid #d9d9d9' }}>
              <label className="flex items-start space-x-3 cursor-pointer">
                <input type="checkbox" {...register('creditInquiryConsent', { required: 'Consent is required to proceed' })}
                  className="mt-1 h-4 w-4 rounded" style={{ accentColor: '#2b7cff' }} />
                <span className="text-xs leading-relaxed" style={{ color: '#494949' }}>
                  I authorize BrightPath Finance and its lending partners to obtain a consumer credit report
                  for the purpose of evaluating my eligibility for a debt consolidation loan. I understand
                  this will be a <strong>soft pull</strong> inquiry that will not affect my credit score.
                  I consent to be contacted regarding my loan inquiry. *
                </span>
              </label>
              {errors.creditInquiryConsent && <p className={`${err} mt-2`}>{errors.creditInquiryConsent.message}</p>}
            </div>

            <button type="button" disabled={!watchConsent}
              onClick={() => validateAndNext(['firstName','lastName','streetAddress','city','state','zipCode','creditInquiryConsent'], 'debt')}
              className="btn-primary w-full mt-2 py-3.5 disabled:opacity-40 disabled:cursor-not-allowed">
              Continue to Loan Details
            </button>
          </div>
        )}

        {/* ── Step 2: Debt & Loan Details ── */}
        {step === 'debt' && (
          <div className="space-y-4">
            <div>
              <label className={lbl} style={{ color: '#0d1b2a' }}>Current Unsecured Debt Balance *</label>
              <select {...register('unsecuredDebtBalance', { required: 'Required' })} className={inp}>
                <option value="">Select total unsecured debt</option>
                {DEBT_AMOUNTS.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
              {errors.unsecuredDebtBalance && <p className={err}>{errors.unsecuredDebtBalance.message}</p>}
              <p className="text-xs mt-1" style={{ color: '#aaaaaa' }}>Include credit cards, medical bills, personal loans.</p>
            </div>

            <div>
              <label className={lbl} style={{ color: '#0d1b2a' }}>Total Monthly Minimum Payments *</label>
              <select {...register('monthlyDebtPayment', { required: 'Required' })} className={inp}>
                <option value="">Select monthly minimum payment</option>
                {MONTHLY_PAYMENTS.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
              {errors.monthlyDebtPayment && <p className={err}>{errors.monthlyDebtPayment.message}</p>}
              <p className="text-xs mt-1" style={{ color: '#aaaaaa' }}>Combined minimum payments on your unsecured debt. Exclude mortgage and auto loans.</p>
            </div>

            <div>
              <label className={lbl} style={{ color: '#0d1b2a' }}>Loan Amount Requested *</label>
              <select {...register('loanRequestAmount', { required: 'Required' })} className={inp}>
                <option value="">Select desired loan amount</option>
                {LOAN_AMOUNTS.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
              {errors.loanRequestAmount && <p className={err}>{errors.loanRequestAmount.message}</p>}
            </div>

            <div>
              <label className={lbl} style={{ color: '#0d1b2a' }}>Estimated FICO Score *</label>
              <select {...register('estimatedFico', { required: 'Required' })} className={inp}>
                <option value="">Select your estimated score</option>
                {FICO_RANGES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              {errors.estimatedFico && <p className={err}>{errors.estimatedFico.message}</p>}
            </div>

            <div>
              <label className={lbl} style={{ color: '#0d1b2a' }}>Purpose of Loan *</label>
              <select {...register('loanPurpose', { required: 'Required' })} className={inp}>
                <option value="">Select purpose</option>
                {LOAN_PURPOSES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              {errors.loanPurpose && <p className={err}>{errors.loanPurpose.message}</p>}
            </div>

            <div className="flex space-x-3 mt-2">
              <button type="button" onClick={() => setStep('personal')}
                className="flex-1 py-3.5 rounded-xl font-semibold text-sm transition-colors"
                style={{ border: '1.5px solid #d9d9d9', color: '#494949', background: 'white' }}>
                Back
              </button>
              <button type="button" className="flex-1 btn-primary py-3.5"
                onClick={() => validateAndNext(['unsecuredDebtBalance','monthlyDebtPayment','loanRequestAmount','estimatedFico','loanPurpose'], 'contact')}>
                Continue
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Contact Info ── */}
        {step === 'contact' && (
          <div className="space-y-4">
            <div>
              <label className={lbl} style={{ color: '#0d1b2a' }}>Email Address *</label>
              <input {...register('email', { required: 'Required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Valid email required' } })}
                type="email" className={inp} placeholder="john.smith@email.com" />
              {errors.email && <p className={err}>{errors.email.message}</p>}
            </div>

            <div>
              <label className={lbl} style={{ color: '#0d1b2a' }}>Phone Number *</label>
              <input {...register('phone', {
                required: 'Required',
                pattern: { value: /^[\d\s\-()+]{10,}$/, message: 'Valid phone required' },
                onChange: () => { setPhoneError(''); setPhoneLookupDone(false); },
                onBlur: () => lookupPhone(),
              })}
                type="tel" className={inp} placeholder="(555) 123-4567" />
              {errors.phone && <p className={err}>{errors.phone.message}</p>}
              {checkingPhone && <p className="text-xs mt-1" style={{ color: '#2b7cff' }}>Validating phone number…</p>}
              {phoneError && <p className={err}>{phoneError}</p>}
            </div>

            <div className="rounded-xl p-4" style={{ background: '#f8f9fa', border: '1px solid #d9d9d9' }}>
              <label className="flex items-start space-x-3 cursor-pointer">
                <input type="checkbox" {...register('tcpaConsent', { required: 'Required' })}
                  className="mt-1 h-4 w-4 rounded" style={{ accentColor: '#2b7cff' }} />
                <span className="text-xs leading-relaxed" style={{ color: '#494949' }}>
                  By checking this box I consent to receive calls and texts from BrightPath Finance at the number
                  provided, including automated messages. Consent is not required for purchase. Msg & data rates may apply. *
                </span>
              </label>
              {errors.tcpaConsent && <p className={`${err} mt-2`}>{errors.tcpaConsent.message}</p>}
            </div>

            <div className="flex space-x-3 mt-2">
              <button type="button" onClick={() => setStep('debt')}
                className="flex-1 py-3.5 rounded-xl font-semibold text-sm transition-colors"
                style={{ border: '1.5px solid #d9d9d9', color: '#494949', background: 'white' }}>
                Back
              </button>
              <button type="button" className="flex-1 btn-primary py-3.5"
                disabled={sendingCode || checkingPhone || !!phoneError}
                onClick={async () => {
                  const valid = await trigger(['email','phone','tcpaConsent']);
                  if (!valid) return;
                  if (!phoneLookupDone) {
                    await lookupPhone();
                    if (!getValues('phone') || phoneError) return;
                  }
                  const ok = await sendCode();
                  if (ok) { scheduleAbandonedLead(); setStep('verify'); }
                }}>
                {sendingCode ? 'Sending Code…' : checkingPhone ? 'Validating…' : 'Verify Phone'}
              </button>
            </div>
          </div>
        )}

        {/* ── Step 4: Phone Verification ── */}
        {step === 'verify' && (
          <div className="space-y-4 text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2"
              style={{ background: '#eef5ff' }}>
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="#2b7cff" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold" style={{ color: '#0d1b2a' }}>Verify Your Phone</h3>
            <p className="text-sm" style={{ color: '#494949' }}>
              We sent a 6-digit code to <strong>{watchPhone}</strong>.
            </p>

            {codeVerified ? (
              <div className="rounded-xl p-4" style={{ background: '#eef5ff', border: '1px solid #bbd5ff' }}>
                <p className="font-semibold text-sm" style={{ color: '#2b7cff' }}>&#10003; Phone verified successfully!</p>
              </div>
            ) : (
              <>
                <input type="text" maxLength={6} value={enteredCode}
                  onChange={e => { setEnteredCode(e.target.value.replace(/\D/g, '')); setCodeError(''); }}
                  className="w-44 text-center text-2xl tracking-[0.5em] font-mono mx-auto block input-field"
                  placeholder="000000" autoFocus />
                {codeError && <p className={err}>{codeError}</p>}
                <button type="button" onClick={sendCode} disabled={sendingCode}
                  className="text-sm underline" style={{ color: '#2b7cff' }}>
                  {sendingCode ? 'Sending…' : 'Resend Code'}
                </button>
              </>
            )}

            <div className="flex space-x-3 mt-2">
              <button type="button" onClick={() => setStep('contact')}
                className="flex-1 py-3.5 rounded-xl font-semibold text-sm"
                style={{ border: '1.5px solid #d9d9d9', color: '#494949', background: 'white' }}>
                Back
              </button>
              <button type="submit" disabled={!codeVerified}
                className="flex-1 btn-primary py-3.5 disabled:opacity-40 disabled:cursor-not-allowed">
                Submit Application
              </button>
            </div>
          </div>
        )}
      </form>

      <p className="text-xs text-center mt-6 leading-relaxed" style={{ color: '#aaaaaa' }}>
        Your information is encrypted with SSL/TLS. Soft inquiry — no credit score impact.{' '}
        <a href="/privacy" className="underline">Privacy Policy</a> ·{' '}
        <a href="/terms" className="underline">Terms</a>
      </p>
    </div>
  );
}
