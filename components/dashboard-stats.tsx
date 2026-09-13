"use client"

import { useMemo } from "react"
import { StatCard } from "@/components/stat-card"
import { PomodoroTimer } from "@/components/pomodoro-timer"
import { useApp } from "@/components/providers/app-provider"
import { toDateKey } from "@/lib/dates"
import { xpProgressInLevel } from "@/lib/xp"

export function DashboardStats() {
  const { goals, habits, habitCompletions, streak, xp, level } = useApp()
  const today = toDateKey()

  const { goalPercent, goalLabel } = useMemo(() => {
    const total = goals.length || 1
    const done = goals.filter((g) => g.status === "done").length
    return {
      goalPercent: Math.round((done / total) * 100),
      goalLabel: `${done}/${total} Goals Done`,
    }
  }, [goals])

  const habitsDoneToday = useMemo(
    () => (habitCompletions[today] ?? []).length,
    [habitCompletions, today]
  )

  const xpProgress = xpProgressInLevel(xp)

  return (
    <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard type="goal" value={goalPercent} max={100} sublabel={goalLabel} />
      <StatCard
        type="streak"
        value={streak}
        sublabel={`${habitsDoneToday}/${habits.length} habits today`}
      />
      <StatCard
        type="level"
        value={xpProgress.percent}
        max={100}
        label={`LEVEL ${level}`}
        sublabel={`${xpProgress.current}/${xpProgress.max} XP in level`}
      />
      <PomodoroTimer compact />
    </div>
  )
}
