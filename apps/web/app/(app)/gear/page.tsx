'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ExternalLink, Star, ThumbsUp } from 'lucide-react'
import { GEAR_CATEGORY_LABELS } from '@/lib/utils'

const GEAR = [
  {
    id: '1', name: 'GoPro Hero 13 Black', brand: 'GoPro', category: 'camera',
    description: 'Best-in-class action camera. Waterproof, 5.3K video, HyperSmooth 6.0 stabilization. Built-in mounting options mean no tripod needed.',
    price_usd: 399, avg_rating: 4.9, review_count: 284, upvotes: 1243,
    affiliate_url: 'https://www.amazon.com/dp/B0CF3B7VB7',
    image_url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&auto=format&fit=crop',
  },
  {
    id: '2', name: 'Pacsafe Venturesafe X Anti-Theft Backpack', brand: 'Pacsafe', category: 'backpack',
    description: 'Slash-proof, RFID-blocking, lockable zippers. The gold standard for solo female travelers in crowded destinations.',
    price_usd: 159, avg_rating: 4.7, review_count: 156, upvotes: 987,
    affiliate_url: 'https://www.amazon.com/dp/B076P52B4D',
    image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&auto=format&fit=crop',
  },
  {
    id: '3', name: "She's Birdie Personal Alarm", brand: "She's Birdie", category: 'safety',
    description: '130dB alarm, strobe light, keychain-sized. Every solo female traveler should have one.',
    price_usd: 28, avg_rating: 4.8, review_count: 423, upvotes: 876,
    affiliate_url: 'https://www.amazon.com/dp/B07BGSZ87M',
    image_url: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&auto=format&fit=crop',
  },
  {
    id: '4', name: 'Garmin inReach Mini 2', brand: 'Garmin', category: 'safety',
    description: 'Satellite communicator for off-grid adventures. Two-way messaging and SOS when your phone has zero signal.',
    price_usd: 349, avg_rating: 4.8, review_count: 198, upvotes: 754,
    affiliate_url: 'https://www.amazon.com/dp/B09MN499HV',
    image_url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&auto=format&fit=crop',
  },
  {
    id: '5', name: "Osprey Farpoint 40 Women's", brand: 'Osprey', category: 'backpack',
    description: "Best carry-on sized travel pack. Women-specific fit, removable daypack. Fits most overhead bins.",
    price_usd: 165, avg_rating: 4.6, review_count: 312, upvotes: 698,
    affiliate_url: 'https://www.amazon.com/dp/B00G0LIM2M',
    image_url: 'https://images.unsplash.com/photo-1622560480654-d96214fdc887?w=400&auto=format&fit=crop',
  },
  {
    id: '6', name: 'Apple AirTag 4-Pack', brand: 'Apple', category: 'tech',
    description: 'Track your luggage in real-time. Sew one into your bag and never panic at baggage claim again.',
    price_usd: 99, avg_rating: 4.5, review_count: 567, upvotes: 632,
    affiliate_url: 'https://www.amazon.com/dp/B0933BVK6T',
    image_url: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=400&auto=format&fit=crop',
  },
  {
    id: '7', name: 'DJI Osmo Pocket 3', brand: 'DJI', category: 'camera',
    description: 'Tiny stabilized camera that fits in your pocket. Perfect for solo travel — no tripod needed for smooth footage.',
    price_usd: 519, avg_rating: 4.9, review_count: 142, upvotes: 589,
    affiliate_url: 'https://www.amazon.com/dp/B0CG3KY1TV',
    image_url: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&auto=format&fit=crop',
  },
  {
    id: '8', name: 'Anker 733 Power Bank', brand: 'Anker', category: 'tech',
    description: '20,000mAh, USB-C PD 65W. Charges laptop + phone simultaneously. Enough for 3+ days off-grid.',
    price_usd: 80, avg_rating: 4.7, review_count: 891, upvotes: 534,
    affiliate_url: 'https://www.amazon.com/dp/B09VPHVT2Z',
    image_url: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&auto=format&fit=crop',
  },
]

const CATEGORIES = Object.entries(GEAR_CATEGORY_LABELS)

