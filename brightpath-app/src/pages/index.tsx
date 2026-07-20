import { NextSeo } from 'next-seo'

// Placeholder landing page for app.brightpath-fin.com.
// The Claude artifact content will replace this page once provided.
export default function Home() {
  return (
    <>
      <NextSeo title="Coming Soon" />
      <main className="flex min-h-screen flex-col items-center justify-center bg-brand-navy px-6 text-center">
        <h1 className="text-4xl font-bold text-white sm:text-5xl">
          BrightPath <span className="text-brand-blue">Finance</span>
        </h1>
        <p className="mt-4 max-w-md text-lg text-brand-gray-light">
          Something new is on the way. Check back soon.
        </p>
      </main>
    </>
  )
}
