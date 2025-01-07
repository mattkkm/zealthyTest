'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const components = ['about', 'address', 'birthdate']

export default function AdminPage() {
  const [page2Components, setPage2Components] = useState<string[]>([])
  const [page3Components, setPage3Components] = useState<string[]>([])

  useEffect(() => {
    fetchConfig()
  }, [])

  const fetchConfig = async () => {
    const res = await fetch('/api/admin')
    if (res.ok) {
      const data = await res.json()
      console.log('data from dmin-',data)
      data.forEach((config: any) => {
        if (config.page_number === 2) setPage2Components(config.components)
        if (config.page_number === 3) setPage3Components(config.components)
      })
    }
  }

  const updateConfig = async (pageNumber: number, components: string[]) => {
    await fetch('/api/admin', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pageNumber, components }),
    })
  }

  const toggleComponent = (component: string, page: number) => {
    if (page === 2) {
      const newComponents = page2Components.includes(component)
        ? page2Components.filter(c => c !== component)
        : [...page2Components, component]
      setPage2Components(newComponents)
      updateConfig(2, newComponents)
    } else {
      const newComponents = page3Components.includes(component)
        ? page3Components.filter(c => c !== component)
        : [...page3Components, component]
      setPage3Components(newComponents)
      updateConfig(3, newComponents)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Admin Configuration</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Page 2 Components</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {components.map(component => (
              <Button
                key={component}
                variant={page2Components.includes(component) ? "default" : "outline"}
                className="mr-2"
                onClick={() => toggleComponent(component, 2)}
              >
                {component}
              </Button>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Page 3 Components</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {components.map(component => (
              <Button
                key={component}
                variant={page3Components.includes(component) ? "default" : "outline"}
                className="mr-2"
                onClick={() => toggleComponent(component, 3)}
              >
                {component}
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}