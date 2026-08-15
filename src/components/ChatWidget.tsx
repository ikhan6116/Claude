import { useState, useEffect, useRef } from 'react';
import { useAbandonedLead } from '@/lib/useAbandonedLead';
import { toStateCode } from '@/lib/usStates';

interface Message {
  role: 'bot' | 'user';
  text: string;
}

interface ChatData {
  firstName?: string;
  lastName?: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  email?: string;
  phone?: string;
  debtAmount?: string;
  monthlyPayment?: string;
  loanAmount?: string;
  creditScore?: string;
  loanPurpose?: string;
}

type Step =
  | 'greeting'
  | 'firstName'
  | 'lastName'
  | 'debtAmount'
  | 'monthlyPayment'
  | 'loanAmount'
  | 'creditScore'
  | 'loanPurpose'
  | 'address'
  | 'email'
  | 'phone'
  | 'verifyCode'
  | 'done';

const DEBT_OPTIONS    = ['$5K–$10K', '$10K–$25K', '$25K–$50K', '$50K–$75K', '$75K–$100K', '$100K+'];
const PAYMENT_OPTIONS = ['Less than $250', '$250–$500', '$500–$1,000', '$1,000–$1,500', '$1,500–$2,500', '$2,500+'];
const LOAN_OPTIONS    = ['$5K–$10K', '$10K–$25K', '$25K–$50K', '$50K–$75K', '$75K–$100K', '$100K+'];
const SCORE_OPTIONS   = ['Excellent (750+)', 'Good (700–749)', 'Fair (650–699)', 'Below Average (600–649)', 'Poor (550–599)', 'Not Sure'];
const PURPOSE_OPTIONS = ['Consolidate Credit Cards', 'Pay Off Medical Bills', 'Lower Monthly Payments', 'Reduce Interest Rate', 'Home Improvement', 'Other'];

const STEP_ORDER: Step[] = ['greeting','firstName','lastName','debtAmount','monthlyPayment','loanAmount','creditScore','loanPurpose','address','email','phone','verifyCode','done'];

