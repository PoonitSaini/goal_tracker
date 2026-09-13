import { createDefaultUserData } from "./defaults"
import type { UserData } from "./types"

export async function loadUserData(_userId?: string | null): Promise<UserData | null> {
  try {
    const response = await fetch("/api/data", { credentials: "include", cache: "no-store" })
    if (response.status === 401) return null
    if (!response.ok) throw new Error("Unable to load data")
    const result = (await response.json()) as { data: UserData | null }
    return result.data ?? null
  } catch (error) {
    console.error("Failed to load cloud user data:", error)
    return null
  }
}

export async function saveUserData(
  _userId: string | null | undefined,
  data: UserData
): Promise<void> {
  try {
    const response = await fetch("/api/data", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ data }),
    })
    if (!response.ok) console.error("Failed to save cloud user data")
  } catch (error) {
    console.error("Failed to save cloud user data:", error)
  }
}

export async function deleteUserData(_userId: string): Promise<void> {
  // Account data is intentionally retained; account deletion can be added later.
}

export async function createUserStorage(userId: string, username: string, email: string): Promise<UserData> {
  const data = createDefaultUserData(username, email)
  await saveUserData(userId, data)
  return data
}
