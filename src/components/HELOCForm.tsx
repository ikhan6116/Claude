import { useState } from 'react';
import { useForm } from 'react-hook-form';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface Step1Data {
  street: string;
  unit?: string;
  city: string;
  state: string;
  zip: string;
  propertyType: string;
  occupancyType: string;
  estimatedValue: string;
  existingMortgageBalance: string;
}

interface Step2Data {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  ssnLastFour: string;
}

interface Step3Data {
  annualIncome: string;
  employmentStatus: string;
  creditScoreRange: string;
  requestedLineAmount: string;
}

interface Step4Data {
  email: string;
  phone: string;
  consent: boolean;
}

type AllFormData = Step1Data & Step2Data & Step3Data & Step4Data;

interface HELOCFormProps {
  source?: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY','DC',
];

const PROPERTY_TYPES = [
  { value: 'single_family', label: 'Single Family Home' },
  { value: 'condo', label: 'Condominium' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'multi_family', label: 'Multi-Family (2-4 units)' },
];

const OCCUPANCY_TYPES = [
  { value: 'primary', label: 'Primary Residence' },
  { value: 'secondary', label: 'Secondary / Vacation Home' },
  { value: 'investment', label: 'Investment Property' },
];

const EMPLOYMENT_STATUSES = [
  { value: 'employed', label: 'Employed (W-2)' },
  { value: 'self_employed', label: 'Self-Employed / 1099' },
  { value: 'retired', label: 'Retired' },
  { value: 'other', label: 'Other' },
];

const CREDIT_SCORE_RANGES = [
  { value: '750+', label: '750+ (Excellent)' },
  { value: '700-749', label: '700 – 749 (Good)' },
  { value: '650-699', label: '650 – 699 (Fair)' },
  { value: '600-649', label: '600 – 649 (Below Average)' },
  { value: 'below_600', label: 'Below 600' },
  { value: 'unknown', label: "I don't know" },
];

const LINE_AMOUNTS = [
  { value: '25000', label: '$25,000' },
  { value: '50000', label: '$50,000' },
  { value: '75000', label: '$75,000' },
  { value: '100000', label: '$100,000' },
  { value: '150000', label: '$150,000' },
  { value: '200000', label: '$200,000' },
  { value: '250000', label: '$250,000+' },
];

