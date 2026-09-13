"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useApp } from "@/components/providers/app-provider"
import { xpProgressInLevel, xpToNextLevel } from "@/lib/xp"

export function Header() {
  const { profile, level, xp } = useApp()
  const progress = xpProgressInLevel(xp)

  return (
    <header className="sticky top-14 z-30 border-b border-border bg-background/80 backdrop-blur-md lg:top-0">
      <div className="flex min-h-14 flex-col gap-3 px-4 py-3 sm:min-h-16 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-6 sm:py-0">
        <div className="relative min-w-0 w-full sm:max-w-md sm:flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search goals, habits..."
            className="w-full min-w-0 border-border bg-secondary pl-10 text-sm placeholder:text-muted-foreground focus-visible:ring-accent"
          />
        </div>

        <div className="flex shrink-0 items-center justify-between gap-3 sm:justify-end">
          <div className="min-w-0 text-left sm:text-right">
            <p className="truncate font-mono text-xs text-muted-foreground">
              LVL {level} · {progress.current}/{progress.max} XP
            </p>
            <p className="truncate text-sm font-medium">{profile.displayName}</p>
            <p className="hidden text-xs text-muted-foreground sm:block">
              {xpToNextLevel(xp)} XP to next level
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}
