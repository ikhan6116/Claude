import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';

interface LoanFormData {
  firstName: string;
  lastName: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  unsecuredDebtBalance: string;
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
  { code: 'AL', name: 'Alabama' }, { code: 'AK', name: 'Alaska' }, { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' }, { code: 'CA', name: 'California' }, { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' }, { code: 'DE', name: 'Delaware' }, { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' }, { code: 'HI', name: 'Hawaii' }, { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' }, { code: 'IN', name: 'Indiana' }, { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' }, { code: 'KY', name: 'Kentucky' }, { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' }, { code: 'MD', name: 'Maryland' }, { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' }, { code: 'MN', name: 'Minnesota' }, { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' }, { code: 'MT', name: 'Montana' }, { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' }, { code: 'NH', name: 'New Hampshire' }, { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' }, { code: 'NY', name: 'New York' }, { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' }, { code: 'OH', name: 'Ohio' }, { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' }, { code: 'PA', name: 'Pennsylvania' }, { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' }, { code: 'SD', name: 'South Dakota' }, { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' }, { code: 'UT', name: 'Utah' }, { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' }, { code: 'WA', name: 'Washington' }, { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' }, { code: 'WY', name: 'Wyoming' }, { code: 'DC', name: 'District of Columbia' },
];

const FICO_RANGES = [
  'Excellent (750+)',
  'Good (700-749)',
  'Fair (650-699)',
  'Below Average (600-649)',
  'Poor (550-599)',
  'Very Poor (Below 550)',
  'Not Sure',
];

const LOAN_PURPOSES = [
  'Consolidate Credit Card Debt',
  'Pay Off Medical Bills',
  'Consolidate Multiple Loans',
  'Reduce Monthly Payments',
  'Lower Interest Rates',
  'Home Improvement',
  'Major Purchase',
  'Other',
];

const DEBT_AMOUNTS = [
  '$5,000 - $10,000',
  '$10,000 - $25,000',
  '$25,000 - $50,000',
  '$50,000 - $75,000',
  '$75,000 - $100,000',
  '$100,000+',
];

const LOAN_AMOUNTS = [
  '$5,000 - $10,000',
  '$10,000 - $25,000',
  '$25,000 - $50,000',
  '$50,000 - $75,000',
  '$75,000 - $100,000',
  '$100,000+',
];

