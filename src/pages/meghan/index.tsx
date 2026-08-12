import Link from 'next/link';
import MeghanShell from '@/components/meghan/MeghanShell';
import MeghanChat from '@/components/meghan/MeghanChat';
import { APP_FEATURES } from '@/lib/meghan/appFeatures';

export default function MeghanHome() {
  return (
    <MeghanShell>
      {/* Hero + chat */}
      <section className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 lg:pt-14">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
              🐾 Meet MEGHAN
            </span>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-emerald-950 sm:text-5xl">
              Your empathetic AI vet, available 24/7.
            </h1>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-gray-600">
              Symptom triage, honest <strong>&ldquo;Real Talk&rdquo;</strong> reviews of pet
              products and supplements, and a whole community behind you — MEGHAN helps you make
              calm, confident decisions for the pet you love.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="#chat"
                className="rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-600"
              >
                Chat with MEGHAN
              </Link>
              <Link
                href="/meghan/community"
                className="rounded-full border border-emerald-200 bg-white px-6 py-3 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-50"
              >
                Explore the community
              </Link>
            </div>
            <p className="mt-4 text-xs text-gray-400">
              Not a substitute for a licensed vet. In an emergency, go to your nearest animal ER.
            </p>
          </div>

          <div id="chat" className="scroll-mt-24">
            <MeghanChat />
          </div>
        </div>
      </section>

      {/* What MEGHAN does */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-center text-2xl font-bold text-emerald-950">
          More than a chatbot — your pet-care home base
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-center text-gray-600">
          MEGHAN connects your questions to everything else the app offers.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {APP_FEATURES.map((f) => (
            <Link
              key={f.id}
              href={f.href}
              className="group rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-2xl">
                {f.icon}
              </div>
              <h3 className="mt-3 font-bold text-emerald-950">{f.name}</h3>
              <p className="mt-1 text-sm leading-relaxed text-gray-500">{f.description}</p>
              <span className="mt-3 inline-block text-sm font-semibold text-emerald-600 group-hover:text-emerald-700">
                Explore →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Trust / how it works */}
      <section className="border-y border-emerald-100 bg-emerald-50/50">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-14 sm:px-6 md:grid-cols-3">
          {[
            {
              icon: '🩺',
              title: 'Safety first',
              body: "MEGHAN spots red-flag symptoms and tells you plainly when it's time for the emergency vet — no burying the lede.",
            },
            {
              icon: '💬',
              title: 'Honest "Real Talk"',
              body: 'Evidence-based veterinary guidance, plus a candid read on what real pet owners say about a product online.',
            },
            {
              icon: '❤️',
              title: 'Warm & judgment-free',
              body: 'Anxious about your pet? MEGHAN meets you with empathy first, then clear, practical next steps.',
            },
          ].map((item) => (
            <div key={item.title} className="text-center md:text-left">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white text-2xl shadow-sm md:mx-0">
                {item.icon}
              </div>
              <h3 className="mt-3 font-bold text-emerald-950">{item.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-gray-600">{item.body}</p>
            </div>
          ))}
        </div>
      </section>
    </MeghanShell>
  );
}
