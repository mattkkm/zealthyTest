'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const formSchema = z.object({
  birthdate: z.string().min(1, 'Birthdate is required'),
})

interface BirthdateFormProps {
  value?: string
  onChange: (value: string) => void
}

export function BirthdateForm({ value = '', onChange }: BirthdateFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="birthdate">Birthdate</Label>
        <Input
          id="birthdate"
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1"
        />
      </div>
    </div>
  )
}