'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Label } from '@radix-ui/react-label'

const formSchema = z.object({
  about_me: z.string().min(10, 'Please write at least 10 characters'),
})

interface AboutMeFormProps {
  value?: string
  onChange: (value: string) => void
}

export function AboutMeForm({ value = '', onChange }: AboutMeFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="about">About Me</Label>
        <Textarea
          id="about"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Tell us about yourself"
          className="mt-1"
        />
      </div>
    </div>
  )
}