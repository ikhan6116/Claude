import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/router'

declare global {
  interface Window { fbq?: (...args: unknown[]) => void }
}

// ─── Constants ────────────────────────────────────────────────────────────────

const US_STATES = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY']

const CREDIT_SCORE_MAP: Record<string, string> = {
  'Below 640':  'below-640',
  '640 – 699':  '640-699',
  '700 – 749':  '700-749',
  '750 – 799':  '750-799',
  '800+':       '800+',
}

const LOAN_PURPOSES = [
  'Working Capital','Business Expansion','Equipment Purchase',
  'Inventory','Hiring & Payroll','Real Estate Investment',
  'Marketing & Advertising','Business Debt Refinancing','Home Improvement','Other',
]

const EMPLOYMENT_STATUSES = [
  'Business Owner / Self-Employed','Employed Full-Time',
  'Employed Part-Time','Retired','Other',
]

const CREDIT_LINE_OPTIONS = [
  { label: '$25,000',   value: 25000  },
  { label: '$50,000',   value: 50000  },
  { label: '$75,000',   value: 75000  },
  { label: '$100,000',  value: 100000 },
  { label: '$150,000',  value: 150000 },
  { label: '$200,000',  value: 200000 },
  { label: '$250,000+', value: 250000 },
]

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message { id: string; role: 'bot' | 'user'; text: string }

interface ChatData {
  street: string; city: string; state: string; zip: string
  estimatedHomeValue: string; currentMortgageBalance: string
  requestedCreditLine: number; loanPurpose: string
  creditScoreRange: string; employmentStatus: string; annualIncome: string
  firstName: string; lastName: string; email: string; phone: string
}

type FieldKey = keyof ChatData

