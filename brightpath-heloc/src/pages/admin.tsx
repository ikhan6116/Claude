'use client'

import { useState } from 'react'
import { NextSeo } from 'next-seo'
import Link from 'next/link'

type CampaignResult = {
  campaignId: string
  adSetId: string
  adCreativeId: string
  adId: string
}

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function AdminPage() {
  const [secret, setSecret] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const [authError, setAuthError] = useState('')

  const [campaignStatus, setCampaignStatus] = useState<Status>('idle')
  const [campaignResult, setCampaignResult] = useState<CampaignResult | null>(null)
  const [campaignError, setCampaignError] = useState('')

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault()
    if (!secret.trim()) {
      setAuthError('Please enter the admin secret.')
      return
    }
    setUnlocked(true)
    setAuthError('')
  }

  const handleLaunchCampaign = async () => {
    setCampaignStatus('loading')
    setCampaignError('')
    setCampaignResult(null)

    try {
      const res = await fetch('/api/launch-campaign', {
        method: 'POST',
        headers: { 'x-admin-secret': secret },
      })
      const json = await res.json() as { success: boolean; result?: CampaignResult; message?: string }

      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Launch failed')
      }

      setCampaignResult(json.result ?? null)
      setCampaignStatus('success')
    } catch (err) {
      setCampaignError(err instanceof Error ? err.message : 'Unknown error')
      setCampaignStatus('error')
    }
  }

  if (!unlocked) {
    return (
      <>
        <NextSeo title="Admin — BrightPath Finance" noindex={true} />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-sm border border-brand-gray-light p-8 w-full max-w-sm">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-brand-blue flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <span className="font-bold text-brand-navy">BrightPath Admin</span>
            </div>
            <form onSubmit={handleUnlock} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-brand-navy mb-1">Admin Secret</label>
                <input
                  type="password"
                  value={secret}
                  onChange={(e) => setSecret(e.target.value)}
                  placeholder="Enter admin secret"
                  className="w-full border border-brand-gray-light rounded-xl px-4 py-3 text-brand-gray focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
                {authError && <p className="mt-1 text-sm text-red-500">{authError}</p>}
              </div>
              <button
                type="submit"
                className="w-full bg-brand-blue hover:bg-brand-blue-light text-white font-semibold py-3 rounded-xl transition-colors"
              >
                Unlock
              </button>
            </form>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <NextSeo title="Admin — BrightPath Finance" noindex={true} />

      <header className="bg-brand-navy shadow-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-brand-blue flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <span className="text-white font-bold text-base">
              BrightPath <span className="text-brand-blue-accent">Finance</span>
            </span>
          </Link>
          <span className="text-xs text-gray-400 bg-brand-navy border border-gray-700 px-3 py-1 rounded-full">
            Admin Panel
          </span>
        </div>
      </header>

      <div className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-3xl mx-auto space-y-6">

          {/* Meta Ads Campaign Launcher */}
          <div className="bg-white rounded-2xl border border-brand-gray-light p-6 md:p-8 shadow-sm">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-brand-navy">Meta Ads Campaign</h2>
                <p className="text-sm text-brand-gray mt-1">
                  Launches a Business HELOC lead campaign on Facebook & Instagram.
                  All objects are created in <span className="font-medium text-orange-600">PAUSED</span> state
                  — review in Meta Ads Manager before activating.
                </p>
              </div>
              <div className="flex-shrink-0 ml-4 w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <svg className="w-5 h-5 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
              </div>
            </div>

            {/* Campaign spec summary */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6 text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-brand-gray">Daily Budget</span>
                <span className="font-semibold text-brand-navy">$20.00 / day</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-gray">Objective</span>
                <span className="font-semibold text-brand-navy">Lead Generation</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-gray">Ad Category</span>
                <span className="font-semibold text-brand-navy">Credit (Special)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-gray">Targeting</span>
                <span className="font-semibold text-brand-navy">US (excl. 15 states), Ages 30–65</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-gray">Excluded States</span>
                <span className="font-semibold text-brand-navy text-right max-w-xs">CA, GA, HI, ID, MI, MN, NV, NJ, ND, OR, SD, UT, VT, VA, WV</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-gray">Landing Page</span>
                <span className="font-semibold text-brand-navy">heloc.brightpath-fin.com/apply</span>
              </div>
            </div>

            <button
              onClick={handleLaunchCampaign}
              disabled={campaignStatus === 'loading' || campaignStatus === 'success'}
              className="flex items-center gap-2 bg-brand-blue hover:bg-brand-blue-light disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-xl transition-colors shadow-md text-sm"
            >
              {campaignStatus === 'loading' ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Launching…
                </>
              ) : campaignStatus === 'success' ? (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Campaign Created
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Launch Campaign (Paused)
                </>
              )}
            </button>

            {/* Success result */}
            {campaignStatus === 'success' && campaignResult && (
              <div className="mt-5 bg-green-50 border border-green-200 rounded-xl p-4 text-sm space-y-2">
                <p className="font-semibold text-green-800 mb-3">
                  Campaign created successfully — review and activate in Meta Ads Manager.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    ['Campaign ID', campaignResult.campaignId],
                    ['Ad Set ID', campaignResult.adSetId],
                    ['Creative ID', campaignResult.adCreativeId],
                    ['Ad ID', campaignResult.adId],
                  ].map(([label, value]) => (
                    <div key={label} className="bg-white rounded-lg px-3 py-2 border border-green-100">
                      <p className="text-xs text-gray-400">{label}</p>
                      <p className="font-mono text-brand-navy text-xs mt-0.5 break-all">{value}</p>
                    </div>
                  ))}
                </div>
                <a
                  href="https://adsmanager.facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-brand-blue hover:text-brand-blue-light text-sm font-medium mt-2"
                >
                  Open Meta Ads Manager →
                </a>
              </div>
            )}

            {/* Error */}
            {campaignStatus === 'error' && (
              <div className="mt-5 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600">
                <strong>Error:</strong> {campaignError}
              </div>
            )}
          </div>

          {/* Quick links */}
          <div className="bg-white rounded-2xl border border-brand-gray-light p-6 shadow-sm">
            <h2 className="text-lg font-bold text-brand-navy mb-4">Quick Links</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              {[
                { label: 'Live Site', href: 'https://heloc.brightpath-fin.com', external: true },
                { label: 'Application Form', href: 'https://heloc.brightpath-fin.com/apply', external: true },
                { label: 'Meta Ads Manager', href: 'https://adsmanager.facebook.com', external: true },
                { label: 'Follow Up Boss', href: 'https://app.followupboss.com', external: true },
                { label: 'Vercel Dashboard', href: 'https://vercel.com/dashboard', external: true },
                { label: 'Back to Home', href: '/', external: false },
              ].map((link) => (
                link.external ? (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between border border-brand-gray-light rounded-xl px-4 py-3 text-brand-gray hover:border-brand-blue hover:text-brand-blue transition-colors"
                  >
                    {link.label}
                    <svg className="w-3.5 h-3.5 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="flex items-center justify-between border border-brand-gray-light rounded-xl px-4 py-3 text-brand-gray hover:border-brand-blue hover:text-brand-blue transition-colors"
                  >
                    {link.label}
                  </Link>
                )
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
