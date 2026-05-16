import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY',
];

const CREDIT_RANGES = ['<640', '640-699', '700-749', '750-799', '800+'];
const EMPLOYMENT_STATUSES = ['Employed Full-Time', 'Employed Part-Time', 'Self-Employed', 'Retired', 'Other'];
const LOAN_PURPOSES = ['Home Improvement', 'Debt Consolidation', 'Education', 'Emergency Funds', 'Business', 'Other'];

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  estimatedHomeValue: string;
  currentMortgageBalance: string;
  requestedCreditLine: number;
  loanPurpose: string;
  creditScoreRange: string;
  employmentStatus: string;
  annualIncome: string;
  consentToTerms: boolean;
}

const INITIAL: FormData = {
  firstName: '', lastName: '', email: '', phone: '',
  street: '', city: '', state: '', zip: '',
  estimatedHomeValue: '', currentMortgageBalance: '',
  requestedCreditLine: 50000, loanPurpose: '',
  creditScoreRange: '', employmentStatus: '', annualIncome: '',
  consentToTerms: false,
};

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
      <div
        className="bg-teal-500 h-2 rounded-full transition-all duration-500"
        style={{ width: `${(step / total) * 100}%` }}
      />
    </div>
  );
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="text-red-500 text-sm mt-1">{msg}</p>;
}

function Input({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        {...props}
      />
    </div>
  );
}

