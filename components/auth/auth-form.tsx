"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Flame, Loader2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/components/providers/auth-provider"
import { toast } from "sonner"

export function AuthForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const addingAccount = searchParams.get("add") === "1"
  const { login, signUp, username: currentUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState(addingAccount ? "signup" : "login")

  const [loginUser, setLoginUser] = useState("")
  const [loginPass, setLoginPass] = useState("")

  const [signUser, setSignUser] = useState("")
  const [signPass, setSignPass] = useState("")
  const [signConfirm, setSignConfirm] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const result = await login(loginUser, loginPass)
    setLoading(false)
    if (result.success) {
      toast.success(`Welcome back, ${result.username}`)
      router.replace("/")
    } else {
      toast.error(result.error)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const result = await signUp(signUser, signPass, signConfirm)
    setLoading(false)
    if (result.success) {
      toast.success(`Account created! Welcome, ${result.username}`)
      router.replace("/")
    } else {
      toast.error(result.error)
    }
  }

  return (
    <div className="mx-auto w-full min-w-0 max-w-md">
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary">
          <Flame className="h-8 w-8 text-primary-foreground" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">DevPulse</h1>
        <p className="mt-2 text-muted-foreground">
          {addingAccount
            ? "Create or sign in to another account"
            : "Your account and progress sync across your devices"}
        </p>
      </div>

      {addingAccount && (
        <div className="mb-4 flex flex-col gap-3 rounded-lg border border-primary/30 bg-primary/5 p-4">
          <p className="text-sm text-muted-foreground">
            You are still signed in as <span className="font-mono text-primary">@{currentUser}</span>.
            Your account and progress are stored securely in the cloud and available on your other devices.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-foreground hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>
        </div>
      )}

      <div className="rounded-xl border border-border bg-card p-6 shadow-xl">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="mb-6 grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="login-user">Username</Label>
                <Input
                  id="login-user"
                  value={loginUser}
                  onChange={(e) => setLoginUser(e.target.value)}
                  placeholder="your_username"
                  autoComplete="username"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="login-pass">Password</Label>
                <Input
                  id="login-pass"
                  type="password"
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground"
                disabled={loading}
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Sign In
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="sign-user">Username</Label>
                <Input
                  id="sign-user"
                  value={signUser}
                  onChange={(e) => setSignUser(e.target.value)}
                  placeholder="letters, numbers, underscores"
                  autoComplete="username"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="sign-pass">Password</Label>
                <Input
                  id="sign-pass"
                  type="password"
                  value={signPass}
                  onChange={(e) => setSignPass(e.target.value)}
                  autoComplete="new-password"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="sign-confirm">Confirm Password</Label>
                <Input
                  id="sign-confirm"
                  type="password"
                  value={signConfirm}
                  onChange={(e) => setSignConfirm(e.target.value)}
                  autoComplete="new-password"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground"
                disabled={loading}
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Create Account
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Your username, password, goals, habits, progress, and XP are stored securely in the cloud so
          you can sign in from another laptop, phone, or tablet.
        </p>
      </div>
    </div>
  )
}
