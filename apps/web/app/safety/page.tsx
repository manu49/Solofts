'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Shield, AlertTriangle, Info } from 'lucide-react'
import { safetyColor, safetyLabel } from '@/lib/utils'

const CITIES = [
  { city: 'Kyoto', country: 'Japan', avg_safety: 9.6, avg_transport: 9.8, avg_accommodation: 9.4, avg_nighttime: 9.2, report_count: 412 },
  { city: 'Tbilisi', country: 'Georgia', avg_safety: 9.1, avg_transport: 8.7, avg_accommodation: 9.3, avg_nighttime: 8.8, report_count: 177 },
  { city: 'Lisbon', country: 'Portugal', avg_safety: 8.9, avg_transport: 9.0, avg_accommodation: 8.7, avg_nighttime: 8.5, report_count: 318 },
  { city: 'Reykjavik', country: 'Iceland', avg_safety: 9.7, avg_transport: 8.9, avg_accommodation: 9.5, avg_nighttime: 9.6, report_count: 143 },
  { city: 'Tokyo', country: 'Japan', avg_safety: 9.4, avg_transport: 9.9, avg_accommodation: 9.2, avg_nighttime: 9.0, report_count: 534 },
  { city: 'Oaxaca', country: 'Mexico', avg_safety: 8.2, avg_transport: 7.8, avg_accommodation: 8.5, avg_nighttime: 7.9, report_count: 201 },
  { city: 'Copenhagen', country: 'Denmark', avg_safety: 9.3, avg_transport: 9.5, avg_accommodation: 9.1, avg_nighttime: 9.0, report_count: 198 },
  { city: 'Chiang Mai', country: 'Thailand', avg_safety: 8.5, avg_transport: 8.0, avg_accommodation: 8.8, avg_nighttime: 8.2, report_count: 289 },
  { city: 'Medellín', country: 'Colombia', avg_safety: 7.2, avg_transport: 7.5, avg_accommodation: 7.8, avg_nighttime: 6.8, report_count: 156 },
  { city: 'Marrakech', country: 'Morocco', avg_safety: 6.9, avg_transport: 7.1, avg_accommodation: 7.4, avg_nighttime: 6.4, report_count: 203 },
  { city: 'New York', country: 'USA', avg_safety: 7.8, avg_transport: 8.5, avg_accommodation: 7.2, avg_nighttime: 7.5, report_count: 467 },
  { city: 'Vienna', country: 'Austria', avg_safety: 9.2, avg_transport: 9.6, avg_accommodation: 9.0, avg_nighttime: 8.9, report_count: 211 },
]

