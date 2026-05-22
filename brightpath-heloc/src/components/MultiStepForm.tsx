import { useState, useCallback } from 'react'
import { useRouter } from 'next/router'

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormData {
  // Step 1
  firstName: string
  lastName: string
  email: string
  phone: string
  // Step 2
  street: string
  city: string
  state: string
  zip: string
  estimatedHomeValue: string
  currentMortgageBalance: string
  // Step 3
  requestedCreditLine: number
  loanPurpose: string
  // Step 4
  creditScoreRange: string
  employmentStatus: string
  annualIncome: string
  // Step 5
  consentToTerms: boolean
}

type FieldErrors = Partial<Record<keyof FormData, string>>

// ─── Constants ────────────────────────────────────────────────────────────────

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA',
  'HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
  'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
  'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY',
]

const STATE_NAMES: Record<string, string> = {
  AL:'Alabama', AK:'Alaska', AZ:'Arizona', AR:'Arkansas', CA:'California',
  CO:'Colorado', CT:'Connecticut', DE:'Delaware', FL:'Florida', GA:'Georgia',
  HI:'Hawaii', ID:'Idaho', IL:'Illinois', IN:'Indiana', IA:'Iowa',
  KS:'Kansas', KY:'Kentucky', LA:'Louisiana', ME:'Maine', MD:'Maryland',
  MA:'Massachusetts', MI:'Michigan', MN:'Minnesota', MS:'Mississippi', MO:'Missouri',
  MT:'Montana', NE:'Nebraska', NV:'Nevada', NH:'New Hampshire', NJ:'New Jersey',
  NM:'New Mexico', NY:'New York', NC:'North Carolina', ND:'North Dakota', OH:'Ohio',
  OK:'Oklahoma', OR:'Oregon', PA:'Pennsylvania', RI:'Rhode Island', SC:'South Carolina',
  SD:'South Dakota', TN:'Tennessee', TX:'Texas', UT:'Utah', VT:'Vermont',
  VA:'Virginia', WA:'Washington', WV:'West Virginia', WI:'Wisconsin', WY:'Wyoming',
}

const CREDIT_SCORE_RANGES = [
  { value: 'below-640', label: 'Below 640', color: 'text-red-500' },
  { value: '640-699', label: '640 – 699', color: 'text-orange-500' },
  { value: '700-749', label: '700 – 749', color: 'text-yellow-600' },
  { value: '750-799', label: '750 – 799', color: 'text-green-500' },
  { value: '800+', label: '800+', color: 'text-brand-blue' },
]

const LOAN_PURPOSES = [
  'Home Improvement',
  'Debt Consolidation',
  'Education',
  'Emergency Expenses',
  'Investment',
  'Other',
]

const EMPLOYMENT_STATUSES = [
  'Employed Full-Time',
  'Employed Part-Time',
  'Self-Employed',
  'Retired',
  'Other',
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDollar(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  if (!digits) return ''
  return parseInt(digits, 10).toLocaleString('en-US')
}

function parseDollar(formatted: string): number {
  return parseInt(formatted.replace(/,/g, ''), 10) || 0
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function isValidPhone(phone: string): boolean {
  return /^[\d\s\-().+]{10,}$/.test(phone)
}

function isValidZip(zip: string): boolean {
  return /^\d{5}(-\d{4})?$/.test(zip)
}

// ─── Initial State ────────────────────────────────────────────────────────────

const initialData: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  street: '',
  city: '',
  state: '',
  zip: '',
  estimatedHomeValue: '',
  currentMortgageBalance: '',
  requestedCreditLine: 100000,
  loanPurpose: '',
  creditScoreRange: '',
  employmentStatus: '',
  annualIncome: '',
  consentToTerms: false,
}

// ─── Step validation ──────────────────────────────────────────────────────────

function validateStep(step: number, data: FormData): FieldErrors {
  const errors: FieldErrors = {}

  if (step === 1) {
    if (!data.firstName.trim()) errors.firstName = 'First name is required'
    if (!data.lastName.trim()) errors.lastName = 'Last name is required'
    if (!data.email.trim()) {
      errors.email = 'Email is required'
    } else if (!isValidEmail(data.email)) {
      errors.email = 'Please enter a valid email address'
    }
    if (!data.phone.trim()) {
      errors.phone = 'Phone number is required'
    } else if (!isValidPhone(data.phone)) {
      errors.phone = 'Please enter a valid phone number (10+ digits)'
    }
  }

  if (step === 2) {
    if (!data.street.trim()) errors.street = 'Street address is required'
    if (!data.city.trim()) errors.city = 'City is required'
    if (!data.state) errors.state = 'State is required'
    if (!data.zip.trim()) {
      errors.zip = 'ZIP code is required'
    } else if (!isValidZip(data.zip)) {
      errors.zip = 'Please enter a valid 5-digit ZIP code'
    }
    if (!data.estimatedHomeValue) {
      errors.estimatedHomeValue = 'Estimated home value is required'
    } else if (parseDollar(data.estimatedHomeValue) < 50000) {
      errors.estimatedHomeValue = 'Home value must be at least $50,000'
    }
    if (!data.currentMortgageBalance && data.currentMortgageBalance !== '0') {
      errors.currentMortgageBalance = 'Current mortgage balance is required'
    }
  }

  if (step === 3) {
    if (!data.loanPurpose) errors.loanPurpose = 'Please select a loan purpose'
  }

  if (step === 4) {
    if (!data.creditScoreRange) errors.creditScoreRange = 'Please select your credit score range'
    if (!data.employmentStatus) errors.employmentStatus = 'Please select your employment status'
    if (!data.annualIncome) {
      errors.annualIncome = 'Annual income is required'
    } else if (parseDollar(data.annualIncome) < 12000) {
      errors.annualIncome = 'Annual income must be at least $12,000'
    }
  }

  if (step === 5) {
    if (!data.consentToTerms) errors.consentToTerms = 'You must agree to the terms to continue'
  }

  return errors
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="mt-1 text-sm text-red-500">{message}</p>
}

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-sm font-medium text-brand-navy mb-1">
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  )
}

