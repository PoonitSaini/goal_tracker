import { NextResponse } from "next/server"
import { getSessionAccount } from "@/lib/server/session"

export const runtime = "nodejs"

export async function GET() {
  try {
    const account = await getSessionAccount()
    if (!account) return NextResponse.json({ authenticated: false })
    return NextResponse.json({ authenticated: true, userId: account.id, username: account.username })
  } catch (error) {
    console.error("Session lookup failed:", error)
    return NextResponse.json({ authenticated: false })
  }
}
