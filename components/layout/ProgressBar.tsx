'use client'

import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

type ProgressBarProps = {
  currentStep: number
  totalSteps: number
}

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100

  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <div className="flex justify-between mb-2 relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-muted -translate-y-1/2" />
        <div 
          className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className="relative flex flex-col items-center"
          >
            <div
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-500",
                i + 1 < currentStep
                  ? "bg-primary border-primary text-primary-foreground"
                  : i + 1 === currentStep
                  ? "bg-primary border-primary text-primary-foreground animate-glow"
                  : "bg-background border-muted"
              )}
            >
              {i + 1 < currentStep ? (
                <Check className="w-4 h-4" />
              ) : (
                i + 1
              )}
            </div>
            <span className={cn(
              "text-xs mt-1",
              i + 1 <= currentStep ? "text-primary font-medium" : "text-muted-foreground"
            )}>
              Step {i + 1}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}