function Input({
  value,
  onChange,
  placeholder,
  type = 'text',
  hasError,
  maxLength,
  inputMode,
  autoComplete,
  disabled,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  hasError?: boolean
  maxLength?: number
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode']
  autoComplete?: string
  disabled?: boolean
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      inputMode={inputMode}
      autoComplete={autoComplete}
      disabled={disabled}
      className={`w-full border rounded-xl px-4 py-3 text-brand-gray focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all ${
        hasError ? 'border-red-400 bg-red-50' : 'border-brand-gray-light bg-white hover:border-gray-300'
      }`}
    />
  )
}

function Select({
  value,
  onChange,
  options,
  placeholder,
  hasError,
}: {
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
  placeholder?: string
  hasError?: boolean
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full border rounded-xl px-4 py-3 text-brand-gray focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all bg-white ${
        hasError ? 'border-red-400 bg-red-50' : 'border-brand-gray-light hover:border-gray-300'
      }`}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}

// ─── Step Components ──────────────────────────────────────────────────────────

function Step1({
  data,
  errors,
  onChange,
}: {
  data: FormData
  errors: FieldErrors
  onChange: (field: keyof FormData, value: string) => void
}) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <Label required>First Name</Label>
          <Input
            value={data.firstName}
            onChange={(v) => onChange('firstName', v)}
            placeholder="John"
            hasError={!!errors.firstName}
          />
          <FieldError message={errors.firstName} />
        </div>
        <div>
          <Label required>Last Name</Label>
          <Input
            value={data.lastName}
            onChange={(v) => onChange('lastName', v)}
            placeholder="Smith"
            hasError={!!errors.lastName}
          />
          <FieldError message={errors.lastName} />
        </div>
      </div>
      <div>
        <Label required>Email Address</Label>
        <Input
          type="email"
          value={data.email}
          onChange={(v) => onChange('email', v)}
          placeholder="john.smith@example.com"
          hasError={!!errors.email}
        />
        <FieldError message={errors.email} />
      </div>
      <div>
        <Label required>Phone Number</Label>
        <Input
          type="tel"
          value={data.phone}
          onChange={(v) => onChange('phone', v)}
          placeholder="(555) 123-4567"
          hasError={!!errors.phone}
        />
        <FieldError message={errors.phone} />
      </div>
    </div>
  )
}

function Step2({
  data,
  errors,
  onChange,
}: {
  data: FormData
  errors: FieldErrors
  onChange: (field: keyof FormData, value: string) => void
}) {
  return (
    <div className="space-y-5">
      <div>
        <Label required>Street Address</Label>
        <Input
          value={data.street}
          onChange={(v) => onChange('street', v)}
          placeholder="123 Main Street"
          hasError={!!errors.street}
        />
        <FieldError message={errors.street} />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="col-span-2 sm:col-span-1">
          <Label required>City</Label>
          <Input
            value={data.city}
            onChange={(v) => onChange('city', v)}
            placeholder="Los Angeles"
            hasError={!!errors.city}
          />
          <FieldError message={errors.city} />
        </div>
        <div>
          <Label required>State</Label>
          <Select
            value={data.state}
            onChange={(v) => onChange('state', v)}
            options={US_STATES.map((s) => ({ value: s, label: `${s} — ${STATE_NAMES[s]}` }))}
            placeholder="Select..."
            hasError={!!errors.state}
          />
          <FieldError message={errors.state} />
        </div>
        <div>
          <Label required>ZIP Code</Label>
          <Input
            value={data.zip}
            onChange={(v) => onChange('zip', v)}
            placeholder="90001"
            maxLength={10}
            hasError={!!errors.zip}
          />
          <FieldError message={errors.zip} />
        </div>
      </div>
      <div>
        <Label required>Estimated Home Value</Label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gray font-medium">$</span>
          <input
            type="text"
            inputMode="numeric"
            value={data.estimatedHomeValue}
            onChange={(e) => onChange('estimatedHomeValue', formatDollar(e.target.value))}
            placeholder="450,000"
            className={`w-full border rounded-xl pl-8 pr-4 py-3 text-brand-gray focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all ${
              errors.estimatedHomeValue ? 'border-red-400 bg-red-50' : 'border-brand-gray-light bg-white hover:border-gray-300'
            }`}
          />
        </div>
        <FieldError message={errors.estimatedHomeValue} />
      </div>
      <div>
        <Label required>Current Mortgage Balance</Label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gray font-medium">$</span>
          <input
            type="text"
            inputMode="numeric"
            value={data.currentMortgageBalance}
            onChange={(e) => onChange('currentMortgageBalance', formatDollar(e.target.value))}
            placeholder="200,000"
            className={`w-full border rounded-xl pl-8 pr-4 py-3 text-brand-gray focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all ${
              errors.currentMortgageBalance ? 'border-red-400 bg-red-50' : 'border-brand-gray-light bg-white hover:border-gray-300'
            }`}
          />
        </div>
        <p className="mt-1 text-xs text-gray-400">Enter 0 if your home is paid off</p>
        <FieldError message={errors.currentMortgageBalance} />
      </div>
    </div>
  )
}

function Step3({
  data,
  errors,
  onChange,
}: {
  data: FormData
  errors: FieldErrors
  onChange: (field: keyof FormData, value: string | number) => void
}) {
  const sliderValue = data.requestedCreditLine
  const sliderPct = ((sliderValue - 10000) / (400000 - 10000)) * 100

  return (
    <div className="space-y-8">
      {/* Credit Line Slider */}
      <div>
        <Label required>Requested Credit Line</Label>
        <div className="mt-4">
          <div className="text-center mb-4">
            <span className="text-4xl font-bold text-brand-blue">
              ${sliderValue.toLocaleString()}
            </span>
          </div>
          <input
            type="range"
            min={10000}
            max={400000}
            step={5000}
            value={sliderValue}
            onChange={(e) => onChange('requestedCreditLine', parseInt(e.target.value, 10))}
            className="w-full"
            style={{
              background: `linear-gradient(to right, #2b7cff 0%, #2b7cff ${sliderPct}%, #d9d9d9 ${sliderPct}%, #d9d9d9 100%)`,
            }}
          />
          <div className="flex justify-between text-xs text-brand-gray mt-2">
            <span>$10,000</span>
            <span>$400,000</span>
          </div>
        </div>
        <p className="text-sm text-gray-400 mt-3 text-center">
          Drag to select your desired credit line amount
        </p>
      </div>

      {/* Loan Purpose */}
      <div>
        <Label required>Loan Purpose</Label>
        <Select
          value={data.loanPurpose}
          onChange={(v) => onChange('loanPurpose', v)}
          options={LOAN_PURPOSES.map((p) => ({ value: p, label: p }))}
          placeholder="Select a purpose..."
          hasError={!!errors.loanPurpose}
        />
        <FieldError message={errors.loanPurpose} />
      </div>
    </div>
  )
}

