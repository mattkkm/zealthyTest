'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AboutMeForm } from '@/components/forms/AboutMeForm'
import { AddressForm } from '@/components/forms/AddressForm'
import { BirthdateForm } from '@/components/forms/BirthdateForm'

export default function StepPage({ params }: { params: { step: string } }) {
  const router = useRouter()
  const [components, setComponents] = useState<string[]>([])
  const step = parseInt(params.step)

  useEffect(() => {
    fetchPageComponents()
  }, [])

  const fetchPageComponents = async () => {
    const res = await fetch('/api/admin')
    if (res.ok) {
      const data = await res.json()
      const pageConfig = data.find((config: any) => config.page_number === step)
      if (pageConfig) {
        setComponents(pageConfig.components)
      }
    }
  }

  const handleSubmit = async (formData: any) => {
    const urlParams = new URLSearchParams(window.location.search)
    const userId = urlParams.get('userId')

    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          current_step: step
        }),
      })

      if (!res.ok) throw new Error('Failed to update user')

      // Navigate to next step or completion
      if (step < 3) {
        router.push(`/onboarding/${step + 1}?userId=${userId}`)
      } else {
        router.push('/onboarding/complete')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Step {step} of 3</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {components.includes('about') && <AboutMeForm onSubmit={handleSubmit} />}
        {components.includes('address') && <AddressForm onSubmit={handleSubmit} />}
        {components.includes('birthdate') && <BirthdateForm onSubmit={handleSubmit} />}
      </CardContent>
    </Card>
  )
}