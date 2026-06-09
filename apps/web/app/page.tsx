'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowRight, MapPin, Shield, Package, Compass, Users, TrendingUp } from 'lucide-react'

const MARQUEE_ITEMS = [
  '🌿 Solo in Patagonia',
  '✦',
  '🗺️ All 63 National Parks',
  '✦',
  '🌏 SE Asia on $40/day',
  '✦',
  '🚗 Nevada Desert Highway',
  '✦',
  '🕌 Solo in Morocco',
  '✦',
  '💼 Full-time job. Full passport.',
  '✦',
  '🌋 Iceland in winter',
  '✦',
  '🏕️ Grand Canyon rim-to-rim',
  '✦',
]

const FEATURES = [
  {
    icon: Shield,
    color: '#FF4D4D',
    title: 'Safety Intelligence Map',
    desc: 'Crowdsourced safety scores by city — from women\'s lived experience, not government stats. Neighborhood-level, updated in real time.',
    tag: 'Data-Backed',
  },
  {
    icon: Package,
    color: '#FFB830',
    title: 'The Solo Stack',
    desc: 'Community-voted gear rankings. Best action cameras, safety devices, packing cubes — ranked by women who actually use them.',
    tag: 'Crowd-Ranked',
  },
  {
    icon: Compass,
    color: '#7DBB8A',
    title: 'AI Trip Architect',
    desc: 'Input your PTO days, budget, fitness level, and risk comfort. Get a fully optimized solo itinerary with safety-scored routing.',
    tag: 'Premium',
  },
  {
    icon: MapPin,
    color: '#5BC4D1',
    title: 'Verified Story Library',
    desc: 'Filter by profession, budget, trip length. Find women exactly like you who\'ve gone exactly where you want to go.',
    tag: '"Women Like Me"',
  },
  {
    icon: TrendingUp,
    color: '#9B59B6',
    title: 'Trending Intelligence',
    desc: 'Live dashboards showing hottest destinations, rising safety cities, and trending gear — built from community data.',
    tag: 'Live Data',
  },
  {
    icon: Users,
    color: '#FF4D4D',
    title: 'The Encounter Board',
    desc: 'Traveling to Tokyo next month? Find other solo women with overlapping dates for dinners, hikes, or safety check-ins.',
    tag: 'Coordinate',
  },
]

const SAFETY_CITIES = [
  { city: 'Kyoto', country: 'Japan', score: 9.6, reports: 412, color: '#7DBB8A' },
  { city: 'Lisbon', country: 'Portugal', score: 8.9, reports: 318, color: '#5BC4D1' },
  { city: 'Tbilisi', country: 'Georgia', score: 9.1, reports: 177, color: '#7DBB8A' },
  { city: 'Oaxaca', country: 'Mexico', score: 8.2, reports: 201, color: '#FFB830' },
]

const STORIES = [
  {
    tag: 'Wild Solo', tagColor: '#FF4D4D',
    location: '📍 Patagonia, Chile',
    quote: 'Hiked Torres del Paine alone with a torn ACL and a broken Spanish dictionary. Best 9 days of my life.',
    author: 'Riya S.', profession: 'Software Engineer', pto: '11 days PTO',
    initials: 'R', gradient: 'from-coral to-purple',
  },
  {
    tag: 'First Timer', tagColor: '#5BC4D1',
    location: '📍 Kyoto, Japan',
    quote: 'I was 52, never traveled alone in my life. Spent 10 days in Japan. I am a completely different woman now.',
    author: 'Martha L.', profession: 'High School Teacher', pto: '10 days',
    initials: 'M', gradient: 'from-gold to-sage',
  },
  {
    tag: 'Budget Solo', tagColor: '#7DBB8A',
    location: '📍 Morocco → Spain',
    quote: '$1,800. Three weeks. Two countries. People kept asking where my husband was. I said "home, with the dishes."',
    author: 'Tanya W.', profession: 'Nurse', pto: '$1.8K total',
    initials: 'T', gradient: 'from-sky to-purple',
  },
]