// ---------------------------------------------------------------------------
// Step indicator
// ---------------------------------------------------------------------------
function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center justify-center mb-6">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
              i + 1 <= current
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-500'
            }`}
          >
            {i + 1 < current ? '✓' : i + 1}
          </div>
          {i < total - 1 && (
            <div
              className={`h-1 w-10 mx-1 transition-colors ${
                i + 1 < current ? 'bg-primary-600' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function HELOCForm({ source = 'heloc-page' }: HELOCFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<AllFormData>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    status: string;
    offers: { lineAmountUsd: number; aprPercent: number; monthlyPaymentEstimateUsd: number }[];
    applicationUrl?: string;
  } | null>(null);
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors }, reset } = useForm<AllFormData>();

  const STEPS = 4;

  const advanceStep = (data: Partial<AllFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep((s) => s + 1);
    reset();
  };

  const submitApplication = async (stepData: Step4Data) => {
    const all = { ...formData, ...stepData } as AllFormData;
    setSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/heloc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // property
          street: all.street,
          unit: all.unit,
          city: all.city,
          state: all.state,
          zip: all.zip,
          propertyType: all.propertyType,
          occupancyType: all.occupancyType,
          estimatedValue: all.estimatedValue,
          existingMortgageBalance: all.existingMortgageBalance,
          // borrower
          firstName: all.firstName,
          lastName: all.lastName,
          dateOfBirth: all.dateOfBirth,
          ssnLastFour: all.ssnLastFour,
          // financial
          annualIncome: all.annualIncome,
          employmentStatus: all.employmentStatus,
          creditScoreRange: all.creditScoreRange,
          requestedLineAmount: all.requestedLineAmount,
          // contact
          email: all.email,
          phone: all.phone,
          // meta
          source,
          consentTimestamp: new Date().toISOString(),
        }),
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error || 'Submission failed');
      }

      setResult(json);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // -------------------------------------------------------------------------
  // Success screen
  // -------------------------------------------------------------------------
  if (result) {
    const hasOffers = result.offers && result.offers.length > 0;
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-accent-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-3xl">✓</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {hasOffers ? 'You Have Pre-Qualified Offers!' : 'Application Received'}
          </h2>
          <p className="text-gray-500 mt-2">
            {hasOffers
              ? 'Review your personalized HELOC offers from Figure below.'
              : 'A specialist will contact you within 1 business day to discuss your options.'}
          </p>
        </div>

        {hasOffers && (
          <div className="space-y-4 mb-6">
            {result.offers.map((offer, i) => (
              <div key={i} className="border-2 border-primary-200 rounded-xl p-5 bg-primary-50">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-primary-900 text-lg">
                    Line of Credit: ${offer.lineAmountUsd.toLocaleString()}
                  </h3>
                  <span className="bg-accent-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    Pre-Qualified
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">APR</p>
                    <p className="font-bold text-gray-900 text-lg">{offer.aprPercent}%</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Est. Monthly Payment</p>
                    <p className="font-bold text-gray-900 text-lg">
                      ${offer.monthlyPaymentEstimateUsd.toLocaleString()}/mo
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {result.applicationUrl && (
          <a
            href={result.applicationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary w-full text-center block text-lg"
          >
            Complete Your Application with Figure →
          </a>
        )}

        <p className="text-xs text-gray-400 text-center mt-4">
          Offers subject to final credit and property verification. Rate shown is for illustrative
          purposes only. APR varies by credit profile.
        </p>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Step 1: Property Information
  // -------------------------------------------------------------------------
  if (step === 1) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
        <StepIndicator current={1} total={STEPS} />
        <h2 className="text-xl font-bold text-gray-900 mb-1">Property Information</h2>
        <p className="text-sm text-gray-500 mb-6">Tell us about the property you want to use as collateral.</p>

        <form onSubmit={handleSubmit((d) => advanceStep(d as Partial<AllFormData>))} className="space-y-4">
          <div>
            <label className="label-field">Street Address *</label>
            <input {...register('street', { required: true })} className="input-field" placeholder="123 Main St" />
            {errors.street && <p className="field-error">Required</p>}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1">
              <label className="label-field">Unit / Apt</label>
              <input {...register('unit')} className="input-field" placeholder="Apt 2B" />
            </div>
            <div className="col-span-2">
              <label className="label-field">City *</label>
              <input {...register('city', { required: true })} className="input-field" placeholder="San Francisco" />
              {errors.city && <p className="field-error">Required</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-field">State *</label>
              <select {...register('state', { required: true })} className="input-field">
                <option value="">Select State</option>
                {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              {errors.state && <p className="field-error">Required</p>}
            </div>
            <div>
              <label className="label-field">ZIP Code *</label>
              <input
                {...register('zip', { required: true, pattern: /^\d{5}(-\d{4})?$/ })}
                className="input-field"
                placeholder="94105"
                maxLength={10}
              />
              {errors.zip && <p className="field-error">Valid ZIP required</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-field">Property Type *</label>
              <select {...register('propertyType', { required: true })} className="input-field">
                <option value="">Select Type</option>
                {PROPERTY_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
              {errors.propertyType && <p className="field-error">Required</p>}
            </div>
            <div>
              <label className="label-field">Occupancy *</label>
              <select {...register('occupancyType', { required: true })} className="input-field">
                <option value="">Select Type</option>
                {OCCUPANCY_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
              {errors.occupancyType && <p className="field-error">Required</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-field">Estimated Home Value *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <input
                  {...register('estimatedValue', { required: true, min: 1 })}
                  type="number"
                  className="input-field pl-7"
                  placeholder="450,000"
                />
              </div>
              {errors.estimatedValue && <p className="field-error">Required</p>}
            </div>
            <div>
              <label className="label-field">Existing Mortgage Balance *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <input
                  {...register('existingMortgageBalance', { required: true, min: 0 })}
                  type="number"
                  className="input-field pl-7"
                  placeholder="250,000"
                />
              </div>
              {errors.existingMortgageBalance && <p className="field-error">Required</p>}
            </div>
          </div>

          <button type="submit" className="btn-primary w-full">
            Continue to Personal Info →
          </button>
        </form>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Step 2: Personal Information
  // -------------------------------------------------------------------------
  if (step === 2) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
        <StepIndicator current={2} total={STEPS} />
        <h2 className="text-xl font-bold text-gray-900 mb-1">Personal Information</h2>
        <p className="text-sm text-gray-500 mb-6">
          Used for identity verification. Your SSN is transmitted securely and never stored.
        </p>

        <form onSubmit={handleSubmit((d) => advanceStep(d as Partial<AllFormData>))} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-field">First Name *</label>
              <input {...register('firstName', { required: true })} className="input-field" />
              {errors.firstName && <p className="field-error">Required</p>}
            </div>
            <div>
              <label className="label-field">Last Name *</label>
              <input {...register('lastName', { required: true })} className="input-field" />
              {errors.lastName && <p className="field-error">Required</p>}
            </div>
          </div>

          <div>
            <label className="label-field">Date of Birth *</label>
            <input
              {...register('dateOfBirth', { required: true })}
              type="date"
              className="input-field"
              max={new Date(Date.now() - 18 * 365.25 * 24 * 3600000).toISOString().split('T')[0]}
            />
            {errors.dateOfBirth && <p className="field-error">Must be 18+</p>}
          </div>

          <div>
            <label className="label-field">Last 4 Digits of SSN *</label>
            <input
              {...register('ssnLastFour', {
                required: true,
                pattern: /^\d{4}$/,
              })}
              type="password"
              className="input-field"
              placeholder="••••"
              maxLength={4}
              inputMode="numeric"
            />
            {errors.ssnLastFour && <p className="field-error">Must be exactly 4 digits</p>}
            <p className="text-xs text-gray-400 mt-1">
              🔒 Encrypted in transit. Used only for soft credit check (no impact to credit score).
            </p>
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={() => setStep(1)} className="btn-outline flex-1">
              ← Back
            </button>
            <button type="submit" className="btn-primary flex-1">
              Continue to Finances →
            </button>
          </div>
        </form>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Step 3: Financial Information
  // -------------------------------------------------------------------------
  if (step === 3) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
        <StepIndicator current={3} total={STEPS} />
        <h2 className="text-xl font-bold text-gray-900 mb-1">Financial Information</h2>
        <p className="text-sm text-gray-500 mb-6">Help us find the best HELOC offer for your situation.</p>

        <form onSubmit={handleSubmit((d) => advanceStep(d as Partial<AllFormData>))} className="space-y-4">
          <div>
            <label className="label-field">Annual Income (pre-tax) *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
              <input
                {...register('annualIncome', { required: true, min: 1 })}
                type="number"
                className="input-field pl-7"
                placeholder="80,000"
              />
            </div>
            {errors.annualIncome && <p className="field-error">Required</p>}
          </div>

          <div>
            <label className="label-field">Employment Status *</label>
            <select {...register('employmentStatus', { required: true })} className="input-field">
              <option value="">Select Status</option>
              {EMPLOYMENT_STATUSES.map((e) => (
                <option key={e.value} value={e.value}>{e.label}</option>
              ))}
            </select>
            {errors.employmentStatus && <p className="field-error">Required</p>}
          </div>

          <div>
            <label className="label-field">Credit Score Range *</label>
            <select {...register('creditScoreRange', { required: true })} className="input-field">
              <option value="">Select Range</option>
              {CREDIT_SCORE_RANGES.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
            {errors.creditScoreRange && <p className="field-error">Required</p>}
          </div>

          <div>
            <label className="label-field">Desired Line of Credit Amount *</label>
            <select {...register('requestedLineAmount', { required: true })} className="input-field">
              <option value="">Select Amount</option>
              {LINE_AMOUNTS.map((a) => (
                <option key={a.value} value={a.value}>{a.label}</option>
              ))}
            </select>
            {errors.requestedLineAmount && <p className="field-error">Required</p>}
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={() => setStep(2)} className="btn-outline flex-1">
              ← Back
            </button>
            <button type="submit" className="btn-primary flex-1">
              Review & Submit →
            </button>
          </div>
        </form>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Step 4: Contact & Consent
  // -------------------------------------------------------------------------
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
      <StepIndicator current={4} total={STEPS} />
      <h2 className="text-xl font-bold text-gray-900 mb-1">Almost Done!</h2>
      <p className="text-sm text-gray-500 mb-6">Enter your contact info to receive your HELOC offers.</p>

      <form
        onSubmit={handleSubmit((d) => submitApplication(d as Step4Data))}
        className="space-y-4"
      >
        <div>
          <label className="label-field">Email Address *</label>
          <input
            {...register('email', {
              required: true,
              pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            })}
            type="email"
            className="input-field"
            placeholder="you@email.com"
          />
          {errors.email && <p className="field-error">Valid email required</p>}
        </div>

        <div>
          <label className="label-field">Phone Number *</label>
          <input
            {...register('phone', { required: true })}
            type="tel"
            className="input-field"
            placeholder="(555) 555-5555"
          />
          {errors.phone && <p className="field-error">Required</p>}
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              {...register('consent', { required: true })}
              type="checkbox"
              className="mt-1 accent-primary-600"
            />
            <span className="text-xs text-gray-600 leading-relaxed">
              By checking this box, I consent to receive calls, texts, and emails about HELOC offers
              from Freedom Debt Solutions and its lending partners, including Figure Lending LLC.
              I understand this may include automated or pre-recorded calls. I agree to the{' '}
              <a href="/terms" className="text-primary-600 underline">Terms of Service</a> and{' '}
              <a href="/privacy" className="text-primary-600 underline">Privacy Policy</a>.
              Checking this box constitutes my electronic signature.
            </span>
          </label>
          {errors.consent && <p className="field-error mt-2">You must consent to continue</p>}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button type="button" onClick={() => setStep(3)} className="btn-outline flex-1" disabled={submitting}>
            ← Back
          </button>
          <button type="submit" disabled={submitting} className="btn-primary flex-1 text-base">
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Checking Offers...
              </span>
            ) : (
              'See My HELOC Offers →'
            )}
          </button>
        </div>

        <p className="text-xs text-gray-400 text-center">
          🔒 256-bit SSL encrypted. Soft credit check only — no impact to your score.
          You will never be charged for checking your offers.
        </p>
      </form>
    </div>
  );
}
