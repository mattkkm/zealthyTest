'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AboutMeForm } from '@/components/forms/AboutMeForm'
import { AddressForm } from '@/components/forms/AddressForm'
import { BirthdateForm } from '@/components/forms/BirthdateForm'

export default function StepPage({ params }: { params: Promise<{ step: string }> }) {
  const router = useRouter()
  const [components, setComponents] = useState<string[]>([])
  const [submittedComponents, setSubmittedComponents] = useState<{ [key: string]: boolean }>({})
  // const step = parseInt(params.step)
  const resolvedParams = use(params)
  const step = parseInt(resolvedParams.step)

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
      // Mark this component as submitted
      const formKey = Object.keys(formData)[0]
      const updatedComponents = {
        ...submittedComponents,
        [formKey]: true
      }
      setSubmittedComponents(updatedComponents)
      // Check if all components on this page have been submitted
      const allSubmitted = components.every(component => {
        switch (component) {
          case 'about':
            return updatedComponents['about_me']
          case 'address':
            return updatedComponents['street_address']
          case 'birthdate':
            return updatedComponents['birthdate']
          default:
            return false
        }
      })
      if (!allSubmitted) {
        return // Don't proceed to next page until all components are submitted
      }

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
        {components.includes('about') && <AboutMeForm submitted={submittedComponents['about_me']} onSubmit={handleSubmit} />}
        {components.includes('address') && <AddressForm submitted={submittedComponents['address']} onSubmit={handleSubmit} />}
        {components.includes('birthdate') && <BirthdateForm submitted={submittedComponents['birthdate']} onSubmit={handleSubmit} />}
      </CardContent>
    </Card>
  )
}