// lib/services/api/userService.ts
import { supabase } from '../config/supabase'
import type { User } from './types'

interface UserData {
  [key: string]: any
}

const handleSupabaseError = (error: any) => {
  console.error('Supabase error:', error)
  throw new Error(error.message || 'An error occurred')
}

export const userService = {
  createUser: async (userData: { email: string, password: string }) => {
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    })
    
    if (!res.ok) throw new Error('Failed to create user')
    return res.json()
  },

  updateUser: async (userId: string, userData: UserData) => {
    const res = await fetch(`/api/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    })

    if (!res.ok) throw new Error('Failed to update user')
    return res.json()
  },

  deleteUser: async (userId: string) => {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId)

    if (error) handleSupabaseError(error)
  },

  getUserById: async (userId: string): Promise<User> => {
    const { data, error } = await supabase
      .from('users')
      .select()
      .eq('id', userId)
      .single()

    if (error) throw error
    return data
  },

  getAllUsers: async (): Promise<User[]> => {
    const { data, error } = await supabase
      .from('users')
      .select()
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }
}
