import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

export default function CompletePage() {
  return (
    <div className="container max-w-md mx-auto py-10">
      <Card>
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <CardTitle className="text-center">All Done!</CardTitle>
          <CardDescription className="text-center">
            Your account has been successfully set up
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <p className="text-center text-muted-foreground">
            Thank you for completing the onboarding process.
          </p>
          <Link href="/data">
            <Button>View All Submissions</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}