function Step4({
  data,
  errors,
  onChange,
}: {
  data: FormData
  errors: FieldErrors
  onChange: (field: keyof FormData, value: string) => void
}) {
  return (
    <div className="space-y-6">
      {/* Credit Score Range */}
      <div>
        <Label required>Credit Score Range</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
          {CREDIT_SCORE_RANGES.map((range) => (
            <button
              key={range.value}
              type="button"
              onClick={() => onChange('creditScoreRange', range.value)}
              className={`border-2 rounded-xl px-4 py-4 text-sm font-semibold transition-all cursor-pointer text-center ${
                data.creditScoreRange === range.value
                  ? 'border-brand-blue bg-blue-50 text-brand-blue shadow-md'
                  : 'border-brand-gray-light bg-white text-brand-gray hover:border-gray-300'
              }`}
            >
              <div className={`text-lg font-bold mb-0.5 ${data.creditScoreRange === range.value ? 'text-brand-blue' : range.color}`}>
                {range.label}
              </div>
              <div className="text-xs text-gray-400">Credit Score</div>
            </button>
          ))}
        </div>
        <FieldError message={errors.creditScoreRange} />
      </div>

      {/* Employment Status */}
      <div>
        <Label required>Employment Status</Label>
        <Select
          value={data.employmentStatus}
          onChange={(v) => onChange('employmentStatus', v)}
          options={EMPLOYMENT_STATUSES.map((s) => ({ value: s, label: s }))}
          placeholder="Select status..."
          hasError={!!errors.employmentStatus}
        />
        <FieldError message={errors.employmentStatus} />
      </div>

      {/* Annual Income */}
      <div>
        <Label required>Annual Household Income</Label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gray font-medium">$</span>
          <input
            type="text"
            inputMode="numeric"
            value={data.annualIncome}
            onChange={(e) => onChange('annualIncome', formatDollar(e.target.value))}
            placeholder="75,000"
            className={`w-full border rounded-xl pl-8 pr-4 py-3 text-brand-gray focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all ${
              errors.annualIncome ? 'border-red-400 bg-red-50' : 'border-brand-gray-light bg-white hover:border-gray-300'
            }`}
          />
        </div>
        <FieldError message={errors.annualIncome} />
      </div>
    </div>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between py-3 border-b border-brand-gray-light last:border-0">
      <span className="text-sm text-brand-gray font-medium">{label}</span>
      <span className="text-sm text-brand-navy font-semibold text-right ml-4 max-w-xs">{value}</span>
    </div>
  )
}

