import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const rawNext = searchParams.get('next') ?? '/dashboard'
  const next = rawNext.startsWith('/') ? rawNext : '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }

    const message = encodeURIComponent('Your verification link is invalid or has expired. Please request a new sign-in link.')
    return NextResponse.redirect(`${origin}/auth/error?message=${message}`)
  }

  const message = encodeURIComponent('The verification link is missing a confirmation code. Please request a new sign-in link.')
  return NextResponse.redirect(`${origin}/auth/error?message=${message}`)
}