export default function HELOCApply() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(INITIAL);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ inquiryId: string; status: string; estimatedApr?: number; prequalifiedAmount?: number } | null>(null);
  const [submitError, setSubmitError] = useState('');

  const set = (key: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const val = e.target.type === 'checkbox'
      ? (e.target as HTMLInputElement).checked
      : e.target.type === 'range'
      ? Number(e.target.value)
      : e.target.value;
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((er) => ({ ...er, [key]: undefined }));
  };

  function validateStep(s: number): boolean {
    const errs: Partial<Record<keyof FormData, string>> = {};

    if (s === 1) {
      if (!form.firstName.trim()) errs.firstName = 'First name is required';
      if (!form.lastName.trim()) errs.lastName = 'Last name is required';
      if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
        errs.email = 'Valid email is required';
      if (!form.phone.trim() || form.phone.replace(/\D/g, '').length < 10)
        errs.phone = 'Valid 10-digit phone is required';
    }

    if (s === 2) {
      if (!form.street.trim()) errs.street = 'Street address is required';
      if (!form.city.trim()) errs.city = 'City is required';
      if (!form.state) errs.state = 'State is required';
      if (!form.zip.trim() || !/^\d{5}$/.test(form.zip)) errs.zip = 'Valid 5-digit ZIP is required';
      if (!form.estimatedHomeValue || Number(form.estimatedHomeValue) < 50000)
        errs.estimatedHomeValue = 'Home value must be at least $50,000';
      if (form.currentMortgageBalance === '' || Number(form.currentMortgageBalance) < 0)
        errs.currentMortgageBalance = 'Current mortgage balance is required';
    }

    if (s === 3) {
      if (!form.loanPurpose) errs.loanPurpose = 'Please select a loan purpose';
    }

    if (s === 4) {
      if (!form.creditScoreRange) errs.creditScoreRange = 'Please select your credit score range';
      if (!form.employmentStatus) errs.employmentStatus = 'Please select your employment status';
      if (!form.annualIncome || Number(form.annualIncome) < 1)
        errs.annualIncome = 'Annual income is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function next() {
    if (validateStep(step)) setStep((s) => s + 1);
  }
  function back() {
    setStep((s) => s - 1);
  }

  async function submit() {
    if (!form.consentToTerms) {
      setErrors({ consentToTerms: 'You must consent to the terms to continue' });
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    try {
      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        propertyAddress: { street: form.street, city: form.city, state: form.state, zip: form.zip },
        estimatedHomeValue: Number(form.estimatedHomeValue),
        currentMortgageBalance: Number(form.currentMortgageBalance),
        requestedCreditLine: form.requestedCreditLine,
        creditScoreRange: form.creditScoreRange,
        employmentStatus: form.employmentStatus,
        annualIncome: Number(form.annualIncome),
        loanPurpose: form.loanPurpose,
        consentToTerms: form.consentToTerms,
        leadSource: 'heloc-apply-form',
      };

      const res = await fetch('/api/heloc/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Submission failed. Please try again.');
      }

      setResult(data);
      setStep(6);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setSubmitting(false);
    }
  }

  const totalSteps = 5;

  return (
    <>
      <Head>
        <title>Apply for a HELOC | Powered by Figure</title>
        <meta name="description" content="Apply for a HELOC in minutes. Get a personalized rate offer with no impact to your credit score." />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
          <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/heloc" className="text-blue-900 font-bold text-lg">
              ← Figure HELOC
            </Link>
            <span className="text-sm text-gray-400">
              {step <= totalSteps ? `Step ${step} of ${totalSteps}` : 'Complete'}
            </span>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-6 py-12">
          {step <= totalSteps && (
            <div className="mb-8">
              <ProgressBar step={step} total={totalSteps} />
              <p className="text-right text-sm text-gray-400 mt-1">{Math.round((step / totalSteps) * 100)}% complete</p>
            </div>
          )}

          {/* ── Step 1: Personal Info ── */}
          {step === 1 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Personal Information</h2>
              <p className="text-gray-500 mb-8">Tell us a bit about yourself to get started.</p>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <Input label="First Name" value={form.firstName} onChange={set('firstName')} placeholder="Jane" />
                  <FieldError msg={errors.firstName} />
                </div>
                <div>
                  <Input label="Last Name" value={form.lastName} onChange={set('lastName')} placeholder="Smith" />
                  <FieldError msg={errors.lastName} />
                </div>
                <div>
                  <Input label="Email Address" type="email" value={form.email} onChange={set('email')} placeholder="jane@email.com" />
                  <FieldError msg={errors.email} />
                </div>
                <div>
                  <Input label="Phone Number" type="tel" value={form.phone} onChange={set('phone')} placeholder="(555) 000-0000" />
                  <FieldError msg={errors.phone} />
                </div>
              </div>
            </div>
          )}

          {/* ── Step 2: Property ── */}
          {step === 2 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Property Details</h2>
              <p className="text-gray-500 mb-8">Tell us about the home securing the line of credit.</p>
              <div className="space-y-5">
                <div>
                  <Input label="Street Address" value={form.street} onChange={set('street')} placeholder="123 Main St" />
                  <FieldError msg={errors.street} />
                </div>
                <div className="grid sm:grid-cols-3 gap-5">
                  <div className="sm:col-span-1">
                    <Input label="City" value={form.city} onChange={set('city')} placeholder="Springfield" />
                    <FieldError msg={errors.city} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">State</label>
                    <select
                      value={form.state}
                      onChange={set('state')}
                      className="border border-gray-300 rounded-lg px-4 py-3 w-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="">Select</option>
                      {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <FieldError msg={errors.state} />
                  </div>
                  <div>
                    <Input label="ZIP Code" value={form.zip} onChange={set('zip')} placeholder="62701" maxLength={5} />
                    <FieldError msg={errors.zip} />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <Input
                      label="Estimated Home Value ($)"
                      type="number"
                      value={form.estimatedHomeValue}
                      onChange={set('estimatedHomeValue')}
                      placeholder="450000"
                      min={50000}
                    />
                    <FieldError msg={errors.estimatedHomeValue} />
                  </div>
                  <div>
                    <Input
                      label="Current Mortgage Balance ($)"
                      type="number"
                      value={form.currentMortgageBalance}
                      onChange={set('currentMortgageBalance')}
                      placeholder="200000"
                      min={0}
                    />
                    <FieldError msg={errors.currentMortgageBalance} />
                  </div>
                </div>
                {form.estimatedHomeValue && form.currentMortgageBalance && (
                  <div className="bg-teal-50 border border-teal-100 rounded-xl p-4 text-sm text-teal-800">
                    <strong>Estimated Available Equity: </strong>
                    {formatCurrency(Math.max(0, Number(form.estimatedHomeValue) - Number(form.currentMortgageBalance)))}
                    {' '}(80% LTV limit may apply)
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Step 3: Loan Details ── */}
          {step === 3 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Loan Details</h2>
              <p className="text-gray-500 mb-8">How much would you like access to?</p>
              <div className="space-y-8">
                <div>
                  <div className="flex justify-between mb-3">
                    <label className="text-sm font-medium text-gray-700">Requested Credit Line</label>
                    <span className="text-teal-600 font-bold text-lg">{formatCurrency(form.requestedCreditLine)}</span>
                  </div>
                  <input
                    type="range"
                    min={10000}
                    max={400000}
                    step={5000}
                    value={form.requestedCreditLine}
                    onChange={set('requestedCreditLine')}
                    className="w-full accent-teal-500"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>$10,000</span>
                    <span>$400,000</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Loan Purpose</label>
                  <select
                    value={form.loanPurpose}
                    onChange={set('loanPurpose')}
                    className="border border-gray-300 rounded-lg px-4 py-3 w-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">Select a purpose...</option>
                    {LOAN_PURPOSES.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <FieldError msg={errors.loanPurpose} />
                </div>
              </div>
            </div>
          )}

          {/* ── Step 4: Financial Info ── */}
          {step === 4 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Financial Information</h2>
              <p className="text-gray-500 mb-8">This helps us generate your personalized offer.</p>
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-3">Credit Score Range</label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {CREDIT_RANGES.map((range) => (
                      <label
                        key={range}
                        className={`cursor-pointer rounded-xl border-2 p-3 text-center text-sm font-medium transition-all ${
                          form.creditScoreRange === range
                            ? 'border-teal-500 bg-teal-50 text-teal-700'
                            : 'border-gray-200 text-gray-600 hover:border-teal-200'
                        }`}
                      >
                        <input
                          type="radio"
                          name="creditScoreRange"
                          value={range}
                          checked={form.creditScoreRange === range}
                          onChange={set('creditScoreRange')}
                          className="sr-only"
                        />
                        {range}
                      </label>
                    ))}
                  </div>
                  <FieldError msg={errors.creditScoreRange} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Employment Status</label>
                  <select
                    value={form.employmentStatus}
                    onChange={set('employmentStatus')}
                    className="border border-gray-300 rounded-lg px-4 py-3 w-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">Select status...</option>
                    {EMPLOYMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <FieldError msg={errors.employmentStatus} />
                </div>
                <div>
                  <Input
                    label="Annual Gross Income ($)"
                    type="number"
                    value={form.annualIncome}
                    onChange={set('annualIncome')}
                    placeholder="85000"
                    min={1}
                  />
                  <FieldError msg={errors.annualIncome} />
                </div>
              </div>
            </div>
          )}

          {/* ── Step 5: Review & Submit ── */}
          {step === 5 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Review & Submit</h2>
              <p className="text-gray-500 mb-8">Please review your information before submitting.</p>

              <div className="space-y-4 mb-8">
                {[
                  { label: 'Name', value: `${form.firstName} ${form.lastName}` },
                  { label: 'Email', value: form.email },
                  { label: 'Phone', value: form.phone },
                  { label: 'Property', value: `${form.street}, ${form.city}, ${form.state} ${form.zip}` },
                  { label: 'Est. Home Value', value: formatCurrency(Number(form.estimatedHomeValue)) },
                  { label: 'Mortgage Balance', value: formatCurrency(Number(form.currentMortgageBalance)) },
                  { label: 'Requested Credit Line', value: formatCurrency(form.requestedCreditLine) },
                  { label: 'Loan Purpose', value: form.loanPurpose },
                  { label: 'Credit Score Range', value: form.creditScoreRange },
                  { label: 'Employment Status', value: form.employmentStatus },
                  { label: 'Annual Income', value: formatCurrency(Number(form.annualIncome)) },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between py-2 border-b border-gray-50 text-sm">
                    <span className="text-gray-500 font-medium">{label}</span>
                    <span className="text-gray-900 font-semibold">{value}</span>
                  </div>
                ))}
              </div>

              <label className="flex items-start gap-3 cursor-pointer mb-6">
                <input
                  type="checkbox"
                  checked={form.consentToTerms}
                  onChange={set('consentToTerms')}
                  className="mt-1 accent-teal-500"
                />
                <span className="text-sm text-gray-600 leading-relaxed">
                  I authorize Figure Lending LLC and its partners to obtain my credit report (soft pull only at this stage),
                  verify my information, and contact me via phone/email/SMS regarding my HELOC inquiry.
                  I agree to the{' '}
                  <a href="/terms" className="text-teal-600 underline">Terms of Service</a> and{' '}
                  <a href="/privacy" className="text-teal-600 underline">Privacy Policy</a>.
                </span>
              </label>
              <FieldError msg={errors.consentToTerms} />

              {submitError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm mb-4">
                  {submitError}
                </div>
              )}
            </div>
          )}

          {/* ── Step 6: Success ── */}
          {step === 6 && result && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Application Submitted!</h2>
              <p className="text-gray-500 mb-6">
                Your HELOC inquiry has been received. Here&apos;s your reference information:
              </p>

              <div className="bg-teal-50 border border-teal-100 rounded-xl p-6 mb-8 text-left space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Inquiry ID</span>
                  <span className="font-mono font-bold text-gray-900">{result.inquiryId}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Status</span>
                  <span className="font-semibold text-teal-700 capitalize">{result.status}</span>
                </div>
                {result.estimatedApr && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Estimated APR</span>
                    <span className="font-bold text-teal-700">{result.estimatedApr.toFixed(2)}%</span>
                  </div>
                )}
                {result.prequalifiedAmount && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Pre-Qualified Amount</span>
                    <span className="font-bold text-teal-700">{formatCurrency(result.prequalifiedAmount)}</span>
                  </div>
                )}
              </div>

              <p className="text-sm text-gray-500 mb-6">
                {result.status === 'pending'
                  ? "We're reviewing your application. You'll receive an email with your offer within 1 business day."
                  : "We'll be in touch shortly with next steps. Check your email for confirmation."}
              </p>

              <Link href="/heloc" className="text-teal-600 underline text-sm">
                ← Return to HELOC home
              </Link>
            </div>
          )}

          {/* Navigation Buttons */}
          {step <= totalSteps && (
            <div className="flex justify-between mt-6">
              {step > 1 ? (
                <button
                  onClick={back}
                  className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  ← Back
                </button>
              ) : (
                <div />
              )}
              {step < totalSteps ? (
                <button
                  onClick={next}
                  className="px-8 py-3 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-xl transition-colors"
                >
                  Continue →
                </button>
              ) : (
                <button
                  onClick={submit}
                  disabled={submitting}
                  className="px-8 py-3 bg-teal-600 hover:bg-teal-500 disabled:opacity-60 text-white font-bold rounded-xl transition-colors"
                >
                  {submitting ? 'Submitting…' : 'Submit Application →'}
                </button>
              )}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
