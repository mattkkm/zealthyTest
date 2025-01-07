import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await supabase
    .from('admin_config')
    .select('*')
    .order('page_number', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json(data)
}

export async function PUT(request: Request) {
  const { pageNumber, components } = await request.json()
  const { data, error } = await supabase
    .from('admin_config')
    .update({ components })
    .eq('page_number', pageNumber)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json(data)
}