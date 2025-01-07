import '../globals.css'
import { Inter } from 'next/font/google'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Zealthy Onboarding',
  description: 'Custom onboarding flow for Zealthy users',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="min-h-screen bg-background">
          <div className="container mx-auto py-4">
            {children}
          </div>
        </main>
        <Toaster />
      </body>
    </html>
  )
}