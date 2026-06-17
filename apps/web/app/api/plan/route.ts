import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { destination, days, budget, pto, risk, fitness, interests } = body

  // Call OpenAI API for trip planning
  const prompt = `You are an expert solo female travel planner. Generate a detailed, realistic itinerary for the following trip.

Trip details:
- Destination: ${destination}
- Duration: ${days} days
- Budget: $${budget} USD total
- PTO days used: ${pto}
- Risk comfort: ${risk}
- Fitness level: ${fitness}
- Interests: ${interests?.join(', ') || 'general'}

Respond ONLY with a valid JSON object (no markdown, no backticks) in this exact structure:
{
  "destination": "City, Country",
  "summary": "2-3 sentence trip overview tailored to a solo woman traveling with a day job",
  "days": [
    {
      "day": 1,
      "title": "Day title",
      "activities": ["activity 1", "activity 2", "activity 3", "activity 4"],
      "accommodation": "Specific hotel recommendation with brief reason",
      "food": "Food recommendation with approximate cost",
      "safety_note": "Optional specific safety tip for solo women",
      "estimated_cost": 150
    }
  ],
  "total_cost": 1200,
  "packing_tips": ["tip 1", "tip 2", "tip 3", "tip 4"],
  "safety_summary": "Overall safety assessment for solo women at this destination"
}`

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY || process.env.OPEN_AI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        max_tokens: 4000,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: 'You are an expert solo female travel planner. Always respond with valid JSON only.' },
          { role: 'user', content: prompt },
        ],
      }),
    })

    const data = await response.json()
    const text = data.choices?.[0]?.message?.content || ''

    let itinerary
    try {
      itinerary = JSON.parse(text)
    } catch {
      // Strip any accidental markdown fences
      const clean = text.replace(/```json|```/g, '').trim()
      itinerary = JSON.parse(clean)
    }

    // Optionally save to DB
    if (user) {
      await supabase.from('trip_plans').insert({
        author_id: user.id,
        title: `${destination} — ${days} Day Trip`,
        destination,
        days_count: parseInt(days),
        budget_usd: parseInt(budget),
        pto_days: parseInt(pto),
        risk_level: risk as 'low' | 'medium' | 'high',
        fitness_level: fitness as 'easy' | 'moderate' | 'challenging',
        itinerary,
        is_public: false,
        ai_generated: true,
      })
    }

    return NextResponse.json({ itinerary })
  } catch (err) {
    console.error('Plan API error:', err)
    return NextResponse.json({ error: 'Failed to generate itinerary. Please try again.' }, { status: 500 })
  }
}