export default function LoanApplicationForm({ source = 'landing-page' }: { source?: string }) {
  const [step, setStep] = useState<FormStep>('personal');
  const [verificationCode, setVerificationCode] = useState('');
  const [enteredCode, setEnteredCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [codeVerified, setCodeVerified] = useState(false);
  const [codeError, setCodeError] = useState('');
  const [sendingCode, setSendingCode] = useState(false);
  const [result, setResult] = useState<LoanResult | null>(null);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<LoanFormData>({
    mode: 'onBlur',
  });

  const watchConsent = watch('creditInquiryConsent');
  const watchPhone = watch('phone');

  const steps: FormStep[] = ['personal', 'debt', 'contact', 'verify'];
  const currentIndex = steps.indexOf(step);
  const progress = step === 'processing' || step === 'result'
    ? 100
    : ((currentIndex + 1) / steps.length) * 100;

  const goToStep = (target: FormStep) => setStep(target);

  const validateAndNext = async (fieldsToValidate: (keyof LoanFormData)[], nextStep: FormStep) => {
    const valid = await trigger(fieldsToValidate);
    if (valid) goToStep(nextStep);
  };

  const sendVerificationCode = async () => {
    const phone = getValues('phone');
    if (!phone) return;

    setSendingCode(true);
    setCodeError('');

    try {
      const response = await fetch('/api/loans/verify-phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });

      if (!response.ok) throw new Error('Failed to send code');

      const data = await response.json();
      setVerificationCode(data.code || '');
      setCodeSent(true);
    } catch {
      setCodeError('Failed to send verification code. Please try again.');
    } finally {
      setSendingCode(false);
    }
  };

  const verifyCode = useCallback(() => {
    if (enteredCode.length !== 6) {
      setCodeError('Please enter a 6-digit code.');
      return;
    }
    if (verificationCode && enteredCode !== verificationCode) {
      setCodeError('Invalid code. Please try again.');
      return;
    }
    setCodeVerified(true);
    setCodeError('');
  }, [enteredCode, verificationCode]);

  useEffect(() => {
    if (enteredCode.length === 6 && !codeVerified) {
      verifyCode();
    }
  }, [enteredCode, codeVerified, verifyCode]);

  const onSubmit = async (data: LoanFormData) => {
    goToStep('processing');
    setError('');

    try {
      const response = await fetch('/api/loans/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          source,
          phoneVerified: codeVerified,
          submittedAt: new Date().toISOString(),
          consentTimestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Submission failed');
      }

      const resultData = await response.json();
      setResult({
        approved: resultData.approved,
        score: resultData.creditScore,
        totalDebt: resultData.totalDebtBalance,
        message: resultData.message,
        offerId: resultData.offerId,
      });
      goToStep('result');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      goToStep('contact');
    }
  };

  const renderProgressBar = () => (
    <div className="mb-8">
      <div className="flex justify-between text-sm text-gray-500 mb-2">
        {['Personal Info', 'Loan Details', 'Contact', 'Verify'].map((label, i) => (
          <span
            key={label}
            className={`font-medium ${i <= currentIndex ? 'text-primary-600' : ''}`}
          >
            {label}
          </span>
        ))}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-primary-600 h-2 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );

  if (step === 'processing') {
    return (
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-2xl mx-auto text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Processing Your Application</h2>
        <p className="text-gray-500">
          We&apos;re running a soft credit inquiry — this will not affect your credit score.
          Please wait a moment...
        </p>
      </div>
    );
  }

  if (step === 'result' && result) {
    return (
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-2xl mx-auto">
        {result.approved ? (
          <div className="text-center">
            <div className="w-20 h-20 bg-accent-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-white text-4xl">&#10003;</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Great News!</h2>
            <p className="text-lg text-gray-600 mb-6">{result.message}</p>
            {result.offerId && (
              <p className="text-sm text-gray-500 mb-6">Reference ID: {result.offerId}</p>
            )}
            <div className="bg-accent-50 border border-accent-200 rounded-lg p-6 mb-6">
              <p className="text-accent-800 font-medium">
                An agent will be reaching out shortly to finalize your offer.
                For immediate assistance, call us at{' '}
                <a href="tel:877-867-2002" className="font-bold underline">877-867-2002</a>.
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-white text-4xl">!</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Thank You for Applying</h2>
            <p className="text-lg text-gray-600 mb-6">{result.message}</p>
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-6 mb-6">
              <p className="text-primary-800 font-medium">
                One of our specialists will review your application and contact you
                with alternative options. You can also call us at{' '}
                <a href="tel:877-867-2002" className="font-bold underline">877-867-2002</a>.
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-xl p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Debt Consolidation Loan Application
      </h2>
      <p className="text-gray-500 mb-6">
        Complete the form below to check your eligibility. No impact to your credit score.
      </p>

      {renderProgressBar()}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Step 1: Personal Information */}
        {step === 'personal' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                <input
                  {...register('firstName', { required: 'First name is required' })}
                  className="input-field"
                  placeholder="John"
                />
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                <input
                  {...register('lastName', { required: 'Last name is required' })}
                  className="input-field"
                  placeholder="Smith"
                />
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
              <input
                {...register('streetAddress', { required: 'Address is required' })}
                className="input-field"
                placeholder="123 Main Street"
              />
              {errors.streetAddress && <p className="text-red-500 text-xs mt-1">{errors.streetAddress.message}</p>}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                <input
                  {...register('city', { required: 'City is required' })}
                  className="input-field"
                  placeholder="New York"
                />
                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                <select
                  {...register('state', { required: 'State is required' })}
                  className="input-field"
                >
                  <option value="">Select</option>
                  {US_STATES.map((s) => (
                    <option key={s.code} value={s.code}>{s.code}</option>
                  ))}
                </select>
                {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>}
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code *</label>
                <input
                  {...register('zipCode', {
                    required: 'ZIP code is required',
                    pattern: { value: /^\d{5}(-\d{4})?$/, message: 'Invalid ZIP code' },
                  })}
                  className="input-field"
                  placeholder="10001"
                />
                {errors.zipCode && <p className="text-red-500 text-xs mt-1">{errors.zipCode.message}</p>}
              </div>
            </div>

            {/* Legal Consent Checkbox */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-6">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('creditInquiryConsent', {
                    required: 'You must consent to a soft credit inquiry to proceed',
                  })}
                  className="mt-1 h-5 w-5 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                />
                <span className="text-xs text-gray-600 leading-relaxed">
                  I hereby authorize BrightPath Finance and its lending partners to obtain
                  a consumer credit report from one or more consumer reporting agencies for
                  the purpose of evaluating my eligibility for a debt consolidation loan.
                  I understand this will be a &quot;soft pull&quot; inquiry that will not affect my
                  credit score. I certify that all information provided is accurate and that
                  I am the individual whose credit report is being requested. I consent to
                  be contacted by BrightPath Finance regarding my loan inquiry via phone,
                  email, or text message at the contact information provided. *
                </span>
              </label>
              {errors.creditInquiryConsent && (
                <p className="text-red-500 text-xs mt-2">{errors.creditInquiryConsent.message}</p>
              )}
            </div>

            <button
              type="button"
              onClick={() => validateAndNext(
                ['firstName', 'lastName', 'streetAddress', 'city', 'state', 'zipCode', 'creditInquiryConsent'],
                'debt'
              )}
              disabled={!watchConsent}
              className="btn-primary w-full mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue to Loan Details
            </button>
          </div>
        )}

        {/* Step 2: Debt & Loan Details */}
        {step === 'debt' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Unsecured Debt Balance *
              </label>
              <select
                {...register('unsecuredDebtBalance', { required: 'Debt balance is required' })}
                className="input-field"
              >
                <option value="">Select your total unsecured debt</option>
                {DEBT_AMOUNTS.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
              {errors.unsecuredDebtBalance && (
                <p className="text-red-500 text-xs mt-1">{errors.unsecuredDebtBalance.message}</p>
              )}
              <p className="text-xs text-gray-400 mt-1">
                Include credit cards, medical bills, personal loans, and other unsecured debts.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Loan Amount Requested *
              </label>
              <select
                {...register('loanRequestAmount', { required: 'Loan amount is required' })}
                className="input-field"
              >
                <option value="">Select desired loan amount</option>
                {LOAN_AMOUNTS.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
              {errors.loanRequestAmount && (
                <p className="text-red-500 text-xs mt-1">{errors.loanRequestAmount.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estimated FICO Score *
              </label>
              <select
                {...register('estimatedFico', { required: 'Please select your estimated credit score' })}
                className="input-field"
              >
                <option value="">Select your estimated score</option>
                {FICO_RANGES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              {errors.estimatedFico && (
                <p className="text-red-500 text-xs mt-1">{errors.estimatedFico.message}</p>
              )}
              <p className="text-xs text-gray-400 mt-1">
                Don&apos;t know your score? Select &quot;Not Sure&quot; — we&apos;ll check with a soft inquiry.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Purpose of Loan *
              </label>
              <select
                {...register('loanPurpose', { required: 'Please select a loan purpose' })}
                className="input-field"
              >
                <option value="">Select purpose</option>
                {LOAN_PURPOSES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              {errors.loanPurpose && (
                <p className="text-red-500 text-xs mt-1">{errors.loanPurpose.message}</p>
              )}
            </div>

            <div className="flex space-x-4 mt-6">
              <button
                type="button"
                onClick={() => goToStep('personal')}
                className="flex-1 border border-gray-300 text-gray-700 rounded-lg py-3 px-6 font-medium hover:bg-gray-50 transition"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => validateAndNext(
                  ['unsecuredDebtBalance', 'loanRequestAmount', 'estimatedFico', 'loanPurpose'],
                  'contact'
                )}
                className="flex-1 btn-primary"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Contact Information */}
        {step === 'contact' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Please enter a valid email address',
                  },
                })}
                type="email"
                className="input-field"
                placeholder="john.smith@email.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
              <input
                {...register('phone', {
                  required: 'Phone number is required',
                  pattern: {
                    value: /^[\d\s\-()+ ]{10,}$/,
                    message: 'Please enter a valid phone number',
                  },
                })}
                type="tel"
                className="input-field"
                placeholder="(555) 123-4567"
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('tcpaConsent', {
                    required: 'You must agree to receive communications',
                  })}
                  className="mt-1 h-5 w-5 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                />
                <span className="text-xs text-gray-600 leading-relaxed">
                  By providing my phone number and checking this box, I consent to receive
                  calls and text messages from BrightPath Finance and its partners at the
                  number provided, including via automated technology and prerecorded messages.
                  Consent is not a condition of purchase. Message and data rates may apply.
                  Reply STOP to opt out. *
                </span>
              </label>
              {errors.tcpaConsent && (
                <p className="text-red-500 text-xs mt-2">{errors.tcpaConsent.message}</p>
              )}
            </div>

            <div className="flex space-x-4 mt-6">
              <button
                type="button"
                onClick={() => goToStep('debt')}
                className="flex-1 border border-gray-300 text-gray-700 rounded-lg py-3 px-6 font-medium hover:bg-gray-50 transition"
              >
                Back
              </button>
              <button
                type="button"
                onClick={async () => {
                  const valid = await trigger(['email', 'phone', 'tcpaConsent']);
                  if (valid) {
                    goToStep('verify');
                    if (watchPhone && !codeSent) {
                      sendVerificationCode();
                    }
                  }
                }}
                className="flex-1 btn-primary"
              >
                Verify Phone
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Phone Verification */}
        {step === 'verify' && (
          <div className="space-y-4 text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900">Verify Your Phone Number</h3>
            <p className="text-gray-500 text-sm">
              We&apos;ve sent a 6-digit code to <strong>{watchPhone}</strong>.
              Enter it below to verify your identity.
            </p>

            {codeVerified ? (
              <div className="bg-accent-50 border border-accent-200 rounded-lg p-4">
                <p className="text-accent-700 font-medium">Phone verified successfully!</p>
              </div>
            ) : (
              <>
                <div className="flex justify-center space-x-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={enteredCode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setEnteredCode(value);
                      setCodeError('');
                    }}
                    className="input-field text-center text-2xl tracking-[0.5em] font-mono w-48"
                    placeholder="000000"
                    autoFocus
                  />
                </div>
                {codeError && <p className="text-red-500 text-sm">{codeError}</p>}
                <button
                  type="button"
                  onClick={sendVerificationCode}
                  disabled={sendingCode}
                  className="text-primary-600 text-sm underline hover:text-primary-800"
                >
                  {sendingCode ? 'Sending...' : 'Resend Code'}
                </button>
              </>
            )}

            <div className="flex space-x-4 mt-6">
              <button
                type="button"
                onClick={() => goToStep('contact')}
                className="flex-1 border border-gray-300 text-gray-700 rounded-lg py-3 px-6 font-medium hover:bg-gray-50 transition"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={!codeVerified}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Application
              </button>
            </div>
          </div>
        )}
      </form>

      <p className="text-xs text-gray-400 mt-6 text-center leading-relaxed">
        BrightPath Finance is committed to protecting your privacy. Your information is
        encrypted using industry-standard SSL/TLS. A soft credit inquiry does not affect
        your credit score. By submitting this form, you agree to our{' '}
        <a href="/privacy" className="underline">Privacy Policy</a> and{' '}
        <a href="/terms" className="underline">Terms of Service</a>.
      </p>
    </div>
  );
}
