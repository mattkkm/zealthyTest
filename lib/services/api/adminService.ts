// lib/services/api/adminService.ts
import { supabase } from '../config/supabase'
import type { AdminConfig } from './types'

export const adminService = {
  getPageConfigs: async () => {
    const res = await fetch('/api/admin')
    if (!res.ok) throw new Error('Failed to fetch page configs')
    return res.json()
  }
}