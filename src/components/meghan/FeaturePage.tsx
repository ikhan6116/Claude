import Link from 'next/link';
import { ReactNode } from 'react';
import MeghanShell from './MeghanShell';

interface FeaturePageProps {
  icon: string;
  title: string;
  subtitle: string;
  metaTitle?: string;
  metaDescription?: string;
  children: ReactNode;
}

/**
 * Shared layout for MEGHAN's in-app feature sections (Community, Resources,
 * Rescues, Pet-stagram). Keeps a consistent hero + "back to chat" CTA.
 */
export default function FeaturePage({
  icon,
  title,
  subtitle,
  metaTitle,
  metaDescription,
  children,
}: FeaturePageProps) {
  return (
    <MeghanShell title={metaTitle ?? `${title} | MEGHAN`} description={metaDescription ?? subtitle}>
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <header className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-4xl">
            {icon}
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-emerald-950 sm:text-4xl">
            {title}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-lg text-gray-600">{subtitle}</p>
        </header>

        <div className="mt-10">{children}</div>

        <div className="mt-14 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-6 text-center">
          <p className="text-lg font-bold text-emerald-950">Have a question about your pet?</p>
          <p className="mt-1 text-sm text-gray-600">
            MEGHAN can help you triage symptoms and talk through your options.
          </p>
          <Link
            href="/meghan#chat"
            className="mt-4 inline-block rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
          >
            🐾 Chat with MEGHAN
          </Link>
        </div>
      </div>
    </MeghanShell>
  );
}
