'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AboutMeForm } from '@/components/forms/AboutMeForm'
import { AddressForm } from '@/components/forms/AddressForm'
import { BirthdateForm } from '@/components/forms/BirthdateForm'
import { Button } from '@/components/ui/button'

interface PageConfig {
  page_number: number
  components: string[]
}

export default function StepPage({ params }: { params: Promise<{ step: string }> }) {
  const router = useRouter()
  const [pageConfigs, setPageConfigs] = useState<PageConfig[]>([])
  const [formData, setFormData] = useState<{ [key: string]: any }>({})
  const [userId, setUserId] = useState<string | null>(null)
  const resolvedParams = use(params)
  const step = parseInt(resolvedParams.step)

  useEffect(() => {
    fetchInitialData()
    // Get userId from URL once on initial load and store in state
    const urlParams = new URLSearchParams(window.location.search)
    const initialUserId = urlParams.get('userId')
    if (initialUserId) {
      setUserId(initialUserId)
      // Remove userId from URL
      const newUrl = `${window.location.pathname}`
      window.history.replaceState({}, '', newUrl)
    }
  }, [])

  const fetchInitialData = async () => {
    // Load saved form data and userId from localStorage
    const savedData = localStorage.getItem('onboardingData')
    const savedUserId = localStorage.getItem('onboardingUserId')
    
    if (savedData) {
      setFormData(JSON.parse(savedData))
    }
    if (savedUserId) {
      setUserId(savedUserId)
    }

    const res = await fetch('/api/admin')
    if (res.ok) {
      const data: PageConfig[] = await res.json()
      setPageConfigs(data.sort((a, b) => a.page_number - b.page_number))
    }
  }

  const handleFormChange = (data: any) => {
    const authFormData = { ...formData, ...data }
    setFormData(authFormData)
    localStorage.setItem('onboardingData', JSON.stringify(authFormData))
  }

  const handleNext = () => {
    if (step < totalSteps) {
      router.push(`/onboarding/${step + 1}`)
    }
  }

  const handleSubmit = async () => {
    if (!userId) {
      console.error('No userId found')
      return
    }

    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          current_step: totalSteps
        }),
      })

      if (!res.ok) throw new Error('Failed to update user')
      
      // Clear stored data after successful submission
      localStorage.removeItem('onboardingData')
      localStorage.removeItem('onboardingUserId')
      router.push('/onboarding/complete')
    } catch (error) {
      console.error('Error:', error)
    }
  }

  // Save userId to localStorage whenever it changes
  useEffect(() => {
    if (userId) {
      localStorage.setItem('onboardingUserId', userId)
    }
  }, [userId])

  // Get current page components and total steps from stored configs
  const currentPageConfig = pageConfigs.find(config => config.page_number === step)
  const components = currentPageConfig?.components || []
  const totalSteps = pageConfigs.length > 0 
    ? Math.max(...pageConfigs.map(config => config.page_number))
    : 0

  const isLastStep = step === totalSteps
  const hasRequiredData = components.every(component => {
    switch (component) {
      case 'about':
        return !!formData.about_me
      case 'address':
        return !!formData.street_address
      case 'birthdate':
        return !!formData.birthdate
      default:
        return false
    }
  })

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Step {step} of {totalSteps}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {components.includes('about') && (
          <AboutMeForm 
            value={formData.about_me} 
            onChange={(data) => handleFormChange({ about_me: data })} 
          />
        )}
        {components.includes('address') && (
          <AddressForm 
            value={formData.street_address} 
            onChange={(data) => handleFormChange({ street_address: data })} 
          />
        )}
        {components.includes('birthdate') && (
          <BirthdateForm 
            value={formData.birthdate} 
            onChange={(data) => handleFormChange({ birthdate: data })} 
          />
        )}

        <div className="flex justify-end">
          {isLastStep ? (
            <Button
              onClick={handleSubmit}
              disabled={!hasRequiredData || !userId}
            >
              Submit All
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!hasRequiredData}
            >
              Next
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}