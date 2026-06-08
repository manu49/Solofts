'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Loader2, MapPin, Clock, DollarSign, AlertTriangle, Compass } from 'lucide-react'

type FormData = {
  destination: string
  days: string
  budget: string
  pto: string
  risk: string
  fitness: string
  interests: string[]
}

type Itinerary = {
  destination: string
  summary: string
  days: Array<{
    day: number
    title: string
    activities: string[]
    accommodation: string
    food: string
    safety_note?: string
    estimated_cost: number
  }>
  total_cost: number
  packing_tips: string[]
  safety_summary: string
}

const INTERESTS = ['Hiking', 'Food', 'Culture', 'Photography', 'Adventure', 'Relaxation', 'History', 'Nightlife', 'Nature']

// Mock AI response for demo — replace with real Anthropic API call
const MOCK_ITINERARY: Itinerary = {
  destination: 'Kyoto, Japan',
  summary: 'A perfectly paced solo trip balancing iconic temples, hidden alleys, and genuine local culture. Designed for a career woman with limited PTO who wants depth over breadth.',
  days: [
    {
      day: 1,
      title: 'Arrival & Gion Quarter',
      activities: ['Land at KIX, take Haruka Express to Kyoto Station', 'Check into hotel, freshen up', 'Walk Gion at sunset — lowest tourist density of the day', 'Dinner at Nishiki Market food stalls'],
      accommodation: 'Hotel Granvia Kyoto (station location = efficient travel)',
      food: 'Nishiki Market street food (~$15)',
      safety_note: 'Gion is extremely safe. Watch for rickshaw traffic.',
      estimated_cost: 180,
    },
    {
      day: 2,
      title: 'Arashiyama & Bamboo Grove',
      activities: ['7am: Bamboo Grove before crowds arrive', 'Tenryu-ji garden', 'Rentals: bike along the river', 'Afternoon: Monkey Park for views', 'Evening: Soak at local sento'],
      accommodation: 'Same hotel',
      food: 'Tofu kaiseki lunch ($25), casual ramen dinner ($12)',
      estimated_cost: 95,
    },
    {
      day: 3,
      title: 'Fushimi Inari & Free Afternoon',
      activities: ['6am: Fushimi Inari — hike the full trail before tour groups arrive', 'Solo summit moment at the top', 'Afternoon: Nishiki Market shopping', 'Sake tasting at local brewery'],
      accommodation: 'Same hotel',
      food: 'Convenience store onigiri ($3), izakaya dinner ($30)',
      safety_note: 'Inari trail is well-lit and populated. Bring water.',
      estimated_cost: 85,
    },
  ],
  total_cost: 360,
  packing_tips: [
    'IC card (Suica/ICOCA) loaded with ¥5000 — covers all trains and convenience stores',
    'Portable WiFi or SIM — essential for Google Maps navigation',
    'Compression socks for long flights',
    'Small daypack that fits in coin lockers (400-500 yen)',
  ],
  safety_summary: 'Kyoto is one of the safest solo travel destinations globally (9.6/10 community score). Nighttime transport is excellent. Women solo travelers report feeling completely at ease.',
}

