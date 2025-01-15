// lib/services/api/userService.ts
import { supabase } from '../config/supabase'
import type { User } from './types'

interface UserData {
  [key: string]: any
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

  getUserById: async (userId: string): Promise<User> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select()
        .eq('id', userId)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      throw new Error(`Failed to get user: ${error.message}`)
    }
  },

  getAllUsers: async (): Promise<User[]> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select()
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    } catch (error) {
      throw new Error(`Failed to get users: ${error.message}`)
    }
  }
}