function Step5({
  data,
  errors,
  onConsentChange,
}: {
  data: FormData
  errors: FieldErrors
  onConsentChange: (checked: boolean) => void
}) {
  return (
    <div className="space-y-6">
      <p className="text-brand-gray text-sm">
        Please review your information before submitting.
      </p>

      {/* Summary card */}
      <div className="bg-gray-50 rounded-2xl border border-brand-gray-light p-5">
        <h3 className="font-semibold text-brand-navy mb-4">Application Summary</h3>

        <div className="space-y-0">
          <SummaryRow label="Name" value={`${data.firstName} ${data.lastName}`} />
          <SummaryRow label="Email" value={data.email} />
          <SummaryRow label="Phone" value={data.phone} />
          <SummaryRow
            label="Property Address"
            value={`${data.street}, ${data.city}, ${data.state} ${data.zip}`}
          />
          <SummaryRow
            label="Estimated Home Value"
            value={data.estimatedHomeValue ? `$${data.estimatedHomeValue}` : '—'}
          />
          <SummaryRow
            label="Current Mortgage Balance"
            value={data.currentMortgageBalance ? `$${data.currentMortgageBalance}` : '$0'}
          />
          <SummaryRow
            label="Requested Credit Line"
            value={`$${data.requestedCreditLine.toLocaleString()}`}
          />
          <SummaryRow label="Loan Purpose" value={data.loanPurpose} />
          <SummaryRow label="Credit Score Range" value={data.creditScoreRange} />
          <SummaryRow label="Employment Status" value={data.employmentStatus} />
          <SummaryRow
            label="Annual Income"
            value={data.annualIncome ? `$${data.annualIncome}` : '—'}
          />
        </div>
      </div>

      {/* Consent checkbox */}
      <div className={`rounded-xl border-2 p-4 ${errors.consentToTerms ? 'border-red-400 bg-red-50' : 'border-brand-gray-light bg-white'}`}>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={data.consentToTerms}
            onChange={(e) => onConsentChange(e.target.checked)}
            className="mt-0.5 w-5 h-5 rounded border-brand-gray-light text-brand-blue focus:ring-brand-blue flex-shrink-0 cursor-pointer"
          />
          <span className="text-sm text-brand-gray leading-relaxed">
            I agree to be contacted by BrightPath Finance regarding my HELOC application and consent
            to the{' '}
            <a href="#" className="text-brand-blue hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-brand-blue hover:underline">
              Privacy Policy
            </a>
            . I understand that BrightPath Finance or its partners may contact me by phone, email,
            or text message regarding my application.
          </span>
        </label>
        <FieldError message={errors.consentToTerms} />
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

const STEP_TITLES = [
  'Personal Information',
  'Property Details',
  'Loan Details',
  'Financial Profile',
  'Review & Submit',
]

export default function MultiStepForm() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [data, setData] = useState<FormData>(initialData)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const totalSteps = 5

  const handleChange = useCallback((field: keyof FormData, value: string | number | boolean) => {
    setData((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => {
      if (prev[field]) {
        const next = { ...prev }
        delete next[field]
        return next
      }
      return prev
    })
  }, [])

  const handleNext = () => {
    const errs = validateStep(step, data)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      // Scroll to first error
      const firstErrEl = document.querySelector('[data-error-field]')
      if (firstErrEl) firstErrEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    setErrors({})
    setStep((s) => s + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleBack = () => {
    setErrors({})
    setStep((s) => s - 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async () => {
    const errs = validateStep(5, data)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setSubmitting(true)
    setSubmitError(null)

    try {
      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        street: data.street,
        city: data.city,
        state: data.state,
        zip: data.zip,
        estimatedHomeValue: parseDollar(data.estimatedHomeValue),
        currentMortgageBalance: parseDollar(data.currentMortgageBalance),
        requestedCreditLine: data.requestedCreditLine,
        loanPurpose: data.loanPurpose,
        creditScoreRange: data.creditScoreRange,
        employmentStatus: data.employmentStatus,
        annualIncome: parseDollar(data.annualIncome),
        consentToTerms: data.consentToTerms,
      }

      const res = await fetch('/api/submit-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const json = await res.json()

      if (!res.ok) {
        throw new Error(json.message || 'Submission failed. Please try again.')
      }

      // Redirect to thank you page
      const params = new URLSearchParams({
        firstName: data.firstName,
        ...(json.leadId ? { leadId: String(json.leadId) } : {}),
        ...(json.inquiryId ? { inquiryId: String(json.inquiryId) } : {}),
      })
      router.push(`/thank-you?${params.toString()}`)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'An unexpected error occurred.')
    } finally {
      setSubmitting(false)
    }
  }

  const progressPct = (step / totalSteps) * 100

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-brand-navy">
            HELOC Application
          </h1>
          <p className="text-brand-gray mt-2">
            Step {step} of {totalSteps} — {STEP_TITLES[step - 1]}
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all ${
                  i + 1 < step
                    ? 'bg-brand-blue text-white'
                    : i + 1 === step
                    ? 'bg-brand-blue text-white ring-4 ring-blue-100'
                    : 'bg-brand-gray-light text-brand-gray'
                }`}
              >
                {i + 1 < step ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
            ))}
          </div>
          <div className="h-2 bg-brand-gray-light rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-blue rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl shadow-sm border border-brand-gray-light p-6 md:p-8">
          {step === 1 && (
            <Step1
              data={data}
              errors={errors}
              onChange={(f, v) => handleChange(f, v)}
            />
          )}
          {step === 2 && (
            <Step2
              data={data}
              errors={errors}
              onChange={(f, v) => handleChange(f, v)}
            />
          )}
          {step === 3 && (
            <Step3
              data={data}
              errors={errors}
              onChange={(f, v) => handleChange(f, v as string | number)}
            />
          )}
          {step === 4 && (
            <Step4
              data={data}
              errors={errors}
              onChange={(f, v) => handleChange(f, v)}
            />
          )}
          {step === 5 && (
            <Step5
              data={data}
              errors={errors}
              onConsentChange={(checked) => handleChange('consentToTerms', checked)}
            />
          )}

          {/* Submit error */}
          {submitError && (
            <div className="mt-5 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
              {submitError}
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-brand-gray-light">
            <button
              type="button"
              onClick={handleBack}
              disabled={step === 1}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                step === 1
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-brand-gray border border-brand-gray-light hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>

            {step < totalSteps ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2 bg-brand-blue hover:bg-brand-blue-light text-white font-semibold px-7 py-2.5 rounded-xl text-sm transition-colors shadow-md"
              >
                Continue
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-2 bg-brand-blue hover:bg-brand-blue-light disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-7 py-2.5 rounded-xl text-sm transition-colors shadow-md"
              >
                {submitting ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Application
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Security note */}
        <div className="flex items-center justify-center gap-2 mt-6 text-xs text-gray-400">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          Your data is encrypted with 256-bit SSL and never sold to third parties.
        </div>
      </div>
    </div>
  )
}
