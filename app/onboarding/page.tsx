'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AboutMeForm } from '@/components/forms/AboutMeForm'
import { AddressForm } from '@/components/forms/AddressForm'
import { BirthdateForm } from '@/components/forms/BirthdateForm'
// import { SignUpForm } from '@/components/forms/SignUpForm'
import { NewForm } from '@/components/forms/NewForm'
import { Button } from '@/components/ui/button'
import { ProgressBar } from '@/components/layout/ProgressBar'
import { adminService } from '@/lib/services/api/adminService'
import { userService } from '@/lib/services/api/userService'

interface PageConfig {
  page_number: number
  components: string[]
}

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [pageConfigs, setPageConfigs] = useState<PageConfig[]>([])
  const [formData, setFormData] = useState<{ [key: string]: any }>({})
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    fetchInitialData()
    initializeFromUrl()
  }, [])

  const initializeFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search)
    const initialUserId = urlParams.get('userId')
    if (initialUserId) {
      setUserId(initialUserId)
      window.history.replaceState({}, '', window.location.pathname)
    }
  }

  const fetchInitialData = async () => {
    loadFromLocalStorage()
    await fetchPageConfigs()
  }

  const loadFromLocalStorage = () => {
    const savedData = localStorage.getItem('onboardingData')
    const savedUserId = localStorage.getItem('onboardingUserId')
    const savedStep = localStorage.getItem('onboardingStep')
    
    if (savedData) setFormData(JSON.parse(savedData))
    if (savedUserId) setUserId(savedUserId)
    if (savedStep) setCurrentStep(parseInt(savedStep))
  }

  const fetchPageConfigs = async () => {
    try {
      const data = await adminService.getPageConfigs()
      setPageConfigs(data.sort((a, b) => a.page_number - b.page_number))
    } catch (error) {
      console.error('Error fetching page configs:', error)
    }
  }

  const handleFormChange = (data: any) => {
    const newFormData = { ...formData, ...data }
    setFormData(newFormData)
    localStorage.setItem('onboardingData', JSON.stringify(newFormData))
  }

  const handleNext = () => {
    if (currentStep < totalSteps) {
      const nextStep = currentStep + 1
      setCurrentStep(nextStep)
      localStorage.setItem('onboardingStep', nextStep.toString())
    }
  }

  const handleBack = () => {
    if (currentStep > 2) {
      const prevStep = currentStep - 1
      setCurrentStep(prevStep)
      localStorage.setItem('onboardingStep', prevStep.toString())
    }
  }

  const handleSubmit = async () => {
    if (!userId) {
      console.error('No userId found')
      return
    }

    try {
      await userService.updateUser(userId, {
        ...formData,
        current_step: totalSteps
      })
      
      clearLocalStorage()
      router.push('/onboarding/complete')
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const clearLocalStorage = () => {
    localStorage.removeItem('onboardingData')
    localStorage.removeItem('onboardingUserId')
    localStorage.removeItem('onboardingStep')
  }
  useEffect(() => {
    if (userId) {
      localStorage.setItem('onboardingUserId', userId)
    }
  }, [userId])

  const currentPageConfig = pageConfigs.find(config => config.page_number === currentStep)
  const components = currentPageConfig?.components || []
  const totalSteps = pageConfigs.length > 0 
    ? Math.max(...pageConfigs.map(config => config.page_number))
    : 0

  const isLastStep = currentStep === totalSteps
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

  const handleSignUpComplete = (newUserId: string) => {
    setUserId(newUserId)
    setCurrentStep(2)
    localStorage.setItem('onboardingStep', '2')
    localStorage.setItem('onboardingUserId', newUserId)
  }

  return (
    <div className="max-w-2xl mx-auto">
      {currentStep > 1 && (
        <ProgressBar 
          currentStep={currentStep}
          totalSteps={totalSteps}
          // totalSteps={totalSteps - 1}
        />
      )}
      <Card>
        <CardHeader>
          <CardTitle>
            {currentStep === 1 
              ? "Create Your Account" 
              : `Step ${currentStep} of ${totalSteps}`}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {currentStep === 1 ? (
            <NewForm onComplete={handleSignUpComplete} />
          ) : (
            <>
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

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep <= 2}
                >
                  Back
                </Button>
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
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}