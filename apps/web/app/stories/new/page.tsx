'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'
import { TAG_LABELS } from '@/lib/utils'

const TAGS = Object.keys(TAG_LABELS) as Array<keyof typeof TAG_LABELS>

export default function NewStoryPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    title: '',
    body: '',
    destination: '',
    country: '',
    days_count: '',
    budget_usd: '',
    pto_days: '',
    tags: [] as string[],
    cover_image: '',
  })

  const toggleTag = (tag: string) => {
    setForm(f => ({
      ...f,
      tags: f.tags.includes(tag) ? f.tags.filter(t => t !== tag) : [...f.tags, tag],
    }))
  }

  const handleSubmit = async (publish: boolean) => {
    setLoading(true)
    setError('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/login'); return }

    const payload = {
      ...form,
      days_count: form.days_count ? parseInt(form.days_count) : null,
      budget_usd: form.budget_usd ? parseInt(form.budget_usd) : null,
      pto_days: form.pto_days ? parseInt(form.pto_days) : null,
      author_id: user.id,
      is_published: publish,
    }

    const { error: err } = await supabase.from('stories').insert(payload)
    setLoading(false)
    if (err) { setError(err.message); return }
    router.push('/stories')
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--ink)' }}>
      <div className="px-8 pt-24 pb-12"
        style={{ background: 'linear-gradient(to bottom,rgba(255,77,77,0.07),transparent)' }}>
        <Link href="/stories" className="text-xs tracking-widest uppercase mb-8 block"
          style={{ color: 'var(--coral)' }}>← Back to Stories</Link>
        <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(48px,7vw,96px)', lineHeight: 0.95 }}>
          SHARE YOUR<br /><span style={{ color: 'var(--coral)' }}>STORY</span>
        </h1>
        <p className="mt-4 max-w-lg text-sm leading-loose" style={{ color: 'rgba(255,248,240,0.5)' }}>
          Your story might be the one that gives another woman permission to go.
        </p>
      </div>

      <div className="max-w-2xl mx-auto px-8 py-12 space-y-6">
        {error && (
          <div className="p-3 text-sm text-center"
            style={{ background: 'rgba(255,77,77,0.1)', border: '1px solid rgba(255,77,77,0.3)', color: 'var(--coral)' }}>
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'rgba(255,248,240,0.45)' }}>
            Story Title *
          </label>
          <input
            className="w-full px-4 py-3 bg-transparent border text-base focus:outline-none transition-colors"
            style={{ borderColor: 'rgba(255,255,255,0.15)', color: 'var(--cream)' }}
            placeholder="e.g. Solo in Kyoto at 52 — My First Ever Solo Trip"
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'rgba(255,248,240,0.45)' }}>
              Destination *
            </label>
            <input
              className="w-full px-4 py-3 bg-transparent border text-sm focus:outline-none"
              style={{ borderColor: 'rgba(255,255,255,0.15)', color: 'var(--cream)' }}
              placeholder="e.g. Kyoto, Japan"
              value={form.destination}
              onChange={e => setForm(f => ({ ...f, destination: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'rgba(255,248,240,0.45)' }}>
              Country *
            </label>
            <input
              className="w-full px-4 py-3 bg-transparent border text-sm focus:outline-none"
              style={{ borderColor: 'rgba(255,255,255,0.15)', color: 'var(--cream)' }}
              placeholder="e.g. Japan"
              value={form.country}
              onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { key: 'days_count',  label: 'Days',       placeholder: '7' },
            { key: 'budget_usd', label: 'Budget (USD)', placeholder: '2000' },
            { key: 'pto_days',   label: 'PTO Days Used', placeholder: '5' },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'rgba(255,248,240,0.45)' }}>
                {label}
              </label>
              <input type="number"
                className="w-full px-4 py-3 bg-transparent border text-sm focus:outline-none"
                style={{ borderColor: 'rgba(255,255,255,0.15)', color: 'var(--cream)' }}
                placeholder={placeholder}
                value={(form as never)[key]}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
              />
            </div>
          ))}
        </div>

        <div>
          <label className="block text-xs tracking-widest uppercase mb-3" style={{ color: 'rgba(255,248,240,0.45)' }}>
            Trip Type Tags
          </label>
          <div className="flex flex-wrap gap-2">
            {TAGS.map(tag => (
              <button key={tag} type="button" onClick={() => toggleTag(tag)}
                className="px-3 py-1.5 text-xs tracking-wide transition-all"
                style={{
                  background: form.tags.includes(tag) ? 'rgba(255,77,77,0.15)' : 'transparent',
                  color: form.tags.includes(tag) ? 'var(--coral)' : 'rgba(255,248,240,0.45)',
                  border: `1px solid ${form.tags.includes(tag) ? 'var(--coral)' : 'rgba(255,255,255,0.1)'}`,
                }}>
                {TAG_LABELS[tag]}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'rgba(255,248,240,0.45)' }}>
            Cover Image URL (optional)
          </label>
          <input
            className="w-full px-4 py-3 bg-transparent border text-sm focus:outline-none"
            style={{ borderColor: 'rgba(255,255,255,0.15)', color: 'var(--cream)' }}
            placeholder="https://images.unsplash.com/..."
            value={form.cover_image}
            onChange={e => setForm(f => ({ ...f, cover_image: e.target.value }))}
          />
        </div>

        <div>
          <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'rgba(255,248,240,0.45)' }}>
            Your Story *
          </label>
          <textarea
            rows={12}
            className="w-full px-4 py-3 bg-transparent border text-sm focus:outline-none leading-loose resize-none"
            style={{ borderColor: 'rgba(255,255,255,0.15)', color: 'var(--cream)' }}
            placeholder="Tell it like it happened. The good, the wild, the scary, the beautiful..."
            value={form.body}
            onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            disabled={loading || !form.title || !form.body || !form.destination || !form.country}
            onClick={() => handleSubmit(true)}
            className="flex-1 py-4 text-sm tracking-widest uppercase font-medium transition-all hover:-translate-y-0.5 disabled:opacity-40 flex items-center justify-center gap-2"
            style={{ background: 'var(--coral)', color: 'white' }}>
            {loading && <Loader2 size={14} className="animate-spin" />}
            Publish Story
          </button>
          <button
            disabled={loading || !form.title || !form.body || !form.destination || !form.country}
            onClick={() => handleSubmit(false)}
            className="px-6 py-4 text-sm tracking-widest uppercase transition-all hover:opacity-70"
            style={{ border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,248,240,0.5)' }}>
            Save Draft
          </button>
        </div>
      </div>
    </div>
  )
}
