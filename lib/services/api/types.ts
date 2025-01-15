// lib/services/api/types.ts
export interface User {
    id: string
    email: string
    password: string
    about_me?: string
    street_address?: string
    city?: string
    state?: string
    zip?: string
    birthdate?: string
    current_step: number
  }
  
  export interface AdminConfig {
    page_number: number
    components: string[]
  }
  