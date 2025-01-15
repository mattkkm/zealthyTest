import { NextResponse } from 'next/server'
import { supabase } from '@/lib/services/config/supabase'

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
  try {
    const { pageNumber, components } = await request.json()
    
    // First check if configuration exists
    const { data: existingConfig } = await supabase
      .from('admin_config')
      .select()
      .eq('page_number', pageNumber)
    
    let result;
    
    if (!existingConfig || existingConfig.length === 0) {
      // If no configuration exists, create one
      result = await supabase
        .from('admin_config')
        .insert([{ page_number: pageNumber, components }])
        .select()
    } else {
      // If configuration exists, update it
      result = await supabase
        .from('admin_config')
        .update({ components })
        .eq('page_number', pageNumber)
        .select()
    }

    const { data, error } = result

    if (error) throw error
    
    return NextResponse.json(data[0])
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update configuration' },
      { status: 400 }
    )
  }
}