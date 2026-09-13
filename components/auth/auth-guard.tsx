"use client"

import { useEffect, type ReactNode } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/components/providers/auth-provider"
import { Loader2 } from "lucide-react"

const PUBLIC_PATHS = ["/login"]

function isLoginPath(pathname: string) {
  return PUBLIC_PATHS.includes(pathname)
}

export function AuthGuard({ children }: { children: ReactNode }) {
  const { userId, hydrated } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const addingAccount = searchParams.get("add") === "1"

  useEffect(() => {
    if (!hydrated) return
    if (!userId && !isLoginPath(pathname)) {
      router.replace("/login")
    }
    if (userId && isLoginPath(pathname) && !addingAccount) {
      router.replace("/")
    }
  }, [userId, hydrated, pathname, router, addingAccount])

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!userId && !PUBLIC_PATHS.includes(pathname)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return <>{children}</>
}
