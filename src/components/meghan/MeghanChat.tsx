import { useCallback, useEffect, useRef, useState } from 'react';
import Markdown from './Markdown';
import type { ChatMessage } from '@/lib/meghan/types';

const SUGGESTIONS: string[] = [
  "My golden retriever has a hot spot that won't heal — does that holistic TikTok spray actually work?",
  "My cat has been sneezing for two days. Should I worry?",
  "What's the real deal on glucosamine joint supplements for senior dogs?",
  "I just lost my dog and I'm devastated. 💔",
];

const GREETING: ChatMessage = {
  role: 'assistant',
  content:
    "Hi, I'm **MEGHAN** — think of me as your friendly vet tech in your pocket. 🐾\n\nTell me what's going on with your pet and I'll help you figure out the next step. I can talk through symptoms, give you the honest **\"Real Talk\"** on products and supplements, and point you to the right corner of the app.\n\nWhat can I help you with today?",
};

function EmergencyBanner() {
  return (
    <div
      role="alert"
      className="mb-4 rounded-xl border-2 border-red-500 bg-red-50 p-4 shadow-sm"
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl" aria-hidden>
          🚨
        </span>
        <div>
          <p className="text-base font-extrabold uppercase tracking-wide text-red-700">
            This may be an emergency
          </p>
          <p className="mt-1 text-sm leading-relaxed text-red-800">
            Based on what you described, your pet may need to be seen{' '}
            <strong>right now</strong>. Please contact your nearest{' '}
            <strong>emergency vet</strong> immediately. If you suspect poisoning, call the{' '}
            <strong>ASPCA Animal Poison Control Center at (888)&nbsp;426-4435</strong> or the{' '}
            <strong>Pet Poison Helpline at (855)&nbsp;764-7661</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 py-1" aria-label="MEGHAN is typing">
      <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-400 [animation-delay:-0.3s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-400 [animation-delay:-0.15s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-400" />
    </span>
  );
}

function Avatar() {
  return (
    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500 text-base shadow-sm">
      🐾
    </span>
  );
}

export default function MeghanChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [emergency, setEmergency] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      setError(null);
      setEmergency(false);
      setInput('');

      // Build the transcript we send to the API (exclude the local greeting).
      const priorTurns = messages.filter((m) => m !== GREETING);
      const userMsg: ChatMessage = { role: 'user', content: trimmed };
      const outgoing = [...priorTurns, userMsg];

      setMessages((prev) => [...prev, userMsg, { role: 'assistant', content: '' }]);
      setLoading(true);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch('/api/meghan/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: outgoing }),
          signal: controller.signal,
        });

        if (res.headers.get('X-Meghan-Emergency') === '1') {
          setEmergency(true);
        }

        if (!res.ok || !res.body) {
          let msg = 'Something went wrong reaching MEGHAN. Please try again.';
          try {
            const data = await res.json();
            if (data?.error) msg = data.error;
          } catch {
            /* non-JSON error body */
          }
          setError(msg);
          setMessages((prev) => prev.slice(0, -1)); // drop empty assistant bubble
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let acc = '';

        // eslint-disable-next-line no-constant-condition
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          acc += decoder.decode(value, { stream: true });
          setMessages((prev) => {
            const copy = prev.slice();
            copy[copy.length - 1] = { role: 'assistant', content: acc };
            return copy;
          });
        }
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setError('Network error — please check your connection and try again.');
          setMessages((prev) =>
            prev[prev.length - 1]?.content === '' ? prev.slice(0, -1) : prev
          );
        }
      } finally {
        setLoading(false);
        abortRef.current = null;
      }
    },
    [loading, messages]
  );

  const stop = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void send(input);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void send(input);
    }
  };

  const showSuggestions = messages.length === 1 && !loading;

  return (
    <div className="flex h-[70vh] min-h-[520px] flex-col overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-emerald-100 bg-emerald-500 px-4 py-3 text-white">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-lg">
          🐾
        </span>
        <div>
          <p className="font-bold leading-tight">MEGHAN</p>
          <p className="text-xs text-emerald-50">AI Veterinary Companion</p>
        </div>
        <span className="ml-auto flex items-center gap-1.5 text-xs text-emerald-50">
          <span className="h-2 w-2 rounded-full bg-emerald-200" />
          Online
        </span>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-5">
        {emergency && <EmergencyBanner />}

        {messages.map((m, idx) => {
          const isUser = m.role === 'user';
          const isLastAssistant = idx === messages.length - 1 && m.role === 'assistant';
          return (
            <div
              key={idx}
              className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              {!isUser && <Avatar />}
              <div
                className={
                  isUser
                    ? 'max-w-[85%] rounded-2xl rounded-tr-sm bg-emerald-500 px-4 py-2.5 text-sm text-white'
                    : 'max-w-[85%] rounded-2xl rounded-tl-sm bg-gray-50 px-4 py-3 text-sm text-gray-800 ring-1 ring-gray-100'
                }
              >
                {isUser ? (
                  <p className="whitespace-pre-wrap">{m.content}</p>
                ) : m.content ? (
                  <Markdown content={m.content} />
                ) : isLastAssistant && loading ? (
                  <TypingDots />
                ) : null}
              </div>
            </div>
          );
        })}

        {error && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-800">
            {error}
          </div>
        )}
      </div>

      {/* Suggestions */}
      {showSuggestions && (
        <div className="border-t border-gray-100 px-4 py-3">
          <p className="mb-2 text-xs font-medium text-gray-400">Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => void send(s)}
                className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-left text-xs text-emerald-800 transition-colors hover:bg-emerald-100"
              >
                {s.length > 60 ? `${s.slice(0, 58)}…` : s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Composer */}
      <form onSubmit={onSubmit} className="border-t border-gray-100 bg-white px-3 py-3">
        <div className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            rows={1}
            placeholder="Describe what's going on with your pet…"
            className="max-h-32 flex-1 resize-none rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          {loading ? (
            <button
              type="button"
              onClick={stop}
              className="rounded-xl bg-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-300"
            >
              Stop
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              className="rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Send
            </button>
          )}
        </div>
        <p className="mt-2 px-1 text-[11px] leading-snug text-gray-400">
          MEGHAN is an AI assistant, not a licensed veterinarian. For emergencies, contact your
          nearest emergency vet right away.
        </p>
      </form>
    </div>
  );
}
