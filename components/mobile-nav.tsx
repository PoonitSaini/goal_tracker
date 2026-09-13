"use client"

import { useState } from "react"
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
  Menu,
  Timer,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useApp } from "@/components/providers/app-provider"
import { AccountSwitcher } from "@/components/auth/account-switcher"

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/goals", label: "Goals", icon: Target },
  { href: "/habits", label: "Habits", icon: CheckCircle2 },
  { href: "/focus", label: "Focus", icon: Timer },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
]

export function MobileNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const { level, setQuickAddOpen } = useApp()

  return (
    <div className="fixed left-0 right-0 top-0 z-50 flex h-14 items-center justify-between gap-2 border-b border-border bg-background/95 px-3 backdrop-blur-md sm:px-4 lg:hidden">
      <div className="flex min-w-0 items-center gap-2">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
          <Flame className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="truncate text-base font-bold sm:text-lg">DevPulse</span>
        <span className="shrink-0 font-mono text-xs text-muted-foreground">Lvl {level}</span>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <AccountSwitcher />
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[min(100vw-2rem,280px)] bg-sidebar p-0">
            <div className="flex h-full flex-col">
              <div className="flex items-center gap-2 border-b border-border px-4 py-4 sm:px-6">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary">
                  <Flame className="h-5 w-5 text-primary-foreground" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-lg font-bold text-foreground sm:text-xl">DevPulse</h1>
                  <p className="font-mono text-xs text-muted-foreground">Level {level}</p>
                </div>
              </div>

              <nav className="flex-1 space-y-1 overflow-y-auto p-3">
                {navItems.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      )}
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      {item.label}
                    </Link>
                  )
                })}
              </nav>

              <div className="border-t border-border p-3">
                <Button
                  className="mb-3 w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => {
                    setQuickAddOpen(true)
                    setOpen(false)
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Quick Add Goal
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}
