import { Suspense } from "react"
import { AuthForm } from "@/components/auth/auth-form"
import { Loader2 } from "lucide-react"

function LoginFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Suspense fallback={<LoginFallback />}>
        <AuthForm />
      </Suspense>
    </div>
  )
}
