'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const formSchema = z.object({
  street_address: z.string().min(5, 'Address must be at least 5 characters'),
})

interface AddressFormProps {
  value?: string
  onChange: (value: string) => void
}

export function AddressForm({ value = '', onChange }: AddressFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter your address"
          className="mt-1"
        />
      </div>
    </div>
  )
}