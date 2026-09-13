"use client"

import { usePathname } from "next/navigation"
import { Suspense } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/providers/auth-provider"
import { AppProvider, useApp } from "@/components/providers/app-provider"
import { AuthGuard } from "@/components/auth/auth-guard"
import { QuickAddTaskDialog } from "@/components/quick-add-task-dialog"
import { Toaster } from "@/components/ui/sonner"
import type { ReactNode } from "react"

const PUBLIC_PATHS = ["/login"]

function QuickAddDialogHost() {
  const { quickAddOpen, setQuickAddOpen } = useApp()
  return <QuickAddTaskDialog open={quickAddOpen} onOpenChange={setQuickAddOpen} />
}

function ShellRouter({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isPublic = PUBLIC_PATHS.includes(pathname)

  if (isPublic) return <>{children}</>

  return (
    <AppProvider>
      {children}
      <QuickAddDialogHost />
    </AppProvider>
  )
}

function AuthGuardFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <span className="text-sm text-muted-foreground">Loading…</span>
    </div>
  )
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <AuthProvider>
        <Suspense fallback={<AuthGuardFallback />}>
          <AuthGuard>
            <ShellRouter>{children}</ShellRouter>
          </AuthGuard>
        </Suspense>
      </AuthProvider>
      <Toaster richColors position="bottom-right" />
    </ThemeProvider>
  )
}
