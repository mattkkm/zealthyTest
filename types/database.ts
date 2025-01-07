export type Database = {
    public: {
      Tables: {
        users: {
          Row: {
            id: string
            email: string
            password: string
            about_me: string | null
            street_address: string | null
            city: string | null
            state: string | null
            zip: string | null
            birthdate: string | null
            current_step: number
            created_at: string
            updated_at: string
          }
          Insert: {
            email: string
            password: string
            about_me?: string | null
            street_address?: string | null
            city?: string | null
            state?: string | null
            zip?: string | null
            birthdate?: string | null
            current_step?: number
          }
          Update: Partial<{
            email: string
            password: string
            about_me: string | null
            street_address: string | null
            city: string | null
            state: string | null
            zip: string | null
            birthdate: string | null
            current_step: number
          }>
        }
        admin_config: {
          Row: {
            id: string
            page_number: number
            components: string[]
            created_at: string
            updated_at: string
          }
          Insert: {
            page_number: number
            components: string[]
          }
          Update: {
            page_number?: number
            components?: string[]
          }
        }
      }
    }
  }