interface Step {
  field: FieldKey
  botMessage: string | ((d: Partial<ChatData>) => string)
  inputType: 'text' | 'dollar' | 'email' | 'tel' | 'options' | 'creditLine'
  options?: string[]
  placeholder?: string
  validate: (v: string) => string | null
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtDollar(raw: string) {
  const d = raw.replace(/\D/g, '')
  return d ? parseInt(d, 10).toLocaleString('en-US') : ''
}
function parseDollar(v: string) { return parseInt(v.replace(/,/g, ''), 10) || 0 }

// ─── Conversation steps ───────────────────────────────────────────────────────

const STEPS: Step[] = [
  {
    field: 'street',
    botMessage: "Hi! 👋 I'm the BrightPath Finance assistant. I can check your HELOC eligibility in about 2 minutes — no credit impact. Let's start: what's the street address of your property?",
    inputType: 'text', placeholder: '123 Main Street',
    validate: v => v.trim() ? null : 'Please enter your street address',
  },
  {
    field: 'city',
    botMessage: 'What city is the property in?',
    inputType: 'text', placeholder: 'Los Angeles',
    validate: v => v.trim() ? null : 'Please enter the city',
  },
  {
    field: 'state',
    botMessage: 'Which state? (2-letter abbreviation)',
    inputType: 'text', placeholder: 'CA',
    validate: v => US_STATES.includes(v.trim().toUpperCase()) ? null : 'Please enter a valid 2-letter state (e.g. CA, TX, NY)',
  },
  {
    field: 'zip',
    botMessage: 'And the ZIP code?',
    inputType: 'text', placeholder: '90001',
    validate: v => /^\d{5}(-\d{4})?$/.test(v.trim()) ? null : 'Please enter a valid 5-digit ZIP code',
  },
  {
    field: 'estimatedHomeValue',
    botMessage: "What's the estimated current value of your home?",
    inputType: 'dollar', placeholder: '450,000',
    validate: v => { const n = parseDollar(v); return !n ? 'Please enter your home value' : n < 50000 ? 'Value must be at least $50,000' : null },
  },
  {
    field: 'currentMortgageBalance',
    botMessage: "What's your current mortgage balance? Enter 0 if your home is paid off.",
    inputType: 'dollar', placeholder: '200,000',
    validate: v => parseDollar(v) >= 0 ? null : 'Please enter your mortgage balance',
  },
  {
    field: 'requestedCreditLine',
    botMessage: 'How much of a credit line are you looking for?',
    inputType: 'creditLine',
    validate: v => v ? null : 'Please select an amount',
  },
  {
    field: 'loanPurpose',
    botMessage: 'What would you primarily use the funds for?',
    inputType: 'options', options: LOAN_PURPOSES,
    validate: v => v ? null : 'Please select a purpose',
  },
  {
    field: 'creditScoreRange',
    botMessage: "What's your current credit score range?",
    inputType: 'options', options: Object.keys(CREDIT_SCORE_MAP),
    validate: v => v ? null : 'Please select your credit score range',
  },
  {
    field: 'employmentStatus',
    botMessage: "What's your employment or business status?",
    inputType: 'options', options: EMPLOYMENT_STATUSES,
    validate: v => v ? null : 'Please select your status',
  },
  {
    field: 'annualIncome',
    botMessage: "What's your total annual income from all sources?",
    inputType: 'dollar', placeholder: '75,000',
    validate: v => { const n = parseDollar(v); return !n ? 'Please enter your income' : n < 12000 ? 'Income must be at least $12,000' : null },
  },
  {
    field: 'firstName',
    botMessage: "Great! Almost done. What's your first name?",
    inputType: 'text', placeholder: 'John',
    validate: v => v.trim() ? null : 'Please enter your first name',
  },
  {
    field: 'lastName',
    botMessage: d => `Thanks ${d.firstName}! What's your last name?`,
    inputType: 'text', placeholder: 'Smith',
    validate: v => v.trim() ? null : 'Please enter your last name',
  },
  {
    field: 'email',
    botMessage: d => `What's the best email to reach you, ${d.firstName}?`,
    inputType: 'email', placeholder: 'john@example.com',
    validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : 'Please enter a valid email address',
  },
  {
    field: 'phone',
    botMessage: 'And your phone number?',
    inputType: 'tel', placeholder: '(555) 123-4567',
    validate: v => /^[\d\s\-().+]{10,}$/.test(v) ? null : 'Please enter a valid phone number (10+ digits)',
  },
]

// ─── Component ────────────────────────────────────────────────────────────────

let msgId = 0
const uid = () => `m${++msgId}`

export default function LeadChatBot() {
  const router = useRouter()
  const [isOpen,        setIsOpen]        = useState(false)
  const [messages,      setMessages]      = useState<Message[]>([])
  const [stepIndex,     setStepIndex]     = useState(0)
  const [inputValue,    setInputValue]    = useState('')
  const [inputError,    setInputError]    = useState('')
  const [isTyping,      setIsTyping]      = useState(false)
  const [showConsent,   setShowConsent]   = useState(false)
  const [submitting,    setSubmitting]    = useState(false)
  const [submitError,   setSubmitError]   = useState('')
  const [collectedData, setCollectedData] = useState<Partial<ChatData>>({})
  const [customCredit,  setCustomCredit]  = useState('')
  const [showCustom,    setShowCustom]    = useState(false)
  const bottomRef  = useRef<HTMLDivElement>(null)
  const inputRef   = useRef<HTMLInputElement>(null)
  const startedRef = useRef(false)

  // Auto-open after 2.5 s
  useEffect(() => {
    const t = setTimeout(() => setIsOpen(true), 2500)
    return () => clearTimeout(t)
  }, [])

  // Kick off conversation the first time the chat opens
  useEffect(() => {
    if (isOpen && !startedRef.current) {
      startedRef.current = true
      setTimeout(() => showBotMessage(resolveMsg(STEPS[0].botMessage, {})), 400)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  // Scroll to bottom whenever messages or typing state changes
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, isTyping, showConsent])

  // Auto-focus input after typing indicator clears
  useEffect(() => {
    if (isOpen && !isTyping && !showConsent) setTimeout(() => inputRef.current?.focus(), 80)
  }, [stepIndex, isTyping, isOpen, showConsent])

  function resolveMsg(msg: Step['botMessage'], data: Partial<ChatData>): string {
    return typeof msg === 'function' ? msg(data) : msg
  }

  function addBotMsg(text: string) {
    setMessages(prev => [...prev, { id: uid(), role: 'bot', text }])
  }

  function addUserMsg(text: string) {
    setMessages(prev => [...prev, { id: uid(), role: 'user', text }])
  }

  const showBotMessage = useCallback((text: string, delay = 800) => {
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      addBotMsg(text)
    }, delay)
  }, [])

