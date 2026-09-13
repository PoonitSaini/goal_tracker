const REMEMBER_KEY = "devpulse-remember"
const DEVICE_KEY = "devpulse-device-key"

interface RememberedLogin {
  username: string
  encryptedPassword: string
  iv: string
}

function getDeviceKey(): string {
  if (typeof window === "undefined") return ""
  let key = localStorage.getItem(DEVICE_KEY)
  if (!key) {
    const bytes = crypto.getRandomValues(new Uint8Array(32))
    key = Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
    localStorage.setItem(DEVICE_KEY, key)
  }
  return key
}

async function getCryptoKey(): Promise<CryptoKey> {
  const keyMaterial = new TextEncoder().encode(getDeviceKey())
  return crypto.subtle.importKey("raw", keyMaterial, "AES-GCM", false, ["encrypt", "decrypt"])
}

export async function saveRememberedLogin(
  username: string,
  password: string
): Promise<void> {
  if (typeof window === "undefined") return
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const key = await getCryptoKey()
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(password)
  )
  const data: RememberedLogin = {
    username: username.trim().toLowerCase(),
    encryptedPassword: Array.from(new Uint8Array(encrypted))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join(""),
    iv: Array.from(iv)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join(""),
  }
  localStorage.setItem(REMEMBER_KEY, JSON.stringify(data))
}

export async function loadRememberedPassword(
  username: string
): Promise<string | null> {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(REMEMBER_KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as RememberedLogin
    if (data.username !== username.trim().toLowerCase()) return null

    const key = await getCryptoKey()
    const iv = new Uint8Array(data.iv.match(/.{2}/g)!.map((h) => parseInt(h, 16)))
    const cipher = new Uint8Array(
      data.encryptedPassword.match(/.{2}/g)!.map((h) => parseInt(h, 16))
    )
    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      cipher
    )
    return new TextDecoder().decode(decrypted)
  } catch {
    return null
  }
}

export function loadRememberedUsername(): string {
  if (typeof window === "undefined") return ""
  try {
    const raw = localStorage.getItem(REMEMBER_KEY)
    if (!raw) return ""
    const data = JSON.parse(raw) as RememberedLogin
    return data.username ?? ""
  } catch {
    return ""
  }
}

export function clearRememberedLogin(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(REMEMBER_KEY)
}
