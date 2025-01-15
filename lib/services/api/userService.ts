// lib/services/api/userService.ts
import { supabase } from '../config/supabase'
import type { User } from './types'

export const userService = {
  async createUser(email: string, password: string): Promise<User> {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([{ email, password, current_step: 1 }])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`)
    }
  },

  async updateUser(userId: string, userData: Partial<User>): Promise<User> {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(userData)
        .eq('id', userId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      throw new Error(`Failed to update user: ${error.message}`)
    }
  },

  async getUserById(userId: string): Promise<User> {
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

  async getAllUsers(): Promise<User[]> {
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
