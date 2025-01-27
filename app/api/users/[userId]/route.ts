import { NextResponse } from 'next/server'
import { supabase } from '@/lib/services/config/supabase'

export async function PUT(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const data = await request.json()
    const { error } = await supabase
      .from('users')
      .update(data)
      .eq('id', params.userId)

    if (error) throw error
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 400 }
    )
  }
}

export async function GET(
  _request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', params.userId)
      .single()

    if (error) throw error
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 400 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { userId: string } } 
) {
  try {

    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', params.userId)
    return NextResponse.json({ message: 'User deleted successfully' })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    )
  }
}

export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Allow': 'DELETE, OPTIONS',
    },
  })
}