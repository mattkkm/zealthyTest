'use client'

import { usePathname } from 'next/navigation'
// import { ProgressBar } from '@/components/layout/ProgressBar'
import { ProgressBar } from '@/components/layout/ProgressBar'

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  
  // Calculate current step based on pathname
  const getCurrentStep = () => {
    if (pathname === '/onboarding') return 1
    if (pathname === '/onboarding/complete') return 3
    const step = pathname.split('/').pop()
    return step ? parseInt(step) : 1
  }

  // Don't show progress bar on completion page
  const showProgress = pathname !== '/onboarding/complete'

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto pt-8">
        {showProgress && (
          <ProgressBar currentStep={getCurrentStep()} totalSteps={3} />
        )}
        {children}
      </div>
    </div>
  )
}