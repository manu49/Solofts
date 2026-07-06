'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, MapPin, Clock, DollarSign, Briefcase } from 'lucide-react'
import { TAG_LABELS } from '@/lib/utils'

const MOCK_STORIES = [
  {
    id: '1', title: 'Hiking Torres del Paine Solo with a Torn ACL',
    destination: 'Patagonia, Chile', country: 'Chile', days_count: 9, budget_usd: 2100, pto_days: 9,
    tags: ['wild_solo', 'adventure'],
    author: { username: 'riya_s', full_name: 'Riya S.', profession: 'Software Engineer' },
    likes: 342, views: 4120,
    cover_image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&auto=format&fit=crop',
    created_at: '2024-11-15',
  },
  {
    id: '2', title: '10 Days in Kyoto at 52 — My First Solo Trip Ever',
    destination: 'Kyoto, Japan', country: 'Japan', days_count: 10, budget_usd: 3200, pto_days: 10,
    tags: ['first_timer', 'career_traveler'],
    author: { username: 'martha_l', full_name: 'Martha L.', profession: 'Teacher' },
    likes: 891, views: 12300,
    cover_image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&auto=format&fit=crop',
    created_at: '2024-10-22',
  },
  {
    id: '3', title: 'Morocco to Spain: 3 Weeks, $1,800, Zero Regrets',
    destination: 'Marrakech, Morocco', country: 'Morocco', days_count: 21, budget_usd: 1800, pto_days: 0,
    tags: ['budget', 'backpacking'],
    author: { username: 'tanya_w', full_name: 'Tanya W.', profession: 'Nurse' },
    likes: 567, views: 7840,
    cover_image: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=800&auto=format&fit=crop',
    created_at: '2024-09-10',
  },
  {
    id: '4', title: 'Road Tripping 13 National Parks with a Full-Time Job',
    destination: 'American West, USA', country: 'USA', days_count: 28, budget_usd: 4500, pto_days: 15,
    tags: ['road_trip', 'career_traveler', 'adventure'],
    author: { username: 'manu', full_name: 'Manu', profession: 'Quantitative Analyst' },
    likes: 1243, views: 18900,
    cover_image: 'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?w=800&auto=format&fit=crop',
    created_at: '2024-08-05',
  },
  {
    id: '5', title: 'Solo in Tbilisi: The City That Adopted Me',
    destination: 'Tbilisi, Georgia', country: 'Georgia', days_count: 7, budget_usd: 900, pto_days: 7,
    tags: ['first_timer', 'budget'],
    author: { username: 'sarah_k', full_name: 'Sarah K.', profession: 'Marketing Manager' },
    likes: 204, views: 3100,
    cover_image: 'https://images.unsplash.com/photo-1565008576549-57569a49371d?w=800&auto=format&fit=crop',
    created_at: '2024-07-18',
  },
  {
    id: '6', title: 'Backpacking Southeast Asia for 45 Days on $35/Day',
    destination: 'Bangkok, Thailand', country: 'Thailand', days_count: 45, budget_usd: 1575, pto_days: 0,
    tags: ['backpacking', 'budget', 'digital_nomad'],
    author: { username: 'jess_r', full_name: 'Jessica R.', profession: 'UX Designer' },
    likes: 789, views: 11200,
    cover_image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&auto=format&fit=crop',
    created_at: '2024-06-30',
  },
]

const TAG_OPTIONS = Object.entries(TAG_LABELS)

type StoryCard = {
  id: string
  title: string
  destination: string
  country: string
  days_count: number | null
  budget_usd: number | null
  pto_days: number | null
  tags: string[]
  author: { username?: string | null; full_name?: string | null; profession?: string | null }
  likes: number
  views: number
  cover_image: string | null
  created_at: string
}

type StoryApiRow = Omit<StoryCard, 'author'> & {
  author?: StoryCard['author'] | null
}

const toStoryCard = (story: StoryApiRow): StoryCard => ({
  ...story,
  tags: story.tags ?? [],
  author: story.author ?? { full_name: 'Solofts traveler', profession: 'Community member' },
})

