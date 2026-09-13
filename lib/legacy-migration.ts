import type { UserData } from "./types"

/**
 * Reads the old browser-only DevPulse account/data format so an existing
 * device can carry its current progress into the new cloud account once.
 */
export function loadLegacyUserData(username: string, email: string): UserData | null {
  if (typeof window === "undefined") return null

  try {
    const registryRaw = localStorage.getItem("devpulse-auth")
    if (!registryRaw) return null

    const registry = JSON.parse(registryRaw) as {
      users?: Array<{ id: string; username: string }>
    }
    const normalizedUsername = username.trim().toLowerCase()
    const user = registry.users?.find((item) => item.username === normalizedUsername)
    if (!user) return null

    const raw = localStorage.getItem(`devpulse-user-${user.id}`)
    if (!raw) return null

    const data = JSON.parse(raw) as UserData
    if (data.profile?.email && data.profile.email.trim().toLowerCase() !== email.trim().toLowerCase()) {
      return null
    }

    return data
  } catch {
    return null
  }
}