export default function PlanPage() {
  const [step, setStep] = useState<'form' | 'loading' | 'result'>('form')
  const [form, setForm] = useState<FormData>({
    destination: '', days: '7', budget: '2000', pto: '7',
    risk: 'low', fitness: 'moderate', interests: [],
  })
  const [itinerary, setItinerary] = useState<Itinerary | null>(null)

  const toggleInterest = (i: string) => {
    setForm(f => ({
      ...f,
      interests: f.interests.includes(i) ? f.interests.filter(x => x !== i) : [...f.interests, i],
    }))
  }

  const handleSubmit = async () => {
    setStep('loading')
    // Simulate API call — in production, call /api/plan with form data → Anthropic API
    await new Promise(r => setTimeout(r, 2500))
    setItinerary({ ...MOCK_ITINERARY, destination: form.destination || 'Kyoto, Japan' })
    setStep('result')
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--ink)' }}>
      <div className="px-8 pt-28 pb-12"
        style={{ background: 'linear-gradient(to bottom,rgba(125,187,138,0.08),transparent)' }}>
        <Link href="/" className="text-xs tracking-widest uppercase mb-8 block" style={{ color: 'var(--sage)' }}>← Back</Link>
        <div className="text-xs tracking-widest uppercase mb-3" style={{ color: 'var(--sage)' }}>AI-Powered</div>
        <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(50px,7vw,96px)', lineHeight: 0.95 }}>
          TRIP<br /><span style={{ color: 'var(--sage)' }}>ARCHITECT</span>
        </h1>
        <p className="mt-4 max-w-lg text-base leading-loose" style={{ color: 'rgba(255,248,240,0.55)' }}>
          Tell us your constraints. We'll build the trip. Optimized for solo women, safety-scored routing, and your actual life.
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-8 py-12">
        {step === 'form' && (
          <div className="space-y-6">
            {/* Destination */}
            <div>
              <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'rgba(255,248,240,0.5)' }}>
                Where do you want to go?
              </label>
              <input className="w-full px-4 py-3 text-base bg-transparent border focus:outline-none focus:border-sage-400 transition-colors"
                style={{ borderColor: 'rgba(255,255,255,0.15)', color: 'var(--cream)' }}
                placeholder="e.g. Japan, Patagonia, Morocco, Iceland..."
                value={form.destination}
                onChange={e => setForm(f => ({ ...f, destination: e.target.value }))} />
            </div>

            {/* Trip params */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { key: 'days', label: '# of Days', placeholder: '7', icon: Clock },
                { key: 'budget', label: 'Budget (USD)', placeholder: '2000', icon: DollarSign },
                { key: 'pto', label: 'PTO Days Used', placeholder: '7', icon: Compass },
              ].map(({ key, label, placeholder, icon: Icon }) => (
                <div key={key}>
                  <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'rgba(255,248,240,0.5)' }}>
                    <Icon size={10} className="inline mr-1" />{label}
                  </label>
                  <input type="number"
                    className="w-full px-4 py-3 text-base bg-transparent border focus:outline-none transition-colors"
                    style={{ borderColor: 'rgba(255,255,255,0.15)', color: 'var(--cream)' }}
                    placeholder={placeholder}
                    value={(form as never)[key]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
                </div>
              ))}
            </div>

            {/* Risk + Fitness */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'rgba(255,248,240,0.5)' }}>
                  Risk Comfort
                </label>
                <div className="flex gap-2">
                  {['low', 'medium', 'high'].map(r => (
                    <button key={r} onClick={() => setForm(f => ({ ...f, risk: r }))}
                      className="flex-1 py-2.5 text-xs tracking-widest uppercase transition-all capitalize"
                      style={{
                        background: form.risk === r ? 'var(--coral)' : 'transparent',
                        color: form.risk === r ? 'white' : 'rgba(255,248,240,0.5)',
                        border: `1px solid ${form.risk === r ? 'var(--coral)' : 'rgba(255,255,255,0.12)'}`,
                      }}>
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'rgba(255,248,240,0.5)' }}>
                  Fitness Level
                </label>
                <div className="flex gap-2">
                  {['easy', 'moderate', 'challenging'].map(f => (
                    <button key={f} onClick={() => setForm(ff => ({ ...ff, fitness: f }))}
                      className="flex-1 py-2.5 text-xs tracking-widest uppercase transition-all capitalize"
                      style={{
                        background: form.fitness === f ? 'var(--sage)' : 'transparent',
                        color: form.fitness === f ? 'white' : 'rgba(255,248,240,0.5)',
                        border: `1px solid ${form.fitness === f ? 'var(--sage)' : 'rgba(255,255,255,0.12)'}`,
                      }}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Interests */}
            <div>
              <label className="block text-xs tracking-widest uppercase mb-3" style={{ color: 'rgba(255,248,240,0.5)' }}>
                Interests (pick all that apply)
              </label>
              <div className="flex flex-wrap gap-2">
                {INTERESTS.map(interest => (
                  <button key={interest} onClick={() => toggleInterest(interest)}
                    className="px-4 py-2 text-sm transition-all"
                    style={{
                      background: form.interests.includes(interest) ? 'rgba(125,187,138,0.2)' : 'transparent',
                      color: form.interests.includes(interest) ? 'var(--sage)' : 'rgba(255,248,240,0.5)',
                      border: `1px solid ${form.interests.includes(interest) ? 'var(--sage)' : 'rgba(255,255,255,0.12)'}`,
                    }}>
                    {interest}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={handleSubmit}
              className="w-full py-4 text-sm tracking-widest uppercase font-medium transition-all hover:-translate-y-0.5"
              style={{ background: 'var(--sage)', color: 'white' }}>
              Build My Itinerary →
            </button>
          </div>
        )}

        {step === 'loading' && (
          <div className="text-center py-24">
            <Loader2 size={40} className="mx-auto mb-6 animate-spin" style={{ color: 'var(--sage)' }} />
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 32 }}>Architecting Your Trip...</div>
            <p className="mt-3 text-sm" style={{ color: 'rgba(255,248,240,0.45)' }}>
              Checking safety scores · Optimizing for your PTO · Building day-by-day plan
            </p>
          </div>
        )}

        {step === 'result' && itinerary && (
          <div>
            <button onClick={() => setStep('form')}
              className="text-xs tracking-widest uppercase mb-6 block" style={{ color: 'var(--sage)' }}>
              ← Plan Another Trip
            </button>

            <div className="mb-8 p-6"
              style={{ background: 'rgba(125,187,138,0.08)', border: '1px solid rgba(125,187,138,0.2)' }}>
              <div className="text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--sage)' }}>Your Trip</div>
              <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 42 }}>{itinerary.destination}</h2>
              <p className="mt-2 text-sm leading-loose" style={{ color: 'rgba(255,248,240,0.65)' }}>{itinerary.summary}</p>
              <div className="flex gap-6 mt-4">
                <div className="text-xs" style={{ color: 'rgba(255,248,240,0.45)' }}>
                  <DollarSign size={11} className="inline mr-1" />
                  Est. total: <strong style={{ color: 'var(--gold)' }}>${itinerary.total_cost.toLocaleString()}</strong>
                </div>
                <div className="text-xs" style={{ color: 'rgba(255,248,240,0.45)' }}>
                  <Clock size={11} className="inline mr-1" />
                  {itinerary.days.length} days planned
                </div>
              </div>
            </div>

            {/* Day by day */}
            <div className="space-y-4 mb-8">
              {itinerary.days.map(day => (
                <div key={day.day} className="p-5"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs px-2 py-0.5" style={{ background: 'var(--coral)', color: 'white' }}>
                      Day {day.day}
                    </span>
                    <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 18 }}>{day.title}</h3>
                    <span className="ml-auto text-xs" style={{ color: 'var(--gold)' }}>~${day.estimated_cost}</span>
                  </div>
                  <ul className="space-y-1 mb-3">
                    {day.activities.map((a, i) => (
                      <li key={i} className="flex gap-2 text-sm" style={{ color: 'rgba(255,248,240,0.7)' }}>
                        <span style={{ color: 'var(--coral)' }}>·</span> {a}
                      </li>
                    ))}
                  </ul>
                  <div className="text-xs" style={{ color: 'rgba(255,248,240,0.4)' }}>
                    🏨 {day.accommodation} · 🍜 {day.food}
                  </div>
                  {day.safety_note && (
                    <div className="mt-2 flex items-start gap-1.5 text-xs"
                      style={{ color: 'var(--sky)' }}>
                      <AlertTriangle size={10} className="mt-0.5 flex-shrink-0" /> {day.safety_note}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Safety + Packing */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-5"
                style={{ background: 'rgba(91,196,209,0.06)', border: '1px solid rgba(91,196,209,0.2)' }}>
                <div className="text-xs tracking-widest uppercase mb-3" style={{ color: 'var(--sky)' }}>Safety Summary</div>
                <p className="text-sm leading-loose" style={{ color: 'rgba(255,248,240,0.65)' }}>
                  {itinerary.safety_summary}
                </p>
              </div>
              <div className="p-5"
                style={{ background: 'rgba(255,184,48,0.06)', border: '1px solid rgba(255,184,48,0.2)' }}>
                <div className="text-xs tracking-widest uppercase mb-3" style={{ color: 'var(--gold)' }}>Packing Tips</div>
                <ul className="space-y-1.5">
                  {itinerary.packing_tips.map((tip, i) => (
                    <li key={i} className="flex gap-2 text-sm" style={{ color: 'rgba(255,248,240,0.65)' }}>
                      <span style={{ color: 'var(--gold)' }}>→</span> {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
