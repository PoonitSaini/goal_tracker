export type AuthResult =
  | { success: true; userId: string; username: string }
  | { success: false; error: string }

async function postAuth(path: string, body?: Record<string, unknown>): Promise<AuthResult> {
  try {
    const response = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
      credentials: "include",
    })
    return (await response.json()) as AuthResult
  } catch {
    return { success: false, error: "Unable to connect to the server. Please try again." }
  }
}

export async function signUp(username: string, password: string, confirmPassword: string): Promise<AuthResult> {
  return postAuth("/api/auth/signup", { username, password, confirmPassword })
}

export async function login(username: string, password: string): Promise<AuthResult> {
  return postAuth("/api/auth/login", { username, password })
}

export async function getCurrentAuth(): Promise<AuthResult | null> {
  try {
    const response = await fetch("/api/auth/me", { credentials: "include", cache: "no-store" })
    const data = await response.json()
    if (!data.authenticated) return null
    return { success: true, userId: data.userId, username: data.username }
  } catch {
    return null
  }
}

export async function logout(): Promise<void> {
  await fetch("/api/auth/logout", { method: "POST", credentials: "include" })
}

export async function listLocalUsers(): Promise<{ id: string; username: string }[]> {
  const current = await getCurrentAuth()
  return current?.success ? [{ id: current.userId, username: current.username }] : []
}

export async function switchUser(userId: string): Promise<boolean> {
  const current = await getCurrentAuth()
  return current?.success === true && current.userId === userId
}