export default function SafetyPage() {
  const [selected, setSelected] = useState<typeof CITIES[0] | null>(null)
  const [sortBy, setSortBy] = useState<'avg_safety' | 'report_count'>('avg_safety')

  const sorted = [...CITIES].sort((a, b) => b[sortBy] - a[sortBy])

  return (
    <div className="min-h-screen" style={{ background: 'var(--ink)' }}>
      <div className="px-8 pt-28 pb-12 relative"
        style={{ background: 'linear-gradient(to bottom,rgba(91,196,209,0.08),transparent)' }}>
        <Link href="/" className="text-xs tracking-widest uppercase mb-8 block" style={{ color: 'var(--sky)' }}>← Back</Link>
        <div className="text-xs tracking-widest uppercase mb-3" style={{ color: 'var(--sky)' }}>Crowdsourced Data</div>
        <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(50px,7vw,96px)', lineHeight: 0.95 }}>
          SAFETY<br /><span style={{ color: 'var(--sky)' }}>INTELLIGENCE</span>
        </h1>
        <p className="mt-4 max-w-lg text-base leading-loose" style={{ color: 'rgba(255,248,240,0.55)' }}>
          Safety scores built from real women's lived experience — not government travel advisories.
          Neighborhood-level, updated continuously.
        </p>
        <div className="mt-4 flex items-center gap-2 text-xs" style={{ color: 'rgba(255,248,240,0.35)' }}>
          <Info size={12} />
          All scores are crowdsourced community data. Always research your specific destination thoroughly.
        </div>
      </div>

      {/* Score legend */}
      <div className="px-8 py-5 flex flex-wrap gap-6"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
        <div className="max-w-6xl mx-auto w-full flex flex-wrap gap-6 items-center">
          <span className="text-xs tracking-widest uppercase" style={{ color: 'rgba(255,248,240,0.35)' }}>Score Guide:</span>
          {[
            { label: '8-10 Very Safe', color: '#7DBB8A' },
            { label: '6-8 Generally Safe', color: '#FFB830' },
            { label: '4-6 Use Caution', color: '#FF4D4D' },
          ].map(g => (
            <div key={g.label} className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full" style={{ background: g.color }} />
              <span style={{ color: 'rgba(255,248,240,0.55)' }}>{g.label}</span>
            </div>
          ))}
          <div className="ml-auto flex gap-2">
            {(['avg_safety', 'report_count'] as const).map(s => (
              <button key={s} onClick={() => setSortBy(s)}
                className="px-3 py-1.5 text-xs tracking-wider uppercase transition-all"
                style={{
                  background: sortBy === s ? 'var(--sky)' : 'transparent',
                  color: sortBy === s ? 'var(--ink)' : 'rgba(255,248,240,0.5)',
                  border: `1px solid ${sortBy === s ? 'var(--sky)' : 'rgba(255,255,255,0.12)'}`,
                }}>
                {s === 'avg_safety' ? 'By Score' : 'By Reports'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cities grid + detail */}
      <div className="max-w-6xl mx-auto px-8 py-12 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {sorted.map(city => (
            <button key={`${city.city}-${city.country}`}
              onClick={() => setSelected(city)}
              className="p-5 text-left transition-all duration-200 hover:-translate-y-0.5 group"
              style={{
                background: selected?.city === city.city ? 'rgba(91,196,209,0.08)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${selected?.city === city.city ? 'rgba(91,196,209,0.4)' : 'rgba(255,255,255,0.07)'}`,
              }}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 22, letterSpacing: 1 }}>{city.city}</div>
                  <div className="text-xs" style={{ color: 'rgba(255,248,240,0.4)' }}>{city.country}</div>
                </div>
                <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 32, color: safetyColor(city.avg_safety) }}>
                  {city.avg_safety}
                </div>
              </div>
              <div className="h-1 rounded-full mb-2" style={{ background: 'rgba(255,255,255,0.07)' }}>
                <div className="h-full rounded-full transition-all"
                  style={{ width: `${city.avg_safety * 10}%`, background: safetyColor(city.avg_safety) }} />
              </div>
              <div className="flex justify-between text-xs" style={{ color: 'rgba(255,248,240,0.35)' }}>
                <span>{safetyLabel(city.avg_safety)}</span>
                <span>{city.report_count} reports</span>
              </div>
            </button>
          ))}
        </div>

        {/* Detail panel */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 p-6"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            {selected ? (
              <>
                <div className="text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--sky)' }}>
                  Safety Breakdown
                </div>
                <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 36 }}>{selected.city}</div>
                <div className="text-sm mb-6" style={{ color: 'rgba(255,248,240,0.45)' }}>{selected.country}</div>

                {[
                  { label: 'Overall Safety', score: selected.avg_safety },
                  { label: 'Public Transport', score: selected.avg_transport },
                  { label: 'Accommodation', score: selected.avg_accommodation },
                  { label: 'Nighttime Safety', score: selected.avg_nighttime },
                ].map(item => (
                  <div key={item.label} className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span style={{ color: 'rgba(255,248,240,0.65)' }}>{item.label}</span>
                      <span style={{ color: safetyColor(item.score), fontWeight: 600 }}>{item.score}/10</span>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.07)' }}>
                      <div className="h-full rounded-full"
                        style={{ width: `${item.score * 10}%`, background: safetyColor(item.score) }} />
                    </div>
                  </div>
                ))}

                <div className="mt-6 p-3 rounded-sm text-xs"
                  style={{ background: 'rgba(255,184,48,0.08)', border: '1px solid rgba(255,184,48,0.2)', color: 'rgba(255,248,240,0.6)' }}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Shield size={11} style={{ color: 'var(--gold)' }} />
                    <span style={{ color: 'var(--gold)' }}>Based on {selected.report_count} community reports</span>
                  </div>
                  Always verify with current travel advisories and your own research.
                </div>
              </>
            ) : (
              <div className="text-center py-10" style={{ color: 'rgba(255,248,240,0.3)' }}>
                <Shield size={32} className="mx-auto mb-3 opacity-30" />
                <div className="text-sm">Click a city to see the full safety breakdown</div>
              </div>
            )}
          </div>

          {/* Submit report CTA */}
          <div className="mt-4 p-5 text-center"
            style={{ background: 'rgba(255,77,77,0.06)', border: '1px solid rgba(255,77,77,0.15)' }}>
            <div className="text-sm font-medium mb-2">Been there recently?</div>
            <p className="text-xs mb-4" style={{ color: 'rgba(255,248,240,0.45)' }}>
              Your experience helps every woman after you.
            </p>
            <Link href="/auth/login"
              className="inline-block px-5 py-2.5 text-xs tracking-widest uppercase transition-all hover:-translate-y-0.5"
              style={{ background: 'var(--coral)', color: 'white' }}>
              Submit Safety Report
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
