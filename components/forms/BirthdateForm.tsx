'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

const formSchema = z.object({
  birthdate: z.string().refine((val) => {
    const date = new Date(val)
    return !isNaN(date.getTime())
  }, 'Please enter a valid date'),
})

type BirthdateFormProps = {
  onSubmit: (data: z.infer<typeof formSchema>) => void
  defaultValue?: string
  submitted: boolean
}

export function BirthdateForm({ onSubmit, defaultValue, submitted }: BirthdateFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      birthdate: defaultValue || '',
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="birthdate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Birthdate</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {submitted ? <></>: <Button type="submit" className="w-full">Save & Continue</Button>}
      </form>
    </Form>
  )
}