import { NextResponse } from 'next/server'
import { supabase } from '@/lib/services/config/supabase'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    const { data, error } = await supabase
      .from('users')
      .insert([{ email, password, current_step: 1 }])
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to create user' }, { status: 400 })
  }
}

export async function GET() {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json(data)
}