export default function HomePage() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)
  const mouse = useRef({ x: 0, y: 0 })
  const ring = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY }
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX - 6}px,${e.clientY - 6}px)`
      }
    }
    const animate = () => {
      ring.current.x += (mouse.current.x - ring.current.x) * 0.12
      ring.current.y += (mouse.current.y - ring.current.y) * 0.12
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x - 18}px,${ring.current.y - 18}px)`
      }
      rafRef.current = requestAnimationFrame(animate)
    }
    document.addEventListener('mousemove', onMove)
    rafRef.current = requestAnimationFrame(animate)
    return () => {
      document.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  // Intersection observer for fade-up
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.fade-up').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS]

  return (
    <>
      {/* Cursor */}
      <div className="cursor" ref={cursorRef} />
      <div className="cursor-ring" ref={ringRef} />

      {/* ── NAV ── */}
      <nav className="fixed top-0 w-full z-50 px-8 py-5 flex items-center justify-between"
        style={{ background: 'linear-gradient(to bottom, rgba(26,26,46,0.95), transparent)' }}>
        <img src="/logo.svg" alt="SOLOFTS" height={44} style={{ height: 44, width: 'auto' }} />
        <div className="hidden md:flex items-center gap-8">
          {['Stories', 'Safety', 'Gear', 'Plan'].map(item => (
            <Link key={item} href={`/${item.toLowerCase()}`}
              className="text-xs tracking-widest uppercase opacity-60 hover:opacity-100 transition-opacity"
              style={{ color: 'var(--cream)' }}>
              {item}
            </Link>
          ))}
        </div>
        <Link href="/auth/login"
          className="btn-clip px-6 py-2.5 text-xs tracking-widest uppercase font-medium transition-all hover:-translate-y-0.5"
          style={{ background: 'var(--coral)', color: 'white' }}>
          Join the Pack
        </Link>
      </nav>

      {/* ── HERO ── */}
      <section className="min-h-screen flex items-center relative overflow-hidden px-8 pt-28 pb-20 grid-bg">
        <div className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 70% 30%, rgba(255,77,77,0.15) 0%,transparent 60%),
              radial-gradient(ellipse at 20% 80%, rgba(91,196,209,0.1) 0%,transparent 50%),
              radial-gradient(ellipse at 50% 50%, rgba(155,89,182,0.08) 0%,transparent 70%)`
          }} />

        {/* Floating badges */}
        <div className="hidden lg:block absolute top-1/4 right-12 animate-float"
          style={{ animationDelay: '0s' }}>
          <div className="px-4 py-2.5 rounded-full text-xs tracking-wide backdrop-blur-sm border"
            style={{ background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.12)' }}>
            <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ background: 'var(--sage)' }} />
            Kyoto → Safe for solo ✓
          </div>
        </div>
        <div className="hidden lg:block absolute top-1/2 right-8 animate-float"
          style={{ animationDelay: '2s' }}>
          <div className="px-4 py-2.5 rounded-full text-xs tracking-wide backdrop-blur-sm border"
            style={{ background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.12)' }}>
            <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ background: 'var(--coral)' }} />
            17.4K women traveling this month
          </div>
        </div>
        <div className="hidden lg:block absolute bottom-1/3 right-14 animate-float"
          style={{ animationDelay: '1s' }}>
          <div className="px-4 py-2.5 rounded-full text-xs tracking-wide backdrop-blur-sm border"
            style={{ background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.12)' }}>
            <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ background: 'var(--gold)' }} />
            Top Gear: GoPro Hero 13 — 4.9★
          </div>
        </div>

        <div className="max-w-3xl relative z-10">
          <div className="flex items-center gap-3 mb-6 text-xs tracking-widest uppercase"
            style={{ color: 'var(--gold)' }}>
            <span className="block w-10 h-px" style={{ background: 'var(--gold)' }} />
            The world. On your terms.
          </div>

          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', lineHeight: 0.92 }}>
            <span className="block" style={{ fontSize: 'clamp(72px,10vw,140px)', color: 'var(--cream)' }}>SOLO.</span>
            <span className="block" style={{ fontSize: 'clamp(72px,10vw,140px)', color: 'var(--coral)', textShadow: '0 0 80px rgba(255,77,77,0.4)' }}>FEARLESS.</span>
            <span className="block" style={{ fontSize: 'clamp(72px,10vw,140px)', color: 'transparent', WebkitTextStroke: '1.5px rgba(255,248,240,0.35)' }}>UNSTOPPABLE.</span>
          </h1>

          <p className="mt-6 mb-10 text-xl leading-relaxed"
            style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic', color: 'rgba(255,248,240,0.65)' }}>
            A community built by women who chose the road — not the waiting room.<br />
            Real stories. Trusted gear. Data-backed safety. No permission needed.
          </p>

          <div className="flex flex-wrap gap-4 items-center">
            <Link href="/auth/signup"
              className="btn-clip px-9 py-4 text-sm tracking-widest uppercase font-medium transition-all hover:-translate-y-0.5 inline-flex items-center gap-2"
              style={{ background: 'var(--coral)', color: 'white' }}>
              Join for Free <ArrowRight size={14} />
            </Link>
            <Link href="/stories"
              className="px-9 py-4 text-sm tracking-widest uppercase border transition-all hover:border-sky-400"
              style={{ borderColor: 'rgba(255,248,240,0.25)', color: 'var(--cream)' }}>
              Explore Stories
            </Link>
          </div>

          {/* Stats */}
          <div className="flex gap-10 mt-14 pt-10 flex-wrap"
            style={{ borderTop: '1px solid rgba(255,248,240,0.08)' }}>
            {[
              { n: '23K+', label: 'Women in the Pack' },
              { n: '140+', label: 'Countries Covered' },
              { n: '8.6K', label: 'Safety Reports' },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 42, color: 'var(--gold)', lineHeight: 1 }}>
                  {s.n}
                </div>
                <div className="text-xs tracking-widest uppercase mt-1" style={{ color: 'rgba(255,248,240,0.45)' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div className="overflow-hidden py-4" style={{ background: 'var(--coral)' }}>
        <div className="marquee-inner">
          {doubled.map((item, i) => (
            <span key={i} className="px-8 flex-shrink-0"
              style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 18, letterSpacing: 3, color: item === '✦' ? 'rgba(255,255,255,0.4)' : 'white' }}>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── FOUNDER STORY ── */}
      <section className="max-w-6xl mx-auto px-8 py-28 grid md:grid-cols-2 gap-20 items-center">
        <div>
          <div className="flex items-center gap-3 mb-5 text-xs tracking-widest uppercase fade-up"
            style={{ color: 'var(--sage)' }}>
            <span className="block w-8 h-px" style={{ background: 'var(--sage)' }} />
            Our Origin
          </div>
          <h2 className="mb-6 fade-up"
            style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(30px,4vw,50px)', lineHeight: 1.15 }}>
            She pulled her car out of{' '}
            <em style={{ color: 'var(--coral)' }}>Nevada desert sand</em>
            {' '}— then went back to work on Monday.
          </h2>
          <p className="text-base leading-loose mb-4 fade-up" style={{ color: 'rgba(255,248,240,0.65)' }}>
            SOLOFTS was born from a simple truth: <strong style={{ color: 'var(--cream)' }}>you don't need to quit your job, go broke, or wait for the "right time"</strong> to see the world.
            Our founder has hit 20+ US states, 13 National Parks, and 5+ countries — all with a full-time career on Wall Street.
          </p>
          <p className="text-base leading-loose mb-4 fade-up" style={{ color: 'rgba(255,248,240,0.65)' }}>
            She's been stranded in the middle of nowhere. Walked highways at midnight. Got stuck in desert sand.{' '}
            <strong style={{ color: 'var(--cream)' }}>And she'd do every single bit of it again.</strong>
          </p>
          <p className="text-base leading-loose fade-up" style={{ color: 'rgba(255,248,240,0.65)' }}>
            This isn't a travel blog. It's a movement for women who refuse to let logistics, fear, or a lack of travel companions stand between them and the world.
          </p>
        </div>

        <div className="relative h-96 md:h-[480px] fade-up">
          <div className="absolute right-0 top-0 w-3/4 p-6 rounded-sm"
            style={{ background: 'linear-gradient(135deg,rgba(255,77,77,0.15),rgba(155,89,182,0.1))', border: '1px solid rgba(255,77,77,0.2)' }}>
            <div className="text-xs tracking-widest uppercase mb-3" style={{ color: 'var(--coral)' }}>🌵 Nevada, Desert Highway</div>
            <div className="text-lg mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
              "Got my car stuck in sand at dusk. No signal. Dug it out alone by dark."
            </div>
            <div className="text-xs tracking-wide" style={{ color: 'rgba(255,248,240,0.4)' }}>@ Death Valley NP · Solo · Day 4 of 7</div>
          </div>
          <div className="absolute left-0 p-6 rounded-sm"
            style={{ bottom: '8%', width: '55%', background: 'linear-gradient(135deg,rgba(255,184,48,0.12),rgba(91,196,209,0.08))', border: '1px solid rgba(255,184,48,0.2)' }}>
            <div className="text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--gold)' }}>📍 13 National Parks & counting</div>
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 60, color: 'var(--gold)', lineHeight: 1 }}>20+</div>
            <div className="text-xs mt-1" style={{ color: 'rgba(255,248,240,0.45)' }}>US States. With a day job.</div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="px-8 py-20" style={{ background: 'rgba(255,255,255,0.015)' }}>
        <div className="max-w-xl mx-auto text-center mb-20 fade-up">
          <div className="text-xs tracking-widest uppercase mb-4" style={{ color: 'var(--sky)' }}>
            What we built for you
          </div>
          <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(40px,5vw,72px)', lineHeight: 1 }}>
            Not Another Travel Blog
          </h2>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px">
          {FEATURES.map((f, i) => (
            <div key={f.title}
              className="group p-10 fade-up transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', transitionDelay: `${i * 60}ms` }}>
              <div className="absolute top-0 left-0 w-full h-0.5 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"
                style={{ background: f.color }} />
              <f.icon size={32} className="mb-5" style={{ color: f.color }} />
              <h3 className="mb-3" style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 26, letterSpacing: 1 }}>
                {f.title}
              </h3>
              <p className="text-sm leading-loose mb-5" style={{ color: 'rgba(255,248,240,0.55)' }}>{f.desc}</p>
              <span className="inline-block text-xs tracking-widest uppercase px-3 py-1 border"
                style={{ color: f.color, borderColor: f.color }}>
                {f.tag}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── STORIES PREVIEW ── */}
      <section className="px-8 py-28 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 pointer-events-none"
          style={{ background: 'radial-gradient(circle,rgba(255,184,48,0.06),transparent 70%)' }} />

        <div className="max-w-xl mx-auto text-center mb-16 fade-up">
          <div className="text-xs tracking-widest uppercase mb-4" style={{ color: 'var(--gold)' }}>From the Community</div>
          <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(40px,5vw,72px)', lineHeight: 1 }}>
            Real Women. Real Roads.
          </h2>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-5">
          {STORIES.map((s, i) => (
            <div key={s.author}
              className="p-7 fade-up transition-all duration-300 hover:-translate-y-1.5 relative"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                marginTop: i === 1 ? 30 : i === 2 ? -20 : 0,
                transitionDelay: `${i * 80}ms`,
              }}>
              <span className="absolute top-5 right-5 text-xs tracking-widest uppercase px-2 py-1 rounded-sm"
                style={{ background: `${s.tagColor}20`, color: s.tagColor }}>
                {s.tag}
              </span>
              <div className="text-xs tracking-widest uppercase mb-3" style={{ color: 'var(--gold)' }}>{s.location}</div>
              <p className="text-base leading-loose mb-5" style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic' }}>
                "{s.quote}"
              </p>
              <div className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${s.gradient} flex items-center justify-center text-xs font-bold flex-shrink-0`}>
                  {s.initials}
                </div>
                <div className="text-xs" style={{ color: 'rgba(255,248,240,0.45)' }}>
                  {s.author} · {s.profession} · {s.pto}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Safety scores */}
        <div className="max-w-6xl mx-auto mt-16">
          <div className="text-xs tracking-widest uppercase mb-6 text-center fade-up" style={{ color: 'rgba(255,248,240,0.35)' }}>
            Trending Safety Scores — This Month
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px">
            {SAFETY_CITIES.map((c, i) => (
              <div key={c.city} className="p-5 fade-up"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', transitionDelay: `${i * 60}ms` }}>
                <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 22, letterSpacing: 1 }}>{c.city}</div>
                <div className="h-0.5 rounded my-2" style={{ background: 'rgba(255,255,255,0.07)' }}>
                  <div className="h-full rounded transition-all" style={{ width: `${c.score * 10}%`, background: c.color }} />
                </div>
                <div className="text-xs" style={{ color: 'rgba(255,248,240,0.45)' }}>
                  Safety <strong style={{ color: 'var(--cream)' }}>{c.score}/10</strong> · {c.reports} reports
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-8 py-28 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 50%,rgba(255,77,77,0.1) 0%,transparent 70%)' }} />
        <div className="relative z-10">
          <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(56px,9vw,120px)', lineHeight: 0.95 }}>
            <div>YOUR NEXT</div>
            <div style={{ color: 'transparent', WebkitTextStroke: '1.5px rgba(255,248,240,0.22)' }}>ADVENTURE</div>
            <div>STARTS NOW</div>
          </div>
          <p className="mt-6 mb-10 text-xl"
            style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic', color: 'rgba(255,248,240,0.55)' }}>
            No partner required. No permission needed. Just you and the road.
          </p>
          <Link href="/auth/signup"
            className="btn-clip inline-flex items-center gap-2 px-10 py-4 text-sm tracking-widest uppercase font-medium transition-all hover:-translate-y-0.5"
            style={{ background: 'var(--coral)', color: 'white' }}>
            Join Free — It's For Everyone <ArrowRight size={14} />
          </Link>
          <p className="mt-5 text-xs tracking-widest uppercase" style={{ color: 'rgba(255,248,240,0.25)' }}>
            Free forever · No ads · No algorithm · Just women who go
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="px-8 py-10" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-6">
          <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 22, letterSpacing: 4 }}>
            <img src="/logo.svg" alt="SOLOFTS" height={36} style={{ height: 36, width: 'auto' }} />
          </div>
          <div className="flex flex-wrap gap-6">
            {['Stories', 'Safety', 'Gear', 'Plan', 'About'].map(item => (
              <Link key={item} href={`/${item.toLowerCase()}`}
                className="text-xs tracking-widest uppercase transition-colors hover:text-yellow-400"
                style={{ color: 'rgba(255,248,240,0.3)' }}>
                {item}
              </Link>
            ))}
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-8 pt-6 text-center text-xs tracking-wide"
          style={{ borderTop: '1px solid rgba(255,255,255,0.04)', color: 'rgba(255,248,240,0.2)' }}>
          © 2025 SOLOFTS · Built by a woman who refused to wait. Made for every woman who won't either.
        </div>
      </footer>
    </>
  )
}
