import Link from 'next/link'

type AuthErrorPageProps = {
  searchParams?: {
    message?: string
  }
}

const DEFAULT_MESSAGE = 'We could not verify your sign-in link. It may have expired or already been used.'

export default function AuthErrorPage({ searchParams }: AuthErrorPageProps) {
  const message = searchParams?.message || DEFAULT_MESSAGE

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: 'var(--ink)' }}>
      <div className="w-full max-w-md text-center">
        <Link href="/" className="block mb-10 text-center">
          <img src="/logo.svg" alt="SOLOFTS" height={48} style={{ height: 48, width: 'auto', margin: '0 auto' }} />
        </Link>

        <div className="p-8" style={{ background: 'rgba(255,77,77,0.08)', border: '1px solid rgba(255,77,77,0.25)' }}>
          <div className="text-4xl mb-4">⚠️</div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 28 }}>Verification link failed</h1>
          <p className="mt-3 text-sm" style={{ color: 'rgba(255,248,240,0.65)' }}>
            {message}
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Link
              href="/auth/login"
              className="w-full py-3.5 text-sm font-semibold transition-all hover:opacity-90"
              style={{ background: 'var(--coral)', color: 'white' }}
            >
              Try signing in again
            </Link>
            <Link href="/auth/signup" className="text-sm" style={{ color: 'var(--cream)', opacity: 0.7 }}>
              Create a new account
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