  function advance(value: string | number, display?: string) {
    const step = STEPS[stepIndex]
    const newData: Partial<ChatData> = { ...collectedData, [step.field]: value }
    setCollectedData(newData)
    addUserMsg(display ?? String(value))
    setInputValue('')
    setInputError('')
    setCustomCredit('')
    setShowCustom(false)

    const next = stepIndex + 1
    if (next >= STEPS.length) {
      // All questions answered — show wrap-up then consent
      setStepIndex(next)
      showBotMessage(
        `Perfect, ${newData.firstName}! I have everything I need. Here's one last step to submit your application.`,
        700
      )
      setTimeout(() => setShowConsent(true), 1600)
    } else {
      setStepIndex(next)
      showBotMessage(resolveMsg(STEPS[next].botMessage, newData))
    }
  }

  function submit() {
    const step = STEPS[stepIndex]
    const val = inputValue.trim()
    const err = step.validate(val)
    if (err) { setInputError(err); return }
    advance(step.field === 'state' ? val.toUpperCase() : val)
  }

  async function handleFinalSubmit() {
    setSubmitting(true)
    setSubmitError('')
    const d = collectedData as ChatData
    try {
      const res = await fetch('/api/submit-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName:              d.firstName,
          lastName:               d.lastName,
          email:                  d.email,
          phone:                  d.phone,
          street:                 d.street,
          city:                   d.city,
          state:                  d.state.toUpperCase(),
          zip:                    d.zip,
          estimatedHomeValue:     parseDollar(d.estimatedHomeValue),
          currentMortgageBalance: parseDollar(d.currentMortgageBalance),
          requestedCreditLine:    d.requestedCreditLine,
          loanPurpose:            d.loanPurpose,
          creditScoreRange:       CREDIT_SCORE_MAP[d.creditScoreRange] ?? d.creditScoreRange,
          employmentStatus:       d.employmentStatus,
          annualIncome:           parseDollar(d.annualIncome),
          consentToTerms:         true,
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.message || 'Submission failed')
      window.fbq?.('track', 'Lead')
      const params = new URLSearchParams({ firstName: d.firstName, ...(json.leadId ? { leadId: String(json.leadId) } : {}) })
      router.push(`/thank-you?${params.toString()}`)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setSubmitting(false)
    }
  }

  const step       = STEPS[stepIndex]
  const isDollar   = step?.inputType === 'dollar'
  const isOptions  = step?.inputType === 'options'
  const isCredit   = step?.inputType === 'creditLine'
  const isText     = step && !isDollar && !isOptions && !isCredit

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">

