import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')

  let query = supabase
    .from('gear_items')
    .select(`
      *,
      gear_reviews (
        id, rating, review_text, trip_type, created_at,
        profiles (username, avatar_url)
      )
    `)
    .order('upvotes', { ascending: false })

  if (category) query = query.eq('category', category)

  const { data, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}
