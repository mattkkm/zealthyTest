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

const formSchema = z.object({
  about_me: z.string().min(10, 'Please write at least 10 characters'),
})

type AboutMeFormProps = {
  onSubmit: (data: z.infer<typeof formSchema>) => void
  defaultValue?: string
  submitted: boolean
}

export function AboutMeForm({ onSubmit, defaultValue = '', submitted }: AboutMeFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      about_me: defaultValue,
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="about_me"
          render={({ field }) => (
            <FormItem>
              <FormLabel>About Me</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about yourself..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {submitted ?<Button type="submit" disabled className="w-full">Saved</Button>  : <Button type="submit">Save & Continue</Button>}
      </form>
    </Form>
  )
}