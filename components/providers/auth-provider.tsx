"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import {
  getCurrentAuth,
  listLocalUsers,
  login,
  logout,
  signUp,
  switchUser,
} from "@/lib/auth"
import type { AuthResult } from "@/lib/auth"

interface AuthContextValue {
  userId: string | null
  username: string | null
  users: { id: string; username: string }[]
  hydrated: boolean
  signUp: (
    username: string,
    password: string,
    confirm: string,
  ) => Promise<AuthResult>
  login: (
    username: string,
    password: string,
  ) => Promise<AuthResult>
  logout: () => Promise<void>
  switchAccount: (userId: string) => Promise<boolean>
  refreshUsers: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null)
  const [username, setUsername] = useState<string | null>(null)
  const [users, setUsers] = useState<{ id: string; username: string }[]>([])
  const [hydrated, setHydrated] = useState(false)

  const refreshSession = useCallback(async () => {
    const session = await getCurrentAuth()
    setUserId(session?.success ? session.userId : null)
    setUsername(session?.success ? session.username : null)
    setUsers(await listLocalUsers())
  }, [])

  useEffect(() => {
    let cancelled = false

    async function init() {
      await refreshSession()
      if (!cancelled) setHydrated(true)
    }

    void init()

    return () => {
      cancelled = true
    }
  }, [refreshSession])

  const handleSignUp = useCallback(
    async (u: string, p: string, c: string) => {
      const result = await signUp(u, p, c)
      if (result.success) await refreshSession()
      return result
    },
    [refreshSession]
  )

  const handleLogin = useCallback(
    async (u: string, p: string) => {
      const result = await login(u, p)
      if (result.success) await refreshSession()
      return result
    },
    [refreshSession]
  )

  const handleLogout = useCallback(async () => {
    await logout()
    setUserId(null)
    setUsername(null)
    setUsers([])
  }, [])

  const handleSwitch = useCallback(async (id: string) => switchUser(id), [])

  const value = useMemo(
    () => ({
      userId,
      username,
      users,
      hydrated,
      signUp: handleSignUp,
      login: handleLogin,
      logout: handleLogout,
      switchAccount: handleSwitch,
      refreshUsers: refreshSession,
    }),
    [userId, username, users, hydrated, handleSignUp, handleLogin, handleLogout, handleSwitch, refreshSession]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
