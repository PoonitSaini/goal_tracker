import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/server/supabase-admin"
import { getSessionAccount } from "@/lib/server/session"
import { createDefaultUserData } from "@/lib/defaults"
import type { UserData } from "@/lib/types"

export const runtime = "nodejs"

function normalizeData(value: unknown): UserData {
  const parsed = (value && typeof value === "object" ? value : {}) as Partial<UserData>
  const profile = parsed.profile as UserData["profile"] | undefined
  const defaults = createDefaultUserData(profile?.displayName ?? "", profile?.email ?? "")

  return {
    ...defaults,
    ...parsed,
    profile: { ...defaults.profile, ...profile },
    preferences: { ...defaults.preferences, ...parsed.preferences },
    goals: parsed.goals ?? defaults.goals,
    habits: parsed.habits ?? defaults.habits,
    dailyActivity: parsed.dailyActivity ?? {},
    habitCompletions: parsed.habitCompletions ?? {},
    pomodoroSessions: parsed.pomodoroSessions ?? [],
    unlockedAchievements: parsed.unlockedAchievements ?? [],
  }
}

export async function GET() {
  const account = await getSessionAccount()
  if (!account) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from("app_user_data")
    .select("data")
    .eq("account_id", account.id)
    .maybeSingle()

  if (error) {
    console.error("Failed to load cloud user data:", error.message)
    return NextResponse.json({ error: "Unable to load your data" }, { status: 500 })
  }

  if (!data?.data) return NextResponse.json({ data: null })
  return NextResponse.json({ data: normalizeData(data.data) })
}

export async function PUT(request: Request) {
  const account = await getSessionAccount()
  if (!account) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await request.json()
    const userData = normalizeData(body.data)
    userData.profile.displayName = userData.profile.displayName || account.username

    const supabase = getSupabaseAdmin()
    const { error } = await supabase.from("app_user_data").upsert(
      {
        account_id: account.id,
        data: userData,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "account_id" }
    )

    if (error) {
      console.error("Failed to save cloud user data:", error.message)
      return NextResponse.json({ error: "Unable to save your data" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Invalid data request:", error)
    return NextResponse.json({ error: "Invalid data" }, { status: 400 })
  }
}
