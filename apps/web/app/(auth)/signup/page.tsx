'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${location.origin}/api/auth/callback`,
      },
    })
    setLoading(false)
    if (error) setError(error.message)
    else setDone(true)
  }

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/api/auth/callback` },
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: 'var(--ink)' }}>
      <div className="w-full max-w-md">
        <Link href="/" className="block mb-10 text-center">
          <img src="/logo.svg" alt="SOLOFTS" height={48} style={{ height: 48, width: 'auto', margin: '0 auto' }} />
        </Link>

        {done ? (
          <div className="text-center p-8"
            style={{ background: 'rgba(125,187,138,0.08)', border: '1px solid rgba(125,187,138,0.2)' }}>
            <div className="text-4xl mb-4">🎉</div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24 }}>You're in the pack!</h2>
            <p className="mt-3 text-sm" style={{ color: 'rgba(255,248,240,0.55)' }}>
              Check <strong>{email}</strong> to confirm your account, then start sharing.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-8 text-center">
              <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 48 }}>JOIN THE PACK</h1>
              <p className="text-sm mt-1" style={{ color: 'rgba(255,248,240,0.45)' }}>
                Already a member?{' '}
                <Link href="/auth/login" style={{ color: 'var(--coral)' }}>Sign in</Link>
              </p>
            </div>

            <button onClick={handleGoogle}
              className="w-full flex items-center justify-center gap-3 py-3.5 mb-6 text-sm transition-all hover:opacity-80"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'var(--cream)' }}>
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
              <span className="text-xs tracking-widest uppercase" style={{ color: 'rgba(255,248,240,0.3)' }}>or</span>
              <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-center"
                  style={{ background: 'rgba(255,77,77,0.1)', border: '1px solid rgba(255,77,77,0.3)', color: 'var(--coral)' }}>
                  {error}
                </div>
              )}
              <input type="text" placeholder="Your name"
                className="w-full px-4 py-3 bg-transparent border focus:outline-none text-sm"
                style={{ borderColor: 'rgba(255,255,255,0.15)', color: 'var(--cream)' }}
                value={name} onChange={e => setName(e.target.value)} />
              <input type="email" required placeholder="Email address"
                className="w-full px-4 py-3 bg-transparent border focus:outline-none text-sm"
                style={{ borderColor: 'rgba(255,255,255,0.15)', color: 'var(--cream)' }}
                value={email} onChange={e => setEmail(e.target.value)} />
              <input type="password" required placeholder="Password (min 6 chars)" minLength={6}
                className="w-full px-4 py-3 bg-transparent border focus:outline-none text-sm"
                style={{ borderColor: 'rgba(255,255,255,0.15)', color: 'var(--cream)' }}
                value={password} onChange={e => setPassword(e.target.value)} />
              <button type="submit" disabled={loading}
                className="w-full py-3.5 text-sm tracking-widest uppercase font-medium transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ background: 'var(--coral)', color: 'white' }}>
                {loading && <Loader2 size={14} className="animate-spin" />}
                Create Free Account
              </button>
              <p className="text-center text-xs" style={{ color: 'rgba(255,248,240,0.25)' }}>
                By joining you agree to our{' '}
                <Link href="/terms" style={{ color: 'var(--coral)' }}>Terms</Link> and{' '}
                <Link href="/privacy" style={{ color: 'var(--coral)' }}>Privacy Policy</Link>
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
