"use client"

import { useMemo } from "react"
import { Lock } from "lucide-react"
import { useApp } from "@/components/providers/app-provider"
import { ACHIEVEMENT_DEFINITIONS } from "@/lib/achievements"
import { cn } from "@/lib/utils"

export function TrophyCase() {
  const { unlockedAchievements, xp, streak, level } = useApp()

  const badges = useMemo(
    () =>
      ACHIEVEMENT_DEFINITIONS.map((a) => ({
        ...a,
        unlocked: unlockedAchievements.includes(a.id),
      })),
    [unlockedAchievements]
  )

  const unlockedCount = badges.filter((b) => b.unlocked).length

  return (
    <div className="min-w-0 rounded-xl border border-border bg-card p-4 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Achievements</h3>
          <p className="text-sm text-muted-foreground">
            {unlockedCount}/{badges.length} unlocked · Lvl {level} · {xp} XP · {streak}d streak
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className={cn(
              "flex items-start gap-3 rounded-lg border p-4 transition-all",
              badge.unlocked
                ? "border-primary/30 bg-primary/5"
                : "border-border bg-secondary/50 opacity-60"
            )}
          >
            <span className="text-2xl">{badge.unlocked ? badge.icon : "🔒"}</span>
            <div className="flex-1">
              <p className="font-medium text-foreground">{badge.title}</p>
              <p className="text-xs text-muted-foreground">{badge.description}</p>
              <p className="mt-1 font-mono text-xs text-primary">+{badge.xpReward} XP</p>
            </div>
            {!badge.unlocked && <Lock className="h-4 w-4 text-muted-foreground" />}
          </div>
        ))}
      </div>
    </div>
  )
}
