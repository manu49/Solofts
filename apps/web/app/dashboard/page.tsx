'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { MapPin, BookOpen, Package, Compass, LogOut, Plus, Globe, Clock } from 'lucide-react'
import type { Profile, Story } from '@/lib/supabase/database.types'

const QUICK_LINKS = [
  { href: '/stories/new', icon: BookOpen, label: 'Share a Story', color: 'var(--coral)', desc: 'Tell the community where you went' },
  { href: '/safety',      icon: MapPin,   label: 'Safety Map',    color: 'var(--sky)',   desc: 'Check or submit city scores' },
  { href: '/gear',        icon: Package,  label: 'The Solo Stack', color: 'var(--gold)', desc: 'Browse crowd-ranked gear' },
  { href: '/plan',        icon: Compass,  label: 'Plan a Trip',   color: 'var(--sage)',  desc: 'AI-powered itinerary builder' },
]

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      const [{ data: profileData }, { data: storyData }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase
          .from('stories')
          .select('*')
          .eq('author_id', user.id)
          .order('created_at', { ascending: false }),
      ])

      setProfile(profileData)
      setStories(storyData ?? [])
      setLoading(false)
    }
    load()
  }, []) // eslint-disable-line

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--ink)' }}>
        <div className="text-xs tracking-widest uppercase animate-pulse" style={{ color: 'rgba(255,248,240,0.3)' }}>
          Loading your pack...
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--ink)' }}>
      {/* Header */}
      <nav className="px-8 py-5 flex items-center justify-between"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Link href="/">
          <img src="/logo.svg" alt="SOLOFTS" height={36} style={{ height: 36, width: 'auto' }} />
        </Link>
        <button onClick={handleSignOut}
          className="flex items-center gap-2 text-xs tracking-widest uppercase transition-opacity hover:opacity-60"
          style={{ color: 'rgba(255,248,240,0.4)' }}>
          <LogOut size={13} /> Sign Out
        </button>
      </nav>

      <div className="max-w-5xl mx-auto px-8 py-16">
        {/* Welcome */}
        <div className="mb-14">
          <div className="text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--gold)' }}>
            Welcome back
          </div>
          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(42px,6vw,80px)', lineHeight: 1 }}>
            {profile?.full_name?.toUpperCase() || profile?.username?.toUpperCase() || 'TRAVELER'}
          </h1>
          {profile?.profession && (
            <p className="mt-2 text-sm" style={{ color: 'rgba(255,248,240,0.45)' }}>
              {profile.profession} · Solo traveler
            </p>
          )}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-px mb-14">
          {[
            { label: 'Countries Visited', value: profile?.countries_visited || 0, icon: Globe },
            { label: 'Trips Shared',      value: stories.length || profile?.trips_count || 0, icon: BookOpen },
            { label: 'Pack Members',      value: '23K+',                           icon: MapPin },
          ].map(stat => (
            <div key={stat.label} className="p-6"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 40, color: 'var(--gold)', lineHeight: 1 }}>
                {stat.value}
              </div>
              <div className="text-xs tracking-widest uppercase mt-1" style={{ color: 'rgba(255,248,240,0.4)' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div className="mb-6">
          <div className="text-xs tracking-widest uppercase mb-6" style={{ color: 'rgba(255,248,240,0.35)' }}>
            Quick Actions
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {QUICK_LINKS.map(link => (
              <Link key={link.href} href={link.href}
                className="group p-5 transition-all duration-200 hover:-translate-y-1"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <link.icon size={22} className="mb-3 transition-transform group-hover:scale-110"
                  style={{ color: link.color }} />
                <div className="text-sm font-medium mb-1">{link.label}</div>
                <div className="text-xs" style={{ color: 'rgba(255,248,240,0.4)' }}>{link.desc}</div>
              </Link>
            ))}
          </div>
        </div>


        {/* My stories */}
        <div className="mt-10">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <div className="text-xs tracking-widest uppercase mb-1" style={{ color: 'rgba(255,248,240,0.35)' }}>
                My Stories
              </div>
              <p className="text-xs" style={{ color: 'rgba(255,248,240,0.45)' }}>
                Your published stories and drafts stay available after you sign in.
              </p>
            </div>
            <Link href="/stories/new"
              className="flex items-center gap-2 px-4 py-2 text-xs tracking-widest uppercase transition-all hover:opacity-80"
              style={{ background: 'var(--coral)', color: 'white' }}>
              <Plus size={12} /> New Story
            </Link>
          </div>

          {stories.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-3">
              {stories.map(story => (
                <Link key={story.id} href={`/stories/${story.id}`}
                  className="group p-5 transition-all duration-200 hover:-translate-y-1"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h2 className="text-base font-medium leading-snug group-hover:opacity-80">{story.title}</h2>
                    <span className="shrink-0 px-2 py-1 text-[10px] tracking-widest uppercase"
                      style={{
                        background: story.is_published ? 'rgba(116,176,154,0.12)' : 'rgba(255,184,77,0.12)',
                        color: story.is_published ? 'var(--sage)' : 'var(--gold)',
                      }}>
                      {story.is_published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-xs" style={{ color: 'rgba(255,248,240,0.45)' }}>
                    <span className="flex items-center gap-1.5"><MapPin size={11} style={{ color: 'var(--coral)' }} /> {story.destination}</span>
                    <span className="flex items-center gap-1.5"><Clock size={11} style={{ color: 'var(--gold)' }} /> {new Date(story.created_at).toLocaleDateString()}</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-5 text-sm" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,248,240,0.5)' }}>
              You have not shared a story yet. When you publish one, it will appear here.
            </div>
          )}
        </div>

        {/* Profile completeness nudge */}
        {!profile?.bio && (
          <div className="mt-10 p-5 flex items-center justify-between flex-wrap gap-4"
            style={{ background: 'rgba(255,184,48,0.06)', border: '1px solid rgba(255,184,48,0.18)' }}>
            <div>
              <div className="text-sm font-medium mb-1" style={{ color: 'var(--gold)' }}>
                Complete your profile
              </div>
              <div className="text-xs" style={{ color: 'rgba(255,248,240,0.45)' }}>
                Add your bio, profession, and home country to help others connect with women like you.
              </div>
            </div>
            <Link href="/profile/edit"
              className="flex items-center gap-2 px-4 py-2 text-xs tracking-widest uppercase transition-all hover:opacity-80"
              style={{ background: 'var(--gold)', color: 'var(--ink)' }}>
              <Plus size={12} /> Update Profile
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
