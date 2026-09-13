"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Target,
  CheckCircle2,
  BarChart3,
  Settings,
  Plus,
  Flame,
  Timer,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useApp } from "@/components/providers/app-provider"
import { AccountSwitcher } from "@/components/auth/account-switcher"
import { xpProgressInLevel } from "@/lib/xp"

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/goals", label: "Goals", icon: Target },
  { href: "/habits", label: "Habits", icon: CheckCircle2 },
  { href: "/focus", label: "Focus", icon: Timer },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { profile, level, xp, setQuickAddOpen } = useApp()
  const progress = xpProgressInLevel(xp)

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-[240px] flex-col border-r border-border bg-sidebar max-lg:hidden">
      <div className="flex items-center gap-2 px-6 py-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
          <Flame className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">DevPulse</h1>
          <p className="font-mono text-xs text-muted-foreground">
            Lvl {level} · {progress.percent}%
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-border p-3">
        <Button
          className="mb-3 w-full bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => setQuickAddOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Quick Add Goal
        </Button>
        <div className="px-1">
          <p className="mb-2 truncate text-xs text-muted-foreground">{profile.displayName}</p>
          <AccountSwitcher />
        </div>
      </div>
    </aside>
  )
}