export default function GearPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const filtered = activeCategory
    ? GEAR.filter(g => g.category === activeCategory)
    : GEAR

  return (
    <div className="min-h-screen" style={{ background: 'var(--ink)' }}>
      <div className="px-8 pt-28 pb-12"
        style={{ background: 'linear-gradient(to bottom,rgba(255,184,48,0.08),transparent)' }}>
        <Link href="/" className="text-xs tracking-widest uppercase mb-8 block" style={{ color: 'var(--gold)' }}>← Back</Link>
        <div className="text-xs tracking-widest uppercase mb-3" style={{ color: 'var(--gold)' }}>Crowd-Ranked</div>
        <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(50px,7vw,96px)', lineHeight: 0.95 }}>
          THE SOLO<br /><span style={{ color: 'var(--gold)' }}>STACK</span>
        </h1>
        <p className="mt-4 max-w-lg text-base leading-loose" style={{ color: 'rgba(255,248,240,0.55)' }}>
          Every item ranked by women who actually used it on the road. No paid placements. No influencer codes.
        </p>
      </div>

      {/* Category filter */}
      <div className="px-8 py-4 sticky top-0 z-40 backdrop-blur-md overflow-x-auto"
        style={{ background: 'rgba(26,26,46,0.92)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex gap-2 min-w-max">
          <button onClick={() => setActiveCategory(null)}
            className="px-4 py-2 text-xs tracking-widest uppercase transition-all whitespace-nowrap"
            style={{
              background: !activeCategory ? 'var(--gold)' : 'transparent',
              color: !activeCategory ? 'var(--ink)' : 'rgba(255,248,240,0.5)',
              border: `1px solid ${!activeCategory ? 'var(--gold)' : 'rgba(255,255,255,0.12)'}`,
            }}>
            🗺️ All Gear
          </button>
          {CATEGORIES.map(([key, label]) => (
            <button key={key} onClick={() => setActiveCategory(activeCategory === key ? null : key)}
              className="px-4 py-2 text-xs tracking-widest uppercase transition-all whitespace-nowrap"
              style={{
                background: activeCategory === key ? 'var(--gold)' : 'transparent',
                color: activeCategory === key ? 'var(--ink)' : 'rgba(255,248,240,0.5)',
                border: `1px solid ${activeCategory === key ? 'var(--gold)' : 'rgba(255,255,255,0.12)'}`,
              }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Gear grid */}
      <div className="max-w-6xl mx-auto px-8 py-12 grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map((item, i) => (
          <div key={item.id}
            className="group transition-all duration-300 hover:-translate-y-1"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            {item.image_url && (
              <div className="h-36 overflow-hidden">
                <img src={item.image_url} alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
            )}
            <div className="p-5">
              {/* Rank badge */}
              {i < 3 && (
                <div className="inline-block text-xs px-2 py-0.5 mb-2 font-bold"
                  style={{
                    background: i === 0 ? 'var(--gold)' : i === 1 ? 'rgba(192,192,192,0.2)' : 'rgba(205,127,50,0.2)',
                    color: i === 0 ? 'var(--ink)' : 'var(--cream)',
                  }}>
                  #{i + 1} {i === 0 ? '🏆' : i === 1 ? '🥈' : '🥉'}
                </div>
              )}
              <div className="text-xs mb-1" style={{ color: 'rgba(255,248,240,0.4)' }}>{item.brand}</div>
              <h3 className="font-medium mb-2 leading-snug text-sm">{item.name}</h3>
              <p className="text-xs leading-relaxed mb-4" style={{ color: 'rgba(255,248,240,0.5)' }}>
                {item.description}
              </p>

              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-1">
                  <Star size={11} style={{ color: 'var(--gold)', fill: 'var(--gold)' }} />
                  <span className="text-xs font-medium">{item.avg_rating}</span>
                  <span className="text-xs" style={{ color: 'rgba(255,248,240,0.35)' }}>({item.review_count})</span>
                </div>
                <div className="flex items-center gap-1 text-xs" style={{ color: 'rgba(255,248,240,0.4)' }}>
                  <ThumbsUp size={10} /> {item.upvotes.toLocaleString()}
                </div>
                <div className="ml-auto text-sm font-bold" style={{ color: 'var(--gold)' }}>
                  ${item.price_usd}
                </div>
              </div>

              <a href={item.affiliate_url} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 text-xs tracking-widest uppercase transition-all hover:opacity-80"
                style={{ background: 'rgba(255,184,48,0.12)', color: 'var(--gold)', border: '1px solid rgba(255,184,48,0.25)' }}>
                View on Amazon <ExternalLink size={11} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
