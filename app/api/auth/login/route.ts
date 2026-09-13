import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/server/supabase-admin"
import { verifyPassword } from "@/lib/server/password"
import { createSession } from "@/lib/server/session"

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const username = String(body.username ?? "").trim().toLowerCase()
    const password = String(body.password ?? "")

    if (!username) return NextResponse.json({ success: false, error: "Username is required" }, { status: 400 })
    if (!password) return NextResponse.json({ success: false, error: "Password is required" }, { status: 400 })

    const supabase = getSupabaseAdmin()
    const { data: account, error } = await supabase
      .from("app_accounts")
      .select("id, username, password_hash")
      .eq("username", username)
      .maybeSingle()

    if (error || !account || !(await verifyPassword(password, account.password_hash))) {
      return NextResponse.json({ success: false, error: "Invalid username or password" }, { status: 401 })
    }

    await createSession(account.id)
    return NextResponse.json({ success: true, userId: account.id, username: account.username })
  } catch (error) {
    console.error("Login failed:", error)
    return NextResponse.json({ success: false, error: "Unable to sign in. Please try again." }, { status: 500 })
  }
}
