import { NextResponse } from 'next/server'
import { userService } from '@/lib/services/api/userService'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }  // Changed from id to userId
) {
    console.log('IN DELETE')
  console.log('DELETE request received for user:', params.id)  // Changed from id to userId
  console.log('Request method:', request.method)
  console.log('Request URL:', request.url)
  
  try {
    await userService.deleteUser(params.id)  // Changed from id to userId
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