import "server-only"

import { createHash, randomBytes } from "node:crypto"
import { cookies } from "next/headers"
import { getSupabaseAdmin } from "./supabase-admin"

const COOKIE_NAME = "goal_tracker_session"
const SESSION_DAYS = 30

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex")
}

export async function createSession(accountId: string) {
  const supabase = getSupabaseAdmin()
  const token = randomBytes(32).toString("base64url")
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000).toISOString()

  const { error } = await supabase.from("app_sessions").insert({
    account_id: accountId,
    token_hash: hashToken(token),
    expires_at: expiresAt,
  })
  if (error) throw new Error(error.message)

  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  })
}

export async function getSessionAccount() {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null

  const supabase = getSupabaseAdmin()
  const tokenHash = hashToken(token)
  const { data, error } = await supabase
    .from("app_sessions")
    .select("account_id, expires_at, app_accounts(id, username)")
    .eq("token_hash", tokenHash)
    .maybeSingle()

  if (error || !data) return null

  if (new Date(data.expires_at).getTime() <= Date.now()) {
    await supabase.from("app_sessions").delete().eq("token_hash", tokenHash)
    return null
  }

  const account = Array.isArray(data.app_accounts) ? data.app_accounts[0] : data.app_accounts
  if (!account) return null

  return { id: account.id as string, username: account.username as string }
}

export async function destroySession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value

  if (token) {
    const supabase = getSupabaseAdmin()
    await supabase.from("app_sessions").delete().eq("token_hash", hashToken(token))
  }

  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  })
}
