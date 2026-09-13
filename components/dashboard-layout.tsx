"use client"

import type { ReactNode } from "react"
import { Sidebar } from "@/components/sidebar"
import { MobileNav } from "@/components/mobile-nav"

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh overflow-x-hidden bg-background">
      <Sidebar />
      <MobileNav />
      <main className="min-w-0 max-lg:pt-14 lg:ml-[240px]">
        <div className="min-w-0 overflow-x-hidden">{children}</div>
      </main>
    </div>
  )
}
