import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/safety — aggregated city scores
export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const country = searchParams.get('country')

  let query = supabase
    .from('city_safety_scores')
    .select('*')
    .order('report_count', { ascending: false })
    .limit(50)

  if (country) query = query.eq('country', country)

  const { data, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

// POST /api/safety — submit a new safety report
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()

  const { data, error } = await supabase
    .from('safety_reports')
    .insert({ ...body, author_id: user.id })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Refresh the materialized view
  await supabase.rpc('refresh_city_safety_scores' as never)

  return NextResponse.json({ data }, { status: 201 })
}