function botMessage(step: Step, data: ChatData): string {
  switch (step) {
    case 'greeting':
      return "Hi there! 👋 I'm Alex, your BrightPath Finance guide. I can help you check if you qualify for a lower rate on your debt — takes just 2 minutes. Ready to get started?";
    case 'firstName':
      return "Great! First, what's your first name?";
    case 'lastName':
      return `Nice to meet you, ${data.firstName}! And your last name?`;
    case 'debtAmount':
      return `Thanks, ${data.firstName}! To find the best options for you, roughly how much unsecured debt do you currently have? (Credit cards, personal loans, medical bills, etc.)`;
    case 'monthlyPayment':
      return "Roughly how much are your total monthly minimum payments on that debt? (Don't include mortgage or auto loans.)";
    case 'loanAmount':
      return "Got it! And how much would you like to borrow to consolidate that debt?";
    case 'creditScore':
      return "Perfect. What's your estimated credit score range? No worries — this won't affect your score at all!";
    case 'loanPurpose':
      return "What's the main reason you're looking for a loan today?";
    case 'address':
      return "What's your home address? (Street, City, State ZIP — e.g. 123 Main St, Dallas, TX 75201)";
    case 'email':
      return `Almost there, ${data.firstName}! What's the best email address to send your rate options to?`;
    case 'phone':
      return "Last one! What's your mobile phone number? We'll use it to verify and reach out. 📞";
    case 'verifyCode':
      return `We just sent a 6-digit verification code to your phone. Please enter it below to confirm your number. 🔐`;
    case 'done':
      return `You're all set, ${data.firstName}! 🎉 We're reviewing your info now. A specialist from BrightPath Finance will be in touch shortly. You can also call us directly at 877-867-2002. Have a great day!`;
    default:
      return '';
  }
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function newEventId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `evt-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function isValidUSPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  const ten = digits.length === 11 && digits.startsWith('1') ? digits.slice(1) : digits;
  if (ten.length !== 10 || /^[01]/.test(ten)) return false;
  if (/^(\d)\1{9}$/.test(ten)) return false;
  if (ten === '1234567890' || ten === '0987654321') return false;
  return true;
}

export default function ChatWidget({
  autoOpen = true,
  autoOpenDelay = 2500,
  align = 'right',
}: { autoOpen?: boolean; autoOpenDelay?: number; align?: 'left' | 'right' } = {}) {
  const side = align === 'left' ? 'left' : 'right';
  const [open, setOpen]           = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [messages, setMessages]   = useState<Message[]>([]);
  const [step, setStep]           = useState<Step>('greeting');
  const [data, setData]           = useState<ChatData>({});
  const [input, setInput]         = useState('');
  const [sending, setSending]     = useState(false);
  const [showOptions, setOptions] = useState<string[]>([]);
  const [validating, setValidating] = useState(false);
  const bottomRef                 = useRef<HTMLDivElement>(null);
  const inputRef                  = useRef<HTMLInputElement>(null);
  const { schedule: scheduleAbandoned, cancel: cancelAbandoned } = useAbandonedLead();

  // Schedule an abandoned-lead capture once the visitor's phone passes
  // validation. Held 30s so a lead who finishes the OTP step doesn't trigger a
  // false alert; sends early if they leave the page. Cancelled on completion.
  function scheduleAbandonedLead(d: ChatData) {
    scheduleAbandoned({
      firstName: d.firstName, lastName: d.lastName, email: d.email, phone: d.phone,
      streetAddress: d.streetAddress, city: d.city, state: d.state, zipCode: d.zipCode,
      unsecuredDebtBalance: d.debtAmount, monthlyDebtPayment: d.monthlyPayment,
      loanRequestAmount: d.loanAmount, estimatedFico: d.creditScore, loanPurpose: d.loanPurpose,
      source: 'chatbot', lastStep: 'phone verification',
    });
  }

  // Auto-open 1.5 seconds after the page loads
  useEffect(() => {
    if (!autoOpen) return;
    const t = setTimeout(() => openChat(), autoOpenDelay);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoOpen, autoOpenDelay]);

  // Scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function openChat() {
    setOpen(true);
    setHasOpened(true);
    if (messages.length === 0) {
      appendBot('greeting', {});
    }
  }

  function appendBot(nextStep: Step, currentData: ChatData) {
    const text = botMessage(nextStep, currentData);
    setMessages(prev => [...prev, { role: 'bot', text }]);
    setStep(nextStep);

    // Set quick-reply options for choice steps
    if (nextStep === 'debtAmount')  setOptions(DEBT_OPTIONS);
    else if (nextStep === 'monthlyPayment') setOptions(PAYMENT_OPTIONS);
    else if (nextStep === 'loanAmount')  setOptions(LOAN_OPTIONS);
    else if (nextStep === 'creditScore') setOptions(SCORE_OPTIONS);
    else if (nextStep === 'loanPurpose') setOptions(PURPOSE_OPTIONS);
    else if (nextStep === 'greeting')    setOptions(['Yes, let\'s go!', 'Tell me more']);
    else setOptions([]);

    setTimeout(() => inputRef.current?.focus(), 100);
  }

  function parseAddress(text: string): { street: string; city: string; state: string; zip: string } | null {
    // Parse "123 Main St, Dallas, TX 75201" — state may be a 2-letter code or a
    // full name ("Texas"); normalize it to a 2-letter USPS code for the CRMs.
    const match = text.match(/^(.+?),\s*(.+?),\s*([A-Za-z .]+?)\s+(\d{5})(?:-\d{4})?$/);
    if (match) return { street: match[1].trim(), city: match[2].trim(), state: toStateCode(match[3]), zip: match[4] };
    // Fallback: just store the whole thing as street
    return { street: text, city: '', state: '', zip: '' };
  }

  function advanceStep(userText: string, currentStep: Step, currentData: ChatData): [Step, ChatData] {
    const next = STEP_ORDER[STEP_ORDER.indexOf(currentStep) + 1] as Step;
    const newData = { ...currentData };

    switch (currentStep) {
      case 'greeting':   break;
      case 'firstName':  newData.firstName  = userText; break;
      case 'lastName':   newData.lastName   = userText; break;
      case 'debtAmount': newData.debtAmount  = userText; break;
      case 'monthlyPayment': newData.monthlyPayment = userText; break;
      case 'loanAmount': newData.loanAmount  = userText; break;
      case 'creditScore':newData.creditScore = userText; break;
      case 'loanPurpose':newData.loanPurpose = userText; break;
      case 'address': {
        const addr = parseAddress(userText);
        if (addr) {
          newData.streetAddress = addr.street;
          newData.city = addr.city;
          newData.state = addr.state;
          newData.zipCode = addr.zip;
        }
        break;
      }
      case 'email':      newData.email       = userText; break;
      case 'phone':      newData.phone       = userText; break;
      case 'verifyCode': break;
    }

    return [next, newData];
  }

  async function handleSend(value?: string) {
    const text = (value ?? input).trim();
    if (!text || sending || validating) return;
    setInput('');
    setOptions([]);

    // Client-side validation before accepting the answer
    if (step === 'email' && !isValidEmail(text)) {
      setMessages(prev => [...prev,
        { role: 'user', text },
        { role: 'bot', text: "Hmm, that doesn't look like a valid email address. Could you double-check and try again? 📧" },
      ]);
      return;
    }

    if (step === 'phone') {
      if (!isValidUSPhone(text)) {
        setMessages(prev => [...prev,
          { role: 'user', text },
          { role: 'bot', text: "That doesn't look like a valid US mobile number. Please enter a 10-digit number (e.g. 555-123-4567)." },
        ]);
        return;
      }

      setMessages(prev => [...prev, { role: 'user', text }]);
      setValidating(true);

      try {
        const r = await fetch('/api/loans/verify-phone', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: text }),
        });
        const result = await r.json();
        setValidating(false);

        if (!r.ok) {
          const msg = result.lineType === 'landline'
            ? "It looks like that's a landline number. We need a mobile number to send you a verification text. Could you enter your cell phone number instead?"
            : result.error || "That doesn't appear to be a valid phone number. Could you double-check and try again?";
          setMessages(prev => [...prev, { role: 'bot', text: msg }]);
          return;
        }

        const newData = { ...data, phone: text };
        setData(newData);
        scheduleAbandonedLead(newData);
        setSending(true);
        await new Promise(r => setTimeout(r, 600));
        appendBot('verifyCode', newData);
        setSending(false);
      } catch {
        setValidating(false);
        setMessages(prev => [...prev, { role: 'bot', text: "Something went wrong sending the verification code. Please try again." }]);
      }
      return;
    }

    if (step === 'verifyCode') {
      const code = text.replace(/\D/g, '');
      if (code.length !== 6) {
        setMessages(prev => [...prev,
          { role: 'user', text },
          { role: 'bot', text: "Please enter the 6-digit code we sent to your phone." },
        ]);
        return;
      }

      setMessages(prev => [...prev, { role: 'user', text }]);
      setValidating(true);

      try {
        const r = await fetch('/api/loans/verify-phone', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: data.phone, code }),
        });
        const result = await r.json();
        setValidating(false);

        if (!r.ok || !result.verified) {
          setMessages(prev => [...prev, { role: 'bot', text: result.error || "That code didn't match. Please try again or request a new one." }]);
          return;
        }

        cancelAbandoned(); // completed — suppress the pending abandoned-lead alert
        setSending(true);
        await new Promise(r => setTimeout(r, 600));
        appendBot('done', data);
        // Shared id so the browser pixel Lead and server CAPI Lead dedupe into one.
        const metaEventId = newEventId();
        fetch('/api/loans/chat-submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...data, metaEventId }),
        }).catch(() => {});
        if (typeof window !== 'undefined' && typeof (window as any).fbq === 'function') {
          (window as any).fbq('track', 'Lead', {}, { eventID: metaEventId });
        }
        setSending(false);
      } catch {
        setValidating(false);
        setMessages(prev => [...prev, { role: 'bot', text: "Something went wrong verifying your code. Please try again." }]);
      }
      return;
    }

    setMessages(prev => [...prev, { role: 'user', text }]);

    const [nextStep, newData] = advanceStep(text, step, data);
    setData(newData);

    setSending(true);
    await new Promise(r => setTimeout(r, 600)); // brief typing delay

    if (nextStep === 'done') {
      appendBot('done', newData);
      fetch('/api/loans/chat-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData),
      }).catch(() => {});
    } else {
      appendBot(nextStep, newData);
    }

    setSending(false);
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => open ? setOpen(false) : openChat()}
        aria-label="Chat with us"
        className="fixed bottom-6 z-50 w-14 h-14 rounded-full text-white flex items-center justify-center shadow-lg transition-transform duration-200 hover:scale-105"
        style={{ [side]: '1.5rem', background: 'linear-gradient(135deg, #2b7cff, #30a2ff)', boxShadow: '0 4px 20px rgba(43,124,255,0.45)' }}
      >
        {open ? (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
        {!open && !hasOpened && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] flex items-center justify-center font-bold">1</span>
        )}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 z-50 w-80 sm:w-96 rounded-2xl overflow-hidden flex flex-col"
          style={{ [side]: '1.5rem', height: '480px', boxShadow: '0 8px 40px rgba(0,0,0,0.18)', border: '1px solid #e0ecf8' }}>

          {/* Header */}
          <div style={{ background: 'linear-gradient(135deg, #0d1b2a, #1a3d6b)' }} className="px-5 py-4 flex items-center space-x-3 flex-shrink-0">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,#2b7cff,#30a2ff)' }}>A</div>
            <div>
              <p className="text-white font-semibold text-sm leading-none">Alex</p>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.55)' }}>BrightPath Finance Guide</p>
            </div>
            <div className="ml-auto flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-green-400"></span>
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>Online</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-white">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'text-white rounded-br-sm'
                    : 'rounded-bl-sm'
                }`}
                  style={m.role === 'user'
                    ? { background: 'linear-gradient(135deg,#2b7cff,#30a2ff)', color: '#fff' }
                    : { background: '#f0f7ff', color: '#0d1b2a', border: '1px solid #ddeeff' }}>
                  {m.text}
                </div>
              </div>
            ))}
            {(sending || validating) && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-sm px-4 py-3" style={{ background: '#f0f7ff', border: '1px solid #ddeeff' }}>
                  <span className="flex space-x-1">
                    {[0,1,2].map(i => (
                      <span key={i} className="w-2 h-2 rounded-full animate-bounce" style={{ background: '#2b7cff', animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick replies */}
          {showOptions.length > 0 && (
            <div className="px-3 py-2 flex flex-wrap gap-2 bg-white" style={{ borderTop: '1px solid #f0f0f0' }}>
              {showOptions.map(opt => (
                <button key={opt} onClick={() => handleSend(opt)}
                  className="text-xs px-3 py-1.5 rounded-full font-medium transition-colors hover:text-white"
                  style={{ border: '1.5px solid #2b7cff', color: '#2b7cff', background: 'transparent' }}
                  onMouseEnter={e => { (e.target as HTMLElement).style.background = '#2b7cff'; (e.target as HTMLElement).style.color = '#fff'; }}
                  onMouseLeave={e => { (e.target as HTMLElement).style.background = 'transparent'; (e.target as HTMLElement).style.color = '#2b7cff'; }}>
                  {opt}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          {step !== 'done' && (
            <div className="px-3 py-3 bg-white flex items-center space-x-2 flex-shrink-0" style={{ borderTop: '1px solid #e9ecef' }}>
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder={step === 'address' ? 'Street, City, ST ZIP' : step === 'email' ? 'you@email.com' : step === 'phone' ? '(555) 123-4567' : step === 'verifyCode' ? '6-digit code' : 'Type your answer…'}
                className="flex-1 text-sm px-4 py-2.5 rounded-xl outline-none"
                style={{ background: '#f8f9fa', border: '1.5px solid #e9ecef', color: '#0d1b2a' }}
              />
              <button onClick={() => handleSend()} disabled={!input.trim() || sending || validating}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white flex-shrink-0 disabled:opacity-40 transition-opacity"
                style={{ background: 'linear-gradient(135deg,#2b7cff,#30a2ff)' }}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
