'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

// Define available components
const COMPONENTS = [
  { id: 'about', label: 'About Me' },
  { id: 'address', label: 'Address' },
  { id: 'birthdate', label: 'Birthdate' }
] as const

interface PageConfig {
  id: string
  page_number: number
  components: string[]
}

export default function AdminPage() {
  const { toast } = useToast()
  const [pages, setPages] = useState<PageConfig[]>([])
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    fetchConfig()
  }, [])

  const fetchConfig = async () => {
    const res = await fetch('/api/admin')
    if (res.ok) {
      const data = await res.json()
      setPages(data.sort((a: PageConfig, b: PageConfig) => 
        a.page_number - b.page_number
      ))
    }
  }

  const updateConfig = async (pageNumber: number, components: string[]) => {
    try {
      const res = await fetch('/api/admin', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageNumber, components }),
      })
      if (!res.ok) throw new Error('Failed to update')
    } catch (error) {
      // If update fails, refresh the page state
      await fetchConfig()
      toast({
        title: "Error",
        description: "Failed to update configuration",
        variant: "destructive",
      })
    }
  }

  const toggleComponent = async (componentId: string, targetPage: PageConfig) => {
    if (isUpdating) return // Prevent multiple rapid clicks

    // Check if we're trying to remove the component
    if (targetPage.components.includes(componentId)) {
      // Prevent removing if it's the last component
      if (targetPage.components.length <= 1) {
        toast({
          title: "Error",
          description: "Cannot remove the last component from a page",
          variant: "destructive",
        })
        return
      }
    }

    // Find the page that currently has this component
    const sourcePageWithComponent = pages.find(p => 
      p.id !== targetPage.id && p.components.includes(componentId)
    )

    if (sourcePageWithComponent?.components.length <= 1) {
      toast({
        title: "Error",
        description: "Cannot remove the last component from a page",
        variant: "destructive",
      })
      return
    }

    setIsUpdating(true)

    // Optimistically update the UI
    let updatedPages = [...pages]
    const targetPageIndex = pages.findIndex(p => p.id === targetPage.id)

    if (sourcePageWithComponent) {
      const sourcePageIndex = pages.findIndex(p => p.id === sourcePageWithComponent.id)
      updatedPages[sourcePageIndex] = {
        ...sourcePageWithComponent,
        components: sourcePageWithComponent.components.filter(c => c !== componentId)
      }
      
      updatedPages[targetPageIndex] = {
        ...targetPage,
        components: [...targetPage.components, componentId]
      }

      setPages(updatedPages)

      // Update database in background
      try {
        await Promise.all([
          updateConfig(sourcePageWithComponent.page_number, updatedPages[sourcePageIndex].components),
          updateConfig(targetPage.page_number, updatedPages[targetPageIndex].components)
        ])
      } catch {
        // Error handling is in updateConfig
      }
    } else {
      const hasComponent = targetPage.components.includes(componentId)
      
      updatedPages[targetPageIndex] = {
        ...targetPage,
        components: hasComponent
          ? targetPage.components.filter(c => c !== componentId)
          : [...targetPage.components, componentId]
      }

      setPages(updatedPages)

      // Update database in background
      try {
        await updateConfig(
          targetPage.page_number, 
          updatedPages[targetPageIndex].components
        )
      } catch {
        // Error handling is in updateConfig
      }
    }

    setIsUpdating(false)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Admin Configuration</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {pages.map((page) => (
          <Card key={page.id}>
            <CardHeader>
              <CardTitle>Page {page.page_number}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {COMPONENTS.map(component => (
                <Button
                  key={component.id}
                  variant={page.components.includes(component.id) ? "default" : "outline"}
                  className="mr-2"
                  onClick={() => toggleComponent(component.id, page)}
                  disabled={isUpdating}
                >
                  {component.label}
                </Button>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}