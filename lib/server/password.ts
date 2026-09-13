import "server-only"

import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto"
import { promisify } from "node:util"

const scrypt = promisify(scryptCallback)
const KEY_LENGTH = 64
const SALT_LENGTH = 16

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_LENGTH)
  const derived = (await scrypt(password, salt, KEY_LENGTH)) as Buffer
  return `scrypt$${salt.toString("hex")}$${derived.toString("hex")}`
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split("$")
  if (parts.length !== 3 || parts[0] !== "scrypt") return false

  try {
    const salt = Buffer.from(parts[1], "hex")
    const expected = Buffer.from(parts[2], "hex")
    const actual = (await scrypt(password, salt, expected.length)) as Buffer
    return expected.length === actual.length && timingSafeEqual(expected, actual)
  } catch {
    return false
  }
}
