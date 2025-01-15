// lib/services/api/types.ts
export interface User {
    id: string
    email: string
    current_step: number
    about_me?: string
    street_address?: string
    city?: string
    state?: string
    zip?: string
    birthdate?: string
    created_at: string
  }
  
  export interface AdminConfig {
    page_number: number
    components: string[]
  }
  