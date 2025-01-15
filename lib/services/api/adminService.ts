// lib/services/api/adminService.ts
import { supabase } from '../config/supabase'
import type { AdminConfig } from './types'

export const adminService = {
  async getPageConfigurations(): Promise<AdminConfig[]> {
    try {
      const { data, error } = await supabase
        .from('admin_config')
        .select()
        .order('page_number', { ascending: true })

      if (error) throw error
      return data
    } catch (error) {
      throw new Error(`Failed to get configurations: ${error.message}`)
    }
  },

  async updatePageConfiguration(
    pageNumber: number, 
    components: string[]
  ): Promise<AdminConfig> {
    try {
      // First check if configuration exists
      const { data: existingConfig } = await supabase
        .from('admin_config')
        .select()
        .eq('page_number', pageNumber)
        .single()

      let result;
      
      if (!existingConfig) {
        result = await supabase
          .from('admin_config')
          .insert([{ page_number: pageNumber, components }])
          .select()
          .single()
      } else {
        result = await supabase
          .from('admin_config')
          .update({ components })
          .eq('page_number', pageNumber)
          .select()
          .single()
      }

      const { data, error } = result
      if (error) throw error
      return data
    } catch (error) {
      throw new Error(`Failed to update configuration: ${error.message}`)
    }
  }
}