      {/* ── Bubble button ── */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 bg-brand-blue text-white rounded-full shadow-2xl px-5 py-3.5 hover:bg-brand-blue-light transition-colors"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400" />
          </span>
          <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <span className="font-semibold text-sm">Check My Rate</span>
        </button>
      )}

      {/* ── Chat window ── */}
      {isOpen && (
        <div
          className="bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
          style={{ width: 'min(375px, calc(100vw - 24px))', height: 'min(560px, calc(100vh - 96px))' }}
        >

          {/* Header */}
          <div className="bg-brand-blue px-5 py-3.5 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm select-none">BP</div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full ring-2 ring-brand-blue" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm leading-none">BrightPath Finance</p>
                <p className="text-blue-200 text-xs mt-0.5">Online · No credit impact</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/60 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
              aria-label="Close chat"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2`}>
                {msg.role === 'bot' && (
                  <div className="w-7 h-7 rounded-full bg-brand-blue flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mb-0.5">B</div>
                )}
                <div className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  msg.role === 'bot'
                    ? 'bg-white text-brand-navy shadow-sm border border-gray-100 rounded-bl-sm'
                    : 'bg-brand-blue text-white rounded-br-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex items-end gap-2">
                <div className="w-7 h-7 rounded-full bg-brand-blue flex items-center justify-center text-white text-xs font-bold flex-shrink-0">B</div>
                <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm border border-gray-100 flex gap-1 items-center">
                  <span className="w-2 h-2 bg-brand-gray-light rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-brand-gray-light rounded-full animate-bounce" style={{ animationDelay: '160ms' }} />
                  <span className="w-2 h-2 bg-brand-gray-light rounded-full animate-bounce" style={{ animationDelay: '320ms' }} />
                </div>
              </div>
            )}

            {/* Consent + submit */}
            {showConsent && !isTyping && (
              <div className="space-y-2.5 pt-1">
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-brand-gray leading-relaxed">
                  By submitting, I agree to be contacted by BrightPath Finance (NMLS #2670114) by phone, email, or text regarding my HELOC application, and I consent to the{' '}
                  <a href="#" className="text-brand-blue underline">Terms</a>{' '}&{' '}
                  <a href="#" className="text-brand-blue underline">Privacy Policy</a>.
                  No hard credit pull to check your rate.
                </div>
                {submitError && (
                  <p className="text-xs text-red-500 px-1">{submitError}</p>
                )}
                <button
                  onClick={handleFinalSubmit}
                  disabled={submitting}
                  className="w-full bg-brand-blue hover:bg-brand-blue-light disabled:opacity-60 text-white font-semibold py-3 rounded-xl text-sm transition-colors shadow flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Submitting...
                    </>
                  ) : 'Submit My Application →'}
                </button>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* ── Input area ── */}
          {!showConsent && !isTyping && step && (
            <div className="border-t border-gray-100 bg-white px-3 py-3 flex-shrink-0">

              {/* Options quick-replies */}
              {isOptions && (
                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto">
                  {step.options?.map(opt => (
                    <button
                      key={opt}
                      onClick={() => advance(opt)}
                      className="border-2 border-brand-gray-light rounded-xl px-3 py-1.5 text-xs font-semibold text-brand-gray hover:border-brand-blue hover:text-brand-blue hover:bg-blue-50 transition-all"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {/* Credit line preset buttons + custom */}
              {isCredit && (
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1.5">
                    {CREDIT_LINE_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => advance(opt.value, opt.label)}
                        className="border-2 border-brand-gray-light rounded-xl px-3 py-1.5 text-xs font-semibold text-brand-gray hover:border-brand-blue hover:text-brand-blue hover:bg-blue-50 transition-all"
                      >
                        {opt.label}
                      </button>
                    ))}
                    <button
                      onClick={() => setShowCustom(v => !v)}
                      className="border-2 border-brand-gray-light rounded-xl px-3 py-1.5 text-xs font-semibold text-brand-gray hover:border-brand-blue hover:text-brand-blue hover:bg-blue-50 transition-all"
                    >
                      Custom
                    </button>
                  </div>
                  {showCustom && (
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-gray text-sm">$</span>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={customCredit}
                          onChange={e => { setCustomCredit(fmtDollar(e.target.value)); setInputError('') }}
                          onKeyDown={e => {
                            if (e.key === 'Enter') {
                              const n = parseDollar(customCredit)
                              if (n >= 10000 && n <= 750000) advance(n, `$${customCredit}`)
                              else setInputError('Enter a valid amount ($10,000 – $750,000)')
                            }
                          }}
                          placeholder="Enter amount"
                          autoFocus
                          className="w-full border border-gray-200 rounded-xl pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
                        />
                      </div>
                      <button
                        onClick={() => {
                          const n = parseDollar(customCredit)
                          if (n >= 10000 && n <= 750000) advance(n, `$${customCredit}`)
                          else setInputError('Enter a valid amount ($10,000 – $750,000)')
                        }}
                        className="bg-brand-blue text-white rounded-xl px-4 text-sm font-semibold hover:bg-brand-blue-light transition-colors"
                      >
                        OK
                      </button>
                    </div>
                  )}
                  {inputError && <p className="text-xs text-red-500">{inputError}</p>}
                </div>
              )}

              {/* Free text / dollar / email / tel input */}
              {isText && (
                <div className="space-y-1">
                  <div className="flex gap-2">
                    {isDollar ? (
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-gray text-sm font-medium">$</span>
                        <input
                          ref={inputRef}
                          type="text"
                          inputMode="numeric"
                          value={inputValue}
                          onChange={e => { setInputValue(fmtDollar(e.target.value)); setInputError('') }}
                          onKeyDown={e => e.key === 'Enter' && submit()}
                          placeholder={step.placeholder}
                          className={`w-full border rounded-xl pl-8 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue ${inputError ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                        />
                      </div>
                    ) : (
                      <input
                        ref={inputRef}
                        type={step.inputType === 'email' ? 'email' : step.inputType === 'tel' ? 'tel' : 'text'}
                        value={inputValue}
                        onChange={e => { setInputValue(e.target.value); setInputError('') }}
                        onKeyDown={e => e.key === 'Enter' && submit()}
                        placeholder={step.placeholder}
                        className={`flex-1 border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue ${inputError ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                      />
                    )}
                    <button
                      onClick={submit}
                      className="bg-brand-blue hover:bg-brand-blue-light text-white rounded-xl px-3.5 flex-shrink-0 transition-colors"
                      aria-label="Send"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                      </svg>
                    </button>
                  </div>
                  {inputError && <p className="text-xs text-red-500 px-1">{inputError}</p>}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
