import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MapPin, Clock, DollarSign, Briefcase, Heart } from 'lucide-react'
import { TAG_LABELS, safetyColor } from '@/lib/utils'

export default async function StoryPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  let query = supabase
    .from('stories')
    .select(`*, author:profiles!stories_author_id_fkey (username, full_name, avatar_url, profession, bio)`)
    .eq('id', params.id)

  query = user
    ? query.or(`is_published.eq.true,author_id.eq.${user.id}`)
    : query.eq('is_published', true)

  const { data: story } = await query.single()

  if (!story) notFound()

  const author = story.author as { username: string; full_name: string | null; avatar_url: string | null; profession: string | null; bio: string | null } | null

  return (
    <div className="min-h-screen" style={{ background: 'var(--ink)' }}>
      {/* Hero */}
      <div className="relative">
        {story.cover_image && (
          <div className="h-72 overflow-hidden">
            <img src={story.cover_image} alt={story.title}
              className="w-full h-full object-cover"
              style={{ filter: 'brightness(0.4)' }} />
          </div>
        )}
        <div className={`px-8 ${story.cover_image ? 'absolute bottom-0 left-0 right-0 pb-8' : 'pt-28 pb-8'}`}
          style={story.cover_image ? {} : { background: 'linear-gradient(to bottom,rgba(255,77,77,0.07),transparent)' }}>
          <Link href="/stories" className="text-xs tracking-widest uppercase mb-5 block"
            style={{ color: 'var(--coral)' }}>← All Stories</Link>
          <div className="flex flex-wrap gap-2 mb-4">
            {(story.tags || []).map((tag: string) => (
              <span key={tag} className="text-xs px-2 py-0.5"
                style={{ background: 'rgba(255,77,77,0.15)', color: 'var(--coral)' }}>
                {TAG_LABELS[tag] || tag}
              </span>
            ))}
          </div>
          <h1 className="max-w-3xl" style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px,4vw,52px)', lineHeight: 1.2 }}>
            {story.title}
          </h1>
        </div>
      </div>

      {/* Meta strip */}
      <div className="px-8 py-4 flex flex-wrap gap-6"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
        <span className="flex items-center gap-1.5 text-xs" style={{ color: 'rgba(255,248,240,0.5)' }}>
          <MapPin size={11} style={{ color: 'var(--coral)' }} /> {story.destination}
        </span>
        {story.days_count && (
          <span className="flex items-center gap-1.5 text-xs" style={{ color: 'rgba(255,248,240,0.5)' }}>
            <Clock size={11} style={{ color: 'var(--gold)' }} /> {story.days_count} days
          </span>
        )}
        {story.budget_usd && (
          <span className="flex items-center gap-1.5 text-xs" style={{ color: 'rgba(255,248,240,0.5)' }}>
            <DollarSign size={11} style={{ color: 'var(--sage)' }} /> ${story.budget_usd.toLocaleString()} total
          </span>
        )}
        {story.pto_days != null && story.pto_days > 0 && (
          <span className="flex items-center gap-1.5 text-xs" style={{ color: 'rgba(255,248,240,0.5)' }}>
            <Briefcase size={11} style={{ color: 'var(--sky)' }} /> {story.pto_days} PTO days
          </span>
        )}
        <span className="flex items-center gap-1.5 text-xs ml-auto" style={{ color: 'rgba(255,248,240,0.35)' }}>
          <Heart size={11} /> {story.likes} likes
        </span>
      </div>

      {/* Body */}
      <div className="max-w-2xl mx-auto px-8 py-14">
        <div className="prose prose-invert max-w-none"
          style={{ color: 'rgba(255,248,240,0.78)', fontSize: 17, lineHeight: 1.9, fontFamily: 'DM Sans, sans-serif' }}>
          {story.body.split('\n').map((para: string, i: number) =>
            para.trim() ? <p key={i} className="mb-5">{para}</p> : <br key={i} />
          )}
        </div>

        {/* Author card */}
        {author && (
          <div className="mt-16 p-6 flex gap-4 items-start"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center text-lg font-bold"
              style={{ background: 'linear-gradient(135deg, var(--coral), var(--purple))' }}>
              {(author.full_name || author.username)?.[0]?.toUpperCase()}
            </div>
            <div>
              <div className="font-medium mb-0.5">{author.full_name || author.username}</div>
              {author.profession && (
                <div className="text-xs mb-2" style={{ color: 'var(--gold)' }}>{author.profession}</div>
              )}
              {author.bio && (
                <p className="text-sm leading-loose" style={{ color: 'rgba(255,248,240,0.55)' }}>{author.bio}</p>
              )}
            </div>
          </div>
        )}

        <div className="mt-10 text-center">
          <Link href="/stories/new"
            className="inline-block px-8 py-4 text-sm tracking-widest uppercase transition-all hover:-translate-y-0.5"
            style={{ background: 'var(--coral)', color: 'white' }}>
            Share Your Story →
          </Link>
        </div>
      </div>
    </div>
  )
}
