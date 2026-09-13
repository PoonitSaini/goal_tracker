const PBKDF2_ITERATIONS = 120_000

function bufferToHex(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer)
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

function hexToBuffer(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16)
  }
  return bytes
}

export async function hashPassword(
  password: string,
  saltHex?: string
): Promise<{ hash: string; salt: string }> {
  const salt = saltHex ? hexToBuffer(saltHex) : crypto.getRandomValues(new Uint8Array(16))
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  )
  const derived = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    256
  )
  return { hash: bufferToHex(derived), salt: bufferToHex(salt) }
}

export async function verifyPassword(
  password: string,
  hash: string,
  salt: string
): Promise<boolean> {
  const { hash: computed } = await hashPassword(password, salt)
  return computed === hash
}

export function createSessionToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32))
  return bufferToHex(bytes)
}

export function validateUsername(username: string): string | null {
  const trimmed = username.trim().toLowerCase()
  if (trimmed.length < 3) return "Username must be at least 3 characters"
  if (trimmed.length > 24) return "Username must be at most 24 characters"
  if (!/^[a-z0-9_]+$/.test(trimmed)) return "Username can only contain letters, numbers, and underscores"
  return null
}

export function validatePassword(password: string): string | null {
  if (password.length < 8) return "Password must be at least 8 characters"
  if (password.length > 128) return "Password is too long"
  return null
}

export function validateEmail(email: string): string | null {
  const trimmed = email.trim()
  if (!trimmed) return "Email is required"
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return "Enter a valid email address"
  return null
}
