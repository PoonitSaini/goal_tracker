import type { Metadata } from 'next'
import { Geist, Geist_Mono, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AppShell } from '@/components/app-shell'
import './globals.css'

const geist = Geist({ 
  subsets: ["latin"],
  variable: "--font-geist"
})

const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: "--font-geist-mono"
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains"
})

const appUrl = process.env.NEXT_PUBLIC_APP_URL

export const metadata: Metadata = {
  metadataBase: appUrl ? new URL(appUrl) : undefined,
  title: 'DevPulse - Developer Productivity Tracker',
  description: 'Track your coding goals, habits, and progress with a modern developer-focused dashboard',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark bg-background" suppressHydrationWarning>
      <body className={`${geist.variable} ${geistMono.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <AppShell>{children}</AppShell>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
