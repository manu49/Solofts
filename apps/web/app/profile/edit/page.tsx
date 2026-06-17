'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Save, ArrowLeft } from 'lucide-react'

const PROFESSIONS = [
  'Engineer', 'Doctor', 'Nurse', 'Teacher', 'Lawyer', 'Accountant',
  'Designer', 'Product Manager', 'Data Scientist', 'Finance / Banking',
  'Consultant', 'Entrepreneur', 'Marketing', 'Journalist', 'Other',
]

const TRAVEL_STYLES = ['Adventure', 'Backpacker', 'Budget', 'Luxury', 'Culture', 'Nature', 'Food & Wine', 'Wellness']

export default function ProfileEditPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    full_name: '',
    username: '',
    bio: '',
    profession: '',
    home_country: '',
    countries_visited: '',
    travel_styles: [] as string[],
    instagram: '',
    linkedin: '',
  })

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (data) {
        setForm({
          full_name: data.full_name || '',
          username: data.username || '',
          bio: data.bio || '',
          profession: data.profession || '',
          home_country: data.home_country || '',
          countries_visited: data.countries_visited?.toString() || '',
          travel_styles: data.travel_styles || [],
          instagram: data.instagram || '',
          linkedin: data.linkedin || '',
        })
      }
      setLoading(false)
    }
    load()
  }, []) // eslint-disable-line

  const toggleStyle = (style: string) => {
    setForm(f => ({
      ...f,
      travel_styles: f.travel_styles.includes(style)
        ? f.travel_styles.filter(s => s !== style)
        : [...f.travel_styles, style],
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSuccess(false)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/login'); return }

    const { error: err } = await supabase.from('profiles').update({
      full_name: form.full_name,
      username: form.username,
      bio: form.bio,
      profession: form.profession,
      home_country: form.home_country,
      countries_visited: form.countries_visited ? parseInt(form.countries_visited) : null,
      travel_styles: form.travel_styles,
      instagram: form.instagram,
      linkedin: form.linkedin,
      updated_at: new Date().toISOString(),
    }).eq('id', user.id)

    setSaving(false)
    if (err) { setError(err.message); return }
    setSuccess(true)
    setTimeout(() => router.push('/dashboard'), 1200)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--ink)' }}>
        <Loader2 size={28} className="animate-spin" style={{ color: 'var(--coral)' }} />
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--ink)' }}>
      {/* Header */}
      <div className="px-8 pt-24 pb-10"
        style={{ background: 'linear-gradient(to bottom, rgba(255,77,77,0.06), transparent)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-xs tracking-widest uppercase mb-6"
          style={{ color: 'var(--coral)' }}>
          <ArrowLeft size={12} /> Back to Dashboard
        </Link>
        <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(42px,6vw,72px)', lineHeight: 1 }}>
          EDIT PROFILE
        </h1>
        <p className="mt-2 text-sm" style={{ color: 'rgba(255,248,240,0.45)' }}>
          Help other women find stories from someone just like them.
        </p>
      </div>

      <div className="max-w-2xl mx-auto px-8 py-12 space-y-7">
        {error && (
          <div className="p-3 text-sm" style={{ background: 'rgba(255,77,77,0.1)', border: '1px solid rgba(255,77,77,0.25)', color: 'var(--coral)' }}>
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 text-sm" style={{ background: 'rgba(125,187,138,0.1)', border: '1px solid rgba(125,187,138,0.3)', color: 'var(--sage)' }}>
            ✓ Profile saved! Redirecting...
          </div>
        )}

        {/* Basic info */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { key: 'full_name', label: 'Full Name', placeholder: 'Jane Smith' },
            { key: 'username',  label: 'Username',  placeholder: 'janesmith' },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'rgba(255,248,240,0.45)' }}>{label}</label>
              <input
                className="w-full px-4 py-3 bg-transparent border text-sm focus:outline-none transition-colors"
                style={{ borderColor: 'rgba(255,255,255,0.15)', color: 'var(--cream)' }}
                placeholder={placeholder}
                value={(form as never)[key]}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
              />
            </div>
          ))}
        </div>

        {/* Bio */}
        <div>
          <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'rgba(255,248,240,0.45)' }}>Bio</label>
          <textarea rows={3}
            className="w-full px-4 py-3 bg-transparent border text-sm focus:outline-none resize-none leading-loose"
            style={{ borderColor: 'rgba(255,255,255,0.15)', color: 'var(--cream)' }}
            placeholder="Wall Street quant. Solo traveler since 24. 20+ states, 13 national parks, 5+ countries — all with a full-time job."
            value={form.bio}
            onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
          />
        </div>

        {/* Profession */}
        <div>
          <label className="block text-xs tracking-widest uppercase mb-3" style={{ color: 'rgba(255,248,240,0.45)' }}>Profession</label>
          <div className="flex flex-wrap gap-2">
            {PROFESSIONS.map(p => (
              <button key={p} type="button" onClick={() => setForm(f => ({ ...f, profession: p }))}
                className="px-3 py-1.5 text-xs tracking-wide transition-all"
                style={{
                  background: form.profession === p ? 'rgba(255,77,77,0.15)' : 'transparent',
                  color: form.profession === p ? 'var(--coral)' : 'rgba(255,248,240,0.45)',
                  border: `1px solid ${form.profession === p ? 'var(--coral)' : 'rgba(255,255,255,0.1)'}`,
                }}>
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Location + countries */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'rgba(255,248,240,0.45)' }}>Home Country</label>
            <input
              className="w-full px-4 py-3 bg-transparent border text-sm focus:outline-none"
              style={{ borderColor: 'rgba(255,255,255,0.15)', color: 'var(--cream)' }}
              placeholder="United States"
              value={form.home_country}
              onChange={e => setForm(f => ({ ...f, home_country: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'rgba(255,248,240,0.45)' }}>Countries Visited</label>
            <input type="number"
              className="w-full px-4 py-3 bg-transparent border text-sm focus:outline-none"
              style={{ borderColor: 'rgba(255,255,255,0.15)', color: 'var(--cream)' }}
              placeholder="12"
              value={form.countries_visited}
              onChange={e => setForm(f => ({ ...f, countries_visited: e.target.value }))}
            />
          </div>
        </div>

        {/* Travel style */}
        <div>
          <label className="block text-xs tracking-widest uppercase mb-3" style={{ color: 'rgba(255,248,240,0.45)' }}>Travel Style</label>
          <div className="flex flex-wrap gap-2">
            {TRAVEL_STYLES.map(style => (
              <button key={style} type="button" onClick={() => toggleStyle(style)}
                className="px-3 py-1.5 text-xs tracking-wide transition-all"
                style={{
                  background: form.travel_styles.includes(style) ? 'rgba(255,184,48,0.15)' : 'transparent',
                  color: form.travel_styles.includes(style) ? 'var(--gold)' : 'rgba(255,248,240,0.45)',
                  border: `1px solid ${form.travel_styles.includes(style) ? 'var(--gold)' : 'rgba(255,255,255,0.1)'}`,
                }}>
                {style}
              </button>
            ))}
          </div>
        </div>

        {/* Social links */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { key: 'instagram', label: 'Instagram', placeholder: '@yourhandle' },
            { key: 'linkedin',  label: 'LinkedIn',  placeholder: 'linkedin.com/in/you' },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'rgba(255,248,240,0.45)' }}>{label}</label>
              <input
                className="w-full px-4 py-3 bg-transparent border text-sm focus:outline-none"
                style={{ borderColor: 'rgba(255,255,255,0.15)', color: 'var(--cream)' }}
                placeholder={placeholder}
                value={(form as never)[key]}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
              />
            </div>
          ))}
        </div>

        {/* Save */}
        <button onClick={handleSave} disabled={saving}
          className="w-full py-4 flex items-center justify-center gap-2 text-sm tracking-widest uppercase font-medium transition-all hover:-translate-y-0.5 disabled:opacity-50"
          style={{ background: 'var(--coral)', color: 'white' }}>
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </div>
    </div>
  )
}