export default function StoriesPage() {
  const [search, setSearch] = useState('')
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [stories, setStories] = useState<StoryCard[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (activeTag) params.set('tag', activeTag)

    const loadStories = async () => {
      setLoading(true)
      setLoadError('')

      try {
        const response = await fetch(`/api/stories?${params.toString()}`)
        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || 'Unable to load stories')
        }

        setStories((result.data ?? []).map(toStoryCard))
      } catch (err) {
        setLoadError(err instanceof Error ? err.message : 'Unable to load stories')
        let filtered = MOCK_STORIES
        if (search) filtered = filtered.filter(s =>
          s.title.toLowerCase().includes(search.toLowerCase()) ||
          s.destination.toLowerCase().includes(search.toLowerCase())
        )
        if (activeTag) filtered = filtered.filter(s => s.tags.includes(activeTag as never))
        setStories(filtered)
      } finally {
        setLoading(false)
      }
    }

    loadStories()
  }, [search, activeTag])

  return (
    <div className="min-h-screen" style={{ background: 'var(--ink)' }}>
      {/* Header */}
      <div className="px-8 pt-28 pb-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(to bottom, rgba(255,77,77,0.08), transparent)' }}>
        <Link href="/" className="text-xs tracking-widest uppercase mb-8 block"
          style={{ color: 'var(--coral)' }}>← Back</Link>
        <div className="text-xs tracking-widest uppercase mb-3" style={{ color: 'var(--gold)' }}>Community Library</div>
        <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(50px,7vw,96px)', lineHeight: 0.95 }}>
          REAL WOMEN.<br />
          <span style={{ color: 'var(--coral)' }}>REAL ROADS.</span>
        </h1>
        <p className="mt-4 max-w-lg text-base leading-loose" style={{ color: 'rgba(255,248,240,0.55)' }}>
          Filter by profession, budget, or trip style. Find the woman who proves it's possible for someone exactly like you.
        </p>
      </div>

      {/* Filters */}
      <div className="px-8 py-6 sticky top-0 z-40 backdrop-blur-md"
        style={{ background: 'rgba(26,26,46,0.92)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-6xl mx-auto flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,248,240,0.35)' }} />
            <input
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-transparent border focus:outline-none"
              style={{ borderColor: 'rgba(255,255,255,0.12)', color: 'var(--cream)' }}
              placeholder="Search destinations, stories..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTag(null)}
              className="px-3 py-1.5 text-xs tracking-wider uppercase transition-all"
              style={{
                background: !activeTag ? 'var(--coral)' : 'transparent',
                color: !activeTag ? 'white' : 'rgba(255,248,240,0.5)',
                border: `1px solid ${!activeTag ? 'var(--coral)' : 'rgba(255,255,255,0.12)'}`,
              }}>
              All
            </button>
            {TAG_OPTIONS.map(([key, label]) => (
              <button key={key}
                onClick={() => setActiveTag(activeTag === key ? null : key)}
                className="px-3 py-1.5 text-xs tracking-wider uppercase transition-all"
                style={{
                  background: activeTag === key ? 'var(--coral)' : 'transparent',
                  color: activeTag === key ? 'white' : 'rgba(255,248,240,0.5)',
                  border: `1px solid ${activeTag === key ? 'var(--coral)' : 'rgba(255,255,255,0.12)'}`,
                }}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loadError && (
        <div className="max-w-6xl mx-auto px-8 pt-8">
          <div className="p-3 text-sm text-center"
            style={{ background: 'rgba(255,184,77,0.1)', border: '1px solid rgba(255,184,77,0.25)', color: 'var(--gold)' }}>
            Could not load live community stories, so sample stories are shown instead. {loadError}
          </div>
        </div>
      )}

      {loading && (
        <div className="text-center py-20" style={{ color: 'rgba(255,248,240,0.45)' }}>
          Loading community stories...
        </div>
      )}

      {/* Stories grid */}
      <div className="max-w-6xl mx-auto px-8 py-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stories.map((story) => (
          <Link key={story.id} href={`/stories/${story.id}`}
            className="group block transition-all duration-300 hover:-translate-y-1"
            style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.03)' }}>
            {story.cover_image && (
              <div className="h-44 overflow-hidden">
                <img src={story.cover_image} alt={story.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
            )}
            <div className="p-6">
              <div className="flex flex-wrap gap-1.5 mb-3">
                {story.tags.slice(0, 2).map(tag => (
                  <span key={tag} className="text-xs px-2 py-0.5 tracking-wide"
                    style={{ background: 'rgba(255,77,77,0.12)', color: 'var(--coral)' }}>
                    {TAG_LABELS[tag as keyof typeof TAG_LABELS] ?? tag}
                  </span>
                ))}
              </div>
              <h3 className="font-medium mb-3 leading-snug group-hover:text-coral transition-colors"
                style={{ fontFamily: 'Playfair Display, serif', fontSize: 18 }}>
                {story.title}
              </h3>
              <div className="flex flex-wrap gap-3 mb-4">
                <span className="flex items-center gap-1 text-xs" style={{ color: 'rgba(255,248,240,0.45)' }}>
                  <MapPin size={11} /> {story.destination}
                </span>
                {story.days_count && (
                  <span className="flex items-center gap-1 text-xs" style={{ color: 'rgba(255,248,240,0.45)' }}>
                    <Clock size={11} /> {story.days_count} days
                  </span>
                )}
                {story.budget_usd && (
                  <span className="flex items-center gap-1 text-xs" style={{ color: 'rgba(255,248,240,0.45)' }}>
                    <DollarSign size={11} /> ${story.budget_usd.toLocaleString()}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 pt-3"
                style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: 'var(--coral)' }}>
                  {(story.author.full_name || story.author.username || 'S')[0]}
                </div>
                <div>
                  <div className="text-xs font-medium">{story.author.full_name || story.author.username || 'Solofts traveler'}</div>
                  <div className="flex items-center gap-1 text-xs" style={{ color: 'rgba(255,248,240,0.4)' }}>
                    <Briefcase size={10} /> {story.author.profession || 'Community member'}
                  </div>
                </div>
                <div className="ml-auto text-xs" style={{ color: 'rgba(255,248,240,0.3)' }}>
                  ♥ {story.likes}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {!loading && stories.length === 0 && (
        <div className="text-center py-20" style={{ color: 'rgba(255,248,240,0.35)' }}>
          <div className="text-6xl mb-4">🗺️</div>
          <div className="text-lg">No stories found. Be the first to share this journey!</div>
          <Link href="/stories/new" className="mt-6 inline-block px-6 py-3 text-sm tracking-widest uppercase"
            style={{ background: 'var(--coral)', color: 'white' }}>
            Share Your Story
          </Link>
        </div>
      )}
    </div>
  )
}
