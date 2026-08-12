import Head from 'next/head';
import Link from 'next/link';
import { ReactNode } from 'react';
import { APP_FEATURES } from '@/lib/meghan/appFeatures';

interface MeghanShellProps {
  children: ReactNode;
  title?: string;
  description?: string;
  /** Constrain content width; the chat page opts out for a full-width layout. */
  narrow?: boolean;
}

export default function MeghanShell({
  children,
  title = 'MEGHAN | Your AI Vet & Pet-Care Companion',
  description = 'MEGHAN is an empathetic AI veterinary companion: symptom triage, honest "Real Talk" product reviews, community, rescues, and more — all in one pet-care app.',
  narrow = false,
}: MeghanShellProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-emerald-50/60 to-white text-gray-800">
        <header className="sticky top-0 z-40 border-b border-emerald-100 bg-white/90 backdrop-blur">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
            <Link href="/meghan" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-lg shadow-sm">
                🐾
              </span>
              <span className="text-lg font-extrabold tracking-tight text-emerald-900">
                MEGHAN
              </span>
            </Link>

            <div className="hidden items-center gap-6 md:flex">
              {APP_FEATURES.map((f) => (
                <Link
                  key={f.id}
                  href={f.href}
                  className="text-sm font-medium text-gray-600 transition-colors hover:text-emerald-700"
                >
                  {f.name.split(' ')[0]}
                </Link>
              ))}
              <Link
                href="/meghan#chat"
                className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-600"
              >
                Ask MEGHAN
              </Link>
            </div>

            <Link
              href="/meghan#chat"
              className="rounded-full bg-emerald-500 px-3 py-1.5 text-sm font-semibold text-white md:hidden"
            >
              Ask MEGHAN
            </Link>
          </nav>
        </header>

        <main className={narrow ? 'mx-auto max-w-3xl px-4 py-10 sm:px-6' : ''}>
          {children}
        </main>

        <footer className="mt-16 border-t border-emerald-100 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-base">
                    🐾
                  </span>
                  <span className="font-extrabold text-emerald-900">MEGHAN</span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-gray-500">
                  Your empathetic AI vet companion for everyday pet-care questions,
                  honest product talk, and a community that gets it.
                </p>
              </div>
              <div className="md:col-span-2">
                <h4 className="mb-3 text-sm font-semibold text-gray-900">Explore the app</h4>
                <ul className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                  {APP_FEATURES.map((f) => (
                    <li key={f.id}>
                      <Link href={f.href} className="hover:text-emerald-700">
                        {f.icon} {f.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="mb-3 text-sm font-semibold text-gray-900">Get started</h4>
                <Link
                  href="/meghan#chat"
                  className="inline-block rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600"
                >
                  Chat with MEGHAN
                </Link>
              </div>
            </div>

            <div className="mt-8 border-t border-gray-100 pt-6 text-center text-xs leading-relaxed text-gray-400">
              <p className="mx-auto max-w-3xl">
                MEGHAN is an AI assistant and <strong>not a substitute for a licensed
                veterinarian</strong> or a hands-on physical exam. In an emergency, contact
                your nearest emergency vet immediately. For suspected poisoning, call the
                ASPCA Animal Poison Control Center at (888) 426-4435.
              </p>
              <p className="mt-3">&copy; {new Date().getFullYear()} MEGHAN Pet Care.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
