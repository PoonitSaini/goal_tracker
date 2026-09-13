import { NextResponse } from "next/server"
import { createDefaultUserData } from "@/lib/defaults"
import { getSupabaseAdmin } from "@/lib/server/supabase-admin"
import { hashPassword } from "@/lib/server/password"
import { createSession } from "@/lib/server/session"

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const username = String(body.username ?? "").trim().toLowerCase()
    const password = String(body.password ?? "")
    const confirmPassword = String(body.confirmPassword ?? "")

    if (!/^[a-z0-9_]{3,24}$/.test(username)) {
      return NextResponse.json({ success: false, error: "Username must be 3–24 characters using letters, numbers, or underscores" }, { status: 400 })
    }
    if (password.length < 8) {
      return NextResponse.json({ success: false, error: "Password must be at least 8 characters" }, { status: 400 })
    }
    if (password !== confirmPassword) {
      return NextResponse.json({ success: false, error: "Passwords do not match" }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()
    const { data: existing, error: lookupError } = await supabase
      .from("app_accounts")
      .select("id")
      .eq("username", username)
      .maybeSingle()

    if (lookupError) {
      console.error("Account lookup failed:", lookupError.message)
      return NextResponse.json({ success: false, error: "Unable to create account. Please try again." }, { status: 500 })
    }
    if (existing) {
      return NextResponse.json({ success: false, error: "That username is already taken" }, { status: 409 })
    }

    const passwordHash = await hashPassword(password)
    const { data: account, error: insertError } = await supabase
      .from("app_accounts")
      .insert({ username, password_hash: passwordHash })
      .select("id, username")
      .single()

    if (insertError || !account) {
      if (insertError?.code === "23505") {
        return NextResponse.json({ success: false, error: "That username is already taken" }, { status: 409 })
      }
      console.error("Account creation failed:", insertError?.message)
      return NextResponse.json({ success: false, error: "Unable to create account. Please try again." }, { status: 500 })
    }

    const initialData = createDefaultUserData(username, "")
    initialData.profile.email = ""
    initialData.profile.displayName = username

    const { error: dataError } = await supabase.from("app_user_data").insert({
      account_id: account.id,
      data: initialData,
    })

    if (dataError) {
      await supabase.from("app_accounts").delete().eq("id", account.id)
      console.error("Initial data creation failed:", dataError.message)
      return NextResponse.json({ success: false, error: "Unable to create account. Please try again." }, { status: 500 })
    }

    await createSession(account.id)
    return NextResponse.json({ success: true, userId: account.id, username: account.username })
  } catch (error) {
    console.error("Signup failed:", error)
    return NextResponse.json({ success: false, error: "Unable to create account. Please try again." }, { status: 500 })
  }
}
